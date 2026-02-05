"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useWorkspace,
  useWorkspaceMembers,
  useWorkspacePendingInvites,
  useInviteMember,
  useUpdateMemberPermissions,
  useRemoveMember,
  useUpdateInvite,
  useEnabledModules,
} from "@/modules/workspace/hooks";
import { InviteModal } from "@/modules/workspace/components/InviteModal";
import { NotificationBell } from "@/components/NotificationBell";
import { WalletDisplay } from "@/components/WalletDisplay";
import { UserMenu } from "@/components/UserMenu";
import {
  ArrowLeft,
  Users,
  Mail,
  Shield,
  Trash2,
  Crown,
  Edit,
  Check,
  X,
  UserPlus,
  Clock,
} from "lucide-react";
import type {
  WorkspaceMember,
  WorkspacePermissions,
  ModulePermissions,
} from "@/modules/workspace/types/workspace.types";

interface EditingMember {
  memberId: string;
  role: string;
  permissions: WorkspacePermissions;
}

interface EditingInvite {
  inviteId: string;
  role: string;
  permissions: WorkspacePermissions;
}

export default function WorkspaceMembersPage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.id as string;

  // React Query hooks
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: members = [], isLoading } = useWorkspaceMembers(workspaceId);
  const { data: pendingInvites = [] } = useWorkspacePendingInvites(workspaceId);
  const { data: enabledModules = [] } = useEnabledModules(workspaceId);
  const inviteMutation = useInviteMember(workspaceId);
  const updatePermissionsMutation = useUpdateMemberPermissions(workspaceId);
  const removeMemberMutation = useRemoveMember(workspaceId);
  const updateInviteMutation = useUpdateInvite(workspaceId);

  // Estado local apenas para UI
  const [editing, setEditing] = useState<EditingMember | null>(null);
  const [editingInvite, setEditingInvite] = useState<EditingInvite | null>(
    null,
  );
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [invitePermissions, setInvitePermissions] =
    useState<WorkspacePermissions>({
      members: { read: false, write: false, delete: false },
    } as WorkspacePermissions);

  const canManageMembers = workspace?.permissions?.members?.write || false;
  const canDeleteMembers = workspace?.permissions?.members?.delete || false;

  // Mapear nomes de módulos para labels em português
  const moduleLabels: Record<string, string> = {
    contacts: "Contatos",
    conversations: "Conversas",
    automations: "Automações",
    settings: "Configurações",
    members: "Membros",
    customers: "Clientes",
  };

  // Gerar permissões padrão dinâmicas baseado nos módulos habilitados
  const getDefaultPermissionsByRole = (role: string): WorkspacePermissions => {
    const permissions: any = {};

    // Iterar pelos módulos habilitados e atribuir permissões padrão
    enabledModules.forEach((module) => {
      if (role === "admin") {
        permissions[module] = { read: true, write: true, delete: true };
      } else {
        // Member: read+write em modules principais, read-only em settings/members
        if (["settings", "members"].includes(module)) {
          permissions[module] = { read: true, write: false, delete: false };
        } else {
          permissions[module] = { read: true, write: true, delete: false };
        }
      }
    });

    return permissions as WorkspacePermissions;
  };

  // Sincronizar permissões quando os módulos mudam
  useEffect(() => {
    if (enabledModules.length > 0) {
      setInvitePermissions(getDefaultPermissionsByRole(inviteRole));
    }
  }, [enabledModules]);

  const handleRoleChange = (role: string) => {
    setInviteRole(role);
    setInvitePermissions(getDefaultPermissionsByRole(role));
  };

  const handlePermissionChange = (
    module: keyof WorkspacePermissions,
    permission: keyof ModulePermissions,
    value: boolean,
  ) => {
    setInvitePermissions((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [permission]: value,
      },
    }));
  };

  const handleStartEdit = (member: WorkspaceMember) => {
    setEditing({
      memberId: member.id,
      role: member.role,
      permissions: { ...member.permissions },
    });
  };

  const handleCancelEdit = () => {
    setEditing(null);
  };

  const handleSaveEdit = () => {
    if (!editing) return;

    const member = members.find((m) => m.id === editing.memberId);
    if (!member) return;

    updatePermissionsMutation.mutate(
      {
        userId: member.id,
        data: {
          role: editing.role,
          permissions: editing.permissions,
        },
      },
      {
        onSuccess: () => {
          setEditing(null);
        },
        onError: (error: any) => {
          console.error("Erro ao atualizar membro:", error);
          alert("Erro ao atualizar permissões do membro");
        },
      },
    );
  };

  const handleRemoveMember = (memberId: string, userName: string) => {
    if (!confirm(`Tem certeza que deseja remover ${userName} do workspace?`)) {
      return;
    }

    removeMemberMutation.mutate(memberId, {
      onError: (error: any) => {
        console.error("Erro ao remover membro:", error);
        alert("Erro ao remover membro");
      },
    });
  };

  const handleStartEditInvite = (invite: any) => {
    setEditingInvite({
      inviteId: invite.id,
      role: invite.role,
      permissions: invite.permissions || {
        contacts: { read: true, write: false, delete: false },
        conversations: { read: true, write: false, delete: false },
        automations: { read: false, write: false, delete: false },
        settings: { read: false, write: false, delete: false },
        members: { read: false, write: false, delete: false },
      },
    });
  };

  const handleCancelEditInvite = () => {
    setEditingInvite(null);
  };

  const handleSaveEditInvite = () => {
    if (!editingInvite) return;

    updateInviteMutation.mutate(
      {
        inviteId: editingInvite.inviteId,
        data: {
          role: editingInvite.role,
          permissions: editingInvite.permissions,
        },
      },
      {
        onSuccess: () => {
          setEditingInvite(null);
        },
        onError: (error: any) => {
          console.error("Erro ao atualizar convite:", error);
          alert("Erro ao atualizar permissões do convite");
        },
      },
    );
  };

  const toggleInvitePermission = (
    module: keyof EditingInvite["permissions"],
    permission: "read" | "write" | "delete",
  ) => {
    if (!editingInvite) return;

    setEditingInvite({
      ...editingInvite,
      permissions: {
        ...editingInvite.permissions,
        [module]: {
          ...editingInvite.permissions[module],
          [permission]: !editingInvite.permissions[module][permission],
        },
      },
    });
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();

    inviteMutation.mutate(
      {
        email: inviteEmail,
        role: inviteRole,
        permissions: invitePermissions,
      },
      {
        onSuccess: () => {
          alert(`Convite enviado para ${inviteEmail}`);
          setShowInviteModal(false);
          setInviteEmail("");
          setInviteRole("member");
          setInvitePermissions(getDefaultPermissionsByRole("member"));
        },
        onError: (error: any) => {
          console.error("Erro ao convidar membro:", error);
          alert(error.response?.data?.message || "Erro ao enviar convite");
        },
      },
    );
  };

  const togglePermission = (
    module: keyof EditingMember["permissions"],
    permission: "read" | "write" | "delete",
  ) => {
    if (!editing) return;

    setEditing({
      ...editing,
      permissions: {
        ...editing.permissions,
        [module]: {
          ...editing.permissions[module],
          [permission]: !editing.permissions[module][permission],
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-gh-bg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Membros do Workspace
            </h2>
            <p className="text-gray-600 mt-1">
              Gerencie os membros e suas permissões
            </p>
          </div>

          {canManageMembers && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Convidar Membro
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gh-hover"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gh-border">
                <thead className="bg-gh-bg">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Membro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Função
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Permissões
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Membro desde
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gh-border">
                  {members.map((member) => {
                    const isEditing = editing?.memberId === member.id;
                    const userName = member.user?.name || "Usuário";
                    const userEmail = member.user?.email || "email@example.com";
                    const userInitials = userName
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);

                    return (
                      <tr key={member.id} className="hover:bg-gh-bg">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600 font-medium">
                                  {userInitials}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                {userName}
                                {member.isOwner && (
                                  <Crown className="w-4 h-4 text-yellow-500" />
                                )}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {userEmail}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {isEditing ? (
                            <select
                              value={editing.role}
                              onChange={(e) =>
                                setEditing({ ...editing, role: e.target.value })
                              }
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                              disabled={member.isOwner}
                            >
                              <option value="owner">Owner</option>
                              <option value="admin">Admin</option>
                              <option value="member">Member</option>
                            </select>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-900 capitalize">
                                {member.role}
                              </span>
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          {isEditing ? (
                            <div className="space-y-2">
                              {Object.entries(editing.permissions).map(
                                ([module, perms]) => (
                                  <div key={module} className="text-xs">
                                    <span className="font-semibold capitalize text-gray-900">
                                      {module}:
                                    </span>
                                    <div className="flex gap-2 mt-1">
                                      {["read", "write", "delete"].map(
                                        (perm) => (
                                          <label
                                            key={perm}
                                            className="flex items-center gap-1 cursor-pointer"
                                          >
                                            <input
                                              type="checkbox"
                                              checked={
                                                perms[
                                                  perm as keyof typeof perms
                                                ]
                                              }
                                              onChange={() =>
                                                togglePermission(
                                                  module as any,
                                                  perm as any,
                                                )
                                              }
                                              className="rounded border-gray-300"
                                            />
                                            <span className="capitalize text-gray-900 font-medium">
                                              {perm}
                                            </span>
                                          </label>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-1 max-h-[48px] overflow-hidden">
                              {Object.entries(member.permissions)
                                .filter(([, perms]) => perms.read)
                                .map(([module], index) => {
                                  const totalPermissions = Object.entries(
                                    member.permissions,
                                  ).filter(([, perms]) => perms.read).length;
                                  const showMore = index >= 2;

                                  if (showMore && index === 2) {
                                    return (
                                      <span
                                        key="more"
                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                                      >
                                        +{totalPermissions - 2}
                                      </span>
                                    );
                                  }

                                  if (showMore) return null;

                                  return (
                                    <span
                                      key={module}
                                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize"
                                    >
                                      {module}
                                    </span>
                                  );
                                })}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(member.joinedAt).toLocaleDateString(
                            "pt-BR",
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={handleSaveEdit}
                                className="p-1 text-green-600 hover:text-green-900"
                                title="Salvar"
                              >
                                <Check className="w-5 h-5" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-1 text-red-600 hover:text-red-900"
                                title="Cancelar"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              {canManageMembers && !member.isOwner && (
                                <button
                                  onClick={() => handleStartEdit(member)}
                                  className="p-1 text-blue-600 hover:text-blue-900"
                                  title="Editar permissões"
                                >
                                  <Edit className="w-5 h-5" />
                                </button>
                              )}
                              {canDeleteMembers && !member.isOwner && (
                                <button
                                  onClick={() =>
                                    handleRemoveMember(
                                      member.id,
                                      member.user?.name || "Desconhecido",
                                    )
                                  }
                                  className="p-1 text-red-600 hover:text-red-900"
                                  title="Remover membro"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Convites Pendentes */}
                  {pendingInvites.map((invite) => {
                    const isEditingInvite =
                      editingInvite?.inviteId === invite.id;

                    return (
                      <tr
                        key={invite.id}
                        className="hover:bg-gh-bg bg-yellow-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                                <Mail className="w-5 h-5 text-yellow-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                Convite Pendente
                                <Clock className="w-4 h-4 text-yellow-500" />
                              </div>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {invite.invitedBy?.email || "Convite pendente"}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {isEditingInvite ? (
                            <select
                              value={editingInvite.role}
                              onChange={(e) =>
                                setEditingInvite({
                                  ...editingInvite,
                                  role: e.target.value,
                                })
                              }
                              className="px-2 py-1 border border-gray-300 rounded text-sm text-gray-900"
                            >
                              <option value="owner">Owner</option>
                              <option value="admin">Admin</option>
                              <option value="member">Member</option>
                            </select>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-900 capitalize">
                                {invite.role}
                              </span>
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          {isEditingInvite ? (
                            <div className="space-y-2">
                              {Object.entries(editingInvite.permissions).map(
                                ([module, perms]) => (
                                  <div key={module} className="text-xs">
                                    <span className="font-semibold capitalize text-gray-900">
                                      {module}:
                                    </span>
                                    <div className="flex gap-2 mt-1">
                                      {["read", "write", "delete"].map(
                                        (perm) => (
                                          <label
                                            key={perm}
                                            className="flex items-center gap-1 cursor-pointer"
                                          >
                                            <input
                                              type="checkbox"
                                              checked={
                                                perms[
                                                  perm as keyof typeof perms
                                                ]
                                              }
                                              onChange={() =>
                                                toggleInvitePermission(
                                                  module as any,
                                                  perm as any,
                                                )
                                              }
                                              className="rounded border-gray-300"
                                            />
                                            <span className="capitalize text-gray-900 font-medium">
                                              {perm}
                                            </span>
                                          </label>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                ),
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Aguardando aceitação
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Expira em{" "}
                          {new Date(invite.expiresAt).toLocaleDateString(
                            "pt-BR",
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {isEditingInvite ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={handleSaveEditInvite}
                                className="p-1 text-green-600 hover:text-green-900"
                                title="Salvar"
                              >
                                <Check className="w-5 h-5" />
                              </button>
                              <button
                                onClick={handleCancelEditInvite}
                                className="p-1 text-red-600 hover:text-red-900"
                                title="Cancelar"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              {canManageMembers && (
                                <button
                                  onClick={() => handleStartEditInvite(invite)}
                                  className="p-1 text-blue-600 hover:text-blue-900"
                                  title="Editar convite"
                                >
                                  <Edit className="w-5 h-5" />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  if (
                                    confirm(
                                      `Cancelar convite para ${invite.invitedBy?.email || "este usuário"}?`,
                                    )
                                  ) {
                                    // TODO: implementar cancelar convite
                                    alert("Funcionalidade em desenvolvimento");
                                  }
                                }}
                                className="p-1 text-red-600 hover:text-red-900"
                                title="Cancelar convite"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {members.length === 0 && pendingInvites.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum membro encontrado
                </h3>
                <p className="text-gray-600">
                  Convide membros para colaborar neste workspace
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de Convite */}
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => {
          setShowInviteModal(false);
          setInviteEmail("");
          setInviteRole("member");
          setInvitePermissions(getDefaultPermissionsByRole("member"));
        }}
        onSubmit={handleInviteMember}
        inviteEmail={inviteEmail}
        onEmailChange={setInviteEmail}
        inviteRole={inviteRole}
        onRoleChange={handleRoleChange}
        invitePermissions={invitePermissions}
        onPermissionChange={handlePermissionChange}
        moduleLabels={moduleLabels}
        isPending={inviteMutation.isPending}
      />
    </div>
  );
}
