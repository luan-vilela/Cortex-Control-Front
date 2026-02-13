'use client'

import { useState } from 'react'

import { ArrowLeft, CheckCircle2, DollarSign, MoreVertical, Trash2, XCircle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  const [isDeleting, setIsDeleting] = useState(false)

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
              <h2 className="text-gh-text mb-2 text-xl font-semibold">Transação não encontrada</h2>
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
                <ArrowLeft size={16} />
                Voltar para Finanças
              </Button>
            </div>
          </div>
        </div>
      </ModuleGuard>
    )
  }

  const handleStatusChange = (newStatus: TransactionStatus) => {
    setIsChangingStatus(true)
    updateTransaction(
      { status: newStatus },
      {
        onSuccess: () => {
          setIsChangingStatus(false)
        },
        onSettled: () => {
          setIsChangingStatus(false)
        },
      }
    )
  }

  const handleDelete = async () => {
    if (
      !confirm('Tem certeza que deseja deletar esta transação? Esta ação não pode ser desfeita.')
    ) {
      return
    }

    setIsDeleting(true)
    deleteTransaction(transactionId, {
      onSuccess: () => {
        router.push(moduleRoutes.finance)
      },
      onSettled: () => {
        setIsDeleting(false)
      },
    })
  }

  const handleMarkAsPaid = () => {
    updateTransaction({
      status: TransactionStatus.PAID,
      paidDate: new Date(),
    })
  }

  const statusLabels: Record<TransactionStatus, string> = {
    [TransactionStatus.PENDING]: 'Pendente',
    [TransactionStatus.OVERDUE]: 'Atrasado',
    [TransactionStatus.PAID]: 'Pago',
    [TransactionStatus.PARTIALLY_PAID]: 'Parcialmente Pago',
    [TransactionStatus.CANCELLED]: 'Cancelado',
  }

  return (
    <ModuleGuard moduleId="finance">
      <div className="min-h-screen p-6">
        <div className="mx-auto max-w-5xl">
          {/* Header Actions */}
          <div className="mb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(moduleRoutes.finance)}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Voltar para Finanças
            </Button>

            <div className="flex items-center gap-2">
              {/* Botão de Ação Rápida */}
              {transaction.status === TransactionStatus.PENDING && (
                <Button
                  onClick={handleMarkAsPaid}
                  className="gap-2 bg-green-600 text-white hover:bg-green-700"
                >
                  <CheckCircle2 size={16} />
                  Marcar como Pago
                </Button>
              )}

              {/* Menu de Ações */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Alterar Status */}
                  {[TransactionStatus.PENDING, TransactionStatus.PARTIALLY_PAID].includes(
                    transaction.status
                  ) && (
                    <>
                      <DropdownMenuLabel className="text-gh-text-secondary text-xs font-normal">
                        Alterar Status
                      </DropdownMenuLabel>
                      {Object.values(TransactionStatus)
                        .filter((s) => s !== transaction.status)
                        .map((status) => (
                          <DropdownMenuItem
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            disabled={isChangingStatus}
                          >
                            {statusLabels[status]}
                          </DropdownMenuItem>
                        ))}
                      <DropdownMenuSeparator />
                    </>
                  )}

                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/20"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Deletar Transação
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Main Content Card */}
          <div className="bg-gh-card border-gh-border rounded-lg border shadow-sm">
            <div className="p-6 sm:p-8">
              <TransactionDetail transaction={transaction} />
            </div>
          </div>

          {/* Debug Info (development only) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6">
              <summary className="text-gh-text-secondary hover:text-gh-text bg-gh-card border-gh-border cursor-pointer rounded-lg border px-4 py-2 text-xs">
                🔍 Ver dados brutos (debug)
              </summary>
              <pre className="bg-gh-card border-gh-border mt-2 overflow-auto rounded-lg border p-4 text-xs">
                {JSON.stringify(transaction, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    </ModuleGuard>
  )
}
