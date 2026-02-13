'use client'

import { useState } from 'react'

import { CheckCircle2, Eye, Plus, Trash2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { type Column, DataTable, type RowAction } from '@/components/DataTable'
import { DataTableToolbar, PageHeader } from '@/components/patterns'
import { DateRangePicker } from '@/components/patterns/DateRangePicker'
import { FilterWithBadge } from '@/components/patterns/FilterWithBadge'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ActorTypeBadge } from '@/modules/financeiro/components/ActorTypeBadge'
import { SourceBadge } from '@/modules/financeiro/components/SourceBadge'
import { StatusBadge } from '@/modules/financeiro/components/StatusBadge'
import {
  useDeleteTransaction,
  useTransactions,
  useUpdateTransactionGeneric,
} from '@/modules/financeiro/hooks/useFinance'
import {
  type GetTransactionsFilters,
  TransactionActorType,
  TransactionSourceType,
  TransactionStatus,
} from '@/modules/financeiro/types'
import { ModuleGuard } from '@/modules/workspace/components/ModuleGuard'
import { useBreadcrumb } from '@/modules/workspace/hooks'
import { useActiveWorkspace } from '@/modules/workspace/hooks/useActiveWorkspace'

export default function FinanceiroPage() {
  const router = useRouter()
  const { activeWorkspace } = useActiveWorkspace()

  useBreadcrumb([
    {
      label: 'Financeiro',
      href: '/financeiro',
    },
  ])

  // Get current month boundaries
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const getDefaultFilters = (): GetTransactionsFilters => ({
    page: 1,
    limit: 20,
    fromDate: firstDayOfMonth,
    toDate: lastDayOfMonth,
  })

  const [filters, setFilters] = useState<GetTransactionsFilters>(getDefaultFilters())
  const [searchTerm, setSearchTerm] = useState('')
  const [advancedOptionsEnabled, setAdvancedOptionsEnabled] = useState(false)
  const [selectedRows, setSelectedRows] = useState<any[]>([])

  // Use pendingFilters directly as active filters (apply immediately)
  const activeFilters = filters

  const { data: transactionsData = { data: [], total: 0, page: 1, limit: 20 }, isLoading } =
    useTransactions(
      activeWorkspace?.id || '',
      {
        ...activeFilters,
        search: searchTerm || undefined,
      },
      !!activeWorkspace?.id
    )

  const { mutate: deleteTransaction } = useDeleteTransaction(activeWorkspace?.id || '')
  const { mutate: updateTransaction } = useUpdateTransactionGeneric(activeWorkspace?.id || '')

  const handleDeleteSelected = async () => {
    if (!activeWorkspace?.id || selectedRows.length === 0) return
    if (confirm(`Tem certeza que deseja deletar ${selectedRows.length} transações?`)) {
      for (const row of selectedRows) {
        deleteTransaction(row.id)
      }
      setSelectedRows([])
    }
  }

  const handleResetFilters = () => {
    const defaultFilters = getDefaultFilters()
    setFilters(defaultFilters)
  }

  if (!activeWorkspace?.id) {
    return (
      <div className="py-12 text-center">
        <p className="text-gh-text-secondary">Workspace não disponível</p>
      </div>
    )
  }

  // Definir colunas
  const columns: Column[] = [
    {
      key: 'partyType',
      label: 'Tipo',
      render: (_, row) => {
        if (row.parties && row.parties.length > 0) {
          return <ActorTypeBadge partyType={row.parties[0].partyType} />
        }
        return <span className="text-gh-text-secondary text-xs">-</span>
      },
    },
    {
      key: 'description',
      label: 'Descrição',
      render: (value) => <p className="text-gh-text truncate font-medium">{value}</p>,
    },
    {
      key: 'sourceType',
      label: 'Origem',
      render: (value) => <SourceBadge sourceType={value} />,
    },
    {
      key: 'amount',
      label: 'Valor',
      render: (value) => (
        <p className="text-gh-text text-sm font-semibold">{formatCurrency(Number(value))}</p>
      ),
    },
    {
      key: 'originalAmount',
      label: 'Valor Original',
      render: (_, row) => (
        <p className="text-gh-text text-sm">
          {row.originalAmount ? formatCurrency(Number(row.originalAmount)) : '-'}
        </p>
      ),
    },
    {
      key: 'recurrenceConfig',
      label: 'Recorrência',
      render: (_, row) => (
        <span className="text-gh-text-secondary text-sm">
          {row.recurrenceConfig ? 'Sim' : 'Não'}
        </span>
      ),
    },
    {
      key: 'installmentPlan',
      label: 'Parcelado',
      render: (_, row) => (
        <span className="text-gh-text-secondary text-sm">
          {row.installmentPlan ? 'Sim' : 'Não'}
        </span>
      ),
    },
    {
      key: 'installmentNumber',
      label: 'Nº Parcela',
      render: (value) => (
        <span className="text-gh-text-secondary text-sm">{value ? `${value}` : '-'}</span>
      ),
    },
    {
      key: 'dueDate',
      label: 'Vencimento',
      render: (value) => (
        <span className="text-gh-text-secondary text-sm">{value ? formatDate(value) : '-'}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} />,
    },
  ]

  // Definir row actions
  const rowActions: RowAction[] = [
    {
      id: 'view',
      label: 'Visualizar',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row) => router.push(`/financeiro/${row.id}`),
    },
    {
      id: 'mark-paid',
      label: 'Marcar como Pago',
      icon: <CheckCircle2 className="h-4 w-4" />,
      onClick: (row) => {
        if (row.status !== TransactionStatus.PAID) {
          updateTransaction({
            transactionId: row.id,
            payload: { status: TransactionStatus.PAID, paidDate: new Date() },
          })
        }
      },
    },
    {
      id: 'delete',
      label: 'Deletar',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row) => {
        if (confirm('Tem certeza que deseja deletar esta transação?')) {
          deleteTransaction(row.id)
        }
      },
      variant: 'destructive',
    },
  ]

  return (
    <ModuleGuard moduleId="finance">
      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Financeiro"
          description="Gerencie suas transações e receitas/despesas"
          action={{
            label: 'Nova Transação',
            onClick: () => router.push(`/financeiro/new`),
            icon: <Plus className="h-4 w-4" />,
          }}
        />

        {/* Search Bar */}
        <DataTableToolbar
          searchPlaceholder="Pesquisar por descrição..."
          onSearch={setSearchTerm}
          exportData={transactionsData.data || []}
          exportFilename="transacoes"
        />

        {/* Advanced Options Button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setAdvancedOptionsEnabled(!advancedOptionsEnabled)}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            {advancedOptionsEnabled ? 'Desabilitar Opções Avançadas' : 'Opções Avançadas'}
          </button>
          {advancedOptionsEnabled && selectedRows.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Deletar Selecionadas ({selectedRows.length})
            </button>
          )}
        </div>

        {/* Advanced Filters - Dropdown with Badge */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Source Type Filter */}
          <FilterWithBadge
            label="Origem"
            options={[
              {
                value: TransactionSourceType.MANUAL,
                label: 'Manual',
              },
              {
                value: TransactionSourceType.SERVICE_ORDER,
                label: 'Ordem de Serviço',
              },
              {
                value: TransactionSourceType.PURCHASE_ORDER,
                label: 'Pedido de Compra',
              },
              {
                value: TransactionSourceType.INVOICE,
                label: 'Nota Fiscal',
              },
            ]}
            value={filters.sourceType}
            onValueChange={(value) => {
              setFilters({
                ...filters,
                sourceType: value as TransactionSourceType | undefined,
              })
            }}
            width="w-56"
          />

          {/* Party Type Filter */}
          <FilterWithBadge
            label="Tipo"
            options={[
              {
                value: TransactionActorType.INCOME,
                label: 'Entrada',
              },
              {
                value: TransactionActorType.EXPENSE,
                label: 'Saída',
              },
            ]}
            value={filters.partyType}
            onValueChange={(value) => {
              setFilters({
                ...filters,
                partyType: value as TransactionActorType | undefined,
              })
            }}
            width="w-48"
          />

          {/* Status Filter */}
          <FilterWithBadge
            label="Status"
            options={[
              {
                value: TransactionStatus.PENDING,
                label: 'Pendente',
              },
              {
                value: TransactionStatus.OVERDUE,
                label: 'Vencido',
              },
              {
                value: TransactionStatus.PAID,
                label: 'Pago',
              },
              {
                value: TransactionStatus.PARTIALLY_PAID,
                label: 'Parcialmente Pago',
              },
              {
                value: TransactionStatus.CANCELLED,
                label: 'Cancelado',
              },
            ]}
            value={filters.status}
            onValueChange={(value) => {
              setFilters({
                ...filters,
                status: value as TransactionStatus | undefined,
              })
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
              })
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
              <X className="mr-1 h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>

        {/* DataTable */}
        <DataTable
          headers={columns}
          data={transactionsData.data || []}
          isLoading={isLoading}
          selectable={advancedOptionsEnabled}
          onSelectionChange={setSelectedRows}
          emptyMessage={
            searchTerm
              ? 'Nenhuma transação encontrada. Tente ajustar os filtros.'
              : 'Nenhuma transação encontrada'
          }
          rowActions={rowActions}
          pageSize={10}
          maxPageSize={100}
        />
      </div>
    </ModuleGuard>
  )
}
