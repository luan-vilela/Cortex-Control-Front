'use client'

import { FinanceiroTransaction, TransactionActorType } from '../types'

import { formatCurrency, formatDate } from '@/lib/utils'

import { SourceBadge } from './SourceBadge'
import { StatusBadge } from './StatusBadge'

const partyTypeLabels: Record<TransactionActorType, string> = {
  [TransactionActorType.INCOME]: 'Entrada',
  [TransactionActorType.EXPENSE]: 'Saída',
}

export function TransactionDetail({ transaction }: { transaction: FinanceiroTransaction }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-gh-text text-2xl font-bold">{transaction.description}</h1>
          <p className="text-gh-text-secondary mt-1 text-sm">Transação #{transaction.id}</p>
        </div>
        <div className="text-right">
          <p className="text-gh-text text-3xl font-bold">
            {formatCurrency(Number(transaction.amount))}
          </p>
          <div className="mt-2">
            <StatusBadge status={transaction.status} showIcon={true} />
          </div>
        </div>
      </div>

      {/* Main Info */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="border-gh-border bg-gh-card rounded-lg border p-4">
          <p className="text-gh-text-secondary mb-2 text-xs font-medium uppercase">Origem</p>
          <div className="mb-3">
            <SourceBadge sourceType={transaction.sourceType} showIcon={true} />
          </div>
          <p className="text-gh-text text-sm">
            <span className="font-medium">ID:</span> {transaction.sourceId}
          </p>
          {transaction.sourceMetadata?.orderNumber && (
            <p className="text-gh-text mt-2 text-sm">
              <span className="font-medium">Número:</span> {transaction.sourceMetadata.orderNumber}
            </p>
          )}
        </div>

        <div className="border-gh-border bg-gh-card rounded-lg border p-4">
          <p className="text-gh-text-secondary mb-3 text-xs font-medium uppercase">Datas</p>
          <div className="space-y-2">
            <p className="text-gh-text text-sm">
              <span className="font-medium">Vencimento:</span>{' '}
              {formatDate(new Date(transaction.dueDate))}
            </p>
            {transaction.paidDate && (
              <p className="text-gh-text text-sm">
                <span className="font-medium">Pagamento:</span>{' '}
                {formatDate(new Date(transaction.paidDate))}
              </p>
            )}
            <p className="text-gh-text-secondary mt-3 text-xs">
              Criado em {formatDate(new Date(transaction.createdAt))}
            </p>
          </div>
        </div>
      </div>

      {/* Parties */}
      <div className="border-gh-border bg-gh-card rounded-lg border p-4">
        <p className="text-gh-text-secondary mb-4 text-xs font-medium uppercase">
          Envolvidos ({transaction.parties.length})
        </p>
        <div className="space-y-3">
          {transaction.parties.map((party) => (
            <div
              key={party.id}
              className="border-gh-border dark:bg-gh-card flex items-center justify-between rounded border bg-white p-3"
            >
              <div>
                <p className="text-gh-text text-sm font-medium">
                  {party.partyMetadata?.name || 'Sistema'}
                </p>
                <p className="text-gh-text-secondary mt-1 text-xs">
                  {partyTypeLabels[party.partyType]}
                </p>
              </div>
              {party.partyStatus && (
                <div className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-700">
                  {party.partyStatus}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Notas */}
      {transaction.notes && (
        <div className="border-gh-border bg-gh-card rounded-lg border p-4">
          <p className="text-gh-text-secondary mb-3 text-xs font-medium uppercase">Notas</p>
          <p className="text-gh-text text-sm whitespace-pre-wrap">{transaction.notes}</p>
        </div>
      )}
    </div>
  )
}
