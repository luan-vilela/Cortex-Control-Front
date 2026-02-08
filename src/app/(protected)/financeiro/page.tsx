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
} from "@/modules/finance/types";
import { ModuleGuard } from "@/modules/workspace/components/ModuleGuard";
import { DataTable, Column, RowAction } from "@/components/DataTable";
import { PageHeader, DataTableToolbar } from "@/components/patterns";
import { Plus, Trash2, Eye, X, Calendar as CalendarIcon } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { SourceBadge } from "@/modules/finance/components/SourceBadge";
import { StatusBadge } from "@/modules/finance/components/StatusBadge";
import { ActorTypeBadge } from "@/modules/finance/components/ActorTypeBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterWithBadge } from "@/components/patterns/FilterWithBadge";
import { DateRangePicker } from "@/components/patterns/DateRangePicker";
import { DateRange } from "react-day-picker";

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
  const [filters, setFilters] =
    useState<GetTransactionsFilters>(getDefaultFilters());
  const [searchTerm, setSearchTerm] = useState("");

  // Use pendingFilters directly as active filters (apply immediately)
  const activeFilters = filters;

  const {
    data: transactionsData = { data: [], total: 0, page: 1, limit: 20 },
    isLoading,
  } = useTransactions(
    activeWorkspace?.id || "",
    {
      ...activeFilters,
      search: searchTerm || undefined,
    },
    !!activeWorkspace?.id,
  );

  const { mutate: deleteTransaction } = useDeleteTransaction(
    activeWorkspace?.id || "",
  );

  const handleResetFilters = () => {
    const defaultFilters = getDefaultFilters();
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
        {/* Header */}
        <PageHeader
          title="Financeiro"
          description="Gerencie suas transações e receitas/despesas"
          action={{
            label: "Nova Transação",
            onClick: () => router.push(`/finance/new`),
            icon: <Plus className="w-4 h-4" />,
          }}
        />

        {/* Search Bar */}
        <DataTableToolbar
          searchPlaceholder="Pesquisar por descrição..."
          onSearch={setSearchTerm}
          exportData={transactionsData.data || []}
          exportFilename="transacoes"
        />

        {/* Advanced Filters - Dropdown with Badge */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Source Type Filter */}
          <FilterWithBadge
            label="Origem"
            options={[
              {
                value: TransactionSourceType.MANUAL,
                label: "Manual",
              },
              {
                value: TransactionSourceType.SERVICE_ORDER,
                label: "Ordem de Serviço",
              },
              {
                value: TransactionSourceType.PURCHASE_ORDER,
                label: "Pedido de Compra",
              },
              {
                value: TransactionSourceType.INVOICE,
                label: "Nota Fiscal",
              },
            ]}
            value={filters.sourceType}
            onValueChange={(value) => {
              setFilters({
                ...filters,
                sourceType: value as TransactionSourceType | undefined,
              });
            }}
            width="w-56"
          />

          {/* Party Type Filter */}
          <FilterWithBadge
            label="Tipo"
            options={[
              {
                value: TransactionActorType.INCOME,
                label: "Entrada",
              },
              {
                value: TransactionActorType.EXPENSE,
                label: "Saída",
              },
            ]}
            value={filters.partyType}
            onValueChange={(value) => {
              setFilters({
                ...filters,
                partyType: value as TransactionActorType | undefined,
              });
            }}
            width="w-48"
          />

          {/* Status Filter */}
          <FilterWithBadge
            label="Status"
            options={[
              {
                value: TransactionStatus.PENDING,
                label: "Pendente",
              },
              {
                value: TransactionStatus.PAID,
                label: "Pago",
              },
              {
                value: TransactionStatus.PARTIALLY_PAID,
                label: "Parcialmente Pago",
              },
              {
                value: TransactionStatus.CANCELLED,
                label: "Cancelado",
              },
            ]}
            value={filters.status}
            onValueChange={(value) => {
              setFilters({
                ...filters,
                status: value as TransactionStatus | undefined,
              });
            }}
            width="w-56"
          />

          {/* Date Range Picker */}
          <DateRangePicker
            value={{
              from: filters.fromDate,
              to: filters.toDate,
            }}
            onValueChange={(range) => {
              setFilters({
                ...filters,
                fromDate: range?.from,
                toDate: range?.to,
              });
            }}
            placeholder="Selecionar período"
            className="w-56"
          />

          {/* Clear Filters Button */}
          {(filters.sourceType ||
            filters.partyType ||
            filters.status ||
            filters.fromDate ||
            filters.toDate) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-gh-text-secondary hover:text-gh-text"
            >
              <X className="w-4 h-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>

        {/* DataTable */}
        <DataTable
          headers={columns}
          data={transactionsData.data || []}
          isLoading={isLoading}
          emptyMessage={
            searchTerm
              ? "Nenhuma transação encontrada. Tente ajustar os filtros."
              : "Nenhuma transação encontrada"
          }
          rowActions={rowActions}
          pageSize={20}
          maxPageSize={100}
        />
      </div>
    </ModuleGuard>
  );
}
