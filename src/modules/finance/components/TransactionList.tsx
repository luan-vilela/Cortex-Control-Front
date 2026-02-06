"use client";

import { FinanceiroTransaction } from "../types";
import { SourceBadge } from "./SourceBadge";
import { StatusBadge } from "./StatusBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";

export function TransactionList({
  transactions,
  workspaceId,
  isLoading = false,
}: {
  transactions: FinanceiroTransaction[];
  workspaceId: string;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-16 bg-gh-card border border-gh-border rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gh-text-secondary text-sm">
          Nenhuma transação encontrada
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <Link
          key={transaction.id}
          href={`/finance/${transaction.id}`}
          className="block p-4 border border-gh-border rounded-lg bg-gh-card hover:bg-gh-hover transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <SourceBadge
                  sourceType={transaction.sourceType}
                  showIcon={true}
                />
                <span className="text-xs text-gh-text-secondary">
                  #{transaction.id}
                </span>
              </div>
              <p className="text-sm font-medium text-gh-text truncate">
                {transaction.description}
              </p>
              <p className="text-xs text-gh-text-secondary mt-1">
                Vencimento: {formatDate(new Date(transaction.dueDate))}
              </p>
              {transaction.sourceMetadata?.orderNumber && (
                <p className="text-xs text-gh-text-secondary">
                  {transaction.sourceMetadata.orderNumber}
                </p>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="text-right">
                <p className="text-sm font-semibold text-gh-text">
                  {formatCurrency(Number(transaction.amount))}
                </p>
              </div>
              <StatusBadge status={transaction.status} showIcon={true} />
            </div>
          </div>

          {transaction.actors && transaction.actors.length > 1 && (
            <div className="mt-3 pt-3 border-t border-gh-border">
              <p className="text-xs text-gh-text-secondary">
                {transaction.actors.length} atores envolvidos
              </p>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
