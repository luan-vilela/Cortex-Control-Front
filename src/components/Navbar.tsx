"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { useEnabledModules, useModuleConfig } from "@/modules/workspace/hooks";
import { NotificationBell } from "@/components/NotificationBell";
import { WalletDisplay } from "@/components/WalletDisplay";
import { UserMenu } from "@/components/UserMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, MoreHorizontal, Package } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  moduleId?: string;
  description?: string;
}

// Componente: Logo
function NavbarLogo() {
  return (
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
  );
}

// Componente: Item de menu navegável
interface NavItemProps {
  item: NavItem;
  isActive: boolean;
}

function NavbarItem({ item, isActive }: NavItemProps) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
        isActive
          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
          : "text-gh-text hover:bg-gh-bg"
      }`}
    >
      <Icon className="w-4 h-4" />
      {item.label}
    </Link>
  );
}

// Componente: Item no dropdown
interface DropdownItemProps {
  module: any;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  onSelect: (moduleId: string) => void;
}

function ModuleDropdownItem({
  module,
  icon: Icon,
  isActive,
  onSelect,
}: DropdownItemProps) {
  return (
    <button
      onClick={() => onSelect(module.id)}
      className={`w-full flex items-start gap-3 px-3 py-2 rounded-lg text-left text-sm transition-all ${
        isActive ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-gh-bg"
      }`}
    >
      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0 text-gh-text" />
      <div className="flex-1 min-w-0">
        <div
          className={`font-medium ${
            isActive ? "text-blue-600 dark:text-blue-400" : "text-gh-text"
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
}

// Componente: Dropdown de módulos
interface ModulesDropdownProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  modules: any[];
  moduleIcons: Record<string, React.ComponentType<{ className?: string }>>;
  isActive: (href: string) => boolean;
  onModuleSelect: (moduleId: string) => void;
}

function ModulesDropdown({
  isOpen,
  onToggle,
  modules,
  moduleIcons,
  isActive,
  onModuleSelect,
}: ModulesDropdownProps) {
  return (
    <DropdownMenu open={isOpen} onOpenChange={onToggle}>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gh-text hover:bg-gh-bg transition-all"
          title="Ver todos os módulos"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        {modules.length === 0 ? (
          <div className="px-3 py-2 text-sm text-gh-text-secondary">
            Nenhum módulo instalado
          </div>
        ) : (
          modules.map((module) => {
            const Icon = moduleIcons[module.id] || Package;
            const moduleRoute = module.domain;
            const isCurrentModule = isActive(moduleRoute);
            return (
              <ModuleDropdownItem
                key={module.id}
                module={module}
                icon={Icon}
                isActive={isCurrentModule}
                onSelect={onModuleSelect}
              />
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Componente: Seção direita da navbar
function NavbarRightSection() {
  return (
    <div className="flex items-center gap-3 min-w-fit">
      <NotificationBell />
      <WalletDisplay />
      <div className="w-px h-6 bg-gh-border" />
      <UserMenu />
    </div>
  );
}

// Componente: Navbar principal
export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { activeWorkspace } = useWorkspaceStore();

  const { data: enabledModules = [] } = useEnabledModules(
    activeWorkspace?.id || "",
  );
  const { moduleIcons } = useModuleConfig(activeWorkspace?.id || "");

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  // Construir itens de menu com módulos já habilitados
  // enabledModules agora já vem com {id, name, category, domain, favorite}
  const visibleMenuItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    ...enabledModules.map((module: any) => {
      const icon = moduleIcons[module.id] || Package;
      return {
        label: module.name,
        href: module.domain,
        icon,
        moduleId: module.id,
        description: module.name,
      };
    }),
  ];

  const handleModuleClick = (moduleId: string) => {
    const module = enabledModules.find((m: any) => m.id === moduleId);
    const route = module?.domain || `/${moduleId.toLowerCase()}`;
    router.push(route);
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-gh-card border-b border-gh-border sticky top-0 z-0 ">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-8">
          <NavbarLogo />

          <nav className="flex items-center gap-1 flex-1">
            {visibleMenuItems.map((item) => (
              <NavbarItem
                key={item.href}
                item={item}
                isActive={isActive(item.href)}
              />
            ))}
          </nav>

          <div className="flex items-center gap-3 min-w-fit">
            <ModulesDropdown
              isOpen={isDropdownOpen}
              onToggle={setIsDropdownOpen}
              modules={enabledModules}
              moduleIcons={moduleIcons}
              isActive={isActive}
              onModuleSelect={handleModuleClick}
            />
            <div className="w-px h-6 bg-gh-border" />
            <NavbarRightSection />
          </div>
        </div>
      </div>
    </header>
  );
}
