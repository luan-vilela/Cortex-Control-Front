'use client'

import { useRouter } from 'next/navigation'

import { PageHeader } from '@/components/patterns'
import { OrderForm } from '@/modules/orders/components'
import { ModuleGuard } from '@/modules/workspace/components/ModuleGuard'
import { useBreadcrumb } from '@/modules/workspace/hooks'
import { useActiveWorkspace } from '@/modules/workspace/hooks/useActiveWorkspace'

export default function NewOrderPage() {
  const router = useRouter()
  const { activeWorkspace } = useActiveWorkspace()

  useBreadcrumb([
    {
      label: 'Ordens de Serviço',
      href: '/orders',
    },
    {
      label: 'Nova Ordem',
      href: '/orders/new',
    },
  ])

  const handleSuccess = () => {
    router.push('/orders')
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <ModuleGuard moduleId="orders">
      <div className="space-y-6">
        <PageHeader title="Nova Ordem de Serviço" description="Crie uma nova ordem de serviço" />

        <div className="max-w-2xl">
          <OrderForm
            workspaceId={activeWorkspace?.id || ''}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </ModuleGuard>
  )
}
