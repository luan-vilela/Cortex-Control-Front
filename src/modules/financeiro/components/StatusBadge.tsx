'use client'

import { TransactionStatus } from '../types'

const statusConfig: Record<
  TransactionStatus,
  { label: string; bgColor: string; textColor: string; icon: string }
> = {
  [TransactionStatus.PENDING]: {
    label: 'Pendente',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
    icon: '⏳',
  },
  [TransactionStatus.OVERDUE]: {
    label: 'Vencido',
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    icon: '⚠️',
  },
  [TransactionStatus.PAID]: {
    label: 'Pago',
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    icon: '✅',
  },
  [TransactionStatus.CANCELED]: {
    label: 'Cancelado',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-700',
    icon: '❌',
  },
}

export function StatusBadge({
  status,
  showIcon = false,
}: {
  status: TransactionStatus
  showIcon?: boolean
}) {
  if (!status) {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
        <span>-</span>
      </div>
    )
  }

  const config = statusConfig[status] || {
    label: status,
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
