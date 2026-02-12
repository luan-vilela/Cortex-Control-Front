export enum TransactionSourceType {
  SERVICE_ORDER = 'SERVICE_ORDER',
  PURCHASE_ORDER = 'PURCHASE_ORDER',
  INVOICE = 'INVOICE',
  MANUAL = 'MANUAL',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  OVERDUE = 'OVERDUE',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  CANCELLED = 'CANCELLED',
}

export enum TransactionActorType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum PaymentMode {
  CASH = 'CASH',
  INSTALLMENT = 'INSTALLMENT',
}

export enum InstallmentPlanType {
  SIMPLE = 'SIMPLE', // Parcelamento Simples: divisão simples
  SAC = 'SAC', // SAC: amortização fixa, juros decrescentes (futuro)
  PRICE_TABLE = 'PRICE_TABLE', // Tabela Price: juros + amortização constante (futuro)
}

export enum RecurrenceType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum InterestType {
  PERCENTAGE = 'PERCENTAGE',
  FLAT = 'FLAT',
}

// Payment configuration for CASH mode (à vista)
export interface CashPaymentConfig {
  mode: PaymentMode.CASH
}

// Payment configuration for INSTALLMENT mode (parcelado)
export interface InstallmentPaymentConfig {
  mode: PaymentMode.INSTALLMENT
  numberOfInstallments: number // Mínimo 2
  downPayment?: number // Valor de entrada (opcional)
  downPaymentDate?: Date // Data da entrada (opcional)
  planType: InstallmentPlanType // Tipo de plano (padrão SIMPLE)
  firstInstallmentDate: Date // Data da primeira parcela
  installmentIntervalDays: number // Intervalo entre parcelas em dias
}

// Union type for payment configuration
export type PaymentConfig = CashPaymentConfig | InstallmentPaymentConfig

export interface TransactionParty {
  id: number
  transactionId: number
  workspaceId: string
  partyType: TransactionActorType
  partyStatus?: string
  partyMetadata?: Record<string, any>
}

export interface InstallmentPlan {
  id: number
  workspaceId: string
  transactionId: number
  planType: InstallmentPlanType
  numberOfInstallments: number
  downpayment?: number
  downpaymentDate?: Date
  firstInstallmentDate: Date
  installmentIntervalDays: number
  createdAt: Date
  updatedAt: Date
}

export interface RecurrenceConfigEntity {
  id: number
  workspaceId: string
  originalTransactionId: number
  recurrenceType: RecurrenceType
  recurrenceOccurrences?: number
  recurrenceEndDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface InterestConfigEntity {
  id: number
  workspaceId: string
  transactionId: number
  interestType: InterestType
  percentage?: number
  flatAmount?: number
  description?: string
  // ✨ Novos campos para multa e mora
  penaltyPercentage?: number
  interestPerMonth?: number
  interestPeriod: 'MONTHLY' | 'ANNUAL'
  createdAt: Date
  updatedAt: Date
}

export interface FinanceiroTransaction {
  id: number
  workspaceId: string
  sourceType: TransactionSourceType
  sourceId: string
  sourceMetadata?: Record<string, any>
  amount: number
  description: string
  dueDate: string | Date
  paidDate?: string | Date
  status: TransactionStatus
  notes?: string
  createdBy?: string
  createdAt: string | Date
  updatedAt: string | Date
  deletedAt?: string | Date
  parties: TransactionParty[]
  // Relations to payment configuration
  paymentConfig?: PaymentConfig
  installmentPlan?: InstallmentPlan
  recurrenceConfig?: RecurrenceConfigEntity
  interestConfig?: InterestConfigEntity
}

export interface CreateTransactionPartyPayload {
  workspaceId: string
  userId?: string
  actorType: TransactionActorType
  actorMetadata?: Record<string, any>
}

export interface CreateTransactionPayload {
  sourceType: TransactionSourceType
  sourceId: string
  sourceMetadata?: Record<string, any>
  amount: number
  description: string
  dueDate: string | Date // Accept both string (YYYY-MM-DD) and Date
  paidDate?: Date
  notes?: string
  paymentConfig: PaymentConfig // Now required
  interestConfig?: {
    type: InterestType
    percentage?: number
    flatAmount?: number
    description?: string
    // ✨ Novos campos para multa e mora
    penaltyPercentage?: number
    interestPerMonth?: number
    interestPeriod?: 'MONTHLY' | 'ANNUAL'
  }
  recurrenceConfig?: {
    type: RecurrenceType
    occurrences?: number
    endDate?: Date
  }
  actors?: CreateTransactionPartyPayload[]
}

export interface UpdateTransactionPayload {
  status?: TransactionStatus
  paidDate?: Date
  notes?: string
}

export interface GetTransactionsFilters {
  sourceType?: TransactionSourceType
  status?: TransactionStatus
  partyType?: TransactionActorType
  fromDate?: Date
  toDate?: Date
  search?: string
  page?: number
  limit?: number
}

export interface GetTransactionsResponse {
  data: FinanceiroTransaction[]
  total: number
  page: number
  limit: number
}
