"use client";

import { usePathname, useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { usePersonStats } from "@/modules/person/hooks/usePersonQueries";
import {
  Users,
  UserPlus,
  TrendingUp,
  ShoppingCart,
  Briefcase,
  Handshake,
} from "lucide-react";

const menuItems = [
  {
    label: "Todas os Contatos",
    href: "/contatos",
    icon: Users,
    count: "total",
  },
  {
    label: "Novo Contato",
    href: "/contatos/new",
    icon: UserPlus,
  },
  {
    section: "criar",
    items: [
      {
        label: "Clientes",
        href: "/contatos/clientes",
        icon: ShoppingCart,
      },
      {
        label: "Fornecedores",
        href: "/contatos/fornecedores",
        icon: Briefcase,
      },
      {
        label: "Parceiros",
        href: "/contatos/parceiros",
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
    if (countKey === "total") return stats.byType.PERSON || 0;
    return null;
  };

  const isActive = (href: string) => {
    if (href === "/contatos" && pathname === "/contatos") {
      return true;
    }
    if (href !== "/contatos" && pathname?.startsWith(href.split("?")[0])) {
      return true;
    }
    return false;
  };

  if (!activeWorkspace) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <p className="text-gh-text-secondary">
          Selecione um workspace para continuar
        </p>
      </div>
    );
  }

  return (
    <div>
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
                        className={`text-xs px-2 py-0.5 rounded-full bg-gh-badge-bg text-gh-text`}
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
