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
  DEFERRED = "DEFERRED",
}

export enum RecurrenceType {
  ONCE = "ONCE",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  BIWEEKLY = "BIWEEKLY",
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  SEMIANNUAL = "SEMIANNUAL",
  ANNUAL = "ANNUAL",
}

export enum FinancialChargeType {
  INTEREST = "INTEREST",
  FINE = "FINE",
  DISCOUNT = "DISCOUNT",
  SURCHARGE = "SURCHARGE",
}

export interface FinancialCharge {
  type: FinancialChargeType;
  description: string;
  percentage: number;
  flatAmount?: number;
}

export interface RecurrenceConfig {
  type: RecurrenceType;
  occurrences?: number;
  endDate?: Date;
}

export interface PaymentConfig {
  mode: PaymentMode;
  installments?: number;
  installmentAmount?: number;
  deferralDays?: number;
}

export interface TransactionParty {
  id: number;
  transactionId: number;
  workspaceId: string;
  partyType: TransactionActorType;
  partyStatus?: string;
  partyMetadata?: Record<string, any>;
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
  paymentConfig?: PaymentConfig;
  recurrenceConfig?: RecurrenceConfig;
  financialCharges?: FinancialCharge[];
  createdBy?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  deletedAt?: string | Date;
  parties: TransactionParty[];
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
  paymentConfig?: PaymentConfig;
  recurrenceConfig?: RecurrenceConfig;
  financialCharges?: FinancialCharge[];
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
