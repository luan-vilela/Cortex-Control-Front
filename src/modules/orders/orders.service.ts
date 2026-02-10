import api from '@/lib/api'

import {
  CreateOrderPayload,
  GetOrdersFilters,
  GetOrdersResponse,
  Order,
  UpdateOrderPayload,
} from './types'

const ORDERS_API = '/workspaces'

export const ordersService = {
  // Criar pedido
  async createOrder(workspaceId: string, data: CreateOrderPayload): Promise<Order> {
    const response = await api.post(`${ORDERS_API}/${workspaceId}/orders`, data)
    return response.data
  },

  // Listar pedidos
  async getOrders(workspaceId: string, filters?: GetOrdersFilters): Promise<GetOrdersResponse> {
    const params = new URLSearchParams()

    if (filters?.status) params.append('status', filters.status)
    if (filters?.priority) params.append('priority', filters.priority)
    if (filters?.clientId) params.append('clientId', String(filters.clientId))
    if (filters?.assignedToId) params.append('assignedToId', String(filters.assignedToId))
    if (filters?.fromDate) params.append('fromDate', filters.fromDate.toISOString().split('T')[0])
    if (filters?.toDate) params.append('toDate', filters.toDate.toISOString().split('T')[0])
    if (filters?.page) params.append('page', String(filters.page))
    if (filters?.limit) params.append('limit', String(filters.limit))

    const response = await api.get(`${ORDERS_API}/${workspaceId}/orders?${params.toString()}`)

    // A API retorna um array diretamente, mas o frontend espera { data, meta }
    const orders = response.data
    return {
      data: orders,
      meta: {
        total: orders.length,
        page: filters?.page || 1,
        limit: filters?.limit || 20,
        totalPages: Math.ceil(orders.length / (filters?.limit || 20)),
      },
    }
  },

  // Obter pedido por ID
  async getOrder(workspaceId: string, orderId: string): Promise<Order> {
    const response = await api.get(`${ORDERS_API}/${workspaceId}/orders/${orderId}`)
    return response.data
  },

  // Atualizar pedido
  async updateOrder(
    workspaceId: string,
    orderId: string,
    data: UpdateOrderPayload
  ): Promise<Order> {
    const response = await api.patch(`${ORDERS_API}/${workspaceId}/orders/${orderId}`, data)
    return response.data
  },

  // Remover pedido
  async deleteOrder(workspaceId: string, orderId: string): Promise<void> {
    await api.delete(`${ORDERS_API}/${workspaceId}/orders/${orderId}`)
  },
}
