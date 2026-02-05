"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useWorkspace,
  useUpdateWorkspace,
  useDeleteWorkspace,
} from "@/modules/workspace/hooks";
import { useAlerts } from "@/contexts/AlertContext";
import { workspaceService } from "@/modules/workspace/services/workspace.service";
import { WorkspaceStatus } from "@/modules/workspace/types/workspace.types";
import { StatusBadge } from "@/components/StatusBadge";
import { NotificationBell } from "@/components/NotificationBell";
import { WalletDisplay } from "@/components/WalletDisplay";
import { UserMenu } from "@/components/UserMenu";
import { Modal } from "@/components/ui/Modal";
import {
  ArrowLeft,
  Settings as SettingsIcon,
  Save,
  Trash2,
  LogOut,
  AlertTriangle,
  Power,
} from "lucide-react";

export default function WorkspaceSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.id as string;
  const alerts = useAlerts();

  const { data: workspace, isLoading } = useWorkspace(workspaceId);
  const updateWorkspaceMutation = useUpdateWorkspace(workspaceId);
  const deleteWorkspaceMutation = useDeleteWorkspace();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [hasOtherOwner, setHasOtherOwner] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<WorkspaceStatus>(
    WorkspaceStatus.ACTIVE,
  );
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Inicializar valores do formulário
  useEffect(() => {
    if (workspace) {
      setName(workspace.name || "");
      setDescription(workspace.description || "");
      setCurrentStatus(workspace.status || WorkspaceStatus.ACTIVE);
    }
  }, [workspace]);

  const getStatusLabel = (status: WorkspaceStatus) => {
    const labels = {
      [WorkspaceStatus.ACTIVE]: "Ativo",
      [WorkspaceStatus.INACTIVE]: "Inativo",
      [WorkspaceStatus.SUSPENDED]: "Suspenso",
      [WorkspaceStatus.ARCHIVED]: "Arquivado",
    };
    return labels[status];
  };

  const handleUpdateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();

    updateWorkspaceMutation.mutate(
      { name, description },
      {
        onSuccess: () => {
          alerts.success("Workspace atualizado com sucesso!");
        },
        onError: (error: any) => {
          console.error("Erro ao atualizar workspace:", error);
          alerts.error(
            error.response?.data?.message || "Erro ao atualizar workspace",
          );
        },
      },
    );
  };

  const handleDeleteWorkspace = () => {
    deleteWorkspaceMutation.mutate(workspaceId, {
      onSuccess: () => {
        setShowDeleteModal(false);
        alerts.success("Workspace deletado com sucesso!");
        router.push("/workspaces");
      },
      onError: (error: any) => {
        console.error("Erro ao deletar workspace:", error);
        alerts.error(
          error.response?.data?.message || "Erro ao deletar workspace",
        );
      },
    });
  };

  const handleLeaveWorkspace = () => {
    // TODO: implementar sair do workspace quando backend tiver o endpoint
    alerts.info("Funcionalidade em desenvolvimento");
  };

  const handleStatusChange = async (newStatus: WorkspaceStatus) => {
    const canChangeStatusNow =
      workspace?.isOwner || workspace?.role === "admin";

    if (!canChangeStatusNow) {
      alerts.warning(
        "Você não tem permissão para alterar o status do workspace",
      );
      return;
    }

    if (currentStatus === WorkspaceStatus.SUSPENDED) {
      alerts.warning(
        "Workspaces suspensos por falta de créditos só podem ser reativados com recarga de saldo",
      );
      return;
    }

    if (
      confirm(
        `Tem certeza que deseja alterar o status para "${getStatusLabel(newStatus)}"?`,
      )
    ) {
      setIsUpdatingStatus(true);
      try {
        await workspaceService.updateWorkspaceStatus(workspaceId, newStatus);
        setCurrentStatus(newStatus);
        alerts.success("Status atualizado com sucesso!");
        // Recarregar dados do workspace
        window.location.reload();
      } catch (error: any) {
        console.error("Erro ao atualizar status:", error);
        alerts.error(
          error.response?.data?.message || "Erro ao atualizar status",
        );
      } finally {
        setIsUpdatingStatus(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gh-hover"></div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Workspace não encontrado
          </h2>
          <button
            onClick={() => router.push("/workspaces")}
            className="text-blue-600 hover:text-blue-700"
          >
            Voltar para workspaces
          </button>
        </div>
      </div>
    );
  }

  const canEditSettings = workspace.permissions?.settings?.write || false;
  const isOwner = workspace.isOwner || false;
  const canChangeStatus = isOwner || workspace.role === "admin";

  return (
    <div className="min-h-screen bg-gh-bg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Configurações </h2>
            <p className="text-gray-600 mt-1">{workspace.name}</p>
          </div>
        </div>

        {/* Content */}
        <div className="w-full h-full">
          {/* Informações Gerais */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Informações Gerais
            </h2>

            <form
              key={workspace.id}
              onSubmit={handleUpdateWorkspace}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Workspace
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={!canEditSettings}
                  required
                  minLength={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Nome do workspace"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição (opcional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={!canEditSettings}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Descreva o propósito deste workspace..."
                />
              </div>

              {canEditSettings && (
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={updateWorkspaceMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {updateWorkspaceMutation.isPending
                      ? "Salvando..."
                      : "Salvar Alterações"}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Status do Workspace */}
          {canChangeStatus && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Status do Workspace
              </h2>

              <div className="space-y-6">
                {/* Switch Ativo/Inativo */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Workspace Ativo
                    </h3>
                    <p className="text-sm text-gray-600">
                      {currentStatus === WorkspaceStatus.ACTIVE
                        ? "Funcionando normalmente"
                        : currentStatus === WorkspaceStatus.INACTIVE
                          ? "Workspace pausado"
                          : currentStatus === WorkspaceStatus.SUSPENDED
                            ? "Suspenso por falta de créditos"
                            : "Workspace arquivado"}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      handleStatusChange(
                        currentStatus === WorkspaceStatus.ACTIVE
                          ? WorkspaceStatus.INACTIVE
                          : WorkspaceStatus.ACTIVE,
                      )
                    }
                    disabled={
                      isUpdatingStatus ||
                      currentStatus === WorkspaceStatus.SUSPENDED ||
                      currentStatus === WorkspaceStatus.ARCHIVED
                    }
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                      currentStatus === WorkspaceStatus.ACTIVE
                        ? "bg-green-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        currentStatus === WorkspaceStatus.ACTIVE
                          ? "translate-x-7"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {currentStatus === WorkspaceStatus.SUSPENDED && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800">
                      ⚠️ <strong>Suspenso por falta de créditos.</strong>{" "}
                      Recarregue seu saldo para reativar automaticamente.
                    </p>
                  </div>
                )}

                {/* Botão Arquivar */}
                <div className="pt-4 border-t border-gray-200 flex items-center justify-end gap-3">
                  <p className="text-xs text-gray-500">
                    {currentStatus === WorkspaceStatus.ARCHIVED
                      ? "Reativa o workspace para uso normal"
                      : "Preserva para consulta, mas impede novas operações"}
                  </p>
                  <button
                    onClick={() =>
                      handleStatusChange(
                        currentStatus === WorkspaceStatus.ARCHIVED
                          ? WorkspaceStatus.ACTIVE
                          : WorkspaceStatus.ARCHIVED,
                      )
                    }
                    disabled={
                      isUpdatingStatus ||
                      currentStatus === WorkspaceStatus.SUSPENDED
                    }
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gh-bg rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    {currentStatus === WorkspaceStatus.ARCHIVED
                      ? "Desarquivar"
                      : "Arquivar"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Zona de Perigo */}
          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-red-200">
            <h2 className="text-xl font-bold text-red-600 mb-4">
              Zona de Perigo
            </h2>

            <div className="space-y-4">
              {/* Sair do Workspace */}
              {!isOwner && (
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Sair do Workspace
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Você será removido deste workspace e perderá acesso.
                    </p>
                    {!hasOtherOwner && (
                      <p className="text-xs text-red-600 mt-1">
                        ⚠️ Ação disponível apenas quando houver outro owner
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleLeaveWorkspace}
                    disabled={!hasOtherOwner}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              )}

              {/* Deletar Workspace */}
              {isOwner && (
                <div className="flex items-center justify-between p-4 border border-red-300 rounded-lg bg-red-50">
                  <div>
                    <h3 className="font-semibold text-red-900">
                      Deletar Workspace
                    </h3>
                    <p className="text-sm text-red-700 mt-1">
                      Esta ação é irreversível. Todos os dados serão
                      permanentemente deletados.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Deletar
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Modal de Confirmação de Exclusão */}
          <Modal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
          >
            <Modal.Header onClose={() => setShowDeleteModal(false)}>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <span>Deletar Workspace</span>
              </div>
            </Modal.Header>

            <Modal.Body>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Tem certeza que deseja deletar o workspace{" "}
                  <span className="font-semibold text-gray-900">
                    &quot;{workspace?.name}&quot;
                  </span>
                  ?
                </p>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-800 font-medium mb-2">
                    ⚠️ Esta ação é permanente e não pode ser desfeita!
                  </p>
                  <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                    <li>Todos os membros serão removidos</li>
                    <li>Todos os dados serão permanentemente deletados</li>
                    <li>Convites pendentes serão cancelados</li>
                    <li>Configurações serão perdidas</li>
                  </ul>
                </div>

                <p className="text-sm text-gray-600">
                  Digite o nome do workspace para confirmar a exclusão:
                </p>

                <input
                  type="text"
                  placeholder={workspace?.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                  id="confirm-delete-input"
                />
              </div>
            </Modal.Body>

            <Modal.Footer>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteWorkspaceMutation.isPending}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gh-bg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const input = document.getElementById(
                    "confirm-delete-input",
                  ) as HTMLInputElement;
                  if (input?.value !== workspace?.name) {
                    alert("O nome do workspace não confere!");
                    return;
                  }
                  handleDeleteWorkspace();
                }}
                disabled={deleteWorkspaceMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                {deleteWorkspaceMutation.isPending
                  ? "Deletando..."
                  : "Deletar Permanentemente"}
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}
