'use client'

import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatCurrency, formatDate } from '@/lib/utils'
import { OrderPriorityBadge, OrderStatusBadge } from '@/modules/orders/components'
import { useDeleteOrder, useOrder } from '@/modules/orders/hooks/useOrders'
import { ModuleGuard } from '@/modules/workspace/components/ModuleGuard'
import { useBreadcrumb } from '@/modules/workspace/hooks'
import { useActiveWorkspace } from '@/modules/workspace/hooks/useActiveWorkspace'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()

  const orderId = params.id as string
  const { activeWorkspace } = useActiveWorkspace()

  const { data: order, isLoading } = useOrder(activeWorkspace?.id || '', orderId)

  const deleteOrder = useDeleteOrder()

  useBreadcrumb([
    {
      label: 'Ordens de Serviço',
      href: '/orders',
    },
    {
      label: order?.title || 'Detalhes da Ordem',
      href: `/orders/${orderId}`,
    },
  ])

  const handleDelete = async () => {
    if (!activeWorkspace?.id) return

    if (confirm('Tem certeza que deseja excluir esta ordem de serviço?')) {
      await deleteOrder.mutateAsync({
        workspaceId: activeWorkspace.id,
        orderId,
      })
      router.push('/orders')
    }
  }

  if (isLoading) {
    return (
      <ModuleGuard moduleId="orders">
        <div className="flex items-center justify-center py-12">
          <div className="border-gh-hover h-12 w-12 animate-spin rounded-full border-b-2"></div>
        </div>
      </ModuleGuard>
    )
  }

  if (!order) {
    return (
      <ModuleGuard moduleId="orders">
        <div className="py-12 text-center">
          <p className="text-gh-text-secondary">Ordem não encontrada</p>
        </div>
      </ModuleGuard>
    )
  }

  return (
    <ModuleGuard moduleId="orders">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-gh-text text-2xl font-bold">{order.title}</h1>
              <p className="text-gh-text-secondary">Ordem #{order.id}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push(`/orders/${order.id}/edit`)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-gh-text-secondary text-sm font-medium">Status</label>
                <div className="mt-1">
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>

              <div>
                <label className="text-gh-text-secondary text-sm font-medium">Prioridade</label>
                <div className="mt-1">
                  <OrderPriorityBadge priority={order.priority} />
                </div>
              </div>

              <div>
                <label className="text-gh-text-secondary text-sm font-medium">Valor Aprovado</label>
                <p className="text-gh-text mt-1 text-lg font-semibold">
                  {formatCurrency(order.approvedValue)}
                </p>
                {order.totalValue && order.totalValue !== order.approvedValue && (
                  <>
                    <label className="text-gh-text-secondary mt-2 block text-sm font-medium">
                      Valor Total
                    </label>
                    <p className="text-gh-text mt-1 text-lg font-semibold text-green-600">
                      {formatCurrency(order.totalValue)}
                    </p>
                  </>
                )}
              </div>

              {order.description && (
                <div>
                  <label className="text-gh-text-secondary text-sm font-medium">Descrição</label>
                  <p className="text-gh-text mt-1">{order.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cliente e Responsável</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-gh-text-secondary text-sm font-medium">Cliente</label>
                <p className="text-gh-text mt-1">{order.client?.name || 'Não informado'}</p>
                {order.client?.email && (
                  <p className="text-gh-text-secondary text-sm">{order.client.email}</p>
                )}
              </div>

              <Separator />

              <div>
                <label className="text-gh-text-secondary text-sm font-medium">Responsável</label>
                <p className="text-gh-text mt-1">{order.assignedTo?.name || 'Não atribuído'}</p>
                {order.assignedTo?.email && (
                  <p className="text-gh-text-secondary text-sm">{order.assignedTo.email}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Datas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-gh-text-secondary text-sm font-medium">
                  Data de Criação
                </label>
                <p className="text-gh-text mt-1">{formatDate(new Date(order.createdAt))}</p>
              </div>

              {order.dueDate && (
                <div>
                  <label className="text-gh-text-secondary text-sm font-medium">Prazo</label>
                  <p className="text-gh-text mt-1">{formatDate(new Date(order.dueDate))}</p>
                </div>
              )}

              {order.completedAt && (
                <div>
                  <label className="text-gh-text-secondary text-sm font-medium">
                    Data de Conclusão
                  </label>
                  <p className="text-gh-text mt-1">{formatDate(new Date(order.completedAt))}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ModuleGuard>
  )
}
