"use client";

import { FinanceiroTransaction } from "../types";
import { SourceBadge } from "./SourceBadge";
import { StatusBadge } from "./StatusBadge";
import { ActorTypeBadge } from "./ActorTypeBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Eye, Trash2 } from "lucide-react";

export function TransactionList({
  transactions,
  workspaceId,
  isLoading = false,
  onDelete,
}: {
  transactions: FinanceiroTransaction[];
  workspaceId: string;
  isLoading?: boolean;
  onDelete?: (id: number) => void;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gh-hover"></div>
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
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gh-border">
        <thead className="bg-gh-bg">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Transação
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descrição
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vencimento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gh-border">
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className="hover:bg-gh-bg transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                {transaction.parties && transaction.parties.length > 0 ? (
                  <ActorTypeBadge
                    partyType={transaction.parties[0].partyType}
                    showIcon={true}
                  />
                ) : (
                  <span className="text-xs text-gh-text-secondary">-</span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <p className="text-gh-text font-medium truncate">
                  {transaction.description}
                </p>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <SourceBadge
                  sourceType={transaction.sourceType}
                  showIcon={true}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <p className="text-sm font-semibold text-gh-text">
                  {formatCurrency(Number(transaction.amount))}
                </p>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gh-text-secondary">
                {formatDate(new Date(transaction.dueDate))}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={transaction.status} showIcon={true} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/finance/${transaction.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    Ver
                  </Link>
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          confirm(
                            "Tem certeza que deseja deletar esta transação?",
                          )
                        ) {
                          onDelete(transaction.id);
                        }
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
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
  );
}
