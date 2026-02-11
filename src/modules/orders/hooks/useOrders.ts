import { ordersService } from '../orders.service'
import {
  type CreateOrderPayload,
  type GetOrdersFilters,
  type GetOrdersResponse,
  type Order,
  type UpdateOrderPayload,
} from '../types'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAlerts } from '@/contexts/AlertContext'

// Query key factory
export const ordersQueryKeys = {
  all: ['orders'],
  orders: () => [...ordersQueryKeys.all, 'orders'],
  order: (workspaceId: string, orderId: string) => [
    ...ordersQueryKeys.orders(),
    workspaceId,
    orderId,
  ],
  orderList: (workspaceId: string, filters?: GetOrdersFilters) => [
    ...ordersQueryKeys.orders(),
    workspaceId,
    filters,
  ],
}

/**
 * Hook para listar ordens de serviço
 */
export function useOrders(workspaceId: string, filters?: GetOrdersFilters, enabled = true) {
  return useQuery<GetOrdersResponse>({
    queryKey: ordersQueryKeys.orderList(workspaceId, filters),
    queryFn: () => ordersService.getOrders(workspaceId, filters),
    enabled: enabled && !!workspaceId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

/**
 * Hook para obter detalhes de uma ordem de serviço
 */
export function useOrder(workspaceId: string, orderId: string, enabled = true) {
  return useQuery<Order>({
    queryKey: ordersQueryKeys.order(workspaceId, orderId),
    queryFn: () => ordersService.getOrder(workspaceId, orderId),
    enabled: enabled && !!workspaceId && !!orderId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

/**
 * Hook para criar uma nova ordem de serviço
 */
export function useCreateOrder() {
  const queryClient = useQueryClient()
  const { addAlert } = useAlerts()

  return useMutation({
    mutationFn: ({ workspaceId, payload }: { workspaceId: string; payload: CreateOrderPayload }) =>
      ordersService.createOrder(workspaceId, payload),
    onSuccess: (data, { workspaceId }) => {
      // Invalidate queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.orderList(workspaceId),
      })

      addAlert('success', 'Ordem criada com sucesso.', 'Ordem criada')
    },
    onError: (error: any) => {
      addAlert(
        'error',
        error?.response?.data?.message || 'Ocorreu um erro ao criar a ordem.',
        'Erro ao criar ordem'
      )
    },
  })
}

/**
 * Hook para atualizar uma ordem de serviço
 */
export function useUpdateOrder() {
  const queryClient = useQueryClient()
  const { addAlert } = useAlerts()

  return useMutation({
    mutationFn: ({
      workspaceId,
      orderId,
      payload,
    }: {
      workspaceId: string
      orderId: string
      payload: UpdateOrderPayload
    }) => ordersService.updateOrder(workspaceId, orderId, payload),
    onSuccess: (data, { workspaceId, orderId }) => {
      // Invalidate queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.orderList(workspaceId),
      })
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.order(workspaceId, orderId),
      })

      addAlert('success', 'Ordem atualizada com sucesso.', 'Ordem atualizada')
    },
    onError: (error: any) => {
      addAlert(
        'error',
        error?.response?.data?.message || 'Ocorreu um erro ao atualizar a ordem.',
        'Erro ao atualizar ordem'
      )
    },
  })
}

/**
 * Hook para excluir uma ordem de serviço
 */
export function useDeleteOrder() {
  const queryClient = useQueryClient()
  const { addAlert } = useAlerts()

  return useMutation({
    mutationFn: ({ workspaceId, orderId }: { workspaceId: string; orderId: string }) =>
      ordersService.deleteOrder(workspaceId, orderId),
    onSuccess: (_, { workspaceId }) => {
      // Invalidate queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ordersQueryKeys.orderList(workspaceId),
      })

      addAlert('success', 'Ordem excluída com sucesso.', 'Ordem excluída')
    },
    onError: (error: any) => {
      addAlert(
        'error',
        error?.response?.data?.message || 'Ocorreu um erro ao excluir a ordem.',
        'Erro ao excluir ordem'
      )
    },
  })
}
