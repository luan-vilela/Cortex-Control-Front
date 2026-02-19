'use client'

import { Badge } from '@/components/ui/badge'
import { EVENT_TYPE_LABELS, EVENT_TYPE_COLORS, type AgendaEventType } from '../types'

interface EventTypeBadgeProps {
  type: AgendaEventType
  className?: string
}

export function EventTypeBadge({ type, className }: EventTypeBadgeProps) {
  const color = EVENT_TYPE_COLORS[type]

  return (
    <Badge
      variant="outline"
      className={className}
      style={{ borderColor: color, color }}
    >
      {EVENT_TYPE_LABELS[type]}
    </Badge>
  )
}
