export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum TransactionCategory {
  SALES = 'SALES',
  SERVICES = 'SERVICES',
  INVESTMENTS = 'INVESTMENTS',
  SALARY = 'SALARY',
  UTILITIES = 'UTILITIES',
  SUPPLIES = 'SUPPLIES',
  RENT = 'RENT',
  MAINTENANCE = 'MAINTENANCE',
  ORDER_SERVICE_OPENING = 'ORDER_SERVICE_OPENING',
  OTHER = 'OTHER',
}

export interface CreateTransactionDto {
  type: TransactionType
  category: TransactionCategory
  amount: number
  description: string
  date: string
  paymentMethod?: string
  reference?: string
}

export interface TransactionResponseDto extends CreateTransactionDto {
  id: string
  workspaceId: string
  createdAt: string
  updatedAt: string
}
