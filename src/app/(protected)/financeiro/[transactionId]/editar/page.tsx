'use client'

import { DollarSign, XCircle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { TransactionEditForm } from '@/modules/financeiro/components'
import { useTransactionDetail } from '@/modules/financeiro/hooks/useFinance'
import { ModuleGuard } from '@/modules/workspace/components/ModuleGuard'
import { useBreadcrumb, useModuleConfig } from '@/modules/workspace/hooks'
import { useActiveWorkspace } from '@/modules/workspace/hooks/useActiveWorkspace'

export default function EditTransactionPage() {
  const router = useRouter()
  const params = useParams()
  const { activeWorkspace } = useActiveWorkspace()
  const { moduleRoutes } = useModuleConfig()

  const transactionId = params.transactionId as string
  const workspaceId = activeWorkspace?.id || ''

  const {
    data: transaction,
    isLoading,
    error,
  } = useTransactionDetail(workspaceId, transactionId)

  useBreadcrumb(
    transaction
      ? [
          {
            label: 'Finanças',
            href: '/finance',
            icon: DollarSign,
          },
          {
            label: transaction.description || 'Transação',
            href: `/financeiro/${transactionId}`,
          },
          {
            label: 'Editar',
          },
        ]
      : [
          {
            label: 'Finanças',
            href: '/finance',
            icon: DollarSign,
          },
          {
            label: 'Editar',
          },
        ]
  )

  if (!workspaceId) {
    return (
      <div className="py-12 text-center">
        <p className="text-gh-text-secondary">Workspace não disponível</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <ModuleGuard moduleId="finance">
        <div className="min-h-screen p-6">
          <div className="mx-auto max-w-5xl">
            <div className="bg-gh-card border-gh-border h-96 animate-pulse rounded-lg border shadow-sm" />
          </div>
        </div>
      </ModuleGuard>
    )
  }

  if (!transaction) {
    return (
      <ModuleGuard moduleId="finance">
        <div className="min-h-screen p-6">
          <div className="mx-auto max-w-5xl py-12 text-center">
            <div className="bg-gh-card border-gh-border rounded-lg border p-12 shadow-sm">
              <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
              <h2 className="text-gh-text mb-2 text-xl font-semibold">
                Transação não encontrada
              </h2>
              <p className="text-gh-text-secondary mb-4">
                A transação que você está procurando não existe ou foi removida.
              </p>
              {error && (
                <p className="mb-6 text-sm text-red-600">
                  {(error as any)?.message || 'Erro ao carregar transação'}
                </p>
              )}
              <Button
                onClick={() => router.push(moduleRoutes.finance)}
                variant="outline"
                className="gap-2"
              >
                Voltar para Finanças
              </Button>
            </div>
          </div>
        </div>
      </ModuleGuard>
    )
  }

  return (
    <ModuleGuard moduleId="finance">
      <div className="min-h-screen p-6">
        <div className="mx-auto w-full">
          <TransactionEditForm
            workspaceId={workspaceId}
            transaction={transaction}
            onSuccess={() => {
              router.push(`/financeiro/${transactionId}`)
            }}
            onCancel={() => {
              router.back()
            }}
          />
        </div>
      </div>
    </ModuleGuard>
  )
}
