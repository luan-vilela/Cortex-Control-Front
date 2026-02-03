"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useWorkspaceMembers,
  useInviteMember,
  useUpdateMemberPermissions,
  useRemoveMember,
} from "@/modules/workspace/hooks";
import { NotificationBell } from "@/components/NotificationBell";
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
} from "lucide-react";

interface WorkspaceMember {
  id: string;
  userId: string;
  user: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };
  role: string;
  isOwner: boolean;
  permissions: {
    contacts: { read: boolean; write: boolean; delete: boolean };
    conversations: { read: boolean; write: boolean; delete: boolean };
    automations: { read: boolean; write: boolean; delete: boolean };
    settings: { read: boolean; write: boolean; delete: boolean };
    members: { read: boolean; write: boolean; delete: boolean };
  };
  joinedAt: string;
}

interface EditingMember {
  memberId: string;
  role: string;
  permissions: WorkspaceMember["permissions"];
}

export default function WorkspaceMembersPage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.id as string;

  // React Query hooks
  const { data: members = [], isLoading } = useWorkspaceMembers(workspaceId);
  const inviteMutation = useInviteMember(workspaceId);
  const updatePermissionsMutation = useUpdateMemberPermissions(workspaceId);
  const removeMemberMutation = useRemoveMember(workspaceId);

  // Estado local apenas para UI
  const [editing, setEditing] = useState<EditingMember | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");

  // Encontra workspace atual (ainda usa Zustand temporariamente para lista de workspaces)
  // TODO: migrar para React Query depois
  const currentWorkspace = members[0]?.user
    ? {
        name: "Workspace",
        permissions: { members: { write: true, delete: true } },
      }
    : undefined;
  const canManageMembers = currentWorkspace?.permissions.members.write || false;
  const canDeleteMembers =
    currentWorkspace?.permissions.members.delete || false;

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
        userId: member.userId,
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

  const handleRemoveMember = (userId: string, userName: string) => {
    if (!confirm(`Tem certeza que deseja remover ${userName} do workspace?`)) {
      return;
    }

    removeMemberMutation.mutate(userId, {
      onError: (error: any) => {
        console.error("Erro ao remover membro:", error);
        alert("Erro ao remover membro");
      },
    });
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();

    // Permissões padrão baseadas no role
    const defaultPermissions =
      inviteRole === "admin"
        ? {
            contacts: { read: true, write: true, delete: true },
            conversations: { read: true, write: true, delete: true },
            automations: { read: true, write: true, delete: true },
            settings: { read: true, write: true, delete: false },
            members: { read: true, write: true, delete: false },
          }
        : {
            contacts: { read: true, write: true, delete: false },
            conversations: { read: true, write: true, delete: false },
            automations: { read: true, write: false, delete: false },
            settings: { read: true, write: false, delete: false },
            members: { read: true, write: false, delete: false },
          };

    inviteMutation.mutate(
      {
        email: inviteEmail,
        role: inviteRole,
        permissions: defaultPermissions,
      },
      {
        onSuccess: () => {
          alert(`Convite enviado para ${inviteEmail}`);
          setShowInviteModal(false);
          setInviteEmail("");
          setInviteRole("member");
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
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Membros</h1>
                  {currentWorkspace && (
                    <p className="text-sm text-gray-600">
                      {currentWorkspace.name}
                    </p>
                  )}
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
      <div className="max-w-7xl mx-auto px-4 py-8">
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
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
                <tbody className="bg-white divide-y divide-gray-200">
                  {members.map((member) => {
                    const isEditing = editing?.memberId === member.id;
                    const userName = member.user?.name || "Usuário";
                    const userEmail = member.user?.email || "email@example.com";
                    const userInitials = userName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);

                    return (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
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
                                    <span className="font-medium capitalize">
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
                                            <span className="capitalize text-gray-600">
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
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(member.permissions)
                                .filter(([_, perms]) => perms.read)
                                .map(([module]) => (
                                  <span
                                    key={module}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize"
                                  >
                                    {module}
                                  </span>
                                ))}
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
                                      member.userId,
                                      member.user?.name || "este membro",
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
                </tbody>
              </table>
            </div>

            {members.length === 0 && (
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
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Convidar Membro
            </h3>

            <form onSubmit={handleInviteMember}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
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
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="member">Member - Permissões limitadas</option>
                  <option value="admin">
                    Admin - Permissões administrativas
                  </option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteEmail("");
                    setInviteRole("member");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={inviteMutation.isPending}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {inviteMutation.isPending ? "Enviando..." : "Enviar Convite"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
