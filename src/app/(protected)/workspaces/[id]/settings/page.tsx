"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useWorkspace,
  useUpdateWorkspace,
  useDeleteWorkspace,
} from "@/modules/workspace/hooks";
import { NotificationBell } from "@/components/NotificationBell";
import { UserMenu } from "@/components/UserMenu";
import { Modal } from "@/components/ui/Modal";
import {
  ArrowLeft,
  Settings as SettingsIcon,
  Save,
  Trash2,
  LogOut,
  AlertTriangle,
} from "lucide-react";

export default function WorkspaceSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.id as string;

  const { data: workspace, isLoading } = useWorkspace(workspaceId);
  const updateWorkspaceMutation = useUpdateWorkspace(workspaceId);
  const deleteWorkspaceMutation = useDeleteWorkspace();

  const [name, setName] = useState("");
  const [hasOtherOwner, setHasOtherOwner] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (workspace) {
      setName(workspace.name || "");
    }
  }, [workspace]);

  const handleUpdateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();

    updateWorkspaceMutation.mutate(
      { name },
      {
        onSuccess: () => {
          alert("Workspace atualizado com sucesso!");
        },
        onError: (error: any) => {
          console.error("Erro ao atualizar workspace:", error);
          alert(error.response?.data?.message || "Erro ao atualizar workspace");
        },
      },
    );
  };

  const handleDeleteWorkspace = () => {
    deleteWorkspaceMutation.mutate(workspaceId, {
      onSuccess: () => {
        setShowDeleteModal(false);
        alert("Workspace deletado com sucesso!");
        router.push("/workspaces");
      },
      onError: (error: any) => {
        console.error("Erro ao deletar workspace:", error);
        alert(error.response?.data?.message || "Erro ao deletar workspace");
      },
    });
  };

  const handleLeaveWorkspace = () => {
    // TODO: implementar sair do workspace quando backend tiver o endpoint
    alert("Funcionalidade em desenvolvimento");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/workspaces")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <SettingsIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Configurações
                  </h1>
                  <p className="text-sm text-gray-600">{workspace.name}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <a
          href="/workspaces"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para workspaces
        </a>

        {/* Informações Gerais */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Informações Gerais
          </h2>

          <form onSubmit={handleUpdateWorkspace} className="space-y-4">
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

        {/* Zona de Perigo */}
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-red-200">
          <h2 className="text-xl font-bold text-red-600 mb-4">Zona de Perigo</h2>

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
        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
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
                  "{workspace?.name}"
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
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
  );
}
