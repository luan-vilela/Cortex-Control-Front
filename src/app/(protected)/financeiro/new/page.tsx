'use client'

import { useRouter } from 'next/navigation'

import { TransactionForm } from '@/modules/financeiro/components'
import { ModuleGuard } from '@/modules/workspace/components/ModuleGuard'
import { useBreadcrumb } from '@/modules/workspace/hooks'
import { useActiveWorkspace } from '@/modules/workspace/hooks/useActiveWorkspace'

export default function NewTransactionPage() {
  const router = useRouter()
  const { activeWorkspace } = useActiveWorkspace()

  useBreadcrumb([
    {
      label: 'Finanças',
      href: '/finance',
    },
    {
      label: 'Nova Transação',
      href: '/finance/new',
    },
  ])

  if (!activeWorkspace?.id) {
    return (
      <div className="py-12 text-center">
        <p className="text-gh-text-secondary">Workspace não disponível</p>
      </div>
    )
  }

  return (
    <ModuleGuard moduleId="finance">
      <div className="min-h-screen p-6">
        <div className="mx-auto w-full">
          {/* Formulário */}
          <div className="overflow-hidden rounded-lg bg-white shadow-lg">
            <TransactionForm
              workspaceId={activeWorkspace.id}
              onSuccess={() => {
                router.back()
              }}
              onCancel={() => {
                router.back()
              }}
            />
          </div>
        </div>
      </div>
    </ModuleGuard>
  )
}
