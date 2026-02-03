import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workspaceService } from "../services/workspace.service";
import { workspaceKeys } from "./queryKeys";
import type {
  CreateWorkspaceDto,
  InviteMemberDto,
  UpdatePermissionsDto,
} from "../types/workspace.types";

/**
 * Hook para criar um novo workspace
 */
export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkspaceDto) =>
      workspaceService.createWorkspace(data),
    onSuccess: () => {
      // Invalida a lista de workspaces para refetch
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
    },
  });
}

/**
 * Hook para atualizar um workspace
 */
export function useUpdateWorkspace(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      workspaceService.updateWorkspace(workspaceId, data),
    onSuccess: () => {
      // Invalida a lista e o detalhe específico
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.detail(workspaceId),
      });
    },
  });
}

/**
 * Hook para deletar um workspace
 */
export function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workspaceId: string) =>
      workspaceService.deleteWorkspace(workspaceId),
    onSuccess: () => {
      // Invalida toda a lista
      queryClient.invalidateQueries({ queryKey: workspaceKeys.all });
    },
  });
}

/**
 * Hook para convidar um membro para o workspace
 */
export function useInviteMember(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InviteMemberDto) =>
      workspaceService.inviteMember(workspaceId, data),
    onSuccess: () => {
      // Invalida membros do workspace e convites pendentes
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.members(workspaceId),
      });
      queryClient.invalidateQueries({ queryKey: workspaceKeys.invites() });
      // Invalida convites pendentes específicos do workspace
      queryClient.invalidateQueries({
        queryKey: [...workspaceKeys.detail(workspaceId), "invites"],
      });
    },
  });
}

/**
 * Hook para atualizar permissões de um membro
 */
export function useUpdateMemberPermissions(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: string;
      data: UpdatePermissionsDto;
    }) => workspaceService.updateMemberPermissions(workspaceId, userId, data),
    onSuccess: () => {
      // Invalida membros do workspace
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.members(workspaceId),
      });
      // Também invalida a lista de workspaces (permissões podem ter mudado)
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
    },
  });
}

/**
 * Hook para remover um membro do workspace
 */
export function useRemoveMember(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      workspaceService.removeMember(workspaceId, userId),
    onSuccess: () => {
      // Invalida membros do workspace
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.members(workspaceId),
      });
    },
  });
}

/**
 * Hook para aceitar um convite
 */
export function useAcceptInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => workspaceService.acceptInvite(token),
    onSuccess: () => {
      // Invalida convites e workspaces (novo workspace foi adicionado)
      queryClient.invalidateQueries({ queryKey: workspaceKeys.invites() });
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
    },
  });
}

/**
 * Hook para rejeitar um convite
 */
export function useRejectInvite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (token: string) => workspaceService.rejectInvite(token),
    onSuccess: () => {
      // Invalida apenas os convites
      queryClient.invalidateQueries({ queryKey: workspaceKeys.invites() });
    },
  });
}

/**
 * Hook para atualizar um convite pendente
 */
export function useUpdateInvite(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      inviteId,
      data,
    }: {
      inviteId: string;
      data: { role: string; permissions: any };
    }) => workspaceService.updateInvite(workspaceId, inviteId, data),
    onSuccess: () => {
      // Invalida convites pendentes do workspace
      queryClient.invalidateQueries({
        queryKey: [...workspaceKeys.detail(workspaceId), "invites"],
      });
    },
  });
}

/**
 * Hook para trocar workspace ativo
 */
export function useSwitchWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workspaceId: string) =>
      workspaceService.switchWorkspace(workspaceId),
    onSuccess: (_, workspaceId) => {
      // Invalida o workspace específico e suas permissões
      queryClient.invalidateQueries({
        queryKey: workspaceKeys.detail(workspaceId),
      });
      queryClient.invalidateQueries({ queryKey: workspaceKeys.lists() });
    },
  });
}
