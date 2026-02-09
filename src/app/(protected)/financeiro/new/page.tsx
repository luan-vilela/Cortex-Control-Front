'use client'

import { ArrowLeft } from 'lucide-react'
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
    <ModuleGuard moduleId="finance" workspaceId={activeWorkspace?.id}>
      <div className="from-gh-bg via-gh-bg to-gh-hover min-h-screen bg-gradient-to-br p-6">
        <div className="mx-auto max-w-4xl">
          {/* Header com Voltar */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="mb-4 flex items-center gap-2 text-blue-600 transition-colors hover:text-blue-700"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Voltar</span>
            </button>
            <div>
              <h1 className="text-gh-text text-3xl font-bold">Nova Transação</h1>
              <p className="text-gh-text-secondary mt-1">Preencha os detalhes da transação</p>
            </div>
          </div>

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
