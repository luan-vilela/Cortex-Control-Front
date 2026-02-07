"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import {
  useEnabledModules,
  useAvailableModules,
  useModuleConfig,
} from "@/modules/workspace/hooks";
import { NotificationBell } from "@/components/NotificationBell";
import { WalletDisplay } from "@/components/WalletDisplay";
import { UserMenu } from "@/components/UserMenu";
import { LayoutDashboard, MoreHorizontal } from "lucide-react";
import * as LucideIcons from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  moduleId?: string;
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const { activeWorkspace } = useWorkspaceStore();
  const { data: enabledModules = [] } = useEnabledModules(
    activeWorkspace?.id || "",
  );
  const { data: availableModules = [] } = useAvailableModules();
  const { moduleRoutes, moduleIcons } = useModuleConfig(
    activeWorkspace?.id || ":workspaceId",
  );

  // Fechar dropdown ao clicar fora
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Filtrar módulos instalados (mesmo padrão do Dashboard)
  const enabledModulesData = availableModules.filter((m: any) =>
    enabledModules.includes(m.id),
  );

  // Construir itens de menu dinamicamente
  const visibleMenuItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    ...enabledModulesData.map((module: any) => {
      const icon = moduleIcons[module.id] || LucideIcons.Package;
      return {
        label: module.name,
        href: moduleRoutes[module.id] || `/`,
        icon: icon,
        moduleId: module.id,
      };
    }),
  ];

  const handleModuleClick = (moduleId: string) => {
    const route = moduleRoutes[moduleId] || "/";
    router.push(route);
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-gh-card border-b border-gh-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-8">
          {/* Logo + Nome */}
          <div className="flex items-center gap-3 min-w-fit">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
              <span className="text-white font-bold text-lg">CC</span>
            </div>
            <Link
              href="/dashboard"
              className="text-lg font-bold text-gh-text hover:text-blue-600 transition-colors"
            >
              Cortex Control
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1 flex-1">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    active
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gh-text hover:bg-gh-bg"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}

            {/* All Modules Dropdown */}
            <div className="relative ml-auto" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gh-text hover:bg-gh-bg transition-all"
                title="Ver todos os módulos"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-gh-card border border-gh-border rounded-lg shadow-lg z-[100]">
                  <div className="p-2 max-h-96 overflow-y-auto">
                    {enabledModulesData.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-gh-text-secondary">
                        Nenhum módulo instalado
                      </div>
                    ) : (
                      enabledModulesData.map((module: any) => {
                        const Icon =
                          moduleIcons[module.id] || LucideIcons.Package;
                        const isCurrentModule = isActive(
                          moduleRoutes[module.id] || "/",
                        );

                        return (
                          <button
                            key={module.id}
                            onClick={() => handleModuleClick(module.id)}
                            className={`w-full flex items-start gap-3 px-3 py-2 rounded-lg text-left text-sm transition-all ${
                              isCurrentModule
                                ? "bg-blue-50 dark:bg-blue-900/20"
                                : "hover:bg-gh-bg"
                            }`}
                          >
                            <Icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-gh-text" />
                            <div className="flex-1 min-w-0">
                              <div
                                className={`font-medium ${
                                  isCurrentModule
                                    ? "text-blue-600 dark:text-blue-400"
                                    : "text-gh-text"
                                }`}
                              >
                                {module.name}
                              </div>
                              <p className="text-xs text-gh-text-secondary line-clamp-1">
                                {module.description}
                              </p>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3 min-w-fit">
            <NotificationBell />
            <WalletDisplay />
            <div className="w-px h-6 bg-gh-border" />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
