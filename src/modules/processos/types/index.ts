export enum ProcessStatus {
  ABERTO = 'ABERTO',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  PENDENTE = 'PENDENTE',
  BLOQUEADO = 'BLOQUEADO',
  CONCLUIDO = 'CONCLUIDO',
  CANCELADO = 'CANCELADO',
}

export enum ProcessType {
  ATENDIMENTO = 'ATENDIMENTO',
  FINANCEIRO = 'FINANCEIRO',
  ESTOQUE = 'ESTOQUE',
  FORNECEDOR = 'FORNECEDOR',
  LOGISTICA = 'LOGISTICA',
  JURIDICO = 'JURIDICO',
  RH = 'RH',
  OUTRO = 'OUTRO',
}

export enum ActorRole {
  APROVADOR = 'APROVADOR',
  EXECUTOR = 'EXECUTOR',
  SOLICITANTE = 'SOLICITANTE',
  OBSERVADOR = 'OBSERVADOR',
  RESPONSAVEL = 'RESPONSAVEL',
}

export interface ProcessActorPhone {
  number: string
  type: string
  isPrimary: boolean
  isWhatsapp: boolean
}

export interface ProcessActor {
  id: string
  processId: string
  actorId: string
  actorType: string
  responsavel: boolean
  papel: ActorRole
  createdAt: string
  // Dados hidratados pelo backend (via findTree)
  actorName?: string
  actorEmail?: string
  actorPhones?: ProcessActorPhone[]
  actorAddress?: string
  actorCity?: string
  actorState?: string
  actorDocument?: string
}

export interface Process {
  id: string
  workspaceId: string
  name: string
  type: ProcessType
  status: ProcessStatus
  schema: Record<string, any> | null
  data: Record<string, any> | null
  gridRow: number | null
  gridColStart: number | null
  gridColSpan: number | null
  gridRowSpan: number | null
  obrigatorio: boolean
  impeditivo: boolean
  parentId: string | null
  parent?: Process | null
  children: Process[]
  actors: ProcessActor[]
  createdAt: string
  updatedAt: string
  closedAt: string | null
  invoicedAt: string | null
}

export interface SubProcessActorPayload {
  actorId: string
  actorType: string
  responsavel?: boolean
  papel?: ActorRole
}

export interface SubProcessPayload {
  name: string
  type?: ProcessType
  status?: ProcessStatus
  schema?: Record<string, any>
  data?: Record<string, any>
  obrigatorio?: boolean
  impeditivo?: boolean
  actors?: SubProcessActorPayload[]
}

export interface CreateProcessPayload {
  name: string
  type?: ProcessType
  status?: ProcessStatus
  schema?: Record<string, any>
  data?: Record<string, any>
  gridRow?: number
  gridColStart?: number
  gridColSpan?: number
  gridRowSpan?: number
  obrigatorio?: boolean
  impeditivo?: boolean
  parentId?: string
  subProcesses?: SubProcessPayload[]
}

export interface UpdateProcessPayload {
  name?: string
  type?: ProcessType
  status?: ProcessStatus
  schema?: Record<string, any>
  data?: Record<string, any>
  gridRow?: number
  gridColStart?: number
  gridColSpan?: number
  gridRowSpan?: number
  obrigatorio?: boolean
  impeditivo?: boolean
  parentId?: string
}

export interface CreateProcessActorPayload {
  actorId: string
  actorType: string
  responsavel?: boolean
  papel?: ActorRole
}

export interface UpdateProcessActorPayload {
  responsavel?: boolean
  papel?: ActorRole
}

export interface GetProcessesFilters {
  status?: ProcessStatus
  type?: ProcessType
  obrigatorio?: string
  impeditivo?: string
  actorId?: string
  actorType?: string
  search?: string
  rootOnly?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export interface GetProcessesResponse {
  data: Process[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// ─── FINANCEIRO DO PROCESSO (tabela própria) ────────────────

export interface ProcessFinanceEntry {
  id: string
  workspaceId: string
  processId: string
  transactionType: 'INCOME' | 'EXPENSE'
  amount: number
  description: string | null
  dueDate: string | null
  archivedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface ProcessFinanceResponse {
  entries: ProcessFinanceEntry[]
  currentProcessId: string
}

export interface ProcessFinanceSummary {
  totalIncome: number
  totalExpense: number
  balance: number
  count: number
}

export interface CreateProcessFinanceEntryPayload {
  transactionType: 'INCOME' | 'EXPENSE'
  amount: number
  description?: string
  dueDate?: string
}

// ─── RELATÓRIOS ─────────────────────────────────────────────

export interface ProcessReportTotals {
  total: number
  root: number
  sub: number
  open: number
  concluded: number
  canceled: number
  overdue: number
}

export interface ProcessReportByStatus {
  status: string
  count: number
}

export interface ProcessReportByType {
  type: string
  count: number
}

export interface ProcessReportTimeline {
  month: string
  count: number
  expense: number
  income: number
}

export interface ProcessReportFinanceSummary {
  transactionType: string
  total: number
  count: number
}

export interface ProcessReportTopExpense {
  processId: string
  processName: string
  totalExpense: number
  entryCount: number
}

export interface ProcessReportDailyOpened {
  date: string
  rootCount: number
  subCount: number
}

export interface ProcessReportAvgLifetimeByType {
  type: string
  avgDays: number
  count: number
}

export type { Period as ReportPeriod } from '@/components/patterns/PeriodPicker'
import type { Period } from '@/components/patterns/PeriodPicker'

export interface ProcessReportsFilters {
  startDate?: string
  endDate?: string
  period?: Period
}

export interface ProcessReportsData {
  totals: ProcessReportTotals
  avgConclusionDays: number | null
  byStatus: ProcessReportByStatus[]
  byType: ProcessReportByType[]
  timeline: ProcessReportTimeline[]
  finance: {
    summary: ProcessReportFinanceSummary[]
    topByExpense: ProcessReportTopExpense[]
  }
  dailyOpened: ProcessReportDailyOpened[]
  avgLifetimeByType: ProcessReportAvgLifetimeByType[]
}
