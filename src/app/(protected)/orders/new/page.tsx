'use client'

import { useRouter } from 'next/navigation'

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
      <div className="min-h-screen p-6">
        <div className="mx-auto w-full">
          {/* Formulário */}
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
