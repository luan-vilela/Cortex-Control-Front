"use client";

import {
  WorkspacePermissions,
  ModulePermissions,
} from "@/modules/workspace/types/workspace.types";
import { X, Check } from "lucide-react";

interface InviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  inviteEmail: string;
  onEmailChange: (email: string) => void;
  inviteRole: string;
  onRoleChange: (role: string) => void;
  invitePermissions: WorkspacePermissions;
  onPermissionChange: (
    module: keyof WorkspacePermissions,
    permission: keyof ModulePermissions,
    value: boolean,
  ) => void;
  moduleLabels: Record<string, string>;
  isPending: boolean;
}

export function InviteModal({
  isOpen,
  onClose,
  onSubmit,
  inviteEmail,
  onEmailChange,
  inviteRole,
  onRoleChange,
  invitePermissions,
  onPermissionChange,
  moduleLabels,
  isPending,
}: InviteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Convidar Membro</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => onEmailChange(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="email@exemplo.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Função
            </label>
            <select
              value={inviteRole}
              onChange={(e) => onRoleChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="member">Member - Permissões limitadas</option>
              <option value="admin">Admin - Permissões administrativas</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              As permissões abaixo serão atualizadas automaticamente de acordo
              com a função
            </p>
          </div>

          <div className="mb-6 border-t pt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              Permissões por Módulo
            </h4>
            <div className="space-y-3">
              {Object.entries(invitePermissions).map(([module, perms]) => (
                <div
                  key={module}
                  className="bg-gh-bg p-3 rounded-md border border-gh-border"
                >
                  <p className="text-xs font-semibold text-gray-700 capitalize mb-2">
                    {moduleLabels[module] || module}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {["read", "write", "delete"].map((permission) => (
                      <label
                        key={permission}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={perms[permission as keyof typeof perms]}
                          onChange={(e) =>
                            onPermissionChange(
                              module as keyof WorkspacePermissions,
                              permission as "read" | "write" | "delete",
                              e.target.checked,
                            )
                          }
                          className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                        />
                        <span className="text-xs text-gray-600 capitalize">
                          {permission === "read"
                            ? "Ler"
                            : permission === "write"
                              ? "Escrever"
                              : "Deletar"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gh-bg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Enviando..." : "Enviar Convite"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
