# Frontend Skills - Cortex Control

## Core Technologies

### Framework & Language

- **Next.js 16.1.6** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript 5.x** - Type-safe JavaScript

### Routing & Navigation

- **Next.js App Router** - File-based routing in `src/app/`
- **Route Groups**: `(protected)` and `(public)` for layout separation
- **Middleware**: Auth protection in `src/middleware.ts`

### State Management

#### Server State

- **React Query (@tanstack/react-query 5.90.20)** - Server state management
- **Query Patterns**: Custom hooks in `modules/{module}/hooks/`
  - `useQuery` - Data fetching
  - `useMutation` - Data mutations
  - `useQueryClient` - Cache invalidation
- **DevTools**: `@tanstack/react-query-devtools` for debugging

#### Client State

- **Zustand 5.0.11** - Lightweight state management
- **Store Pattern**: `src/store/{feature}.store.ts`
- **Example**: `theme.store.ts` for theme persistence

### Forms & Validation

- **React Hook Form 7.71.1** - Form state management
- **Zod 4.3.6** - Schema validation
- **@hookform/resolvers** - Integration between RHF and Zod

### Styling

- **Tailwind CSS 4.0** - Utility-first CSS framework
- **PostCSS** - CSS processing with `@tailwindcss/postcss`
- **Custom Fonts**: Geist Sans and Geist Mono (Vercel fonts)
- **Theme Support**: Dark/light mode with ThemeProvider

### HTTP Client

- **Axios 1.13.4** - HTTP client
- **API Configuration**: Centralized in `src/lib/api.ts`
- **Interceptors**:
  - Request: Auto-inject JWT token from localStorage
  - Response: Handle 401 errors with auto-logout

### UI Components

- **lucide-react 0.563.0** - Icon library
- **Custom Components**: `src/components/` and `src/components/ui/`
- **Feature Components**: `src/modules/{module}/components/`

### Context Providers

- **AlertContext** - Global notification system
- **ThemeProvider** - Dark/light theme management
- **QueryProvider** - React Query setup

## Architectural Patterns

### Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (protected)/       # Auth-required routes
│   ├── (public)/          # Public routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Shared components
│   ├── ui/               # Base UI components
│   ├── Alert.tsx
│   ├── AlertContainer.tsx
│   ├── NotificationBell.tsx
│   ├── StatusBadge.tsx
│   ├── UserMenu.tsx
│   └── WalletDisplay.tsx
├── contexts/              # React contexts
│   └── AlertContext.tsx
├── lib/                   # Core utilities
│   ├── api.ts            # Axios instance
│   ├── queryClient.ts    # React Query config
│   ├── QueryProvider.tsx
│   └── utils.ts
├── modules/               # Feature modules
│   ├── auth/
│   ├── customer/
│   ├── person/
│   ├── wallet/
│   └── workspace/
├── providers/             # App providers
│   └── ThemeProvider.tsx
├── store/                 # Zustand stores
│   └── theme.store.ts
└── middleware.ts          # Next.js middleware
```

### Module Pattern

```
modules/{feature}/
├── components/            # Feature-specific components
├── hooks/                 # React Query hooks
│   ├── use{Feature}Queries.ts
│   └── use{Feature}Mutations.ts
├── services/              # API service calls
│   └── {feature}.service.ts
└── types/                 # TypeScript interfaces
    └── {feature}.types.ts
```

## API Integration

### Base Configuration (`src/lib/api.ts`)

```typescript
axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  timeout: 10000,
  withCredentials: true,
});
```

### Request Interceptor

- Auto-adds JWT token from localStorage
- SSR-safe: Checks `typeof window !== "undefined"`

### Response Interceptor

- Handles 401: Clears token + redirects to login
- Preserves other errors for component handling

### React Query Hooks Pattern

```typescript
// Query
export function useWorkspaces() {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const { data } = await api.get("/workspaces");
      return data;
    },
  });
}

// Mutation
export function useCreateWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/workspaces", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
  });
}
```

## Environment Variables

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Important**: Use `NEXT_PUBLIC_` prefix for client-side access.

## Development Workflow

### Common Commands

```bash
npm run dev              # Start dev server (port 3001)
TURBOPACK=0 npm run dev  # Dev without Turbopack
npm run build            # Production build
npm test                 # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

### Testing

- **Jest 30.2.0** - Test runner
- **@testing-library/react 16.3.2** - Component testing
- **@testing-library/jest-dom** - DOM matchers
- **@testing-library/user-event** - User interaction simulation
- **jest-environment-jsdom** - Browser environment

## Component Patterns

### Documented Components

- **Alert System** - See `ALERTS_SYSTEM.md`
- **Person Interface** - See `INTERFACE_PESSOAS.md`
- **Route Groups** - See `ROUTE_GROUPS.md`
- **Workspace Status** - See `INTEGRACAO_STATUS_WORKSPACE.md`

### Common Patterns

1. **Server Components** by default (App Router)
2. **'use client'** directive for interactive components
3. **Loading States**: Handle with React Query `isLoading`
4. **Error States**: Display with Alert context
5. **Forms**: React Hook Form + Zod validation

## Key Features

### Authentication Flow

1. User submits credentials
2. API returns JWT token + user data
3. Token stored in localStorage
4. All requests auto-include token
5. Middleware protects routes in `(protected)` group

### Alert System

- Context-based notifications
- Multiple types: success, error, info, warning
- Auto-dismiss with timeout
- Global container in root layout

### Theme System

- Zustand store for persistence
- ThemeProvider with system preference detection
- Tailwind dark mode classes
- Theme toggle in UI

### Workspace Context

- Active workspace selection
- Workspace-scoped API calls
- Workspace switcher component
- Member permissions display

## SSR Considerations

### Client-Side Only Code

```typescript
if (typeof window !== "undefined") {
  // Browser-only code (localStorage, window APIs)
}
```

### API Calls

- Server Components: Fetch directly in component
- Client Components: Use React Query hooks

### Hydration

- `suppressHydrationWarning` on html/body for theme
- Avoid mismatches between SSR and client render

## Best Practices

1. **Custom Hooks**: Extract React Query logic to hooks
2. **Type Safety**: Use TypeScript interfaces for API responses
3. **Error Handling**: Display errors via Alert context
4. **Loading States**: Show spinners/skeletons during fetch
5. **Cache Invalidation**: Invalidate queries after mutations
6. **Form Validation**: Zod schemas for type-safe validation
7. **Component Organization**: Feature-based modules
