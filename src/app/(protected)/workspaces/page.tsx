"use client";

import { useRouter } from "next/navigation";
import { useWorkspaces } from "@/modules/workspace/hooks";
import { WorkspaceSwitcher } from "@/modules/workspace/components/WorkspaceSwitcher";
import { NotificationBell } from "@/components/NotificationBell";
import { UserMenu } from "@/components/UserMenu";
import { Building2, Plus, Settings, Users, Crown } from "lucide-react";

export default function WorkspacesPage() {
  const router = useRouter();
  const { data: workspaces = [], isLoading } = useWorkspaces();

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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Meus Workspaces</h2>
          <a
            href="/workspaces/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Criar Workspace
          </a>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((workspace) => (
              <div
                key={workspace.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {workspace.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600 capitalize">
                        {workspace.isOwner && (
                          <Crown className="w-3 h-3 text-yellow-500" />
                        )}
                        {workspace.role}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  Membro desde{" "}
                  {new Date(workspace.joinedAt).toLocaleDateString("pt-BR")}
                </div>

                <div className="flex gap-2">
                  {workspace.permissions.settings.read && (
                    <a
                      href={`/workspaces/${workspace.id}/settings`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Configurações
                    </a>
                  )}
                  {workspace.permissions.members.read && (
                    <a
                      href={`/workspaces/${workspace.id}/members`}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <Users className="w-4 h-4" />
                      Membros
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && workspaces.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum workspace encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              Crie seu primeiro workspace para começar
            </p>
            <a
              href="/workspaces/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Criar Workspace
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
