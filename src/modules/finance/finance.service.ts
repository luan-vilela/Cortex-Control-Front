import api from "@/lib/api";
import {
  FinanceiroTransaction,
  CreateTransactionPayload,
  UpdateTransactionPayload,
  GetTransactionsFilters,
  GetTransactionsResponse,
  TransactionParty,
} from "./types";

const FINANCEIRO_API = "/workspaces";

export const financeService = {
  /**
   * Cria uma nova transação
   */
  async createTransaction(
    workspaceId: string,
    payload: CreateTransactionPayload,
  ): Promise<FinanceiroTransaction> {
    const response = await api.post(
      `${FINANCEIRO_API}/${workspaceId}/finance/transactions`,
      payload,
    );
    return response.data;
  },

  /**
   * Lista transações com filtros
   */
  async getTransactions(
    workspaceId: string,
    filters?: GetTransactionsFilters,
  ): Promise<GetTransactionsResponse> {
    const response = await api.get(
      `${FINANCEIRO_API}/${workspaceId}/finance/transactions`,
      {
        params: {
          sourceType: filters?.sourceType,
          partyType: filters?.partyType,
          status: filters?.status,
          fromDate: filters?.fromDate
            ? filters.fromDate.toISOString().split("T")[0]
            : undefined,
          toDate: filters?.toDate
            ? filters.toDate.toISOString().split("T")[0]
            : undefined,
          page: filters?.page || 1,
          limit: filters?.limit || 20,
        },
      },
    );
    return response.data;
  },

  /**
   * Obtém detalhes de uma transação
   */
  async getTransactionDetail(
    workspaceId: string,
    transactionId: number,
  ): Promise<FinanceiroTransaction> {
    const response = await api.get(
      `${FINANCEIRO_API}/${workspaceId}/finance/transactions/${transactionId}`,
    );
    return response.data;
  },

  /**
   * Atualiza status de uma transação
   */
  async updateTransaction(
    workspaceId: string,
    transactionId: number,
    payload: UpdateTransactionPayload,
  ): Promise<FinanceiroTransaction> {
    const response = await api.patch(
      `${FINANCEIRO_API}/${workspaceId}/finance/transactions/${transactionId}`,
      payload,
    );
    return response.data;
  },

  /**
   * Deleta uma transação (soft delete)
   */
  async deleteTransaction(
    workspaceId: string,
    transactionId: number,
  ): Promise<void> {
    await api.delete(
      `${FINANCEIRO_API}/${workspaceId}/finance/transactions/${transactionId}`,
    );
  },

  /**
   * Obtém atores de uma transação
   */
  async getTransactionActors(
    transactionId: number,
  ): Promise<TransactionParty[]> {
    const response = await api.get(
      `${FINANCEIRO_API}/:workspaceId/finance/transactions/${transactionId}/actors`,
    );
    return response.data;
  },

  /**
   * Adiciona um ator a uma transação
   */
  async addActorToTransaction(
    workspaceId: string,
    transactionId: number,
    payload: {
      workspaceId: string;
      actorType: string;
    },
  ): Promise<TransactionParty> {
    const response = await api.post(
      `${FINANCEIRO_API}/${workspaceId}/finance/transactions/${transactionId}/actors`,
      payload,
    );
    return response.data;
  },
};
