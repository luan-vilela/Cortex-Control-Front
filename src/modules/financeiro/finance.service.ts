import api from '@/lib/api'

import {
  type CreateTransactionPayload,
  type FinanceiroTransaction,
  type GetTransactionsFilters,
  type GetTransactionsResponse,
  type TransactionParty,
  TransactionStatus,
  type TransactionSummary,
  TransactionType,
  type UpdateTransactionPayload,
} from './types'
import { adaptCreateTransactionPayload } from './types/adapter'

const FINANCEIRO_API = '/workspaces'

export const financeService = {
  /**
   * Cria uma nova transação
   * ADAPTADO para nova arquitetura - converte payload automaticamente
   */
  async createTransaction(
    workspaceId: string,
    payload: CreateTransactionPayload
  ): Promise<FinanceiroTransaction> {
    // Usar nova API (transaction groups)
    const adaptedPayload = adaptCreateTransactionPayload(payload)
    const response = await api.post(
      `${FINANCEIRO_API}/${workspaceId}/finance/groups`,
      adaptedPayload
    )

    // Converter resposta de volta para formato antigo
    return {
      id: parseInt(response.data.id) || 0,
      workspaceId: response.data.workspaceId,
      sourceType: payload.sourceType,
      sourceId: payload.sourceId,
      transactionType: payload.transactionType || TransactionType.EXPENSE,
      amount: response.data.totalAmount,
      description: response.data.description,
      dueDate: response.data.firstDueDate || new Date().toISOString(),
      status: TransactionStatus.PENDING,
      createdAt: response.data.createdAt,
      updatedAt: response.data.updatedAt,
      parties: [],
      isDownpayment: false,
    } as FinanceiroTransaction
  },

  /**
   * Lista transações com filtros
   */
  async getTransactions(
    workspaceId: string,
    filters?: GetTransactionsFilters
  ): Promise<GetTransactionsResponse> {
    const response = await api.get(`${FINANCEIRO_API}/${workspaceId}/finance/transactions`, {
      params: {
        sourceType: filters?.sourceType,
        transactionType: filters?.transactionType,
        status: filters?.status,
        fromDate: filters?.fromDate ? filters.fromDate.toISOString().split('T')[0] : undefined,
        toDate: filters?.toDate ? filters.toDate.toISOString().split('T')[0] : undefined,
        page: filters?.page || 1,
        limit: filters?.limit || 20,
      },
    })
    return response.data
  },

  /**
   * Obtém detalhes de uma transação
   */
  async getTransactionDetail(
    workspaceId: string,
    transactionId: number
  ): Promise<FinanceiroTransaction> {
    const response = await api.get(
      `${FINANCEIRO_API}/${workspaceId}/finance/transactions/${transactionId}`
    )
    return response.data
  },

  /**
   * Atualiza status de uma transação
   */
  async updateTransaction(
    workspaceId: string,
    transactionId: number,
    payload: UpdateTransactionPayload
  ): Promise<FinanceiroTransaction> {
    const response = await api.patch(
      `${FINANCEIRO_API}/${workspaceId}/finance/transactions/${transactionId}`,
      payload
    )
    return response.data
  },

  /**
   * Deleta uma transação (soft delete)
   */
  async deleteTransaction(workspaceId: string, transactionId: number): Promise<void> {
    await api.delete(`${FINANCEIRO_API}/${workspaceId}/finance/transactions/${transactionId}`)
  },

  /**
   * Obtém resumo das transações (totais de entrada, saída e balanço)
   */
  async getTransactionsSummary(
    workspaceId: string,
    filters?: GetTransactionsFilters
  ): Promise<TransactionSummary> {
    const response = await api.get(
      `${FINANCEIRO_API}/${workspaceId}/finance/transactions/summary`,
      {
        params: {
          fromDate: filters?.fromDate ? filters.fromDate.toISOString().split('T')[0] : undefined,
          toDate: filters?.toDate ? filters.toDate.toISOString().split('T')[0] : undefined,
          status: filters?.status,
        },
      }
    )
    return response.data
  },

  /**
   * Obtém atores de uma transação
   */
  async getTransactionActors(transactionId: number): Promise<TransactionParty[]> {
    const response = await api.get(
      `${FINANCEIRO_API}/:workspaceId/finance/transactions/${transactionId}/actors`
    )
    return response.data
  },

  /**
   * Adiciona um ator a uma transação
   */
  async addActorToTransaction(
    workspaceId: string,
    transactionId: number,
    payload: {
      workspaceId: string
      actorType: string
    }
  ): Promise<TransactionParty> {
    const response = await api.post(
      `${FINANCEIRO_API}/${workspaceId}/finance/transactions/${transactionId}/actors`,
      payload
    )
    return response.data
  },
}
