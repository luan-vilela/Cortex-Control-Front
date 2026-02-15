// ========================================
// NEW FINANCIAL ARCHITECTURE - Event Sourcing
// ========================================

// -------------------- ENUMS --------------------

export enum GroupType {
  SINGLE = 'SINGLE',
  INSTALLMENT = 'INSTALLMENT',
  RECURRENT = 'RECURRENT',
  CONTRACT = 'CONTRACT',
}

export enum SourceType {
  MANUAL = 'MANUAL',
  ORDER = 'ORDER',
  INVOICE = 'INVOICE',
  CONTRACT = 'CONTRACT',
  EXPENSE = 'EXPENSE',
}

export enum GroupStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export enum PlanType {
  SIMPLE = 'SIMPLE',
  PRICE = 'PRICE',
  COMPOUND = 'COMPOUND',
}

export enum CalculationMethod {
  FIXED = 'FIXED',
  VARIABLE = 'VARIABLE',
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum EventType {
  PRINCIPAL = 'PRINCIPAL',
  INTEREST = 'INTEREST',
  FINE = 'FINE',
  DISCOUNT = 'DISCOUNT',
  ADJUSTMENT = 'ADJUSTMENT',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  CASH = 'CASH',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PIX = 'PIX',
  BANK_TRANSFER = 'BANK_TRANSFER',
  BANK_SLIP = 'BANK_SLIP',
  CHECK = 'CHECK',
  OTHER = 'OTHER',
}

export enum SettlementStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  REVERSED = 'REVERSED',
}

export enum FineType {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE',
}

export enum InterestType {
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
}

export enum Frequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  SEMIANNUAL = 'SEMIANNUAL',
  ANNUAL = 'ANNUAL',
}

export enum EndType {
  NEVER = 'NEVER',
  DATE = 'DATE',
  COUNT = 'COUNT',
}

// -------------------- ENTITIES --------------------

export interface InterestConfig {
  id: number
  workspaceId: string
  fineType: FineType
  fineValue: number
  interestType: InterestType
  interestValue: number
  graceDays: number
  maxInterest?: number
  isActive: boolean
  description?: string
  createdBy?: string
  createdAt: string
  updatedAt: string
}

export interface RecurrenceRule {
  id: number
  workspaceId: string
  frequency: Frequency
  interval: number
  endType: EndType
  endDate?: string
  endCount?: number
  nextExecutionAt: string
  executionCount: number
  isActive: boolean
  description?: string
  createdBy?: string
  createdAt: string
  updatedAt: string
}

export interface TransactionGroup {
  id: string
  workspaceId: string
  personId: string
  groupType: GroupType
  sourceType: SourceType
  sourceId?: string
  totalAmount: number
  status: GroupStatus
  numberOfInstallments?: number
  downpaymentAmount?: number
  planType?: PlanType
  calculationMethod?: CalculationMethod
  firstDueDate?: string
  intervalDays?: number
  recurrenceRuleId?: number
  interestConfigId?: number
  description?: string
  createdBy?: string
  createdAt: string
  updatedAt: string
  // Relations (populated when needed)
  recurrenceRule?: RecurrenceRule
  interestConfig?: InterestConfig
  transactions?: Transaction[]
}

export interface Transaction {
  id: string
  workspaceId: string
  groupId: string
  parentTransactionId?: string
  transactionType: TransactionType
  eventType: EventType
  amount: number
  originalAmount: number
  dueDate: string
  paidDate?: string
  status: TransactionStatus
  personId?: string
  installmentNumber?: number
  description?: string
  metadata?: Record<string, any>
  createdBy?: string
  createdAt: string
  updatedAt: string
  // Relations
  group?: TransactionGroup
  parentTransaction?: Transaction
  settlements?: SettlementItem[]
}

export interface Settlement {
  id: string
  workspaceId: string
  totalAmount: number
  settlementDate: string
  paymentMethod: PaymentMethod
  status: SettlementStatus
  reversalSettlementId?: string
  notes?: string
  metadata?: Record<string, any>
  createdBy?: string
  createdAt: string
  updatedAt: string
  // Relations
  items?: SettlementItem[]
}

export interface SettlementItem {
  id: number
  settlementId: string
  transactionId: string
  appliedAmount: number
  createdAt: string
  // Relations
  settlement?: Settlement
  transaction?: Transaction
}

// -------------------- DTOs --------------------

export interface CreateTransactionGroupDto {
  downPaymentIsPaid: boolean
  personId: string
  groupType: GroupType
  sourceType: SourceType
  sourceId?: string
  totalAmount: number
  numberOfInstallments?: number
  downpaymentAmount?: number
  planType?: PlanType
  calculationMethod?: CalculationMethod
  firstDueDate?: string
  intervalDays?: number
  recurrenceRuleId?: number
  interestConfigId?: number
  description?: string
}

export interface SettlementItemDto {
  transactionId: string
  appliedAmount: number
}

export interface CreateSettlementDto {
  totalAmount: number
  settlementDate: string
  paymentMethod: PaymentMethod
  items: SettlementItemDto[]
  notes?: string
}

// -------------------- API RESPONSES --------------------

export interface GetTransactionGroupsResponse {
  data: TransactionGroup[]
  total: number
  page: number
  limit: number
}

export interface GetTransactionsResponse {
  data: Transaction[]
  total: number
  page: number
  limit: number
}

export interface FinancialDashboardSummary {
  totalReceivable: number
  totalPayable: number
  overdueReceivable: number
  overduePayable: number
  paidThisMonth: number
  pendingThisMonth: number
  receivableCount: number
  payableCount: number
}

// -------------------- FILTERS --------------------

export interface GetTransactionGroupsFilters {
  groupType?: GroupType
  status?: GroupStatus
  personId?: string
  sourceType?: SourceType
  fromDate?: string
  toDate?: string
  search?: string
  page?: number
  limit?: number
}

export interface GetTransactionsFilters {
  transactionType?: TransactionType
  status?: TransactionStatus
  eventType?: EventType
  groupId?: string
  personId?: string
  fromDueDate?: string
  toDueDate?: string
  search?: string
  page?: number
  limit?: number
}
