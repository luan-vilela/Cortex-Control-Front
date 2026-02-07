"use client";

import {
  WorkspacePermissions,
  ModulePermissions,
} from "@/modules/workspace/types/workspace.types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";

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
  return (
    <Modal isOpen={isOpen} onClose={onClose} blur="none">
      <Modal.Header onClose={onClose}>Convidar Membro</Modal.Header>

      <Modal.Body>
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gh-text mb-1">
              Email
            </label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => onEmailChange(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gh-border rounded-md bg-gh-bg text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="email@exemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gh-text mb-1">
              Função
            </label>
            <select
              value={inviteRole}
              onChange={(e) => onRoleChange(e.target.value)}
              className="w-full px-3 py-2 border border-gh-border rounded-md bg-gh-bg text-gh-text focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="member">Member - Permissões limitadas</option>
              <option value="admin">Admin - Permissões administrativas</option>
            </select>
          </div>

          {/* Submit button escondido para usar via Modal.Footer */}
          <button type="submit" className="hidden" />
        </form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            const form = document.querySelector("form");
            form?.dispatchEvent(
              new Event("submit", { cancelable: true, bubbles: true }),
            );
          }}
          disabled={isPending}
        >
          {isPending ? "Enviando..." : "Enviar Convite"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
