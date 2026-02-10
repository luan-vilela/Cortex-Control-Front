export enum OrderStatus {
  DRAFT = 'draft',
  OPEN = 'open',
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  WAITING_CLIENT = 'waiting_client',
  WAITING_RESOURCES = 'waiting_resources',
  COMPLETED = 'completed',
  INVOICED = 'invoiced',
  CLOSED = 'closed',
  CANCELED = 'canceled',
}

export enum OrderPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface OrderStatusTransition {
  id: string
  orderId: string
  fromStatus: OrderStatus
  toStatus: OrderStatus
  transitionedAt: string
  transitionedBy: string
  reason?: string
  metadata?: Record<string, any>
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
  invoicedAt?: string
  closedAt?: string
  canceledAt?: string
  statusHistory: OrderStatusTransition[]
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
