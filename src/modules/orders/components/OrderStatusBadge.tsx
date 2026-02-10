import { OrderStatus } from '../types'

import { Badge } from '@/components/ui/badge'

interface OrderStatusBadgeProps {
  status: OrderStatus
}

const statusConfig = {
  [OrderStatus.DRAFT]: {
    label: 'Rascunho',
    variant: 'secondary' as const,
  },
  [OrderStatus.OPEN]: {
    label: 'Aberta',
    variant: 'default' as const,
  },
  [OrderStatus.SCHEDULED]: {
    label: 'Agendada',
    variant: 'default' as const,
  },
  [OrderStatus.IN_PROGRESS]: {
    label: 'Em Execução',
    variant: 'default' as const,
  },
  [OrderStatus.WAITING_CLIENT]: {
    label: 'Aguardando Cliente',
    variant: 'outline' as const,
  },
  [OrderStatus.WAITING_RESOURCES]: {
    label: 'Aguardando Recursos',
    variant: 'outline' as const,
  },
  [OrderStatus.COMPLETED]: {
    label: 'Concluída',
    variant: 'default' as const,
  },
  [OrderStatus.INVOICED]: {
    label: 'Faturada',
    variant: 'default' as const,
  },
  [OrderStatus.CLOSED]: {
    label: 'Encerrada',
    variant: 'secondary' as const,
  },
  [OrderStatus.CANCELED]: {
    label: 'Cancelada',
    variant: 'destructive' as const,
  },
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status || OrderStatus.DRAFT]

  return <Badge variant={config?.variant}>{config?.label}</Badge>
}
