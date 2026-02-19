import { workspaceService } from '../services/workspace.service'

import { useQuery } from '@tanstack/react-query'

import { workspaceKeys } from './queryKeys'

/**
 * Hook para buscar lista de workspaces do usuário
 */
export function useWorkspaces() {
  return useQuery({
    queryKey: workspaceKeys.lists(),
    queryFn: () => workspaceService.getUserWorkspaces(),
    staleTime: 2 * 60 * 1000, // 2 minutos
  })
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
  })
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
  })
}

/**
 * Hook para buscar convites pendentes do usuário
 */
export function useWorkspaceInvites() {
  return useQuery({
    queryKey: workspaceKeys.invites(),
    queryFn: () => workspaceService.getPendingInvites(),
    staleTime: 30 * 1000, // 30 segundos - dados bem voláteis
  })
}

/**
 * Hook para buscar convites pendentes de um workspace específico
 */
export function useWorkspacePendingInvites(workspaceId: string) {
  return useQuery({
    queryKey: [...workspaceKeys.detail(workspaceId), 'invites'],
    queryFn: () => workspaceService.getWorkspaceInvites(workspaceId),
    enabled: !!workspaceId,
    staleTime: 30 * 1000, // 30 segundos - dados bem voláteis
  })
}
/**
 * Hook para buscar módulos habilitados do workspace
 */
export function useEnabledModules(workspaceId: string) {
  return useQuery({
    queryKey: [...workspaceKeys.detail(workspaceId), 'modules'],
    queryFn: () => workspaceService.getEnabledModules(workspaceId),
    enabled: !!workspaceId && workspaceId !== '',
    staleTime: 5 * 60 * 1000, // 5 minutos - não muda frequentemente
  })
}

/**
 * Hook para buscar todos os módulos disponíveis com suas configurações
 */
export function useAvailableModules() {
  return useQuery({
    queryKey: workspaceKeys.availableModules(),
    queryFn: () => workspaceService.getAvailableModules(),
    staleTime: 60 * 60 * 1000, // 1 hora - configuração estática
  })
}
