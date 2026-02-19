import { ProcessStatus } from '../types'

import { Badge } from '@/components/ui/badge'

interface ProcessStatusBadgeProps {
  status: ProcessStatus
}

const statusConfig = {
  [ProcessStatus.ABERTO]: {
    label: 'Aberto',
    variant: 'default' as const,
  },
  [ProcessStatus.EM_ANDAMENTO]: {
    label: 'Em Andamento',
    variant: 'default' as const,
  },
  [ProcessStatus.PENDENTE]: {
    label: 'Pendente',
    variant: 'outline' as const,
  },
  [ProcessStatus.BLOQUEADO]: {
    label: 'Bloqueado',
    variant: 'destructive' as const,
  },
  [ProcessStatus.CONCLUIDO]: {
    label: 'Concluído',
    variant: 'secondary' as const,
  },
  [ProcessStatus.CANCELADO]: {
    label: 'Cancelado',
    variant: 'destructive' as const,
  },
}

export function ProcessStatusBadge({ status }: ProcessStatusBadgeProps) {
  const config = statusConfig[status || ProcessStatus.ABERTO]

  return <Badge variant={config?.variant}>{config?.label}</Badge>
}
