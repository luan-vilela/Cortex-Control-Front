import { financeService } from '../finance.service'
import {
  type CreateTransactionPayload,
  type FinanceiroTransaction,
  type GetTransactionsFilters,
  type GetTransactionsResponse,
  type TransactionParty,
  type TransactionSummary,
  type UpdateTransactionPayload,
} from '../types'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAlerts } from '@/contexts/AlertContext'

// Query key factory
export const financeQueryKeys = {
  all: ['finance'],
  transactions: () => [...financeQueryKeys.all, 'transactions'],
  transaction: (workspaceId: string, transactionId: number) => [
    ...financeQueryKeys.transactions(),
    workspaceId,
    transactionId,
  ],
  transactionList: (workspaceId: string, filters?: GetTransactionsFilters) => [
    ...financeQueryKeys.transactions(),
    workspaceId,
    filters,
  ],
  transactionSummary: (workspaceId: string, filters?: GetTransactionsFilters) => [
    ...financeQueryKeys.transactions(),
    'summary',
    workspaceId,
    filters,
  ],
  actors: (transactionId: number) => [...financeQueryKeys.all, 'actors', transactionId],
}

/**
 * Hook para listar transações
 */
export function useTransactions(
  workspaceId: string,
  filters?: GetTransactionsFilters,
  enabled = true
) {
  return useQuery<GetTransactionsResponse>({
    queryKey: financeQueryKeys.transactionList(workspaceId, filters),
    queryFn: () => financeService.getTransactions(workspaceId, filters),
    enabled: enabled && !!workspaceId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

/**
 * Hook para obter resumo das transações
 */
export function useTransactionsSummary(
  workspaceId: string,
  filters?: GetTransactionsFilters,
  enabled = true
) {
  return useQuery<TransactionSummary>({
    queryKey: financeQueryKeys.transactionSummary(workspaceId, filters),
    queryFn: () => financeService.getTransactionsSummary(workspaceId, filters),
    enabled: enabled && !!workspaceId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

/**
 * Hook para obter detalhes de uma transação
 */
export function useTransactionDetail(workspaceId: string, transactionId: number, enabled = true) {
  return useQuery<FinanceiroTransaction>({
    queryKey: financeQueryKeys.transaction(workspaceId, transactionId),
    queryFn: () => financeService.getTransactionDetail(workspaceId, transactionId),
    enabled: enabled && !!workspaceId && !!transactionId,
    staleTime: 5 * 60 * 1000,
  })
}

/**
 * Hook para criar transação
 */
export function useCreateTransaction(workspaceId: string) {
  const queryClient = useQueryClient()
  const { addAlert } = useAlerts()

  return useMutation({
    mutationFn: (payload: CreateTransactionPayload) =>
      financeService.createTransaction(workspaceId, payload),
    onSuccess: (data) => {
      // Invalida o cache de transações
      queryClient.invalidateQueries({
        queryKey: financeQueryKeys.transactionList(workspaceId),
      })

      addAlert('success', `Transação ${data.id} criada com sucesso`, 'Transação criada', 3000)
    },
    onError: (error: any) => {
      addAlert(
        'error',
        error?.response?.data?.message || 'Erro ao criar transação. Tente novamente.',
        'Erro ao criar transação',
        5000
      )
    },
  })
}

/**
 * Hook para atualizar transação (genérico, sem ID fixo)
 */
export function useUpdateTransactionGeneric(workspaceId: string) {
  const queryClient = useQueryClient()
  const { addAlert } = useAlerts()

  return useMutation({
    mutationFn: ({
      transactionId,
      payload,
    }: {
      transactionId: number
      payload: UpdateTransactionPayload
    }) => financeService.updateTransaction(workspaceId, transactionId, payload),
    onSuccess: () => {
      // Invalida a lista de transações
      queryClient.invalidateQueries({
        queryKey: financeQueryKeys.transactionList(workspaceId),
      })

      addAlert('success', 'Transação atualizada com sucesso', 'Transação atualizada', 3000)
    },
    onError: (error: any) => {
      addAlert(
        'error',
        error?.response?.data?.message || 'Erro ao atualizar transação. Tente novamente.',
        'Erro ao atualizar transação',
        5000
      )
    },
  })
}

/**
 * Hook para atualizar transação
 */
export function useUpdateTransaction(workspaceId: string, transactionId: number) {
  const queryClient = useQueryClient()
  const { addAlert } = useAlerts()

  return useMutation({
    mutationFn: (payload: UpdateTransactionPayload) =>
      financeService.updateTransaction(workspaceId, transactionId, payload),
    onSuccess: () => {
      // Invalida caches relevantes
      queryClient.invalidateQueries({
        queryKey: financeQueryKeys.transaction(workspaceId, transactionId),
      })
      queryClient.invalidateQueries({
        queryKey: financeQueryKeys.transactionList(workspaceId),
      })

      addAlert('success', 'Transação atualizada com sucesso', 'Transação atualizada', 3000)
    },
    onError: (error: any) => {
      addAlert(
        'error',
        error?.response?.data?.message || 'Erro ao atualizar transação. Tente novamente.',
        'Erro ao atualizar transação',
        5000
      )
    },
  })
}

/**
 * Hook para deletar transação
 */
export function useDeleteTransaction(workspaceId: string) {
  const queryClient = useQueryClient()
  const { addAlert } = useAlerts()

  return useMutation({
    mutationFn: (transactionId: number) =>
      financeService.deleteTransaction(workspaceId, transactionId),
    onSuccess: () => {
      // Invalida o cache de transações
      queryClient.invalidateQueries({
        queryKey: financeQueryKeys.transactionList(workspaceId),
      })

      addAlert('success', 'Transação deletada com sucesso', 'Transação deletada', 3000)
    },
    onError: (error: any) => {
      addAlert(
        'error',
        error?.response?.data?.message || 'Erro ao deletar transação. Tente novamente.',
        'Erro ao deletar transação',
        5000
      )
    },
  })
}

/**
 * Hook para obter atores de uma transação
 */
export function useTransactionActors(transactionId: number, enabled = true) {
  return useQuery<TransactionParty[]>({
    queryKey: financeQueryKeys.actors(transactionId),
    queryFn: () => financeService.getTransactionActors(transactionId),
    enabled: enabled && !!transactionId,
  })
}

/**
 * Hook para adicionar ator a transação
 */
export function useAddActorToTransaction(workspaceId: string, transactionId: number) {
  const queryClient = useQueryClient()
  const { addAlert } = useAlerts()

  return useMutation({
    mutationFn: (payload: { workspaceId: string; actorType: string }) =>
      financeService.addActorToTransaction(workspaceId, transactionId, {
        workspaceId: payload.workspaceId,
        actorType: payload.actorType,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: financeQueryKeys.actors(transactionId),
      })

      addAlert('success', 'Ator adicionado à transação com sucesso', 'Ator adicionado', 3000)
    },
    onError: (error: any) => {
      addAlert(
        'error',
        error?.response?.data?.message || 'Erro ao adicionar ator. Tente novamente.',
        'Erro ao adicionar ator',
        5000
      )
    },
  })
}
