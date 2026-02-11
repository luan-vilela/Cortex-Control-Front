import * as React from "react";
import { ChevronsUpDown, Plus, Package, Building2 } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

type TeamSwitcherProps = {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
};

export function TeamSwitcher({ teams }: TeamSwitcherProps) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const { activeWorkspace, workspaces, switchWorkspace } = useWorkspaceStore();
  const [isLoading, setIsLoading] = React.useState(false);

  const activeTeam = teams[0]; // Usa o primeiro team que vem do sidebar data

  const handleSwitchWorkspace = async (workspaceId: string) => {
    try {
      setIsLoading(true);
      const pathSegments = pathname.split("/").filter(Boolean);
      const firstRoute = pathSegments[0] ? `/${pathSegments[0]}` : "/dashboard";
      router.push(firstRoute);

      await new Promise((resolve) => setTimeout(resolve, 300));
      await switchWorkspace(workspaceId);
    } catch (error) {
      console.error("Erro ao trocar workspace:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              disabled={isLoading}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {/* logo aqui */}
                CC
              </div>
              <div className="grid flex-1 text-start text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam?.name}
                </span>
                <span className="truncate text-xs">{activeTeam?.plan}</span>
              </div>
              <ChevronsUpDown className="ms-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Seus Workspaces
            </DropdownMenuLabel>
            {workspaces.map((workspace, index) => (
              <DropdownMenuItem
                key={workspace.id}
                onClick={() => handleSwitchWorkspace(workspace.id)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Building2 className="size-4 shrink-0" />
                </div>
                <div className="flex flex-col">
                  <span>{workspace.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {workspace.role}
                  </span>
                </div>
                {activeWorkspace?.id === workspace.id && (
                  <DropdownMenuShortcut>✓</DropdownMenuShortcut>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/workspaces/new" className="gap-2 p-2 cursor-pointer">
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <span className="font-medium">Criar Workspace</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/workspaces/${activeWorkspace?.id}/modules`}
                className="gap-2 p-2 cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Package className="size-4" />
                </div>
                <span className="font-medium">Instalar Módulos</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/workspaces" className="gap-2 p-2 cursor-pointer">
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Building2 className="size-4" />
                </div>
                <span className="font-medium">Gerenciar Workspaces</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
