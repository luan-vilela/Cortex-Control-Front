'use client'

import { useState } from 'react'

import { ArrowLeft, DollarSign, Trash2 } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { TransactionDetail } from '@/modules/financeiro/components'
import {
  useDeleteTransaction,
  useTransactionDetail,
  useUpdateTransaction,
} from '@/modules/financeiro/hooks/useFinance'
import { TransactionStatus } from '@/modules/financeiro/types'
import { ModuleGuard } from '@/modules/workspace/components/ModuleGuard'
import { useBreadcrumb, useModuleConfig } from '@/modules/workspace/hooks'
import { useActiveWorkspace } from '@/modules/workspace/hooks/useActiveWorkspace'

export default function TransactionDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { activeWorkspace } = useActiveWorkspace()
  const { moduleRoutes } = useModuleConfig()
  const [isChangingStatus, setIsChangingStatus] = useState(false)

  const transactionId = parseInt(params.transactionId as string, 10)
  const workspaceId = activeWorkspace?.id || ''

  const {
    data: transaction,
    isLoading,
    error,
  } = useTransactionDetail(workspaceId, transactionId, !!workspaceId && !isNaN(transactionId))

  // Atualizar breadcrumb quando transação carrega
  useBreadcrumb(
    transaction
      ? [
          {
            label: 'Finanças',
            href: '/finance',
            icon: DollarSign,
          },
          {
            label: `${transaction.sourceType} #${transaction.id}`,
          },
        ]
      : [
          {
            label: 'Finanças',
            href: '/finance',
            icon: DollarSign,
          },
        ]
  )

  const { mutate: updateTransaction } = useUpdateTransaction(workspaceId, transactionId)

  const { mutate: deleteTransaction } = useDeleteTransaction(workspaceId)

  if (!workspaceId) {
    return (
      <div className="py-12 text-center">
        <p className="text-gh-text-secondary">Workspace não disponível</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="from-gh-bg via-gh-bg to-gh-hover min-h-screen bg-gradient-to-br p-6">
        <div className="mx-auto max-w-4xl">
          <div className="bg-gh-card border-gh-border h-96 animate-pulse rounded-lg border" />
        </div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="from-gh-bg via-gh-bg to-gh-hover min-h-screen bg-gradient-to-br p-6">
        <div className="mx-auto max-w-4xl py-12 text-center">
          <p className="text-gh-text-secondary mb-2">Transação não encontrada</p>
          {error && (
            <p className="mb-4 text-sm text-red-600">
              {(error as any)?.message || 'Erro ao carregar transação'}
            </p>
          )}
          <Button
            onClick={() => router.push(moduleRoutes.finance)}
            className="mt-4"
            variant="outline"
          >
            Voltar
          </Button>
        </div>
      </div>
    )
  }

  const handleStatusChange = (newStatus: TransactionStatus) => {
    updateTransaction(
      { status: newStatus },
      {
        onSuccess: () => {
          setIsChangingStatus(false)
        },
      }
    )
  }

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja deletar esta transação?')) {
      deleteTransaction(transactionId, {
        onSuccess: () => {
          router.push(moduleRoutes.finance)
        },
      })
    }
  }

  const handleMarkAsPaid = () => {
    updateTransaction({
      status: TransactionStatus.PAID,
      paidDate: new Date(),
    })
  }

  return (
    <ModuleGuard moduleId="finance">
      <div className="from-gh-bg via-gh-bg to-gh-hover min-h-screen bg-gradient-to-br p-6">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-6 flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(moduleRoutes.finance)}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Voltar
            </Button>
          </div>

          {/* Main Content */}
          <div className="bg-gh-card border-gh-border mb-6 rounded-lg border p-8">
            <TransactionDetail transaction={transaction} />
          </div>

          {/* Actions */}
          <div className="flex justify-between gap-3">
            <div className="flex gap-3">
              {transaction.status === TransactionStatus.PENDING && (
                <Button
                  onClick={handleMarkAsPaid}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  Marcar como Pago
                </Button>
              )}

              {[TransactionStatus.PENDING, TransactionStatus.PARTIALLY_PAID].includes(
                transaction.status
              ) && (
                <div className="group relative">
                  <Button variant="outline">Alterar Status</Button>

                  <div className="bg-gh-card border-gh-border absolute left-0 z-10 mt-1 hidden min-w-max rounded-lg border shadow-lg group-hover:block">
                    {Object.values(TransactionStatus)
                      .filter((s) => s !== transaction.status)
                      .map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          className="text-gh-text hover:bg-gh-hover block w-full px-4 py-2 text-left text-sm first:rounded-t last:rounded-b"
                        >
                          {status}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <Button
              size="sm"
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700"
            >
              <Trash2 size={16} />
              Deletar
            </Button>
          </div>
        </div>
      </div>
    </ModuleGuard>
  )
}
