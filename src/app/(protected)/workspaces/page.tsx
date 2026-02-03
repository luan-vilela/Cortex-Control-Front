"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaces } from "@/modules/workspace/hooks";
import { WorkspaceSwitcher } from "@/modules/workspace/components/WorkspaceSwitcher";
import { NotificationBell } from "@/components/NotificationBell";
import { WalletDisplay } from "@/components/WalletDisplay";
import { UserMenu } from "@/components/UserMenu";
import { StatusBadge } from "@/components/StatusBadge";
import { WorkspaceStatus } from "@/modules/workspace/types/workspace.types";
import {
  Building2,
  Plus,
  Settings,
  Users,
  Crown,
  Search,
  Filter,
} from "lucide-react";

export default function WorkspacesPage() {
  const router = useRouter();
  const { data: workspaces = [], isLoading } = useWorkspaces();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filtrar workspaces
  const filteredWorkspaces = useMemo(() => {
    return workspaces.filter((workspace) => {
      const matchesSearch = workspace.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || workspace.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [workspaces, searchTerm, statusFilter]);

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

        {/* Filtros e Pesquisa */}
        <div className="mb-6 space-y-4">
          {/* Barra de Pesquisa */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pesquisar workspaces..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtros por Status */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                statusFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Todos ({workspaces.length})
            </button>
            <button
              onClick={() => setStatusFilter(WorkspaceStatus.ACTIVE)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                statusFilter === WorkspaceStatus.ACTIVE
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Ativos (
              {
                workspaces.filter((w) => w.status === WorkspaceStatus.ACTIVE)
                  .length
              }
              )
            </button>
            <button
              onClick={() => setStatusFilter(WorkspaceStatus.INACTIVE)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                statusFilter === WorkspaceStatus.INACTIVE
                  ? "bg-gray-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Inativos (
              {
                workspaces.filter((w) => w.status === WorkspaceStatus.INACTIVE)
                  .length
              }
              )
            </button>
            <button
              onClick={() => setStatusFilter(WorkspaceStatus.SUSPENDED)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                statusFilter === WorkspaceStatus.SUSPENDED
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Suspensos (
              {
                workspaces.filter((w) => w.status === WorkspaceStatus.SUSPENDED)
                  .length
              }
              )
            </button>
            <button
              onClick={() => setStatusFilter(WorkspaceStatus.ARCHIVED)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                statusFilter === WorkspaceStatus.ARCHIVED
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Arquivados (
              {
                workspaces.filter((w) => w.status === WorkspaceStatus.ARCHIVED)
                  .length
              }
              )
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkspaces.map((workspace) => {
              const isDisabled =
                workspace.status === WorkspaceStatus.INACTIVE ||
                workspace.status === WorkspaceStatus.SUSPENDED ||
                workspace.status === WorkspaceStatus.ARCHIVED;

              return (
                <div
                  key={workspace.id}
                  className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 ${
                    isDisabled ? "opacity-70" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          isDisabled ? "bg-gray-100" : "bg-blue-100"
                        }`}
                      >
                        <Building2
                          className={`w-6 h-6 ${
                            isDisabled ? "text-gray-600" : "text-blue-600"
                          }`}
                        />
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
                    <StatusBadge
                      status={workspace.status}
                      size="sm"
                      showLabel={false}
                    />
                  </div>

                  <div className="min-h-[2.5rem] mb-3">
                    {workspace.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {workspace.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    <div>
                      Membro desde{" "}
                      {new Date(workspace.joinedAt).toLocaleDateString("pt-BR")}
                    </div>
                    {workspace.memberCount !== undefined && (
                      <div>
                        {workspace.memberCount}{" "}
                        {workspace.memberCount === 1 ? "membro" : "membros"}
                      </div>
                    )}
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
              );
            })}
          </div>
        )}

        {!isLoading &&
          filteredWorkspaces.length === 0 &&
          workspaces.length > 0 && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum workspace encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                Tente ajustar os filtros ou termos de pesquisa
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Limpar Filtros
              </button>
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
