export enum TransactionType {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
}

export enum TransactionCategory {
  INITIAL_CREDIT = "INITIAL_CREDIT",
  MANUAL_RECHARGE = "MANUAL_RECHARGE",
  PAYMENT_RECHARGE = "PAYMENT_RECHARGE",
  WORKSPACE_DAILY_COST = "WORKSPACE_DAILY_COST",
  MODULE_ACTIVATION = "MODULE_ACTIVATION",
  ACTION_EXECUTION = "ACTION_EXECUTION",
  REFUND = "REFUND",
  ADJUSTMENT = "ADJUSTMENT",
}

export interface Transaction {
  id: string;
  walletId: string;
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  balanceAfter: number;
  description: string | null;
  metadata: Record<string, any> | null;
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}

export interface RechargeWalletDto {
  amount: number;
  description?: string;
}
