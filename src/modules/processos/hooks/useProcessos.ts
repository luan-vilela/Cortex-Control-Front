import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAlerts } from '@/contexts/AlertContext'

import { processosService } from '../processos.service'
import type {
  CreateProcessActorPayload,
  CreateProcessFinanceEntryPayload,
  CreateProcessPayload,
  GetProcessesFilters,
  GetProcessesResponse,
  Process,
  ProcessActor,
  ProcessFinanceEntry,
  ProcessFinanceResponse,
  ProcessFinanceSummary,
  ProcessReportsData,
  ProcessReportsFilters,
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
  finance: (workspaceId: string, processId: string) => [
    ...processosQueryKeys.all,
    'finance',
    workspaceId,
    processId,
  ],
  financeSummary: (workspaceId: string, processId: string) => [
    ...processosQueryKeys.all,
    'finance-summary',
    workspaceId,
    processId,
  ],
  financeArchived: (workspaceId: string, processId: string) => [
    ...processosQueryKeys.all,
    'finance-archived',
    workspaceId,
    processId,
  ],
  reports: (workspaceId: string, filters?: ProcessReportsFilters) => [
    ...processosQueryKeys.all,
    'reports',
    workspaceId,
    filters,
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
    onSuccess: (data: any, { workspaceId, processId }) => {
      queryClient.invalidateQueries({
        queryKey: processosQueryKeys.processoList(workspaceId),
      })
      queryClient.invalidateQueries({
        queryKey: processosQueryKeys.processo(workspaceId, processId),
      })

      if (data?.autoInvoice?.invoiced) {
        // Invalidar queries de finance para atualizar o card financeiro
        queryClient.invalidateQueries({
          queryKey: processosQueryKeys.finance(workspaceId, processId),
        })
        queryClient.invalidateQueries({
          queryKey: processosQueryKeys.financeSummary(workspaceId, processId),
        })

        const parts: string[] = []
        if (data.autoInvoice.totalExpenses > 0) {
          parts.push(`Despesas: ${Number(data.autoInvoice.totalExpenses).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`)
        }
        if (data.autoInvoice.totalIncomes > 0) {
          parts.push(`Receitas: ${Number(data.autoInvoice.totalIncomes).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`)
        }
        addAlert(
          'success',
          `Processo concluído e faturado automaticamente. ${parts.join(' | ')}`,
          'Processo concluído e faturado'
        )
      } else {
        addAlert('success', 'Processo atualizado com sucesso.', 'Processo atualizado')
      }
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

// ─── FINANCEIRO ─────────────────────────────────────────────

export function useProcessoFinance(workspaceId: string, processId: string, enabled = true) {
  return useQuery<ProcessFinanceResponse>({
    queryKey: processosQueryKeys.finance(workspaceId, processId),
    queryFn: () => processosService.getProcessFinance(workspaceId, processId),
    enabled: enabled && !!workspaceId && !!processId,
    staleTime: 2 * 60 * 1000,
  })
}

export function useProcessoFinanceSummary(workspaceId: string, processId: string, enabled = true) {
  return useQuery<ProcessFinanceSummary>({
    queryKey: processosQueryKeys.financeSummary(workspaceId, processId),
    queryFn: () => processosService.getProcessFinanceSummary(workspaceId, processId),
    enabled: enabled && !!workspaceId && !!processId,
    staleTime: 2 * 60 * 1000,
  })
}

export function useCreateProcessoTransaction() {
  const { addAlert } = useAlerts()

  return useMutation({
    mutationFn: ({
      workspaceId,
      processId,
      payload,
    }: {
      workspaceId: string
      processId: string
      payload: CreateProcessFinanceEntryPayload
    }) => processosService.createProcessTransaction(workspaceId, processId, payload),
    onSuccess: () => {
      addAlert('success', 'Lançamento financeiro criado com sucesso.', 'Lançamento criado')
    },
    onError: (error: any) => {
      addAlert(
        'error',
        error?.response?.data?.message || 'Ocorreu um erro ao criar o lançamento.',
        'Erro ao criar lançamento'
      )
    },
  })
}

export function useInvoiceProcessTree() {
  const { addAlert } = useAlerts()

  return useMutation({
    mutationFn: ({
      workspaceId,
      processId,
      payload,
    }: {
      workspaceId: string
      processId: string
      payload: { dueDate: string; description?: string; personId?: string }
    }) => processosService.invoiceProcessTree(workspaceId, processId, payload),
    onSuccess: () => {
      addAlert('success', 'Processo faturado com sucesso!', 'Fatura gerada')
    },
    onError: (error: any) => {
      addAlert(
        'error',
        error?.response?.data?.message || 'Ocorreu um erro ao faturar o processo.',
        'Erro ao faturar'
      )
    },
  })
}

export function useArchivedProcessoEntries(workspaceId: string, processId: string, enabled = true) {
  return useQuery<ProcessFinanceResponse>({
    queryKey: processosQueryKeys.financeArchived(workspaceId, processId),
    queryFn: () => processosService.getArchivedEntries(workspaceId, processId),
    enabled: enabled && !!workspaceId && !!processId,
    staleTime: 2 * 60 * 1000,
  })
}

export function useArchiveProcessoEntry() {
  const queryClient = useQueryClient()
  const { addAlert } = useAlerts()

  return useMutation({
    mutationFn: ({
      workspaceId,
      processId,
      entryId,
      archive,
    }: {
      workspaceId: string
      processId: string
      entryId: string
      archive: boolean
    }) => processosService.archiveFinanceEntry(workspaceId, processId, entryId, archive),
    onSuccess: (_, { workspaceId, processId, archive }) => {
      queryClient.invalidateQueries({
        queryKey: processosQueryKeys.finance(workspaceId, processId),
      })
      queryClient.invalidateQueries({
        queryKey: processosQueryKeys.financeSummary(workspaceId, processId),
      })
      queryClient.invalidateQueries({
        queryKey: processosQueryKeys.financeArchived(workspaceId, processId),
      })
      addAlert(
        'success',
        archive ? 'Lançamento arquivado com sucesso.' : 'Lançamento restaurado com sucesso.',
        archive ? 'Lançamento arquivado' : 'Lançamento restaurado'
      )
    },
    onError: (error: any) => {
      addAlert(
        'error',
        error?.response?.data?.message || 'Ocorreu um erro ao arquivar/restaurar o lançamento.',
        'Erro'
      )
    },
  })
}

// ─── RELATÓRIOS ──────────────────────────────────────────────

export function useProcessoReports(
  workspaceId: string,
  filters?: ProcessReportsFilters,
  enabled = true
) {
  return useQuery<ProcessReportsData>({
    queryKey: processosQueryKeys.reports(workspaceId, filters),
    queryFn: () => processosService.getReports(workspaceId, filters),
    enabled: enabled && !!workspaceId,
  })
}
