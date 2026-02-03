import api from "@/lib/api";
import {
  Workspace,
  WorkspaceMember,
  WorkspaceInvite,
  CreateWorkspaceDto,
  InviteMemberDto,
  UpdatePermissionsDto,
  UpdateWorkspaceDto,
} from "../types/workspace.types";

export const workspaceService = {
  // Criar workspace
  async createWorkspace(data: CreateWorkspaceDto): Promise<Workspace> {
    const response = await api.post("/workspaces", data);
    return response.data.workspace;
  },

  // Listar workspaces do usuário
  async getUserWorkspaces(): Promise<Workspace[]> {
    const response = await api.get("/workspaces");
    return response.data.workspaces;
  },

  // Obter detalhes do workspace
  async getWorkspaceDetails(workspaceId: string): Promise<Workspace> {
    const response = await api.get(`/workspaces/${workspaceId}`);
    return response.data.workspace;
  },

  // Atualizar workspace
  async updateWorkspace(
    workspaceId: string,
    data: UpdateWorkspaceDto,
  ): Promise<Workspace> {
    const response = await api.patch(`/workspaces/${workspaceId}`, data);
    return response.data.workspace;
  },

  // Deletar workspace
  async deleteWorkspace(workspaceId: string): Promise<void> {
    await api.delete(`/workspaces/${workspaceId}`);
  },

  // Convidar membro
  async inviteMember(
    workspaceId: string,
    data: InviteMemberDto,
  ): Promise<{
    token: string;
    email: string;
    role: string;
    expiresAt: string;
  }> {
    const response = await api.post(`/workspaces/${workspaceId}/invite`, data);
    return response.data.invite;
  },

  // Listar convites pendentes
  async getPendingInvites(): Promise<WorkspaceInvite[]> {
    const response = await api.get("/workspaces/invites/pending");
    return response.data.invites;
  },

  // Listar convites pendentes de um workspace específico
  async getWorkspaceInvites(workspaceId: string): Promise<WorkspaceInvite[]> {
    const response = await api.get(`/workspaces/${workspaceId}/invites`);
    return response.data.invites;
  },

  // Aceitar convite
  async acceptInvite(token: string): Promise<void> {
    await api.post(`/workspaces/invites/${token}/accept`);
  },

  // Rejeitar convite
  async rejectInvite(token: string): Promise<void> {
    await api.post(`/workspaces/invites/${token}/reject`);
  },

  // Listar membros do workspace
  async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    const response = await api.get(`/workspaces/${workspaceId}/members`);
    return response.data.members;
  },

  // Atualizar permissões de membro
  async updateMemberPermissions(
    workspaceId: string,
    userId: string,
    data: UpdatePermissionsDto,
  ): Promise<void> {
    await api.patch(`/workspaces/${workspaceId}/members/${userId}`, data);
  },

  // Remover membro
  async removeMember(workspaceId: string, userId: string): Promise<void> {
    await api.delete(`/workspaces/${workspaceId}/members/${userId}`);
  },

  // Atualizar convite pendente
  async updateInvite(
    workspaceId: string,
    inviteId: string,
    data: { role: string; permissions: any },
  ): Promise<void> {
    await api.patch(`/workspaces/${workspaceId}/invites/${inviteId}`, data);
  },

  // Trocar workspace ativo
  async switchWorkspace(workspaceId: string): Promise<void> {
    await api.post(`/workspaces/${workspaceId}/switch`);
  },

  // Obter permissões do usuário no workspace
  async getMemberPermissions(workspaceId: string): Promise<any> {
    const response = await api.get(`/workspaces/${workspaceId}/permissions`);
    return response.data.permissions;
  },
};
