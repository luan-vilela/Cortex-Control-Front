import api from '@/lib/api'
import { buildQueryParams } from '@/lib/utils'

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
    const queryString = buildQueryParams(filters)
    const response = await api.get(
      `${ORDERS_API}/${workspaceId}/orders${queryString ? `?${queryString}` : ''}`
    )

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
