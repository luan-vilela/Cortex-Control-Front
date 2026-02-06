"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useActiveWorkspace } from "@/modules/workspace/hooks/useActiveWorkspace";
import {
  useTransactions,
  useDeleteTransaction,
} from "@/modules/finance/hooks/useFinance";
import { TransactionList } from "@/modules/finance/components";
import {
  TransactionSourceType,
  TransactionStatus,
  TransactionActorType,
  GetTransactionsFilters,
} from "@/modules/finance/types";
import { ModuleGuard } from "@/modules/workspace/components/ModuleGuard";
import { Button } from "@/components/ui/Button";
import { Plus, Filter } from "lucide-react";

export default function FinanceiroPage() {
  const router = useRouter();
  const { activeWorkspace } = useActiveWorkspace();
  const [showFilters, setShowFilters] = useState(false);

  // Get current month boundaries
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const getDefaultFilters = (): GetTransactionsFilters => ({
    page: 1,
    limit: 20,
    fromDate: firstDayOfMonth,
    toDate: lastDayOfMonth,
  });

  const [pendingFilters, setPendingFilters] =
    useState<GetTransactionsFilters>(getDefaultFilters());
  const [filters, setFilters] =
    useState<GetTransactionsFilters>(getDefaultFilters());

  const {
    data: transactionsData = { data: [], total: 0, page: 1, limit: 20 },
    isLoading,
  } = useTransactions(
    activeWorkspace?.id || "",
    filters,
    !!activeWorkspace?.id,
  );

  const { mutate: deleteTransaction } = useDeleteTransaction(
    activeWorkspace?.id || "",
  );

  const handleApplyFilters = () => {
    setFilters({ ...pendingFilters, page: 1 });
  };

  const handleResetFilters = () => {
    const defaultFilters = getDefaultFilters();
    setPendingFilters(defaultFilters);
    setFilters(defaultFilters);
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  if (!activeWorkspace?.id) {
    return (
      <div className="text-center py-12">
        <p className="text-gh-text-secondary">Workspace não disponível</p>
      </div>
    );
  }

  return (
    <ModuleGuard moduleId="finance" workspaceId={activeWorkspace?.id}>
      <div className="min-h-screen bg-gradient-to-br from-gh-bg via-gh-bg to-gh-hover p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gh-text">Financeiro</h1>
              <p className="text-gh-text-secondary mt-1">
                Gerencie suas transações e receitas/despesas
              </p>
            </div>
            <Button
              onClick={() => router.push(`/finance/new`)}
              className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus size={16} />
              Nova Transação
            </Button>
          </div>

          {/* Filtros */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter size={16} />
                Filtros
              </Button>
            </div>

            {transactionsData.total > 0 && (
              <div className="text-sm text-gh-text-secondary">
                {transactionsData.data.length} de {transactionsData.total}{" "}
                transações
              </div>
            )}
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mb-6 p-4 border border-gh-border rounded-lg bg-gh-card space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Source Type Filter */}
                <div>
                  <label className="text-xs font-medium text-gh-text-secondary block mb-2">
                    Tipo de Origem
                  </label>
                  <select
                    value={pendingFilters.sourceType || ""}
                    onChange={(e) =>
                      setPendingFilters({
                        ...pendingFilters,
                        sourceType: e.target.value as TransactionSourceType,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gh-border rounded bg-white dark:bg-gh-bg text-gh-text"
                  >
                    <option value="">Todos</option>
                    <option value={TransactionSourceType.MANUAL}>Manual</option>
                    <option value={TransactionSourceType.SERVICE_ORDER}>
                      Ordem de Serviço
                    </option>
                    <option value={TransactionSourceType.PURCHASE_ORDER}>
                      Pedido de Compra
                    </option>
                    <option value={TransactionSourceType.INVOICE}>
                      Nota Fiscal
                    </option>
                  </select>
                </div>

                {/* Party Type Filter */}
                <div>
                  <label className="text-xs font-medium text-gh-text-secondary block mb-2">
                    Tipo de Transação
                  </label>
                  <select
                    value={pendingFilters.partyType || ""}
                    onChange={(e) =>
                      setPendingFilters({
                        ...pendingFilters,
                        partyType: e.target.value as TransactionActorType,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gh-border rounded bg-white dark:bg-gh-bg text-gh-text"
                  >
                    <option value="">Todos</option>
                    <option value={TransactionActorType.INCOME}>Entrada</option>
                    <option value={TransactionActorType.EXPENSE}>Saída</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="text-xs font-medium text-gh-text-secondary block mb-2">
                    Status
                  </label>
                  <select
                    value={pendingFilters.status || ""}
                    onChange={(e) =>
                      setPendingFilters({
                        ...pendingFilters,
                        status: e.target.value as TransactionStatus,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gh-border rounded bg-white dark:bg-gh-bg text-gh-text"
                  >
                    <option value="">Todos</option>
                    <option value={TransactionStatus.PENDING}>Pendente</option>
                    <option value={TransactionStatus.PAID}>Pago</option>
                    <option value={TransactionStatus.PARTIALLY_PAID}>
                      Parcialmente Pago
                    </option>
                    <option value={TransactionStatus.CANCELLED}>
                      Cancelado
                    </option>
                  </select>
                </div>

                {/* From Date */}
                <div>
                  <label className="text-xs font-medium text-gh-text-secondary block mb-2">
                    De
                  </label>
                  <input
                    type="date"
                    value={
                      pendingFilters.fromDate
                        ? new Date(pendingFilters.fromDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setPendingFilters({
                        ...pendingFilters,
                        fromDate: e.target.value
                          ? new Date(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gh-border rounded bg-white dark:bg-gh-bg text-gh-text"
                  />
                </div>

                {/* To Date */}
                <div>
                  <label className="text-xs font-medium text-gh-text-secondary block mb-2">
                    Até
                  </label>
                  <input
                    type="date"
                    value={
                      pendingFilters.toDate
                        ? new Date(pendingFilters.toDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      setPendingFilters({
                        ...pendingFilters,
                        toDate: e.target.value
                          ? new Date(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-gh-border rounded bg-white dark:bg-gh-bg text-gh-text"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                >
                  Limpar Filtros
                </Button>
                <Button
                  onClick={handleApplyFilters}
                  className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
                >
                  <Filter size={16} />
                  Pesquisar
                </Button>
              </div>
            </div>
          )}

          {/* Transactions List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <TransactionList
              transactions={transactionsData.data}
              workspaceId={activeWorkspace.id}
              isLoading={isLoading}
              onDelete={(transactionId) =>
                deleteTransaction(transactionId, {
                  onSuccess: () => {
                    // A query será invalidada automaticamente
                  },
                })
              }
            />
          </div>

          {/* Pagination */}
          {transactionsData.total > transactionsData.limit && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page === 1}
                onClick={() =>
                  handlePageChange(Math.max(1, (filters.page || 1) - 1))
                }
              >
                Anterior
              </Button>

              <span className="text-sm text-gh-text-secondary">
                Página {filters.page || 1}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={
                  (filters.page || 1) >=
                  Math.ceil(transactionsData.total / transactionsData.limit)
                }
                onClick={() => handlePageChange((filters.page || 1) + 1)}
              >
                Próxima
              </Button>
            </div>
          )}
        </div>
      </div>
    </ModuleGuard>
  );
}
