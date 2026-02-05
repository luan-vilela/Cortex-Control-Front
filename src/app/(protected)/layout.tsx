"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import {
  useWorkspaces,
  useEnabledModules,
  useAvailableModules,
} from "@/modules/workspace/hooks";
import { WorkspaceSwitcher } from "@/modules/workspace/components/WorkspaceSwitcher";
import { NotificationBell } from "@/components/NotificationBell";
import { WalletDisplay } from "@/components/WalletDisplay";
import { UserMenu } from "@/components/UserMenu";
import Sidebar from "@/components/Sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const { activeWorkspace } = useWorkspaceStore();
  const { data: enabledModules = [] } = useEnabledModules(
    activeWorkspace?.id || "",
  );
  const { data: availableModules = [] } = useAvailableModules();

  // Pré-carregar workspaces
  useWorkspaces();

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, _hasHydrated, router]);

  // Mostra loading enquanto verifica autenticação
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Se não estiver autenticado, não renderiza nada (vai redirecionar)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gh-bg flex">
      {/* Sidebar */}
      <Sidebar
        activeWorkspaceName={activeWorkspace?.name}
        enabledModules={enabledModules}
        availableModules={availableModules}
      />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gh-card border-b border-gh-border sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1
                  onClick={() => router.push("/dashboard")}
                  className="text-xl font-semibold text-gh-text cursor-pointer hover:text-gh-accent"
                >
                  Cortex Control
                </h1>
                {activeWorkspace && <WorkspaceSwitcher />}
              </div>
              <div className="flex items-center gap-3">
                <NotificationBell />
                <WalletDisplay />
                <UserMenu />
              </div>
            </div>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
