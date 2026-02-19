'use client'

import { Badge } from '@/components/ui/badge'
import { EVENT_STATUS_LABELS, AgendaEventStatus, type AgendaEventStatus as AgendaEventStatusType } from '../types'

interface EventStatusBadgeProps {
  status: AgendaEventStatusType
  className?: string
}

export function EventStatusBadge({ status, className }: EventStatusBadgeProps) {
  const variant =
    status === AgendaEventStatus.CONCLUIDO
      ? 'default'
      : status === AgendaEventStatus.CANCELADO
        ? 'destructive'
        : 'secondary'

  return (
    <Badge variant={variant} className={className}>
      {EVENT_STATUS_LABELS[status]}
    </Badge>
  )
}
