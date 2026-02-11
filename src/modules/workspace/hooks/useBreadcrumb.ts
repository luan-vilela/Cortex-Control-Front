import { useEffect } from "react";
import {
  useBreadcrumbStore,
  BreadcrumbItem,
} from "@/modules/workspace/store/breadcrumb.store";
import { LayoutDashboard } from "lucide-react";

export function useBreadcrumb(breadcrumbs: BreadcrumbItem[]) {
  const setBreadcrumbs = useBreadcrumbStore((state) => state.setBreadcrumbs);

  useEffect(() => {
    const withDashboard = [
      { label: "", href: "/dashboard", icon: LayoutDashboard },
      ...breadcrumbs,
    ];
    setBreadcrumbs(withDashboard);

    return () => {
      useBreadcrumbStore.getState().resetBreadcrumbs();
    };
  }, [breadcrumbs, setBreadcrumbs]);
}
