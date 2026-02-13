'use client'

import { type FinanceiroTransaction } from '../types'

import { Eye, Trash2 } from 'lucide-react'
import Link from 'next/link'

import { formatCurrency, formatDate } from '@/lib/utils'

import { ActorTypeBadge } from './ActorTypeBadge'
import { SourceBadge } from './SourceBadge'
import { StatusBadge } from './StatusBadge'

export function TransactionList({
  transactions,
  workspaceId,
  isLoading = false,
  onDelete,
}: {
  transactions: FinanceiroTransaction[]
  workspaceId: string
  isLoading?: boolean
  onDelete?: (id: number) => void
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="border-gh-hover h-12 w-12 animate-spin rounded-full border-b-2"></div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gh-text-secondary text-sm">Nenhuma transação encontrada</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="divide-gh-border min-w-full divide-y">
        <thead className="bg-gh-bg">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Transação
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Descrição
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Valor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Vencimento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-gh-border divide-y bg-white">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gh-bg transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                {transaction.parties && transaction.parties.length > 0 ? (
                  <ActorTypeBadge partyType={transaction.parties[0].partyType} showIcon={true} />
                ) : (
                  <span className="text-gh-text-secondary text-xs">-</span>
                )}
              </td>
              <td className="px-6 py-4 text-sm whitespace-nowrap">
                <p className="text-gh-text truncate font-medium">{transaction.description}</p>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <SourceBadge sourceType={transaction.sourceType} showIcon={true} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <p className="text-gh-text text-sm font-semibold">
                  {formatCurrency(Number(transaction.amount))}
                </p>
              </td>
              <td className="text-gh-text-secondary px-6 py-4 text-sm whitespace-nowrap">
                {formatDate(new Date(transaction.dueDate))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={transaction.status} showIcon={true} />
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/finance/${transaction.id}`}
                    className="inline-flex items-center gap-1 rounded px-3 py-1 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-800"
                  >
                    <Eye className="h-4 w-4" />
                    Ver
                  </Link>
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        if (confirm('Tem certeza que deseja deletar esta transação?')) {
                          onDelete(transaction.id)
                        }
                      }}
                      className="inline-flex items-center gap-1 rounded px-3 py-1 text-red-600 transition-colors hover:bg-red-50 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                      Deletar
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
