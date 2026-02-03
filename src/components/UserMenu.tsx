"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Settings,
  Key,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { useThemeStore } from "@/store/theme.store";

export function UserMenu() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const { clear: clearWorkspace } = useWorkspaceStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearAuth();
    clearWorkspace();
    router.push("/auth/login");
  };

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 text-gh-text hover:bg-gh-bg rounded-lg transition-colors"
        aria-label="Menu do usuário"
      >
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {getUserInitials()}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gh-text-secondary transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gh-card rounded-lg shadow-lg border border-gh-border z-50">
          {/* User Info */}
          <div className="p-4 border-b border-gh-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-lg font-medium">
                  {getUserInitials()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gh-text truncate">
                  {user?.name || "Usuário"}
                </p>
                <p className="text-xs text-gh-text-secondary truncate">
                  {user?.email || "email@example.com"}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/profile");
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gh-text hover:bg-gh-bg transition-colors"
            >
              <User className="w-4 h-4 text-gh-text-secondary" />
              <span>Meu Perfil</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/profile/settings");
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gh-text hover:bg-gh-bg transition-colors"
            >
              <Settings className="w-4 h-4 text-gh-text-secondary" />
              <span>Configurações</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/profile/change-password");
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gh-text hover:bg-gh-bg transition-colors"
            >
              <Key className="w-4 h-4 text-gh-text-secondary" />
              <span>Alterar Senha</span>
            </button>

            <div className="border-t border-gh-border my-2" />

            {/* Theme Toggle */}
            <button
              onClick={() => {
                toggleTheme();
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gh-text hover:bg-gh-bg transition-colors"
            >
              {theme === "light" ? (
                <>
                  <Moon className="w-4 h-4 text-gh-text-secondary" />
                  <span>Modo Escuro</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-gh-text-secondary" />
                  <span>Modo Claro</span>
                </>
              )}
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-gh-border py-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
