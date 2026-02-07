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
import { DefaultPermissionsConfig } from "@/modules/workspace/components/DefaultPermissionsConfig";
import {
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
    useState<WorkspacePermissions>({
      members: { read: false, write: false, delete: false },
    } as WorkspacePermissions);
  const [searchTerm, setSearchTerm] = useState("");

  const canManageMembers = workspace?.permissions?.members?.write || false;
  const canDeleteMembers = workspace?.permissions?.members?.delete || false;

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

  // Funções auxiliares
  const getDefaultPermissionsByRole = (role: string): WorkspacePermissions => {
    const defaultConfig = defaultPermissions?.find((p: any) => p.role === role);
    if (defaultConfig) {
      return defaultConfig.permissions;
    }

    const permissions: any = {};
    enabledModules.forEach((module) => {
      if (role === "admin") {
        permissions[module] = { read: true, write: true, delete: true };
      } else {
        if (["settings", "members"].includes(module)) {
          permissions[module] = { read: true, write: false, delete: false };
        } else {
          permissions[module] = { read: true, write: true, delete: false };
        }
      }
    });

    return permissions as WorkspacePermissions;
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
        userId: member.id,
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

  // Handlers - Convites
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
        const isMember = "user" in row;
        const isEditing = isMember
          ? editing?.memberId === row.id
          : editingInvite?.inviteId === row.id;

        if (isEditing) {
          return (
            <select
              value={isMember ? editing?.role : editingInvite?.role}
              onChange={(e) => {
                if (isMember) {
                  setEditing((prev) =>
                    prev ? { ...prev, role: e.target.value } : null,
                  );
                } else {
                  setEditingInvite((prev) =>
                    prev ? { ...prev, role: e.target.value } : null,
                  );
                }
              }}
              className="px-2 py-1 border border-gray-300 rounded text-sm"
              disabled={isMember && row.isOwner}
            >
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
              <option value="member">Member</option>
            </select>
          );
        }

        return (
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-gray-400" />
            <span className="capitalize text-sm">
              {isMember ? row.role : row.role}
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
            handleRemoveMember(member.id, member.user?.name || "Desconhecido");
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
    </div>
  );
}
