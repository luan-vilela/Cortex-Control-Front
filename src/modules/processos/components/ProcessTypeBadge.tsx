import { ProcessType } from '../types'

import { Badge } from '@/components/ui/badge'

interface ProcessTypeBadgeProps {
  type: ProcessType
}

const typeConfig: Record<ProcessType, { label: string }> = {
  [ProcessType.ATENDIMENTO]: { label: 'Atendimento' },
  [ProcessType.FINANCEIRO]: { label: 'Financeiro' },
  [ProcessType.ESTOQUE]: { label: 'Estoque' },
  [ProcessType.FORNECEDOR]: { label: 'Fornecedor' },
  [ProcessType.LOGISTICA]: { label: 'Logística' },
  [ProcessType.JURIDICO]: { label: 'Jurídico' },
  [ProcessType.RH]: { label: 'RH' },
  [ProcessType.OUTRO]: { label: 'Outro' },
}

export function ProcessTypeBadge({ type }: ProcessTypeBadgeProps) {
  const config = typeConfig[type || ProcessType.OUTRO]

  return <Badge variant="outline">{config?.label}</Badge>
}
