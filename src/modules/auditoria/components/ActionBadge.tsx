import { AuditAction } from '../types'

import { Badge } from '@/components/ui/badge'

interface ActionBadgeProps {
  action: AuditAction
}

export function ActionBadge({ action }: ActionBadgeProps) {
  const variants = {
    [AuditAction.CREATE]: { label: 'Criado', variant: 'default' as const },
    [AuditAction.UPDATE]: { label: 'Atualizado', variant: 'secondary' as const },
    [AuditAction.DELETE]: { label: 'Deletado', variant: 'destructive' as const },
    [AuditAction.STATUS_CHANGE]: { label: 'Status', variant: 'outline' as const },
  }

  const { label, variant } = variants[action] || {
    label: action,
    variant: 'default' as const,
  }

  return <Badge variant={variant}>{label}</Badge>
}
