# Module Layout Standardization

## Overview

Created a standardized `ModuleLayout` component for consistent module UI across the application.

## Architecture

### Two-Column Layout Pattern

```
┌─────────────────────────────────────────┐
│           Navbar (top-fixed)            │
├──────────────┬──────────────────────────┤
│   Menu       │      Content             │
│  (optional)  │    (flex-1, full)        │
│              │                          │
│  - 264px     │                          │
│  - Sticky    │                          │
│  - Card      │                          │
└──────────────┴──────────────────────────┘
```

### Key Features

- **Flexible Menu**: Optional left sidebar (removed if no menu items)
- **Sticky Menu**: Stays in viewport while scrolling
- **Responsive**: Adapts to screen size
- **Badge Support**: Menu items can show counters/badges
- **Sections**: Menu items can be grouped in labeled sections

## Component API

### ModuleLayout Props

```typescript
interface ModuleLayoutProps {
  children: ReactNode;
  menuItems?: ModuleMenuGroup[];
  menuTitle?: string;
}
```

### Menu Item Types

```typescript
interface ModuleMenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number | string;
}

interface ModuleMenuSection {
  section: string;
  label: string;
  items: ModuleMenuItem[];
}

type ModuleMenuGroup = ModuleMenuItem | ModuleMenuSection;
```

## Usage Examples

### Module WITH Menu (Contatos)

```tsx
// src/app/(protected)/contatos/layout.tsx
import {
  ModuleLayout,
  ModuleMenuGroup,
} from "@/components/layouts/ModuleLayout";
import { Users, UserPlus, ShoppingCart, Briefcase } from "lucide-react";

const menuItems: ModuleMenuGroup[] = [
  {
    label: "Todos os Contatos",
    href: "/contatos",
    icon: Users,
    badge: 42, // Optional badge
  },
  {
    label: "Novo Contato",
    href: "/contatos/new",
    icon: UserPlus,
  },
  {
    section: "papel",
    label: "PAPÉIS",
    items: [
      {
        label: "Clientes",
        href: "/contatos/clientes",
        icon: ShoppingCart,
        badge: 15,
      },
      {
        label: "Fornecedores",
        href: "/contatos/fornecedores",
        icon: Briefcase,
        badge: 8,
      },
    ],
  },
];

export default function ContatosLayout({ children }) {
  return (
    <ModuleLayout menuItems={menuItems} menuTitle="Contatos">
      {children}
    </ModuleLayout>
  );
}
```

### Module WITHOUT Menu (Finance)

```tsx
// src/app/(protected)/finance/layout.tsx
import { ModuleLayout } from "@/components/layouts/ModuleLayout";

export default function FinanceLayout({ children }) {
  // No menu items = full-width content
  return <ModuleLayout>{children}</ModuleLayout>;
}
```

## Styling Classes

- **Menu Container**: `w-64 shrink-0` (fixed width, no shrink)
- **Menu Card**: `bg-gh-card border border-gh-border rounded-lg sticky top-24`
- **Active Item**: `border-blue-500 bg-gh-bg font-medium`
- **Hover Item**: `hover:bg-gh-hover hover:text-gh-text`
- **Badge**: `text-xs px-2 py-0.5 rounded-full bg-gh-badge-bg`

## Implemented Modules

- ✅ **Contatos** - WITH menu (all contacts, roles, new contact)
- ✅ **Finance** - WITHOUT menu (full-width content)

## Available for Standardization

- `members` - Can add menu for filters/groups
- Other future modules - Follow this pattern

## Benefits

✅ Consistent visual hierarchy across modules  
✅ Reusable component reduces code duplication  
✅ Flexible: Works with or without menu  
✅ Sticky menu improves navigation UX  
✅ Badge support for counters/stats  
✅ Proper spacing (gap-6, px-6 py-8)  
✅ Responsive and accessible

## File Location

- **Component**: `/src/components/layouts/ModuleLayout.tsx`
- **Usage**: Apply to all module layouts in `/app/(protected)/**/layout.tsx`
