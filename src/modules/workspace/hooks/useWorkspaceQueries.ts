import { useQuery } from "@tanstack/react-query";
import { workspaceService } from "../services/workspace.service";
import { workspaceKeys } from "./queryKeys";

/**
 * Hook para buscar lista de workspaces do usuário
 */
export function useWorkspaces() {
  return useQuery({
    queryKey: workspaceKeys.lists(),
    queryFn: () => workspaceService.getUserWorkspaces(),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
}

/**
 * Hook para buscar um workspace específico
 */
export function useWorkspace(id: string) {
  return useQuery({
    queryKey: workspaceKeys.detail(id),
    queryFn: () => workspaceService.getWorkspaceDetails(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook para buscar membros de um workspace
 */
export function useWorkspaceMembers(workspaceId: string) {
  return useQuery({
    queryKey: workspaceKeys.members(workspaceId),
    queryFn: () => workspaceService.getWorkspaceMembers(workspaceId),
    enabled: !!workspaceId,
    staleTime: 1 * 60 * 1000, // 1 minuto - dados mais voláteis
  });
}

/**
 * Hook para buscar convites pendentes do usuário
 */
export function useWorkspaceInvites() {
  return useQuery({
    queryKey: workspaceKeys.invites(),
    queryFn: () => workspaceService.getPendingInvites(),
    staleTime: 30 * 1000, // 30 segundos - dados bem voláteis
  });
}
