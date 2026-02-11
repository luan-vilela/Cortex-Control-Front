'use client'

import { useRouter } from 'next/navigation'

import { OrderForm } from '@/modules/orders/components'
import { useOrder } from '@/modules/orders/hooks/useOrders'
import { ModuleGuard } from '@/modules/workspace/components/ModuleGuard'
import { useBreadcrumb } from '@/modules/workspace/hooks'
import { useActiveWorkspace } from '@/modules/workspace/hooks/useActiveWorkspace'

interface EditOrderPageProps {
  params: {
    orderId: string
  }
}

export default function EditOrderPage({ params }: EditOrderPageProps) {
  const router = useRouter()
  const { activeWorkspace } = useActiveWorkspace()
  const orderId = params.orderId

  const { data: order, isLoading } = useOrder(activeWorkspace?.id || '', orderId)

  useBreadcrumb([
    {
      label: 'Ordens de Serviço',
      href: '/orders',
    },
    {
      label: order?.title || 'Editar Ordem',
      href: `/orders/${orderId}`,
    },
    {
      label: 'Editar',
      href: `/orders/${orderId}/edit`,
    },
  ])

  const handleSuccess = () => {
    router.push(`/orders/${orderId}`)
  }

  const handleCancel = () => {
    router.back()
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
      <div className="min-h-screen p-6">
        <div className="mx-auto w-full">
          {/* Formulário */}
          <div className="overflow-hidden rounded-lg bg-white shadow-lg">
            <OrderForm
              workspaceId={activeWorkspace?.id || ''}
              order={order}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </div>
    </ModuleGuard>
  )
}
