"use client";

import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

export interface ModuleMenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number | string;
}

export interface ModuleMenuSection {
  section: string;
  label: string;
  items: ModuleMenuItem[];
}

export type ModuleMenuGroup = ModuleMenuItem | ModuleMenuSection;

interface ModuleLayoutProps {
  children: ReactNode;
  menuItems?: ModuleMenuGroup[];
  menuTitle?: string;
}

export function ModuleLayout({
  children,
  menuItems,
  menuTitle,
}: ModuleLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href.endsWith("/") && pathname.endsWith("/")) {
      return pathname === href;
    }
    if (!href.endsWith("/") && !pathname.endsWith("/")) {
      return pathname === href || pathname.startsWith(href + "/");
    }
    return false;
  };

  const renderMenuItem = (item: ModuleMenuItem, isActive: boolean) => {
    const Icon = item.icon;
    return (
      <button
        key={item.href}
        onClick={() => router.push(item.href)}
        className={`
          w-full flex items-center justify-between px-4 py-3 text-sm
          transition-colors border-l-2
          ${
            isActive
              ? "bg-gh-bg border-blue-500 text-gh-text font-medium"
              : "border-transparent text-gh-text-secondary hover:bg-gh-hover hover:text-gh-text"
          }
        `}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Icon className="w-4 h-4 shrink-0" />
          <span className="truncate">{item.label}</span>
        </div>
        {item.badge !== undefined && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-gh-badge-bg text-gh-text ml-2 shrink-0">
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  const isSectionItem = (item: ModuleMenuGroup): item is ModuleMenuSection =>
    "section" in item;

  // Se não há menu, ocupa todo o espaço
  if (!menuItems || menuItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <main className="w-full">{children}</main>
      </div>
    );
  }

  // Layout com 2 colunas (menu + conteúdo)
  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex gap-6">
        {/* Sidebar Menu */}
        <nav className="w-64 shrink-0">
          <div className="bg-gh-card border border-gh-border rounded-lg overflow-hidden sticky top-24">
            {/* Menu Title */}
            {menuTitle && (
              <div className="px-4 py-3 border-b border-gh-border bg-gh-bg">
                <h3 className="text-xs font-semibold text-gh-text-secondary uppercase tracking-wide">
                  {menuTitle}
                </h3>
              </div>
            )}

            {/* Menu Items */}
            <div>
              {menuItems.map((item, index) => {
                // Se é uma seção
                if (isSectionItem(item)) {
                  return (
                    <div key={`section-${index}`}>
                      <div className="px-4 py-3 text-xs font-semibold text-gh-text-secondary uppercase tracking-wide border-t border-gh-border bg-gh-bg">
                        {item.label}
                      </div>
                      {item.items.map((subItem) => (
                        <div
                          key={subItem.href}
                          className="border-t border-gh-border"
                        >
                          {renderMenuItem(subItem, isActive(subItem.href))}
                        </div>
                      ))}
                    </div>
                  );
                }

                // Se é um item regular
                return (
                  <div
                    key={item.href}
                    className={index !== 0 ? "border-t border-gh-border" : ""}
                  >
                    {renderMenuItem(item, isActive(item.href))}
                  </div>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
