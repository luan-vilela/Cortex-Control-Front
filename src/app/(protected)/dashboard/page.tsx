"use client";

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
    <div className="min-h-screen bg-gh-bg">
      {/* Header estilo GitHub */}
      <header className="bg-gh-card border-b border-gh-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gh-text">
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
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gh-text mb-2">
            Dashboard
          </h2>
          <p className="text-gh-text-secondary">
            Bem-vindo ao seu painel de controle
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {/* Card Pessoas */}
          <button
            onClick={() => router.push("/persons")}
            className="bg-gh-card border border-gh-border hover:border-gh-hover rounded-md p-5 transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-medium text-gh-text-secondary mb-1">
                  Pessoas
                </h3>
                {personStats ? (
                  <p className="text-2xl font-semibold text-gh-text">
                    {personStats.total}
                  </p>
                ) : (
                  <p className="text-2xl font-semibold text-gh-text-secondary">
                    -
                  </p>
                )}
              </div>
              <span className="text-2xl opacity-70 group-hover:opacity-100 transition-opacity">
                👥
              </span>
            </div>
            {personStats && (
              <div className="space-y-1 text-xs text-gh-text-secondary">
                <div className="flex justify-between py-1 border-t border-gh-border">
                  <span>Leads</span>
                  <span className="text-gh-text font-medium">
                    {personStats.byType?.LEAD || 0}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Clientes</span>
                  <span className="text-gh-text font-medium">
                    {personStats.byType?.CLIENTE || 0}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Fornecedores</span>
                  <span className="text-gh-text font-medium">
                    {personStats.byType?.FORNECEDOR || 0}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Parceiros</span>
                  <span className="text-gh-text font-medium">
                    {personStats.byType?.PARCEIRO || 0}
                  </span>
                </div>
              </div>
            )}
          </button>

          {/* Card Workspaces */}
          <button
            onClick={() => router.push("/workspaces")}
            className="bg-gh-card border border-gh-border hover:border-gh-hover rounded-md p-5 transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-medium text-gh-text-secondary mb-1">
                  Workspaces
                </h3>
                <p className="text-sm text-gh-text-secondary mt-2">
                  Gerencie seus espaços de trabalho
                </p>
              </div>
              <span className="text-2xl opacity-70 group-hover:opacity-100 transition-opacity">
                🏢
              </span>
            </div>
          </button>

          {/* Card Perfil */}
          <button
            onClick={() => router.push("/profile")}
            className="bg-gh-card border border-gh-border hover:border-gh-hover rounded-md p-5 transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-medium text-gh-text-secondary mb-1">
                  Perfil
                </h3>
                <p className="text-sm text-gh-text-secondary mt-2">
                  Configurações e preferências
                </p>
              </div>
              <span className="text-2xl opacity-70 group-hover:opacity-100 transition-opacity">
                ⚙️
              </span>
            </div>
          </button>
        </div>

        {/* User Info Card */}
        <div className="bg-gh-card border border-gh-border rounded-md">
          <div className="px-5 py-4 border-b border-gh-border">
            <h3 className="text-sm font-semibold text-gh-text">
              Informações da Conta
            </h3>
          </div>
          <div className="p-5">
            <dl className="space-y-4">
              <div className="flex items-start">
                <dt className="text-sm text-gh-text-secondary w-32">Nome</dt>
                <dd className="text-sm text-gh-text flex-1">{user?.name}</dd>
              </div>
              <div className="flex items-start">
                <dt className="text-sm text-gh-text-secondary w-32">Email</dt>
                <dd className="text-sm text-gh-text flex-1">{user?.email}</dd>
              </div>
              <div className="flex items-start">
                <dt className="text-sm text-gh-text-secondary w-32">Role</dt>
                <dd className="text-sm text-gh-text flex-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gh-badge-bg text-gh-badge-text border border-gh-badge-border/30">
                    {user?.role}
                  </span>
                </dd>
              </div>
              <div className="flex items-start">
                <dt className="text-sm text-gh-text-secondary w-32">
                  Provider
                </dt>
                <dd className="text-sm text-gh-text flex-1">
                  {user?.provider || "local"}
                </dd>
              </div>
              {activeWorkspace && (
                <div className="flex items-start">
                  <dt className="text-sm text-gh-text-secondary w-32">
                    Workspace
                  </dt>
                  <dd className="text-sm text-gh-text flex-1">
                    {activeWorkspace.name}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
