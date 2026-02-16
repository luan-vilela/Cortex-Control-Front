import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAlerts } from '@/contexts/AlertContext'

import { processosService } from '../processos.service'
import type {
  CreateProcessActorPayload,
  CreateProcessPayload,
  GetProcessesFilters,
  GetProcessesResponse,
  Process,
  ProcessActor,
  UpdateProcessActorPayload,
  UpdateProcessPayload,
} from '../types'

// Query key factory
export const processosQueryKeys = {
  all: ['processos'],
  processos: () => [...processosQueryKeys.all, 'list'],
  myProcessos: (workspaceId: string, filters?: GetProcessesFilters) => [
    ...processosQueryKeys.all,
    'my',
    workspaceId,
    filters,
  ],
  processo: (workspaceId: string, processId: string) => [
    ...processosQueryKeys.all,
    workspaceId,
    processId,
  ],
  processoList: (workspaceId: string, filters?: GetProcessesFilters) => [
    ...processosQueryKeys.processos(),
    workspaceId,
    filters,
  ],
  processoTree: (workspaceId: string, processId: string) => [
    ...processosQueryKeys.all,
    'tree',
    workspaceId,
    processId,
  ],
  actors: (workspaceId: string, processId: string) => [
    ...processosQueryKeys.all,
    'actors',
    workspaceId,
    processId,
  ],
}

// ─── PROCESSOS ──────────────────────────────────────────────

export function useProcessos(workspaceId: string, filters?: GetProcessesFilters, enabled = true) {
  return useQuery<GetProcessesResponse>({
    queryKey: processosQueryKeys.processoList(workspaceId, filters),
    queryFn: () => processosService.getProcesses(workspaceId, filters),
    enabled: enabled && !!workspaceId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useMyProcessos(workspaceId: string, filters?: GetProcessesFilters, enabled = true) {
  return useQuery<GetProcessesResponse>({
    queryKey: processosQueryKeys.myProcessos(workspaceId, filters),
    queryFn: () => processosService.getMyProcesses(workspaceId, filters),
    enabled: enabled && !!workspaceId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useProcesso(workspaceId: string, processId: string, enabled = true) {
  return useQuery<Process>({
    queryKey: processosQueryKeys.processo(workspaceId, processId),
    queryFn: () => processosService.getProcess(workspaceId, processId),
    enabled: enabled && !!workspaceId && !!processId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useProcessoTree(workspaceId: string, processId: string, enabled = true) {
  return useQuery<Process>({
    queryKey: processosQueryKeys.processoTree(workspaceId, processId),
    queryFn: () => processosService.getProcessTree(workspaceId, processId),
    enabled: enabled && !!workspaceId && !!processId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateProcesso() {
  const queryClient = useQueryClient()
  const { addAlert } = useAlerts()

  return useMutation({
    mutationFn: ({
      workspaceId,
      payload,
    }: {
      workspaceId: string
      payload: CreateProcessPayload
    }) => processosService.createProcess(workspaceId, payload),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({
        queryKey: processosQueryKeys.processoList(workspaceId),
      })
      addAlert('success', 'Processo criado com sucesso.', 'Processo criado')
    },
    onError: (error: any) => {
      addAlert(
        'error',
        error?.response?.data?.message || 'Ocorreu um erro ao criar o processo.',
        'Erro ao criar processo'
      )
    },
  })
}

export function useUpdateProcesso() {
  const queryClient = useQueryClient()
  const { addAlert } = useAlerts()

  return useMutation({
    mutationFn: ({
      workspaceId,
      processId,
      payload,
    }: {
      workspaceId: string
      processId: string
      payload: UpdateProcessPayload
    }) => processosService.updateProcess(workspaceId, processId, payload),
    onSuccess: (_, { workspaceId, processId }) => {
      queryClient.invalidateQueries({
        queryKey: processosQueryKeys.processoList(workspaceId),
      })
      queryClient.invalidateQueries({
        queryKey: processosQueryKeys.processo(workspaceId, processId),
      })
      addAlert('success', 'Processo atualizado com sucesso.', 'Processo atualizado')
    },
    onError: (error: any) => {
      addAlert(
        'error',
        error?.response?.data?.message || 'Ocorreu um erro ao atualizar o processo.',
        'Erro ao atualizar processo'
      )
    },
  })
}

export function useDeleteProcesso() {
  const queryClient = useQueryClient()
  const { addAlert } = useAlerts()

  return useMutation({
    mutationFn: ({ workspaceId, processId }: { workspaceId: string; processId: string }) =>
      processosService.deleteProcess(workspaceId, processId),
    onSuccess: (_, { workspaceId }) => {
      queryClient.invalidateQueries({
        queryKey: processosQueryKeys.processoList(workspaceId),
      })
      addAlert('success', 'Processo excluído com sucesso.', 'Processo excluído')
    },
    onError: (error: any) => {
      addAlert(
        'error',
        error?.response?.data?.message || 'Ocorreu um erro ao excluir o processo.',
        'Erro ao excluir processo'
      )
    },
  })
}

// ─── ATORES ─────────────────────────────────────────────────

export function useProcessoActors(workspaceId: string, processId: string, enabled = true) {
  return useQuery<ProcessActor[]>({
    queryKey: processosQueryKeys.actors(workspaceId, processId),
    queryFn: () => processosService.getProcessActors(workspaceId, processId),
    enabled: enabled && !!workspaceId && !!processId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useAddProcessoActor() {
  const queryClient = useQueryClient()
  const { addAlert } = useAlerts()

  return useMutation({
    mutationFn: ({
      workspaceId,
      processId,
      payload,
    }: {
      workspaceId: string
      processId: string
      payload: CreateProcessActorPayload
    }) => processosService.addProcessActor(workspaceId, processId, payload),
    onSuccess: (_, { workspaceId, processId }) => {
      queryClient.invalidateQueries({
        queryKey: processosQueryKeys.actors(workspaceId, processId),
      })
      queryClient.invalidateQueries({
        queryKey: processosQueryKeys.processo(workspaceId, processId),
      })
      addAlert('success', 'Ator adicionado com sucesso.', 'Ator adicionado')
    },
    onError: (error: any) => {
      addAlert(
        'error',
        error?.response?.data?.message || 'Ocorreu um erro ao adicionar o ator.',
        'Erro ao adicionar ator'
      )
    },
  })
}

export function useRemoveProcessoActor() {
  const queryClient = useQueryClient()
  const { addAlert } = useAlerts()

  return useMutation({
    mutationFn: ({
      workspaceId,
      processId,
      actorId,
    }: {
      workspaceId: string
      processId: string
      actorId: string
    }) => processosService.removeProcessActor(workspaceId, processId, actorId),
    onSuccess: (_, { workspaceId, processId }) => {
      queryClient.invalidateQueries({
        queryKey: processosQueryKeys.actors(workspaceId, processId),
      })
      queryClient.invalidateQueries({
        queryKey: processosQueryKeys.processo(workspaceId, processId),
      })
      addAlert('success', 'Ator removido com sucesso.', 'Ator removido')
    },
    onError: (error: any) => {
      addAlert(
        'error',
        error?.response?.data?.message || 'Ocorreu um erro ao remover o ator.',
        'Erro ao remover ator'
      )
    },
  })
}
