import { useState } from 'react'

import { Clock, Coins, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'
import { useWallet, useWalletTransactions } from '@/modules/wallet/hooks'
import { TransactionType } from '@/modules/wallet/types/wallet.types'

export function NavUser() {
  const { state } = useSidebar()
  const { data: wallet, isLoading } = useWallet()
  const [showTransactions, setShowTransactions] = useState(false)
  const [page, setPage] = useState(1)
  const { data: transactionsData } = useWalletTransactions(page, 10)
  const isCollapsed = state === 'collapsed'

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      INITIAL_CREDIT: 'Crédito Inicial',
      MANUAL_RECHARGE: 'Recarga Manual',
      PAYMENT_RECHARGE: 'Recarga por Pagamento',
      WORKSPACE_DAILY_COST: 'Custo Diário do Workspace',
      MODULE_ACTIVATION: 'Ativação de Módulo',
      ACTION_EXECUTION: 'Execução de Ação',
      REFUND: 'Reembolso',
      ADJUSTMENT: 'Ajuste',
    }
    return labels[category] || category
  }

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="px-2 py-1.5">
            <div className="border-gh-border h-5 w-5 animate-spin rounded-full border-2 border-t-blue-600"></div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={`h-auto ${isCollapsed ? 'w-10 px-2 py-2' : 'w-full justify-start px-2 py-1.5'}`}
            >
              {isCollapsed ? (
                <Coins className="h-5 w-5 text-yellow-600" />
              ) : (
                <div className="w-full space-y-1.5">
                  <div className="flex w-full items-center justify-between">
                    <p className="text-gh-text-secondary text-xs font-semibold">Créditos</p>
                    <div className="flex items-center gap-2">
                      <Coins className="h-5 w-5 text-yellow-600" />
                      <span className="text-sm font-semibold">
                        {wallet ? formatCurrency(wallet.balance) : '0,00'}
                      </span>
                    </div>
                  </div>
                  <div className="border-gh-border border-t"></div>
                  <div className="flex w-full flex-col gap-1">
                    <p className="text-gh-text-secondary text-xs font-semibold">
                      Custo do Workspace
                    </p>
                    <p className="text-gh-text text-xs">Em breve</p>
                  </div>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end" side="right" forceMount>
            {!showTransactions ? (
              <>
                {/* Cabeçalho */}
                <div className="border-gh-border border-b p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-gh-text text-lg font-semibold">Minha Carteira</h3>
                    <Coins className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="text-gh-text text-3xl font-bold">
                    {wallet ? formatCurrency(wallet.balance) : '0,00'}
                  </div>
                  <p className="text-gh-text-secondary mt-1 text-sm">créditos disponíveis</p>
                </div>

                {/* Ações */}
                <div className="space-y-2 p-4">
                  <button
                    onClick={() => {
                      alert('Funcionalidade de recarga será implementada em breve!')
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    <Plus className="h-5 w-5" />
                    Adicionar Créditos
                  </button>

                  <button
                    onClick={() => setShowTransactions(true)}
                    className="bg-gh-bg text-gh-text flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition-colors hover:bg-gray-200"
                  >
                    <Clock className="h-5 w-5" />
                    Ver Histórico
                  </button>
                </div>

                {/* Informações */}
                <div className="border-gh-border border-t bg-blue-50 p-4">
                  <p className="text-xs text-blue-900">
                    💡 <strong>Dica:</strong> Os créditos são usados para manter workspaces ativos e
                    executar ações.
                  </p>
                </div>
              </>
            ) : (
              <>
                {/* Histórico de Transações */}
                <div className="border-gh-border flex items-center justify-between border-b p-4">
                  <h3 className="text-gh-text text-lg font-semibold">Histórico</h3>
                  <button
                    onClick={() => setShowTransactions(false)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Voltar
                  </button>
                </div>

                {/* Lista de Transações */}
                <div className="max-h-96 overflow-y-auto">
                  {transactionsData?.transactions && transactionsData.transactions.length > 0 ? (
                    <div className="divide-gh-border divide-y">
                      {transactionsData.transactions.map((transaction) => (
                        <div key={transaction.id} className="hover:bg-gh-bg p-3 transition-colors">
                          <div className="mb-1 flex items-center justify-between">
                            <span className="text-gh-text text-sm font-medium">
                              {getCategoryLabel(transaction.category)}
                            </span>
                            <span
                              className={`text-sm font-semibold ${
                                transaction.type === TransactionType.CREDIT
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {transaction.type === TransactionType.CREDIT ? '+' : '-'}
                              {formatCurrency(transaction.amount)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gh-text-secondary text-xs">
                              {formatDate(transaction.createdAt)}
                            </span>
                            <span
                              className={`rounded px-2 py-1 text-xs ${
                                transaction.type === TransactionType.CREDIT
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {transaction.type === TransactionType.CREDIT ? 'Crédito' : 'Débito'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gh-text-secondary p-8 text-center">
                      Nenhuma transação encontrada
                    </div>
                  )}
                </div>

                {/* Paginação */}
                {transactionsData?.total && transactionsData.total > 10 && (
                  <div className="border-gh-border flex items-center justify-between border-t p-4">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400"
                    >
                      Anterior
                    </button>
                    <span className="text-gh-text-secondary text-sm">Página {page}</span>
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={!transactionsData?.hasMore}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400"
                    >
                      Próxima
                    </button>
                  </div>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
