"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useWorkspaces, useWorkspaceInvites } from "@/modules/workspace/hooks";
import { usePersonStats } from "@/modules/person/hooks/usePersonQueries";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { WorkspaceSwitcher } from "@/modules/workspace/components/WorkspaceSwitcher";
import { NotificationBell } from "@/components/NotificationBell";
import { WalletDisplay } from "@/components/WalletDisplay";
import { UserMenu } from "@/components/UserMenu";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { activeWorkspace } = useWorkspaceStore();

  // Pré-carregar workspaces e convites
  useWorkspaces();
  useWorkspaceInvites();

  // Carregar estatísticas de pessoas
  const { data: personStats } = usePersonStats(activeWorkspace?.id || "");

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

        {/* Cards de Módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Card Pessoas */}
          <div
            onClick={() => router.push("/persons")}
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Pessoas</h3>
              <span className="text-3xl">👥</span>
            </div>
            {personStats ? (
              <div className="space-y-2">
                <p className="text-2xl font-bold text-blue-600">
                  {personStats.total}
                </p>
                <p className="text-sm text-gray-600">
                  {personStats.active} ativos
                </p>
                <div className="pt-2 border-t text-xs text-gray-500 space-y-1">
                  {personStats.byType.lead && (
                    <p>Leads: {personStats.byType.lead}</p>
                  )}
                  {personStats.byType.customer && (
                    <p>Clientes: {personStats.byType.customer}</p>
                  )}
                  {personStats.byType.company && (
                    <p>Empresas: {personStats.byType.company}</p>
                  )}
                  {personStats.byType.supplier && (
                    <p>Fornecedores: {personStats.byType.supplier}</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Carregando...</p>
            )}
          </div>

          {/* Card Workspaces */}
          <div
            onClick={() => router.push("/workspaces")}
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-green-500"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Workspaces
              </h3>
              <span className="text-3xl">🏢</span>
            </div>
            <p className="text-sm text-gray-600">
              Gerencie seus espaços de trabalho
            </p>
          </div>

          {/* Card Perfil */}
          <div
            onClick={() => router.push("/profile")}
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-purple-500"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Perfil</h3>
              <span className="text-3xl">⚙️</span>
            </div>
            <p className="text-sm text-gray-600">
              Configurações e preferências
            </p>
          </div>
        </div>

        {/* Informações do Usuário */}
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
            {activeWorkspace && (
              <p className="text-gray-600">
                <span className="font-medium">Workspace Ativo:</span>{" "}
                {activeWorkspace.name}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
