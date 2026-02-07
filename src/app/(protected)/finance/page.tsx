"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useActiveWorkspace } from "@/modules/workspace/hooks/useActiveWorkspace";
import { useBreadcrumb } from "@/modules/workspace/hooks";
import {
  useTransactions,
  useDeleteTransaction,
} from "@/modules/finance/hooks/useFinance";
import {
  TransactionSourceType,
  TransactionStatus,
  TransactionActorType,
  GetTransactionsFilters,
  FinanceiroTransaction,
} from "@/modules/finance/types";
import { ModuleGuard } from "@/modules/workspace/components/ModuleGuard";
import { DataTable, Column, RowAction } from "@/components/DataTable";
import { PageHeader } from "@/components/patterns";
import { Plus, Trash2, Eye } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { SourceBadge } from "@/modules/finance/components/SourceBadge";
import { StatusBadge } from "@/modules/finance/components/StatusBadge";
import { ActorTypeBadge } from "@/modules/finance/components/ActorTypeBadge";
import { Button } from "@/components/ui/button";

export default function FinanceiroPage() {
  const router = useRouter();
  const { activeWorkspace } = useActiveWorkspace();

  useBreadcrumb([
    {
      label: "Finanças",
      href: "/finance",
    },
  ]);

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

  const [showFilters, setShowFilters] = useState(false);
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

  if (!activeWorkspace?.id) {
    return (
      <div className="text-center py-12">
        <p className="text-gh-text-secondary">Workspace não disponível</p>
      </div>
    );
  }

  // Definir colunas
  const columns: Column[] = [
    {
      key: "partyType",
      label: "Tipo",
      render: (_, row) => {
        if (row.parties && row.parties.length > 0) {
          return (
            <ActorTypeBadge
              partyType={row.parties[0].partyType}
              showIcon={true}
            />
          );
        }
        return <span className="text-xs text-gh-text-secondary">-</span>;
      },
    },
    {
      key: "description",
      label: "Descrição",
      render: (value) => (
        <p className="text-gh-text font-medium truncate">{value}</p>
      ),
    },
    {
      key: "sourceType",
      label: "Origem",
      render: (value) => <SourceBadge sourceType={value} showIcon={true} />,
    },
    {
      key: "amount",
      label: "Valor",
      render: (value) => (
        <p className="text-sm font-semibold text-gh-text">
          {formatCurrency(Number(value))}
        </p>
      ),
    },
    {
      key: "dueDate",
      label: "Vencimento",
      render: (value) => (
        <span className="text-sm text-gh-text-secondary">
          {value ? formatDate(new Date(value)) : "-"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
  ];

  // Definir row actions
  const rowActions: RowAction[] = [
    {
      id: "view",
      label: "Visualizar",
      icon: <Eye className="w-4 h-4" />,
      onClick: (row) => router.push(`/finance/${row.id}`),
    },
    {
      id: "delete",
      label: "Deletar",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (row) => {
        if (confirm("Tem certeza que deseja deletar esta transação?")) {
          deleteTransaction(row.id);
        }
      },
      variant: "destructive",
    },
  ];

  return (
    <ModuleGuard moduleId="finance" workspaceId={activeWorkspace?.id}>
      <div className="space-y-6">
        <PageHeader
          title="Financeiro"
          description="Gerencie suas transações e receitas/despesas"
          action={{
            label: "Nova Transação",
            onClick: () => router.push(`/finance/new`),
            icon: <Plus className="w-4 h-4" />,
          }}
        />

        {/* Filtros */}
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="mb-4"
          >
            {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
          </Button>

          {showFilters && (
            <div className="p-4 border border-gh-border rounded-lg bg-gh-card space-y-4 mb-6">
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
                  Limpar
                </Button>
                <Button
                  onClick={handleApplyFilters}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Pesquisar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* DataTable */}
        <DataTable
          headers={columns}
          data={transactionsData.data || []}
          isLoading={isLoading}
          emptyMessage="Nenhuma transação encontrada"
          rowActions={rowActions}
          pageSize={20}
          maxPageSize={100}
        />
      </div>
    </ModuleGuard>
  );
}
