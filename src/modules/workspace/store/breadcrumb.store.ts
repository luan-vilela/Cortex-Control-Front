import { LayoutDashboard } from "lucide-react";
import { create } from "zustand";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbStore {
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  resetBreadcrumbs: () => void;
}

export const useBreadcrumbStore = create<BreadcrumbStore>((set) => ({
  breadcrumbs: [{ label: "", href: "/dashboard", icon: LayoutDashboard }],
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
  resetBreadcrumbs: () =>
    set({
      breadcrumbs: [{ label: "", href: "/dashboard", icon: LayoutDashboard }],
    }),
}));
