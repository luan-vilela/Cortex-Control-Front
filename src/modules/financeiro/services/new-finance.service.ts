import {
  type CreateSettlementDto,
  type CreateTransactionGroupDto,
  type FinancialDashboardSummary,
  type GetTransactionGroupsFilters,
  type GetTransactionGroupsResponse,
  type GetTransactionsFilters,
  type GetTransactionsResponse,
  type Settlement,
  type Transaction,
  type TransactionGroup,
} from '../types/new-architecture'

import api from '@/lib/api'

const BASE_PATH = '/workspaces'

// ==================== TRANSACTION GROUPS ====================

export async function createTransactionGroup(
  workspaceId: string,
  data: CreateTransactionGroupDto
): Promise<TransactionGroup> {
  const response = await api.post(`${BASE_PATH}/${workspaceId}/finance/groups`, data)
  return response.data
}

export async function getTransactionGroups(
  workspaceId: string,
  filters?: GetTransactionGroupsFilters
): Promise<GetTransactionGroupsResponse> {
  const params = new URLSearchParams()

  if (filters?.groupType) params.append('groupType', filters.groupType)
  if (filters?.status) params.append('status', filters.status)
  if (filters?.personId) params.append('personId', filters.personId)
  if (filters?.sourceType) params.append('sourceType', filters.sourceType)
  if (filters?.fromDate) params.append('fromDate', filters.fromDate)
  if (filters?.toDate) params.append('toDate', filters.toDate)
  if (filters?.search) params.append('search', filters.search)
  if (filters?.page) params.append('page', filters.page.toString())
  if (filters?.limit) params.append('limit', filters.limit.toString())

  const response = await api.get(`${BASE_PATH}/${workspaceId}/finance/groups?${params}`)
  return response.data
}

export async function getTransactionGroup(
  workspaceId: string,
  groupId: string
): Promise<TransactionGroup> {
  const response = await api.get(`${BASE_PATH}/${workspaceId}/finance/groups/${groupId}`)
  return response.data
}

// ==================== TRANSACTIONS ====================

export async function getTransactions(
  workspaceId: string,
  filters?: GetTransactionsFilters
): Promise<GetTransactionsResponse> {
  const params = new URLSearchParams()

  if (filters?.transactionType) params.append('transactionType', filters.transactionType)
  if (filters?.status) params.append('status', filters.status)
  if (filters?.eventType) params.append('eventType', filters.eventType)
  if (filters?.groupId) params.append('groupId', filters.groupId)
  if (filters?.personId) params.append('personId', filters.personId)
  if (filters?.fromDueDate) params.append('fromDueDate', filters.fromDueDate)
  if (filters?.toDueDate) params.append('toDueDate', filters.toDueDate)
  if (filters?.search) params.append('search', filters.search)
  if (filters?.page) params.append('page', filters.page.toString())
  if (filters?.limit) params.append('limit', filters.limit.toString())

  const response = await api.get(`${BASE_PATH}/${workspaceId}/finance/transactions?${params}`)
  return response.data
}

export async function getTransaction(
  workspaceId: string,
  transactionId: string
): Promise<Transaction> {
  const response = await api.get(
    `${BASE_PATH}/${workspaceId}/finance/transactions/${transactionId}`
  )
  return response.data
}

// ==================== SETTLEMENTS ====================

export async function createSettlement(
  workspaceId: string,
  data: CreateSettlementDto
): Promise<Settlement> {
  const response = await api.post(`${BASE_PATH}/${workspaceId}/finance/settlements`, data)
  return response.data
}

export async function getSettlements(
  workspaceId: string,
  page = 1,
  limit = 20
): Promise<{ data: Settlement[]; total: number }> {
  const response = await api.get(
    `${BASE_PATH}/${workspaceId}/finance/settlements?page=${page}&limit=${limit}`
  )
  return response.data
}

// ==================== DASHBOARD ====================

export async function getFinancialSummary(workspaceId: string): Promise<FinancialDashboardSummary> {
  const response = await api.get(`${BASE_PATH}/${workspaceId}/finance/dashboard`)
  return response.data
}

// ==================== LEGACY COMPATIBILITY ====================
// Keep old methods for backwards compatibility (will be removed later)

export async function getFinanceiroTransactions(workspaceId: string, filters?: any): Promise<any> {
  console.warn('getFinanceiroTransactions is deprecated, use getTransactionGroups instead')
  // Redirect to new API
  return getTransactionGroups(workspaceId, filters)
}
