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

export interface TransactionActor {
  id: number;
  transactionId: number;
  workspaceId: string;
  actorType: TransactionActorType;
  actorStatus?: string;
  actorMetadata?: Record<string, any>;
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
  actors: TransactionActor[];
}

export interface CreateTransactionActorPayload {
  workspaceId: string;
  actorType: TransactionActorType;
  actorMetadata?: Record<string, any>;
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
  actors: CreateTransactionActorPayload[];
}

export interface UpdateTransactionPayload {
  status?: TransactionStatus;
  paidDate?: Date;
  notes?: string;
}

export interface GetTransactionsFilters {
  sourceType?: TransactionSourceType;
  status?: TransactionStatus;
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  limit?: number;
}

export interface GetTransactionsResponse {
  data: FinanceiroTransaction[];
  total: number;
  page: number;
  limit: number;
}
