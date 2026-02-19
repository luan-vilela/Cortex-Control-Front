"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  useWorkspace,
  useWorkspaceMembers,
  useWorkspacePendingInvites,
  useInviteMember,
  useUpdateMemberPermissions,
  useRemoveMember,
  useUpdateInvite,
  useEnabledModules,
  useBreadcrumb,
  useDefaultMemberPermissions,
} from "@/modules/workspace/hooks";
import { InviteModal } from "@/modules/workspace/components/InviteModal";
import { MemberPermissionsModal } from "@/modules/workspace/components/MemberPermissionsModal";
import { DefaultPermissionsConfig } from "@/modules/workspace/components/DefaultPermissionsConfig";
import {
  Users,
  Mail,
  Shield,
  Trash2,
  Crown,
  Edit,
  UserPlus,
  Clock,
} from "lucide-react";
import type {
  WorkspaceMember,
  WorkspacePermissions,
} from "@/modules/workspace/types/workspace.types";
import { usePermission } from "@/modules/workspace/hooks/usePermission";
import {
  MODULE_PERMISSIONS,
  getPermissionPreset,
  generateMemberPermissions,
} from "@/modules/workspace/config/permissions.config";
import {
  PageHeader,
  DataTableToolbar,
  BulkActions,
} from "@/components/patterns";
import { DataTable, Column, RowAction } from "@/components/DataTable";

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
  const params = useParams();
  const workspaceId = params.id as string;

  useBreadcrumb([
    {
      label: "Workspaces",
      href: `/workspaces/`,
    },
    {
      label: "Gerenciar Membros",
      href: `/workspaces/${workspaceId}/members`,
    },
  ]);

  // Queries
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: members = [], isLoading } = useWorkspaceMembers(workspaceId);
  const { data: pendingInvites = [] } = useWorkspacePendingInvites(workspaceId);
  const { data: enabledModules = [] } = useEnabledModules(workspaceId);
  const { data: defaultPermissions = [] } =
    useDefaultMemberPermissions(workspaceId);

  // Mutations
  const inviteMutation = useInviteMember(workspaceId);
  const updatePermissionsMutation = useUpdateMemberPermissions(workspaceId);
  const removeMemberMutation = useRemoveMember(workspaceId);
  const updateInviteMutation = useUpdateInvite(workspaceId);

  // State
  const [editing, setEditing] = useState<EditingMember | null>(null);
  const [editingInvite, setEditingInvite] = useState<EditingInvite | null>(
    null,
  );
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [invitePermissions, setInvitePermissions] =
    useState<WorkspacePermissions>(generateMemberPermissions());
  const [searchTerm, setSearchTerm] = useState("");

  const { hasPermission } = usePermission();
  const canManageMembers = hasPermission('members', 'update_permissions');
  const canDeleteMembers = hasPermission('members', 'remove');

  const moduleLabels: Record<string, string> = {};
  MODULE_PERMISSIONS.forEach((m) => {
    moduleLabels[m.moduleId] = m.label;
  });

  // Funções auxiliares
  const getDefaultPermissionsByRole = (role: string): WorkspacePermissions => {
    const defaultConfig = defaultPermissions?.find((p: any) => p.role === role);
    if (defaultConfig) {
      return defaultConfig.permissions;
    }
    return getPermissionPreset(role);
  };

  // Handlers - Membros
  const handleStartEdit = (member: WorkspaceMember) => {
    setEditing({
      memberId: member.id,
      role: member.role,
      permissions: { ...member.permissions },
    });
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
        onSuccess: () => setEditing(null),
        onError: (error: any) => {
          console.error("Erro ao atualizar membro:", error);
          alert("Erro ao atualizar permissões do membro");
        },
      },
    );
  };

  const handleRemoveMember = (memberId: string, userName: string) => {
    if (!confirm(`Tem certeza que deseja remover ${userName} do workspace?`))
      return;
    removeMemberMutation.mutate(memberId, {
      onError: (error: any) => {
        console.error("Erro ao remover membro:", error);
        alert("Erro ao remover membro");
      },
    });
  };

  const togglePermission = (
    module: string,
    permission: string,
  ) => {
    if (!editing) return;
    setEditing({
      ...editing,
      permissions: {
        ...editing.permissions,
        [module]: {
          ...(editing.permissions[module] || {}),
          [permission]: !(editing.permissions[module]?.[permission]),
        },
      },
    });
  };

  const setEditingPermissions = (permissions: WorkspacePermissions) => {
    if (!editing) return;
    setEditing({ ...editing, permissions });
  };

  const setEditingRole = (role: string) => {
    if (!editing) return;
    setEditing({ ...editing, role });
  };

  // Handlers - Convites
  const handleStartEditInvite = (invite: any) => {
    setEditingInvite({
      inviteId: invite.id,
      role: invite.role,
      permissions: invite.permissions || generateMemberPermissions(),
    });
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
        onSuccess: () => setEditingInvite(null),
        onError: (error: any) => {
          console.error("Erro ao atualizar convite:", error);
          alert("Erro ao atualizar permissões do convite");
        },
      },
    );
  };

  const toggleInvitePermission = (
    module: string,
    permission: string,
  ) => {
    if (!editingInvite) return;
    setEditingInvite({
      ...editingInvite,
      permissions: {
        ...editingInvite.permissions,
        [module]: {
          ...(editingInvite.permissions[module] || {}),
          [permission]: !(editingInvite.permissions[module]?.[permission]),
        },
      },
    });
  };

  const setEditingInvitePermissions = (permissions: WorkspacePermissions) => {
    if (!editingInvite) return;
    setEditingInvite({ ...editingInvite, permissions });
  };

  const setEditingInviteRole = (role: string) => {
    if (!editingInvite) return;
    setEditingInvite({ ...editingInvite, role });
  };

  const handleRoleChange = (role: string) => {
    setInviteRole(role);
    setInvitePermissions(getDefaultPermissionsByRole(role));
  };

  const handlePermissionChange = (
    module: string,
    permission: string,
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

  // Filtrar membros por busca
  const filteredMembers = members.filter((m) =>
    (m.user?.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const allItems = [...filteredMembers, ...pendingInvites];

  // Colunas para DataTable
  const columns: Column[] = [
    {
      key: "member",
      label: "Membro",
      render: (_, row) => {
        const isMember = "user" in row;
        const userName = isMember ? row.user?.name : "Convite Pendente";
        const userEmail = isMember ? row.user?.email : row.invitedBy?.email;
        const userInitials =
          userName
            ?.split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2) || "?";
        const isOwner = isMember && row.isOwner;
        const isPending = !isMember;

        return (
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium text-white ${
                isPending
                  ? "bg-yellow-500"
                  : isOwner
                    ? "bg-purple-500"
                    : "bg-blue-500"
              }`}
            >
              {userInitials}
            </div>
            <div>
              <div className="flex items-center gap-2 font-medium">
                <span>{userName}</span>
                {isOwner && <Crown className="w-4 h-4 text-yellow-500" />}
                {isPending && <Clock className="w-4 h-4 text-yellow-500" />}
              </div>
              <div className="text-sm text-gray-500">{userEmail}</div>
            </div>
          </div>
        );
      },
    },
    {
      key: "role",
      label: "Função",
      render: (_, row) => {
        return (
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-400" />
            <span className="capitalize text-sm">
              {row.role}
            </span>
          </div>
        );
      },
    },
    {
      key: "status",
      label: "Status",
      render: (_, row) => {
        const isMember = "user" in row;
        const variant = isMember ? "default" : "secondary";
        const bgColor =
          variant === "default"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800";
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor}`}
          >
            {isMember ? "Ativo" : "Pendente"}
          </span>
        );
      },
    },
  ];

  // Row Actions
  const rowActions: RowAction[] = [];

  if (canManageMembers) {
    rowActions.push({
      id: "edit",
      label: "Editar",
      icon: <Edit className="w-4 h-4" />,
      onClick: (row) => {
        const isMember = "user" in row;
        if (isMember && !row.isOwner) {
          handleStartEdit(row as WorkspaceMember);
        } else if (!isMember) {
          handleStartEditInvite(row);
        }
      },
    });
  }

  if (canDeleteMembers) {
    rowActions.push({
      id: "delete",
      label: "Deletar",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (row) => {
        const isMember = "user" in row;
        if (isMember) {
          const member = row as WorkspaceMember;
          if (!member.isOwner) {
            handleRemoveMember(member.userId, member.user?.name || "Desconhecido");
          }
        } else {
          if (
            confirm(
              `Cancelar convite para ${row.invitedBy?.email || "este usuário"}?`,
            )
          ) {
            alert("Funcionalidade em desenvolvimento");
          }
        }
      },
      variant: "destructive",
    });
  }

  return (
    <div className="space-y-6">
      <DefaultPermissionsConfig workspaceId={workspaceId} />

      <PageHeader
        title="Membros do Workspace"
        description="Gerencie os membros e suas permissões"
        action={
          canManageMembers
            ? {
                label: "Convidar Membro",
                onClick: () => setShowInviteModal(true),
                icon: <UserPlus className="w-4 h-4" />,
              }
            : undefined
        }
      />

      <DataTableToolbar
        searchPlaceholder="Pesquisar por nome..."
        onSearch={setSearchTerm}
        exportData={filteredMembers}
        exportFilename="members"
      />

      <DataTable
        headers={columns}
        data={allItems}
        isLoading={isLoading}
        emptyMessage="Nenhum membro encontrado"
        rowActions={rowActions}
      />

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

      {/* Modal de edição de permissões de membro */}
      {editing && (() => {
        const member = members.find((m) => m.id === editing.memberId);
        return (
          <MemberPermissionsModal
            isOpen={!!editing}
            onClose={() => setEditing(null)}
            memberName={member?.user?.name || 'Desconhecido'}
            memberEmail={member?.user?.email || ''}
            role={editing.role}
            permissions={editing.permissions}
            onRoleChange={setEditingRole}
            onTogglePermission={togglePermission}
            onSetPermissions={setEditingPermissions}
            onSave={handleSaveEdit}
            isSaving={updatePermissionsMutation.isPending}
            isOwner={member?.isOwner}
            enabledModuleIds={enabledModules.map((m: any) => m.id)}
          />
        );
      })()}

      {/* Modal de edição de permissões de convite */}
      {editingInvite && (() => {
        const invite = pendingInvites.find((i: any) => i.id === editingInvite.inviteId);
        return (
          <MemberPermissionsModal
            isOpen={!!editingInvite}
            onClose={() => setEditingInvite(null)}
            memberName="Convite Pendente"
            memberEmail={invite?.invitedBy?.email || ''}
            role={editingInvite.role}
            permissions={editingInvite.permissions}
            onRoleChange={setEditingInviteRole}
            onTogglePermission={toggleInvitePermission}
            onSetPermissions={setEditingInvitePermissions}
            onSave={handleSaveEditInvite}
            isSaving={updateInviteMutation.isPending}
            enabledModuleIds={enabledModules.map((m: any) => m.id)}
          />
        );
      })()}
    </div>
  );
}
