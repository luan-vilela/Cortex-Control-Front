import { OrderPriority } from '../types'

import { Badge } from '@/components/ui/badge'

interface OrderPriorityBadgeProps {
  priority: OrderPriority
}

const priorityConfig = {
  [OrderPriority.LOW]: {
    label: 'Baixa',
    variant: 'secondary' as const,
  },
  [OrderPriority.MEDIUM]: {
    label: 'Média',
    variant: 'default' as const,
  },
  [OrderPriority.HIGH]: {
    label: 'Alta',
    variant: 'destructive' as const,
  },
  [OrderPriority.URGENT]: {
    label: 'Urgente',
    variant: 'destructive' as const,
  },
}

export function OrderPriorityBadge({ priority }: OrderPriorityBadgeProps) {
  const config = priorityConfig[priority]

  return <Badge variant={config.variant}>{config.label}</Badge>
}
