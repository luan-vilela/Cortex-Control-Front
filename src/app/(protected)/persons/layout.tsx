"use client";

import { usePathname, useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { usePersonStats } from "@/modules/person/hooks/usePersonQueries";
import { WorkspaceSwitcher } from "@/modules/workspace/components/WorkspaceSwitcher";
import { NotificationBell } from "@/components/NotificationBell";
import { WalletDisplay } from "@/components/WalletDisplay";
import { UserMenu } from "@/components/UserMenu";
import { Users, UserPlus, TrendingUp, ShoppingCart, Briefcase, Handshake } from "lucide-react";

const menuItems = [
  {
    label: "Todas as Pessoas",
    href: "/persons",
    icon: Users,
    count: "total",
  },
  {
    label: "Nova Pessoa",
    href: "/persons/new",
    icon: UserPlus,
  },
  {
    section: "criar",
    items: [
      {
        label: "Novo Contato",
        href: "/persons/new",
        icon: Users,
      },
      {
        label: "Novo Lead",
        href: "/leads/new",
        icon: TrendingUp,
      },
      {
        label: "Novo Cliente",
        href: "/clientes/new",
        icon: ShoppingCart,
      },
      {
        label: "Novo Fornecedor",
        href: "/fornecedores/new",
        icon: Briefcase,
      },
      {
        label: "Novo Parceiro",
        href: "/parceiros/new",
        icon: Handshake,
      },
    ],
  },
];

export default function PersonsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { activeWorkspace } = useWorkspaceStore();
  const { data: stats } = usePersonStats(activeWorkspace?.id || "");

  const getCount = (countKey: string) => {
    if (!stats) return null;
    if (countKey === "total") return stats.total;
    return null;
  };

  const isActive = (href: string) => {
    if (href === "/persons" && pathname === "/persons") {
      return true;
    }
    if (href !== "/persons" && pathname?.startsWith(href.split("?")[0])) {
      return true;
    }
    return false;
  };

  if (!activeWorkspace) {
    return (
      <div className="min-h-screen bg-gh-bg">
        <header className="bg-gh-card border-b border-gh-border">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gh-text">
                Cortex Control
              </h1>
              <div className="flex items-center gap-3">
                <NotificationBell />
                <WalletDisplay />
                <UserMenu />
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <p className="text-gh-text-secondary">
            Selecione um workspace para continuar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gh-bg">
      {/* Header */}
      <header className="bg-gh-card border-b border-gh-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1
                onClick={() => router.push("/dashboard")}
                className="text-xl font-semibold text-gh-text cursor-pointer hover:text-gh-accent"
              >
                Cortex Control
              </h1>
              <WorkspaceSwitcher />
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
              {menuItems.map((item: any, index: number) => {
                // Se é uma seção de grupo
                if (item.section === "criar") {
                  return (
                    <div key={`section-${index}`}>
                      <div className="px-4 py-3 text-xs font-semibold text-gh-text-secondary uppercase tracking-wide border-t border-gh-border bg-gh-bg">
                        CRIAR
                      </div>
                      {item.items.map((subItem: any) => {
                        const Icon = subItem.icon;
                        const active = isActive(subItem.href);

                        return (
                          <button
                            key={subItem.href}
                            onClick={() => router.push(subItem.href)}
                            className={`
                              w-full flex items-center gap-3 px-4 py-2.5 text-sm
                              transition-colors
                              ${
                                active
                                  ? "bg-gh-hover text-gh-text"
                                  : "text-gh-text-secondary hover:bg-gh-hover hover:text-gh-text"
                              }
                            `}
                          >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{subItem.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  );
                }

                // Se é um item regular
                const Icon = item.icon;
                const count = item.count ? getCount(item.count) : null;
                const active = isActive(item.href);

                return (
                  <button
                    key={item.href}
                    onClick={() => router.push(item.href)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 text-sm
                      transition-colors border-l-2
                      ${
                        active
                          ? "bg-gh-bg border-gh-accent text-gh-text font-medium"
                          : "border-transparent text-gh-text-secondary hover:bg-gh-hover hover:text-gh-text"
                      }
                      ${index !== 0 ? "border-t border-gh-border" : ""}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {count !== null && (
                      <span
                        className={`
                        text-xs px-2 py-0.5 rounded-full
                        ${
                          active
                            ? "bg-gh-accent text-white"
                            : "bg-gh-hover text-gh-text-secondary"
                        }
                      `}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
