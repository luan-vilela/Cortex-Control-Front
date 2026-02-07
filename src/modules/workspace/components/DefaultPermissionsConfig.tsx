"use client";

import { useState } from "react";
import {
  useDefaultMemberPermissions,
  useSetDefaultMemberPermissions,
} from "@/modules/workspace/hooks";
import { AlertCircle, Save, RotateCcw } from "lucide-react";
import type { WorkspacePermissions } from "@/modules/workspace/types/workspace.types";

interface DefaultPermissionsConfigProps {
  workspaceId: string;
}

const moduleLabels: Record<string, string> = {
  contacts: "Contatos",
  conversations: "Conversas",
  automations: "Automações",
  settings: "Configurações",
  members: "Membros",
  customers: "Clientes",
};

const permissionLabels: Record<string, string> = {
  read: "Visualizar",
  write: "Editar",
  delete: "Deletar",
};

export function DefaultPermissionsConfig({
  workspaceId,
}: DefaultPermissionsConfigProps) {
  const { data: defaultPermissions = [] } =
    useDefaultMemberPermissions(workspaceId);
  const setDefaultPermissionsMutation =
    useSetDefaultMemberPermissions(workspaceId);

  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [editingPermissions, setEditingPermissions] =
    useState<WorkspacePermissions | null>(null);

  const memberConfig = defaultPermissions?.find(
    (p: any) => p.role === "member",
  );

  const handleEditMember = () => {
    if (memberConfig) {
      setEditingRole("member");
      setEditingPermissions({ ...memberConfig.permissions });
    }
  };

  const handleSave = () => {
    if (!editingRole || !editingPermissions) return;

    setDefaultPermissionsMutation.mutate(
      {
        role: editingRole,
        permissions: editingPermissions,
      },
      {
        onSuccess: () => {
          setEditingRole(null);
          setEditingPermissions(null);
        },
        onError: (error: any) => {
          console.error("Erro ao atualizar permissões padrão:", error);
          alert("Erro ao atualizar permissões padrão");
        },
      },
    );
  };

  const handleCancel = () => {
    setEditingRole(null);
    setEditingPermissions(null);
  };

  const togglePermission = (
    module: keyof WorkspacePermissions,
    permission: "read" | "write" | "delete",
  ) => {
    if (!editingPermissions) return;

    setEditingPermissions({
      ...editingPermissions,
      [module]: {
        ...editingPermissions[module],
        [permission]: !editingPermissions[module][permission],
      },
    });
  };

  const isEditing = editingRole === "member";

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <AlertCircle className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Permissões Padrão para Membros
        </h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Configure as permissões padrão que novos membros receberão ao serem
        convidados.
      </p>

      {isEditing && editingPermissions ? (
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">
              Configurar Permissões
            </h4>
            <div className="space-y-3">
              {Object.entries(editingPermissions).map(([module, perms]) => (
                <div key={module} className="border-l-4 border-blue-200 pl-4">
                  <p className="font-medium text-gray-900 mb-2">
                    {moduleLabels[module as keyof typeof moduleLabels] ||
                      module}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {["read", "write", "delete"].map((perm) => (
                      <label
                        key={perm}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={perms[perm as keyof typeof perms]}
                          onChange={() =>
                            togglePermission(
                              module as keyof WorkspacePermissions,
                              perm as "read" | "write" | "delete",
                            )
                          }
                          className="rounded border-gray-300 w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">
                          {permissionLabels[perm]}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={setDefaultPermissionsMutation.isPending}
            >
              <RotateCcw className="w-4 h-4" />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={setDefaultPermissionsMutation.isPending}
            >
              <Save className="w-4 h-4" />
              {setDefaultPermissionsMutation.isPending
                ? "Salvando..."
                : "Salvar"}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {memberConfig ? (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="space-y-2 mb-4">
                {Object.entries(memberConfig.permissions).map(
                  ([module, perms]) => {
                    const activePerms = Object.entries(perms)
                      .filter(([, value]) => value)
                      .map(([key]) => permissionLabels[key])
                      .join(", ");

                    return (
                      <div
                        key={module}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-900">
                          {moduleLabels[module as keyof typeof moduleLabels] ||
                            module}
                        </span>
                        <span className="text-sm text-gray-600">
                          {activePerms || "Sem permissões"}
                        </span>
                      </div>
                    );
                  },
                )}
              </div>
              <button
                onClick={handleEditMember}
                className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Editar Permissões
              </button>
            </div>
          ) : (
            <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                Nenhuma configuração de permissões padrão definida. As
                permissões padrão do sistema serão usadas.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
