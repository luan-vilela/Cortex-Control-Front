"use client";

import { useState, useRef, useEffect } from "react";
import { Check, X, Building2, Clock } from "lucide-react";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { workspaceService } from "@/modules/workspace/services/workspace.service";

interface PendingInvitesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PendingInvitesModal({
  isOpen,
  onClose,
}: PendingInvitesModalProps) {
  const { invites, fetchInvites } = useWorkspaceStore();
  const [processing, setProcessing] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleAccept = async (token: string) => {
    try {
      setProcessing(token);
      await workspaceService.acceptInvite(token);
      await fetchInvites();
      if (invites.length <= 1) {
        onClose();
      }
    } catch (error: any) {
      console.error("Erro ao aceitar convite:", error);
      alert(error.response?.data?.message || "Erro ao aceitar convite");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (token: string) => {
    try {
      setProcessing(token);
      await workspaceService.rejectInvite(token);
      await fetchInvites();
    } catch (error) {
      console.error("Erro ao rejeitar convite:", error);
      alert("Erro ao rejeitar convite");
    } finally {
      setProcessing(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div
        ref={modalRef}
        className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-gh-card rounded-lg shadow-lg border border-gh-border z-50"
      >
        <div className="p-6 border-b border-gh-border">
          <h2 className="text-lg font-semibold text-gh-text">Notificações</h2>
          {invites.length > 0 && (
            <p className="text-sm text-gh-text-secondary mt-1">
              Você tem {invites.length} convite{invites.length > 1 ? "s" : ""}{" "}
              pendente{invites.length > 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {invites.length === 0 ? (
            <div className="p-8 text-center">
              <Building2 className="w-12 h-12 text-gh-text-secondary mx-auto mb-3" />
              <p className="text-gh-text-secondary">Nenhuma notificação</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  className="p-4 hover:bg-gh-bg transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gh-text">
                        Convite para workspace
                      </p>
                      <p className="text-sm text-gh-text-secondary mt-1">
                        {invite.invitedBy ? (
                          <>
                            <strong>{invite.invitedBy.name}</strong> convidou
                            você para <strong>{invite.workspace.name}</strong>
                          </>
                        ) : (
                          <>
                            Você foi convidado para{" "}
                            <strong>{invite.workspace.name}</strong>
                          </>
                        )}
                      </p>

                      <div className="flex items-center gap-2 mt-2 text-xs text-gh-text-secondary">
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-gh-bg text-gh-text capitalize">
                          {invite.role}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Expira em{" "}
                          {new Date(invite.expiresAt).toLocaleDateString(
                            "pt-BR",
                          )}
                        </span>
                      </div>

                      {invite.permissions && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {Object.entries(invite.permissions)
                            .filter(([_, perms]) => perms.read)
                            .slice(0, 3)
                            .map(([module]) => (
                              <span
                                key={module}
                                className="text-xs px-2 py-1 bg-gh-bg text-gh-text-secondary rounded"
                              >
                                {module}
                              </span>
                            ))}
                        </div>
                      )}

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleAccept(invite.token)}
                          disabled={processing === invite.token}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium"
                        >
                          <Check className="w-4 h-4" />
                          {processing === invite.token
                            ? "Aceitando..."
                            : "Aceitar"}
                        </button>
                        <button
                          onClick={() => handleReject(invite.token)}
                          disabled={processing === invite.token}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gh-bg text-gh-text rounded-lg hover:bg-gh-border disabled:opacity-50 transition-colors text-sm font-medium"
                        >
                          <X className="w-4 h-4" />
                          {processing === invite.token
                            ? "Rejeitando..."
                            : "Rejeitar"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gh-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gh-text hover:bg-gh-bg rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </>
  );
}
