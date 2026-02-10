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
  [OrderStatus.IN_PROGRESS]: {
    label: 'Em Andamento',
    variant: 'default' as const,
  },
  [OrderStatus.COMPLETED]: {
    label: 'Concluída',
    variant: 'default' as const,
  },
  [OrderStatus.CANCELLED]: {
    label: 'Cancelada',
    variant: 'destructive' as const,
  },
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status]

  return <Badge variant={config.variant}>{config.label}</Badge>
}
