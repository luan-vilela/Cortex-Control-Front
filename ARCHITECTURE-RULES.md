# Architecture Rules - Frontend (Cortex Control)

## Core Architectural Principles

### 1. App Router Structure

**RULE**: Use Next.js 13+ App Router with route groups

```
src/app/
├── (protected)/          # Auth-required pages
│   ├── dashboard/
│   ├── workspaces/
│   └── persons/
├── (public)/            # Public pages
│   ├── auth/
│   └── landing/
├── layout.tsx           # Root layout
└── page.tsx            # Home page
```

### 2. Feature Module Organization

**RULE**: Each business domain is a separate module

```
src/modules/{feature}/
├── components/          # Feature-specific UI components
├── hooks/              # React Query hooks
│   ├── use{Feature}Queries.ts    # Data fetching
│   └── use{Feature}Mutations.ts  # Data mutations
├── services/           # API service calls
│   └── {feature}.service.ts
├── store/              # Zustand stores (if needed)
│   └── {feature}.store.ts
└── types/              # TypeScript interfaces
    └── {feature}.types.ts
```

### 3. State Management Separation

**RULE**: Separate server state from client state

**Server State** (React Query):

- API data fetching
- Server synchronization
- Caching and background updates

**Client State** (Zustand):

- UI state (modals, themes)
- User preferences
- Navigation state

## React Query Rules

### 1. Query Hook Pattern

**RULE**: Create custom hooks for all API operations

```typescript
// ❌ NEVER - Direct API calls in components
const { data } = useQuery({
  queryKey: ["users"],
  queryFn: () => api.get("/users"),
});

// ✅ ALWAYS - Custom hook abstraction
const { data, isLoading, error } = useUsers();
```

### 2. Query Key Structure

**RULE**: Use consistent query key factories

```typescript
// queryKeys.ts
export const workspaceKeys = {
  all: ["workspaces"] as const,
  lists: () => [...workspaceKeys.all, "list"] as const,
  detail: (id: string) => [...workspaceKeys.all, "detail", id] as const,
  members: (id: string) => [...workspaceKeys.all, id, "members"] as const,
};
```

### 3. Mutation with Optimistic Updates

**RULE**: Invalidate queries after successful mutations

```typescript
export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => workspaceService.create(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.lists(),
      });
    },
  });
}
```

### 4. Loading and Error States

**RULE**: Handle loading and error states in components

```typescript
function Component() {
  const { data, isLoading, error } = useWorkspaces();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <DataDisplay data={data} />;
}
```

## Component Architecture Rules

### 1. Server vs Client Components

**RULE**: Use Server Components by default (App Router)

```typescript
// ❌ Don't add 'use client' unless necessary
'use client';
export default function StaticComponent() {}

// ✅ Server Component by default
export default function ServerComponent() {
  // Can fetch data directly
  const data = await fetchData();
  return <div>{data}</div>;
}

// ✅ Client Component only when needed
'use client';
export default function InteractiveComponent() {
  const [state, setState] = useState();
  return <button onClick={() => setState()}>Click</button>;
}
```

### 2. Component File Structure

**RULE**: Co-locate related files

```
components/workspace/
├── WorkspaceCard.tsx
├── WorkspaceCard.test.tsx
├── WorkspaceList.tsx
├── WorkspaceList.test.tsx
└── index.ts              # Export barrel
```

### 3. Props Interface Pattern

**RULE**: Define explicit interfaces for all components

```typescript
interface WorkspaceCardProps {
  workspace: Workspace;
  onSelect?: (workspace: Workspace) => void;
  showMembers?: boolean;
}

export function WorkspaceCard({
  workspace,
  onSelect,
  showMembers = false,
}: WorkspaceCardProps) {
  // Component implementation
}
```

## Form Handling Rules

### 1. React Hook Form + Zod Pattern

**RULE**: Always use Zod schema for form validation

```typescript
// Define schema
const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

type CreateWorkspaceForm = z.infer<typeof createWorkspaceSchema>;

// Use in component
const form = useForm<CreateWorkspaceForm>({
  resolver: zodResolver(createWorkspaceSchema),
});
```

