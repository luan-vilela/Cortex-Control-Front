export enum TransactionSourceType {
  SERVICE_ORDER = "SERVICE_ORDER",
  PURCHASE_ORDER = "PURCHASE_ORDER",
  INVOICE = "INVOICE",
  MANUAL = "MANUAL",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  CANCELLED = "CANCELLED",
}

export enum TransactionActorType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export enum PaymentMode {
  CASH = "CASH",
  INSTALLMENT = "INSTALLMENT",
}

export enum RecurrenceType {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  BIWEEKLY = "BIWEEKLY",
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  SEMIANNUAL = "SEMIANNUAL",
  ANNUAL = "ANNUAL",
}

export enum InstallmentPlanType {
  PRICE_TABLE = "PRICE_TABLE", // Tabela Price: juros + amortização constante
  SAC = "SAC", // SAC: amortização fixa, juros decrescentes
  SIMPLE = "SIMPLE", // Parcelamento Simples: divisão simples
}

export enum InterestType {
  PERCENTAGE = "PERCENTAGE", // Percentual (ex: 5%)
  FLAT = "FLAT", // Valor fixo (ex: R$100)
}

// Interest configuration (shared by CASH and INSTALLMENT modes)
export interface InterestConfig {
  type: InterestType;
  percentage?: number; // For PERCENTAGE type
  flatAmount?: number; // For FLAT type
  description?: string;
}

// Recurrence configuration (only for CASH mode)
export interface RecurrenceConfig {
  type: RecurrenceType;
  occurrences?: number; // NULL = infinite
  endDate?: Date; // Optional end date
}

// Payment configuration for CASH mode (à vista)
export interface CashPaymentConfig {
  mode: PaymentMode.CASH;
  recurrence?: RecurrenceConfig;
  interest?: InterestConfig;
}

// Payment configuration for INSTALLMENT mode (parcelado)
export interface InstallmentPaymentConfig {
  mode: PaymentMode.INSTALLMENT;
  planType: InstallmentPlanType;
  numberOfInstallments: number;
  downpayment?: number;
  downpaymentDate?: Date;
  firstInstallmentDate: Date;
  installmentIntervalDays?: number;
  interest?: InterestConfig;
}

// Union type for payment configuration
export type PaymentConfig = CashPaymentConfig | InstallmentPaymentConfig;

export interface TransactionParty {
  id: number;
  transactionId: number;
  workspaceId: string;
  partyType: TransactionActorType;
  partyStatus?: string;
  partyMetadata?: Record<string, any>;
}

export interface InstallmentPlan {
  id: number;
  workspaceId: string;
  transactionId: number;
  planType: InstallmentPlanType;
  numberOfInstallments: number;
  downpayment?: number;
  downpaymentDate?: Date;
  firstInstallmentDate: Date;
  installmentIntervalDays: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecurrenceConfigEntity {
  id: number;
  workspaceId: string;
  originalTransactionId: number;
  recurrenceType: RecurrenceType;
  recurrenceOccurrences?: number;
  recurrenceEndDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InterestConfigEntity {
  id: number;
  workspaceId: string;
  transactionId: number;
  interestType: InterestType;
  percentage?: number;
  flatAmount?: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinanceiroTransaction {
  id: number;
  workspaceId: string;
  sourceType: TransactionSourceType;
  sourceId: string;
  sourceMetadata?: Record<string, any>;
  amount: number;
  description: string;
  dueDate: string | Date;
  paidDate?: string | Date;
  status: TransactionStatus;
  notes?: string;
  createdBy?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date;
  parties: TransactionParty[];
  // Relations to payment configuration
  paymentConfig?: PaymentConfig;
  installmentPlan?: InstallmentPlan;
  recurrenceConfig?: RecurrenceConfigEntity;
  interestConfig?: InterestConfigEntity;
}

export interface CreateTransactionPartyPayload {
  workspaceId: string;
  partyType: TransactionActorType;
  partyMetadata?: Record<string, any>;
}

export interface CreateTransactionPayload {
  sourceType: TransactionSourceType;
  sourceId: string;
  sourceMetadata?: Record<string, any>;
  amount: number;
  description: string;
  dueDate: Date;
  paidDate?: Date;
  notes?: string;
  paymentConfig: PaymentConfig; // Now required
  parties: CreateTransactionPartyPayload[];
}

export interface UpdateTransactionPayload {
  status?: TransactionStatus;
  paidDate?: Date;
  notes?: string;
}

export interface GetTransactionsFilters {
  sourceType?: TransactionSourceType;
  status?: TransactionStatus;
  partyType?: TransactionActorType;
  fromDate?: Date;
  toDate?: Date;
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetTransactionsResponse {
  data: FinanceiroTransaction[];
  total: number;
  page: number;
  limit: number;
}
