export enum OrderStatus {
  DRAFT = 'DRAFT',
  OPEN = 'OPEN',
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  WAITING_CLIENT = 'WAITING_CLIENT',
  WAITING_RESOURCES = 'WAITING_RESOURCES',
  COMPLETED = 'COMPLETED',
  INVOICED = 'INVOICED',
  CLOSED = 'CLOSED',
  CANCELED = 'CANCELED',
}

export enum OrderPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum OrderType {
  OS = 'OS', // Ordem de Serviço
  CH = 'CH', // Chamado
  OT = 'OT', // Ordem de Trabalho
  PV = 'PV', // Proposta / Orçamento
  CT = 'CT', // Contrato
  IN = 'IN', // Inspeção / Vistoria
  MA = 'MA', // Manutenção
  TR = 'TR', // Treinamento
  GT = 'GT', // Garantia
  AG = 'AG', // Agendamento
  RC = 'RC', // Reclamação
  SV = 'SV', // Serviço Avulso
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
  orderNumber: string
  orderType: OrderType
  title: string
  description?: string
  approvedValue: number
  totalValue?: number
  isBillable?: boolean
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
  orderType?: OrderType
  title: string
  description?: string
  approvedValue?: number
  totalValue?: number
  isBillable?: boolean
  priority: OrderPriority
  clientId: string
  assignedToId?: string
  dueDate?: string
}

export interface UpdateOrderPayload {
  orderType?: OrderType
  title?: string
  description?: string
  approvedValue?: number
  totalValue?: number
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
