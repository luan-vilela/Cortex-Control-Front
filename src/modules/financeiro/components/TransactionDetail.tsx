"use client";

import { FinanceiroTransaction, TransactionActorType } from "../types";
import { SourceBadge } from "./SourceBadge";
import { StatusBadge } from "./StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";

const partyTypeLabels: Record<TransactionActorType, string> = {
  [TransactionActorType.INCOME]: "Entrada",
  [TransactionActorType.EXPENSE]: "Saída",
};

export function TransactionDetail({
  transaction,
}: {
  transaction: FinanceiroTransaction;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gh-text">
            {transaction.description}
          </h1>
          <p className="text-sm text-gh-text-secondary mt-1">
            Transação #{transaction.id}
          </p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gh-text">
            {formatCurrency(Number(transaction.amount))}
          </p>
          <div className="mt-2">
            <StatusBadge status={transaction.status} showIcon={true} />
          </div>
        </div>
      </div>

      {/* Main Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border border-gh-border rounded-lg bg-gh-card">
          <p className="text-xs font-medium text-gh-text-secondary uppercase mb-2">
            Origem
          </p>
          <div className="mb-3">
            <SourceBadge sourceType={transaction.sourceType} showIcon={true} />
          </div>
          <p className="text-sm text-gh-text">
            <span className="font-medium">ID:</span> {transaction.sourceId}
          </p>
          {transaction.sourceMetadata?.orderNumber && (
            <p className="text-sm text-gh-text mt-2">
              <span className="font-medium">Número:</span>{" "}
              {transaction.sourceMetadata.orderNumber}
            </p>
          )}
        </div>

        <div className="p-4 border border-gh-border rounded-lg bg-gh-card">
          <p className="text-xs font-medium text-gh-text-secondary uppercase mb-3">
            Datas
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gh-text">
              <span className="font-medium">Vencimento:</span>{" "}
              {formatDate(new Date(transaction.dueDate))}
            </p>
            {transaction.paidDate && (
              <p className="text-sm text-gh-text">
                <span className="font-medium">Pagamento:</span>{" "}
                {formatDate(new Date(transaction.paidDate))}
              </p>
            )}
            <p className="text-xs text-gh-text-secondary mt-3">
              Criado em {formatDate(new Date(transaction.createdAt))}
            </p>
          </div>
        </div>
      </div>

      {/* Parties */}
      <div className="p-4 border border-gh-border rounded-lg bg-gh-card">
        <p className="text-xs font-medium text-gh-text-secondary uppercase mb-4">
          Envolvidos ({transaction.parties.length})
        </p>
        <div className="space-y-3">
          {transaction.parties.map((party) => (
            <div
              key={party.id}
              className="flex items-center justify-between p-3 border border-gh-border rounded bg-white dark:bg-gh-card"
            >
              <div>
                <p className="text-sm font-medium text-gh-text">
                  {party.partyMetadata?.name || 'Sistema'}
                </p>
                <p className="text-xs text-gh-text-secondary mt-1">
                  {partyTypeLabels[party.partyType]}
                </p>
              </div>
              {party.partyStatus && (
                <div className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                  {party.partyStatus}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Notas */}
      {transaction.notes && (
        <div className="p-4 border border-gh-border rounded-lg bg-gh-card">
          <p className="text-xs font-medium text-gh-text-secondary uppercase mb-3">
            Notas
          </p>
          <p className="text-sm text-gh-text whitespace-pre-wrap">
            {transaction.notes}
          </p>
        </div>
      )}
    </div>
  );
}
