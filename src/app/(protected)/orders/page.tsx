'use client'

import { useState } from 'react'

import { CheckCircle2, Eye, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { type Column, DataTable, type RowAction } from '@/components/DataTable'
import { DataTableToolbar, PageHeader } from '@/components/patterns'
import { formatCurrency, formatDate } from '@/lib/utils'
import { OrderPriorityBadge, OrderStatusBadge } from '@/modules/orders/components'
import { useDeleteOrder, useOrders, useUpdateOrder } from '@/modules/orders/hooks/useOrders'
import { type GetOrdersFilters, OrderStatus } from '@/modules/orders/types'
import { ModuleGuard } from '@/modules/workspace/components/ModuleGuard'
import { useBreadcrumb } from '@/modules/workspace/hooks'
import { useActiveWorkspace } from '@/modules/workspace/hooks/useActiveWorkspace'

export default function OrdersPage() {
  const router = useRouter()
  const { activeWorkspace } = useActiveWorkspace()

  useBreadcrumb([
    {
      label: 'Ordens de Serviço',
      href: '/orders',
    },
  ])

  const getDefaultFilters = (): GetOrdersFilters => ({
    page: 1,
    limit: 20,
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [advancedOptionsEnabled, setAdvancedOptionsEnabled] = useState(false)
  const [selectedRows, setSelectedRows] = useState<any[]>([])

  const { data: ordersResponse, isLoading } = useOrders(activeWorkspace?.id || '', {})

  const deleteOrder = useDeleteOrder()
  const updateOrder = useUpdateOrder()

  const handleDeleteSelected = async () => {
    if (!activeWorkspace?.id || selectedRows.length === 0) return
    if (confirm(`Tem certeza que deseja excluir ${selectedRows.length} ordens de serviço?`)) {
      for (const row of selectedRows) {
        await deleteOrder.mutateAsync({
          workspaceId: activeWorkspace.id,
          orderId: row.id,
        })
      }
      setSelectedRows([])
    }
  }

  // Definir colunas
  const columns: Column[] = [
    {
      key: 'title',
      label: 'Ordem',
      render: (_, row) => (
        <div>
          <p className="text-gh-text font-medium">{row.title}</p>
          {row.description && (
            <p className="text-gh-text-secondary max-w-xs truncate text-sm">{row.description}</p>
          )}
        </div>
      ),
    },
    {
      key: 'client',
      label: 'Cliente',
      render: (_, row) => row.client?.name || '-',
    },
    {
      key: 'value',
      label: 'Valor',
      render: (_, row) => formatCurrency(row.value),
    },
    {
      key: 'priority',
      label: 'Prioridade',
      render: (_, row) => <OrderPriorityBadge priority={row.priority} />,
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, row) => <OrderStatusBadge status={row.status} />,
    },
    {
      key: 'dueDate',
      label: 'Prazo',
      render: (_, row) => (row.dueDate ? formatDate(new Date(row.dueDate)) : '-'),
    },
    {
      key: 'assignedTo',
      label: 'Responsável',
      render: (_, row) => row.assignedTo?.name || '-',
    },
  ]

  const rowActions: RowAction[] = [
    {
      id: 'view',
      label: 'Ver detalhes',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row) => router.push(`/orders/${row.id}`),
    },
    {
      id: 'complete',
      label: 'Marcar como concluída',
      icon: <CheckCircle2 className="h-4 w-4" />,
      onClick: (row) => {
        if (!activeWorkspace?.id) return
        updateOrder.mutateAsync({
          workspaceId: activeWorkspace.id,
          orderId: row.id,
          payload: { status: OrderStatus.COMPLETED },
        })
      },
    },
    {
      id: 'delete',
      label: 'Excluir',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row) => {
        if (!activeWorkspace?.id) return
        if (confirm('Tem certeza que deseja excluir esta ordem de serviço?')) {
          deleteOrder.mutateAsync({
            workspaceId: activeWorkspace.id,
            orderId: row.id,
          })
        }
      },
      variant: 'destructive',
    },
  ]

  return (
    <ModuleGuard moduleId="orders">
      <div className="space-y-6">
        <PageHeader
          title="Ordens de Serviço"
          description="Gerencie ordens de serviço e projetos"
          action={{
            label: 'Nova Ordem',
            onClick: () => router.push('/orders/new'),
            icon: <Plus className="h-4 w-4" />,
          }}
        />

        <DataTableToolbar
          searchPlaceholder="Pesquisar ordens..."
          onSearch={setSearchTerm}
          exportData={ordersResponse?.data || []}
          exportFilename="ordens-servico"
        />

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

        <DataTable
          headers={columns}
          data={ordersResponse?.data || []}
          isLoading={isLoading}
          selectable={advancedOptionsEnabled}
          onSelectionChange={setSelectedRows}
          onRowClick={(row) => router.push(`/orders/${row.id}`)}
          emptyMessage={
            searchTerm
              ? 'Tente ajustar os termos de pesquisa.'
              : 'Comece criando sua primeira ordem de serviço.'
          }
          rowActions={rowActions}
          pageSize={20}
        />
      </div>
    </ModuleGuard>
  )
}
