'use client'

import { TransactionActorType } from '../types'

import { ArrowDownLeft, ArrowUpRight } from 'lucide-react'

interface ActorTypeBadgeProps {
  partyType: TransactionActorType
  showIcon?: boolean
}

export function ActorTypeBadge({ partyType, showIcon = false }: ActorTypeBadgeProps) {
  const isIncome = partyType === TransactionActorType.INCOME

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
        isIncome ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
      }`}
    >
      {showIcon &&
        (isIncome ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownLeft className="h-3 w-3" />)}
      {isIncome ? 'Entrada' : 'Saída'}
    </div>
  )
}
