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
  CANCELED = 'CANCELED',
}

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER',
}

// @deprecated Use TransactionType instead
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

export interface TransactionPartyUser {
  id: string
  name: string
  email: string
  createdVia?: string
}

export interface TransactionParty {
  id: number
  transactionId: number
  workspaceId: string
  partyType?: TransactionActorType // Tipo do ator (INCOME/EXPENSE)
  partyStatus?: string
  partyMetadata?: Record<string, any>
  user?: TransactionPartyUser
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
  interestPercentage?: number
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
  transactionType: TransactionType // ← Tipo da transação (INCOME, EXPENSE, TRANSFER)
  amount: number
  // ✨ Valor original da dívida (para referência em cálculos de multa/juros)
  // Útil em parcelamentos com entrada: originalAmount = totalValue, amount = parcela
  originalAmount?: number
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
  // ✨ Campos estruturados (novos - substituem sourceMetadata)
  installmentNumber?: number // Número da parcela (1, 2, 3...)
  personId?: string // ID da pessoa (cliente/fornecedor)
  parentTransactionId?: number // ID da transação pai (para parcelas e recorrências)
  isDownpayment: boolean // É entrada?
  installmentTotal?: number // Total de parcelas do plano
  installmentInterest?: number // Juros desta parcela
  installmentAmortization?: number // Amortização desta parcela
  outstandingBalance?: number // Saldo devedor após esta parcela
  orderNumber?: string // Número do pedido/OS
}

export interface CreateTransactionPartyPayload {
  workspaceId: string
  userId?: string
  actorMetadata?: Record<string, any>
}

export interface CreateTransactionPayload {
  sourceType: TransactionSourceType
  sourceId: string
  sourceMetadata?: Record<string, any>
  transactionType?: TransactionType // ← Tipo da transação (opcional, default EXPENSE no backend)
  amount: number
  // ✨ Valor original da dívida (salvo na criação)
  // Se não informado, frontend assume que originalAmount = amount
  originalAmount?: number
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
    interestPercentage?: number
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
  transactionType?: TransactionType
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

export interface TransactionSummary {
  totalIncome: number
  totalExpense: number
  balance: number
  incomeCount: number
  expenseCount: number
}
