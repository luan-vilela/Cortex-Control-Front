"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useWorkspaces, useWorkspaceInvites } from "@/modules/workspace/hooks";
import { WorkspaceSwitcher } from "@/modules/workspace/components/WorkspaceSwitcher";
import { NotificationBell } from "@/components/NotificationBell";
import { WalletDisplay } from "@/components/WalletDisplay";
import { UserMenu } from "@/components/UserMenu";

export default function DashboardPage() {
  const { user } = useAuthStore();

  // Pré-carregar workspaces e convites
  useWorkspaces();
  useWorkspaceInvites();

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
            <WalletDisplay />
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
