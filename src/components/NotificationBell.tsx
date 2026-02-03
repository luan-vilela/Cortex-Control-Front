"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, Check, X, Building2, Clock } from "lucide-react";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { workspaceService } from "@/modules/workspace/services/workspace.service";

export function NotificationBell() {
  const { invites, fetchInvites } = useWorkspaceStore();
  const [isOpen, setIsOpen] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchInvites();

    // Atualizar a cada 30 segundos
    const interval = setInterval(() => {
      fetchInvites();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAccept = async (token: string) => {
    try {
      setProcessing(token);
      await workspaceService.acceptInvite(token);
      await fetchInvites();
      setIsOpen(false);
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

  const unreadCount = invites.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Notificações"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Notificações
            </h3>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                Você tem {unreadCount} convite{unreadCount > 1 ? "s" : ""}{" "}
                pendente{unreadCount > 1 ? "s" : ""}
              </p>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {invites.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">Nenhuma notificação</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {invites.map((invite) => (
                  <div
                    key={invite.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                        <Building2 className="w-5 h-5 text-blue-600" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          Convite para workspace
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
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

                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700 capitalize">
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
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700 capitalize"
                                >
                                  {module}
                                </span>
                              ))}
                            {Object.entries(invite.permissions).filter(
                              ([_, perms]) => perms.read,
                            ).length > 3 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
                                +
                                {Object.entries(invite.permissions).filter(
                                  ([_, perms]) => perms.read,
                                ).length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleAccept(invite.token)}
                            disabled={processing === invite.token}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Check className="w-4 h-4" />
                            Aceitar
                          </button>
                          <button
                            onClick={() => handleReject(invite.token)}
                            disabled={processing === invite.token}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <X className="w-4 h-4" />
                            Recusar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
