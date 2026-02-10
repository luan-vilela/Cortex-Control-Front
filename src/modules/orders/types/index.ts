export enum OrderStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum OrderPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface Order {
  id: string
  title: string
  description?: string
  value: number
  status: OrderStatus
  priority: OrderPriority
  clientId: string
  client?: {
    id: string
    name: string
    email?: string
    phone?: string
  }
  assignedToId?: string
  assignedTo?: {
    id: string
    name: string
    email?: string
  }
  dueDate?: string
  completedAt?: string
  createdAt: string
  updatedAt: string
  workspaceId: string
}

export interface CreateOrderPayload {
  title: string
  description?: string
  value: number
  priority: OrderPriority
  clientId: string
  assignedToId?: string
  dueDate?: string
}

export interface UpdateOrderPayload {
  title?: string
  description?: string
  value?: number
  status?: OrderStatus
  priority?: OrderPriority
  assignedToId?: string
  dueDate?: string
}

export interface GetOrdersFilters {
  status?: OrderStatus
  priority?: OrderPriority
  clientId?: string
  assignedToId?: string
  fromDate?: Date
  toDate?: Date
  page?: number
  limit?: number
}

export interface GetOrdersResponse {
  data: Order[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
