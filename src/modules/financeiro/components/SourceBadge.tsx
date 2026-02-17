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
  [TransactionSourceType.PROCESS]: {
    label: 'Processo',
    bgColor: 'bg-cyan-100',
    textColor: 'text-cyan-700',
    icon: '⚙️',
  },
  [TransactionSourceType.ORDER]: {
    label: 'Pedido',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700',
    icon: '📋',
  },
  [TransactionSourceType.CONTRACT]: {
    label: 'Contrato',
    bgColor: 'bg-teal-100',
    textColor: 'text-teal-700',
    icon: '📑',
  },
  [TransactionSourceType.EXPENSE]: {
    label: 'Despesa',
    bgColor: 'bg-rose-100',
    textColor: 'text-rose-700',
    icon: '💸',
  },
}

export function SourceBadge({
  sourceType,
  showIcon = false,
}: {
  sourceType: TransactionSourceType
  showIcon?: boolean
}) {
  if (!sourceType) {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
        <span>-</span>
      </div>
    )
  }

  const config = sourceTypeConfig[sourceType] || {
    label: sourceType,
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    icon: '❓',
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.bgColor} ${config.textColor}`}
    >
      {showIcon && <span>{config.icon}</span>}
      <span>{config.label}</span>
    </div>
  )
}
