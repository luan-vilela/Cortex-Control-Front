"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useWorkspaceInvites,
  useAcceptInvite,
  useRejectInvite,
} from "@/modules/workspace/hooks";
import { WorkspaceSwitcher } from "@/modules/workspace/components/WorkspaceSwitcher";
import { NotificationBell } from "@/components/NotificationBell";
import { WalletDisplay } from "@/components/WalletDisplay";
import { UserMenu } from "@/components/UserMenu";
import { Mail, Check, X, Clock } from "lucide-react";

export default function InvitesPage() {
  const router = useRouter();
  const { data: invites = [], isLoading } = useWorkspaceInvites();
  const acceptInviteMutation = useAcceptInvite();
  const rejectInviteMutation = useRejectInvite();
  const [processing, setProcessing] = useState<string | null>(null);

  const handleAcceptInvite = (token: string) => {
    setProcessing(token);
    acceptInviteMutation.mutate(token, {
      onSuccess: () => {
        router.push("/workspaces");
      },
      onError: (error) => {
        console.error("Erro ao aceitar convite:", error);
        alert("Erro ao aceitar convite. Tente novamente.");
      },
      onSettled: () => {
        setProcessing(null);
      },
    });
  };

  const handleRejectInvite = (token: string) => {
    setProcessing(token);
    rejectInviteMutation.mutate(token, {
      onError: (error) => {
        console.error("Erro ao rejeitar convite:", error);
        alert("Erro ao rejeitar convite. Tente novamente.");
      },
      onSettled: () => {
        setProcessing(null);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gh-bg">
      {/* Header */}
      <header className="bg-gh-card border border-gh-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gh-text">Cortex Control</h1>
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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gh-text mb-6">
          Convites Pendentes
        </h2>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gh-hover"></div>
          </div>
        ) : invites.length > 0 ? (
          <div className="space-y-4">
            {invites.map((invite) => (
              <div
                key={invite.id}
                className="bg-gh-card border border-gh-border rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-5 h-5 text-gh-hover" />
                      <h3 className="text-lg font-semibold text-gh-text">
                        {invite.workspace.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gh-text-secondary mb-2">
                      <span className="font-medium">
                        {invite.invitedBy.name}
                      </span>{" "}
                      ({invite.invitedBy.email}) convidou você para participar
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gh-text-secondary">
                      <div className="capitalize">
                        <span className="font-medium">Cargo:</span>{" "}
                        {invite.role}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Expira em{" "}
                        {new Date(invite.expiresAt).toLocaleDateString("pt-BR")}
                      </div>
                    </div>

                    {/* Permissões */}
                    <div className="mt-4 p-3 bg-gh-bg rounded-lg">
                      <p className="text-sm font-medium text-gh-text mb-2">
                        Permissões:
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gh-text-secondary">
                        {Object.entries(invite.permissions).map(
                          ([module, perms]) => (
                            <div key={module} className="capitalize">
                              <span className="font-medium">{module}:</span>{" "}
                              {perms.read && "Ler"} {perms.write && "Escrever"}{" "}
                              {perms.delete && "Excluir"}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleAcceptInvite(invite.token)}
                      disabled={processing === invite.token}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Aceitar
                    </button>
                    <button
                      onClick={() => handleRejectInvite(invite.token)}
                      disabled={processing === invite.token}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Rejeitar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gh-card border border-gh-border rounded-lg shadow p-12 text-center">
            <Mail className="w-16 h-16 text-gh-text-secondary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gh-text mb-2">
              Nenhum convite pendente
            </h3>
            <p className="text-gh-text-secondary">
              Você não tem convites pendentes no momento
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
