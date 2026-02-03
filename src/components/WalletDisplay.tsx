"use client";

import { useEffect, useState, useRef } from "react";
import { Coins, Plus, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { useWallet, useWalletTransactions } from "@/modules/wallet/hooks";
import { TransactionType } from "@/modules/wallet/types/wallet.types";

export function WalletDisplay() {
  const { data: wallet, isLoading } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const [page, setPage] = useState(1);
  const { data: transactionsData } = useWalletTransactions(page, 10);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowTransactions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      INITIAL_CREDIT: "Crédito Inicial",
      MANUAL_RECHARGE: "Recarga Manual",
      PAYMENT_RECHARGE: "Recarga por Pagamento",
      WORKSPACE_DAILY_COST: "Custo Diário do Workspace",
      MODULE_ACTIVATION: "Ativação de Módulo",
      ACTION_EXECUTION: "Execução de Ação",
      REFUND: "Reembolso",
      ADJUSTMENT: "Ajuste",
    };
    return labels[category] || category;
  };

  if (isLoading) {
    return (
      <div className="p-2">
        <div className="w-5 h-5 border-2 border-gh-border border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-gh-text hover:bg-gh-bg rounded-lg transition-colors"
        aria-label="Carteira"
      >
        <Coins className="w-5 h-5 text-yellow-600" />
        <span className="text-sm font-semibold">
          {wallet ? formatCurrency(wallet.balance) : "0,00"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gh-card rounded-lg shadow-lg border border-gh-border z-50">
          {!showTransactions ? (
            <>
              {/* Cabeçalho */}
              <div className="p-4 border-b border-gh-border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gh-text">
                    Minha Carteira
                  </h3>
                  <Coins className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="text-3xl font-bold text-gh-text">
                  {wallet ? formatCurrency(wallet.balance) : "0,00"}
                </div>
                <p className="text-sm text-gh-text-secondary mt-1">
                  créditos disponíveis
                </p>
              </div>

              {/* Ações */}
              <div className="p-4 space-y-2">
                <button
                  onClick={() => {
                    // TODO: Implementar modal de recarga
                    alert(
                      "Funcionalidade de recarga será implementada em breve!",
                    );
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Adicionar Créditos
                </button>

                <button
                  onClick={() => setShowTransactions(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gh-bg text-gh-text rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  <Clock className="w-5 h-5" />
                  Ver Histórico
                </button>
              </div>

              {/* Informações */}
              <div className="p-4 bg-blue-50 border-t border-gh-border">
                <p className="text-xs text-blue-900">
                  💡 <strong>Dica:</strong> Os créditos são usados para manter
                  workspaces ativos e executar ações.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Histórico de Transações */}
              <div className="p-4 border-b border-gh-border flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gh-text">
                  Histórico
                </h3>
                <button
                  onClick={() => setShowTransactions(false)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Voltar
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {transactionsData &&
                transactionsData.transactions.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {transactionsData.transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="p-4 hover:bg-gh-bg"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-lg flex-shrink-0 ${
                              transaction.type === TransactionType.CREDIT
                                ? "bg-green-100"
                                : "bg-red-100"
                            }`}
                          >
                            {transaction.type === TransactionType.CREDIT ? (
                              <TrendingUp className="w-5 h-5 text-green-600" />
                            ) : (
                              <TrendingDown className="w-5 h-5 text-red-600" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gh-text">
                              {getCategoryLabel(transaction.category)}
                            </p>
                            {transaction.description && (
                              <p className="text-xs text-gh-text-secondary mt-1">
                                {transaction.description}
                              </p>
                            )}
                            <p className="text-xs text-gh-text-secondary mt-1">
                              {formatDate(transaction.createdAt)}
                            </p>
                          </div>

                          <div className="text-right">
                            <p
                              className={`text-sm font-semibold ${
                                transaction.type === TransactionType.CREDIT
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.type === TransactionType.CREDIT
                                ? "+"
                                : "-"}
                              {formatCurrency(transaction.amount)}
                            </p>
                            <p className="text-xs text-gh-text-secondary mt-1">
                              Saldo: {formatCurrency(transaction.balanceAfter)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Clock className="w-12 h-12 text-gh-text-secondary mx-auto mb-3" />
                    <p className="text-gh-text-secondary">
                      Nenhuma transação encontrada
                    </p>
                  </div>
                )}

                {/* Paginação */}
                {transactionsData && transactionsData.totalPages > 1 && (
                  <div className="p-4 border-t border-gh-border flex items-center justify-between">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-3 py-1 text-sm text-gh-text bg-gh-bg rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Anterior
                    </button>
                    <span className="text-sm text-gh-text-secondary">
                      Página {page} de {transactionsData.totalPages}
                    </span>
                    <button
                      onClick={() =>
                        setPage((p) =>
                          Math.min(transactionsData.totalPages, p + 1),
                        )
                      }
                      disabled={page === transactionsData.totalPages}
                      className="px-3 py-1 text-sm text-gh-text bg-gh-bg rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Próxima
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
