import { ordersService } from '../orders.service'
import { validateStatusTransition } from '../services/order-status.service'
import { OrderStatus } from '../types'

import { useState } from 'react'

import { useMutation, useQueryClient } from '@tanstack/react-query'

interface UseOrderStatusTransitionProps {
  orderId: string
  workspaceId: string
  currentStatus: OrderStatus
  onSuccess?: (newStatus: OrderStatus) => void
  onError?: (error: Error) => void
}

export function useOrderStatusTransition({
  orderId,
  workspaceId,
  currentStatus,
  onSuccess,
  onError,
}: UseOrderStatusTransitionProps) {
  const queryClient = useQueryClient()
  const [isValidating, setIsValidating] = useState(false)

  const transitionMutation = useMutation({
    mutationFn: async ({ newStatus, reason }: { newStatus: OrderStatus; reason?: string }) => {
      // Validar transição
      setIsValidating(true)
      const isValid = validateStatusTransition(currentStatus, newStatus)

      if (!isValid) {
        throw new Error(`Transição de ${currentStatus} para ${newStatus} não é permitida`)
      }

      setIsValidating(false)

      // Executar transição
      return ordersService.updateOrder(workspaceId, orderId, {
        status: newStatus,
        // Adicionar metadata para auditoria se necessário
      })
    },
    onSuccess: (data) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ['orders', workspaceId],
      })
      queryClient.invalidateQueries({
        queryKey: ['orders', workspaceId, orderId],
      })

      // Callback de sucesso
      onSuccess?.(data.status)
    },
    onError: (error) => {
      setIsValidating(false)
      onError?.(error as Error)
    },
  })

  const canTransitionTo = (newStatus: OrderStatus): boolean => {
    return validateStatusTransition(currentStatus, newStatus)
  }

  return {
    transition: transitionMutation.mutate,
    isTransitioning: transitionMutation.isPending,
    isValidating,
    canTransitionTo,
    error: transitionMutation.error,
  }
}
