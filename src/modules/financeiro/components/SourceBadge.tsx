'use client'

import { TransactionSourceType } from '../types'

const sourceTypeConfig: Record<
  TransactionSourceType,
  { label: string; bgColor: string; textColor: string; icon: string }
> = {
  [TransactionSourceType.SERVICE_ORDER]: {
    label: 'Ordem de Serviço',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    icon: '🔧',
  },
  [TransactionSourceType.PURCHASE_ORDER]: {
    label: 'Pedido de Compra',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-700',
    icon: '📦',
  },
  [TransactionSourceType.INVOICE]: {
    label: 'Nota Fiscal',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    icon: '📄',
  },
  [TransactionSourceType.MANUAL]: {
    label: 'Manual',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    icon: '✏️',
  },
}

export function SourceBadge({
  sourceType,
  showIcon = false,
}: {
  sourceType: TransactionSourceType
  showIcon?: boolean
}) {
  const config = sourceTypeConfig[sourceType]

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.bgColor} ${config.textColor}`}
    >
      {showIcon && <span>{config.icon}</span>}
      <span>{config.label}</span>
    </div>
  )
}
