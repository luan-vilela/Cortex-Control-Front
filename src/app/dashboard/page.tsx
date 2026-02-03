"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { WorkspaceSwitcher } from "@/modules/workspace/components/WorkspaceSwitcher";
import { NotificationBell } from "@/components/NotificationBell";
import { UserMenu } from "@/components/UserMenu";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, _hasHydrated, clearAuth } = useAuthStore();
  const {
    fetchWorkspaces,
    fetchInvites,
    invites,
    clear: clearWorkspace,
  } = useWorkspaceStore();

  const handleLogout = () => {
    clearAuth();
    clearWorkspace();
    router.push("/auth/login");
  };

  useEffect(() => {
    // Aguarda a hidratação do estado antes de verificar autenticação
    if (_hasHydrated && !isAuthenticated) {
      router.push("/auth/login");
    }

    // Carregar workspaces quando autenticado
    if (_hasHydrated && isAuthenticated) {
      fetchWorkspaces();
      fetchInvites();
    }
  }, [isAuthenticated, _hasHydrated, router]);

  // Mostra loading enquanto hidrata ou não está autenticado
  if (!_hasHydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Cortex Control</h1>
            <WorkspaceSwitcher />
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">
            Bem-vindo, {user?.name}!
          </h3>
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-medium">Email:</span> {user?.email}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Role:</span> {user?.role}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Provider:</span>{" "}
              {user?.provider || "local"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
