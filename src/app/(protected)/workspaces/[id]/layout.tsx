"use client";

import { useRouter, useParams, usePathname } from "next/navigation";
import { useEnabledModules, useWorkspace } from "@/modules/workspace/hooks";
import { NotificationBell } from "@/components/NotificationBell";
import { WalletDisplay } from "@/components/WalletDisplay";
import { UserMenu } from "@/components/UserMenu";
import { WorkspaceStatus } from "@/modules/workspace/types/workspace.types";
import {
  Package,
  Settings,
  Users,
  ArrowLeft,
  BarChart3,
  CreditCard,
  CheckCircle,
  PauseCircle,
  AlertTriangle,
  Archive,
} from "lucide-react";

const statusConfig = {
  [WorkspaceStatus.ACTIVE]: {
    label: "Ativo",
    icon: CheckCircle,
    color: "text-green-600",
    dotColor: "bg-green-500",
  },
  [WorkspaceStatus.INACTIVE]: {
    label: "Inativo",
    icon: PauseCircle,
    color: "text-gray-600",
    dotColor: "bg-gray-500",
  },
  [WorkspaceStatus.SUSPENDED]: {
    label: "Suspenso",
    icon: AlertTriangle,
    color: "text-red-600",
    dotColor: "bg-red-500",
  },
  [WorkspaceStatus.ARCHIVED]: {
    label: "Arquivado",
    icon: Archive,
    color: "text-yellow-600",
    dotColor: "bg-yellow-500",
  },
};

const menuGroups = [
  {
    label: "Gerencia do Workspace",
    items: [
      {
        label: "Módulos",
        href: "/modules",
        icon: Package,
      },
      {
        label: "Membros",
        href: "/members",
        icon: Users,
      },
      {
        label: "Configurações",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
  {
    label: "Faturamento",
    items: [
      {
        label: "Relatórios",
        href: "/billing/reports",
        icon: BarChart3,
      },
      {
        label: "Cobrança",
        href: "/billing/settings",
        icon: CreditCard,
      },
    ],
  },
];

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const workspaceId = params.id as string;
  const { data: enabledModules = [] } = useEnabledModules(workspaceId);
  const { data: workspace } = useWorkspace(workspaceId);

  const isActive = (href: string) => {
    return pathname.includes(href);
  };

  return (
    <div className="min-h-screen bg-gh-bg">
      {/* Header */}
      <header className="bg-gh-card border-b border-gh-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/workspaces")}
                className="p-2 hover:bg-gh-hover rounded transition-colors"
                title="Voltar para workspaces"
              >
                <ArrowLeft className="w-5 h-5 text-gh-text-secondary" />
              </button>
              <h1 className="text-xl font-semibold text-gh-text">
                {workspace?.name || "Workspace"}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell />
              <WalletDisplay />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Layout com sidebar estilo GitHub */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-6">
          {/* Sidebar Menu */}
          <nav className="w-64 shrink-0">
            <div className="bg-gh-card border border-gh-border rounded-md overflow-hidden">
              {/* Status dos Módulos */}
              {workspace && (
                <div className="px-4 py-3 text-xs font-semibold text-gh-text-secondary uppercase tracking-wide border-b border-gh-border bg-gh-bg flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      statusConfig[workspace.status as WorkspaceStatus]
                        ?.dotColor || "bg-gray-500"
                    }`}
                  />
                  <span>
                    {statusConfig[workspace.status as WorkspaceStatus]?.label ||
                      "Desconhecido"}
                  </span>
                </div>
              )}

              {/* Menu Groups */}
              {menuGroups.map((group, groupIndex) => (
                <div key={group.label}>
                  <div className="px-4 py-2 text-xs font-semibold text-gh-text-secondary uppercase tracking-wide border-t border-gh-border">
                    {group.label}
                  </div>
                  {group.items.map((item, itemIndex) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    const isModulesMenu = item.label === "Módulos";

                    return (
                      <button
                        key={item.href}
                        onClick={() =>
                          router.push(`/workspaces/${workspaceId}${item.href}`)
                        }
                        className={`
                          w-full flex items-center justify-between px-4 py-3 text-sm
                          transition-colors border-l-2
                          ${
                            active
                              ? "bg-gh-bg border-gh-accent text-gh-text font-medium"
                              : "border-transparent text-gh-text-secondary hover:bg-gh-hover hover:text-gh-text"
                          }
                          ${itemIndex !== 0 ? "border-t border-gh-border" : ""}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {isModulesMenu && (
                          <span
                            className="inline-block px-2 py-1 text-gh-text rounded text-xs font-medium cursor-help"
                            title={`${enabledModules.length} módulo${enabledModules.length !== 1 ? "s" : ""} instalado${enabledModules.length !== 1 ? "s" : ""}`}
                          >
                            {enabledModules.length}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