### 2. Form Submission Pattern

**RULE**: Handle loading states and errors

```typescript
const createMutation = useCreateWorkspace();

const onSubmit = async (data: CreateWorkspaceForm) => {
  try {
    await createMutation.mutateAsync(data);
    // Success handling
  } catch (error) {
    // Error handling via React Query
  }
};
```

## Routing and Navigation Rules

### 1. Route Protection

**RULE**: Use middleware for auth protection

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect("/auth/login");
  }
}
```

### 2. Layout Composition

**RULE**: Use nested layouts for route groups

```typescript
// (protected)/layout.tsx
export default function ProtectedLayout({ children }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

## API Integration Rules

### 1. Centralized API Configuration

**RULE**: Single Axios instance with interceptors

```typescript
// lib/api.ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Request interceptor - add JWT token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  },
);
```

### 2. Service Layer Pattern

**RULE**: Abstract API calls into service functions

```typescript
// services/workspace.service.ts
export const workspaceService = {
  getUserWorkspaces: async () => {
    const { data } = await api.get("/workspaces");
    return data;
  },

  create: async (data: CreateWorkspaceDto) => {
    const { data: response } = await api.post("/workspaces", data);
    return response;
  },
};
```

## Error Handling Rules

### 1. Global Error Boundary

**RULE**: Wrap app with error boundary

```typescript
// components/ErrorBoundary.tsx
export class ErrorBoundary extends Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### 2. Alert System Integration

**RULE**: Use AlertContext for user notifications

```typescript
const { showAlert } = useAlert();

try {
  await createMutation.mutateAsync(data);
  showAlert("Success!", "success");
} catch (error) {
  showAlert("Failed to create workspace", "error");
}
```

## Styling Rules

### 1. Tailwind CSS Classes

**RULE**: Use utility classes, avoid custom CSS

```typescript
// ❌ AVOID - Custom CSS
<div className="custom-card">

// ✅ PREFER - Utility classes
<div className="bg-white rounded-lg shadow-md p-6">
```

### 2. Responsive Design

**RULE**: Mobile-first responsive classes

```typescript
<div className="w-full md:w-1/2 lg:w-1/3">
```

### 3. Theme Support

**RULE**: Use CSS variables for theme colors

```css
/* globals.css */
:root {
  --color-primary: #3b82f6;
  --color-background: #ffffff;
}

[data-theme="dark"] {
  --color-primary: #60a5fa;
  --color-background: #1f2937;
}
```

## Performance Rules

### 1. Code Splitting

**RULE**: Use dynamic imports for large components

```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
});
```

### 2. Image Optimization

**RULE**: Use Next.js Image component

```typescript
import Image from 'next/image';

<Image
  src="/avatar.jpg"
  alt="User Avatar"
  width={40}
  height={40}
  className="rounded-full"
/>
```

### 3. Bundle Analysis

**RULE**: Keep bundle size under control

```bash
# Analyze bundle
npm run build
npm run analyze
```

## Testing Rules

### 1. Component Testing

**RULE**: Test user interactions, not implementation

```typescript
test('should create workspace when form is submitted', async () => {
  render(<CreateWorkspaceForm />);

  await user.type(screen.getByLabelText(/name/i), 'New Workspace');
  await user.click(screen.getByRole('button', { name: /create/i }));

  expect(screen.getByText(/created successfully/i)).toBeInTheDocument();
});
```

### 2. Mock API Calls

**RULE**: Mock API calls in tests

```typescript
// Setup MSW (Mock Service Worker)
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.post("/api/workspaces", (req, res, ctx) => {
    return res(ctx.json({ id: "1", name: "Test Workspace" }));
  }),
);
```

## Environment Rules

### 1. Environment Variables

**RULE**: Use `NEXT_PUBLIC_` prefix for client-side variables

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
DATABASE_URL=postgresql://...  # Server-side only
```

### 2. Configuration Management

**RULE**: Validate environment variables at startup

```typescript
// lib/config.ts
const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
};

export default config;
```
