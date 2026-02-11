import Link from "next/link";
import {
  Menu,
  X,
  ChevronDown,
  Building2,
  Plus,
  Check,
  Package,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";

export function AppTitle() {
  const { setOpenMobile } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const {
    workspaces,
    activeWorkspace,
    switchWorkspace,
    fetchWorkspaces,
    _hasHydrated,
  } = useWorkspaceStore();

  useEffect(() => {
    if (_hasHydrated) {
      fetchWorkspaces();
    }
  }, [_hasHydrated, fetchWorkspaces]);

  const handleSwitchWorkspace = async (workspaceId: string) => {
    try {
      setIsOpen(false);

      const pathSegments = pathname.split("/").filter(Boolean);
      const firstRoute = pathSegments[0] ? `/${pathSegments[0]}` : "/dashboard";
      router.push(firstRoute);

      await new Promise((resolve) => setTimeout(resolve, 300));
      await switchWorkspace(workspaceId);
    } catch (error) {
      console.error("Erro ao trocar workspace:", error);
    }
  };

  if (!_hasHydrated || !activeWorkspace) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-gh-bg-secondary animate-pulse" />
              <ToggleSidebar />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="relative">
          <SidebarMenuButton
            size="lg"
            className="gap-0 py-0 hover:bg-transparent active:bg-transparent"
            asChild
          >
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center gap-2"
            >
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-bold">
                  {activeWorkspace.name}
                </span>
                <span className="truncate text-xs">{"Cortex Control"}</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </SidebarMenuButton>

          {/* Dropdown Menu */}
          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />

              <div className="absolute top-full left-0 mt-2 w-64 bg-gh-card rounded-lg shadow-lg border border-gh-border z-20 p-2">
                <div className="px-3 py-2 text-xs font-semibold text-gh-text-secondary uppercase tracking-wider">
                  Workspaces
                </div>

                {workspaces.length > 0 &&
                  workspaces.map((workspace) => (
                    <button
                      key={workspace.id}
                      onClick={() => handleSwitchWorkspace(workspace.id)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gh-bg transition-colors text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gh-text-secondary" />
                        <div className="text-left">
                          <div className="font-medium text-gh-text">
                            {workspace.name}
                          </div>
                          <div className="text-xs text-gh-text-secondary capitalize">
                            {workspace.role}
                          </div>
                        </div>
                      </div>

                      {activeWorkspace.id === workspace.id && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  ))}

                <div className="my-2 border-t border-gh-border" />

                <Link
                  href="/workspaces/new"
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gh-bg transition-colors text-blue-600 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Criar Workspace
                </Link>

                <Link
                  href={`/workspaces/${activeWorkspace.id}/modules`}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gh-bg transition-colors text-gh-text text-sm font-medium"
                >
                  <Package className="w-4 h-4" />
                  Instalar Módulos
                </Link>

                <Link
                  href="/workspaces"
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gh-bg transition-colors text-gh-text text-sm font-medium"
                >
                  <Building2 className="w-4 h-4" />
                  Gerenciar Workspaces
                </Link>
              </div>
            </>
          )}
        </div>

        <ToggleSidebar />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function ToggleSidebar({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("aspect-square size-8 max-md:scale-125", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <X className="md:hidden" />
      <Menu className="max-md:hidden" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}
