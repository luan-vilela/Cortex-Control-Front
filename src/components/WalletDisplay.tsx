'use client'

import { useEffect, useRef, useState } from 'react'

import { Clock, Coins, Plus, TrendingDown, TrendingUp } from 'lucide-react'

import { useWallet, useWalletTransactions } from '@/modules/wallet/hooks'
import { TransactionType } from '@/modules/wallet/types/wallet.types'

export function WalletDisplay() {
  const { data: wallet, isLoading } = useWallet()
  const [isOpen, setIsOpen] = useState(false)
  const [showTransactions, setShowTransactions] = useState(false)
  const [page, setPage] = useState(1)
  const { data: transactionsData } = useWalletTransactions(page, 10)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [dropdownTop, setDropdownTop] = useState(0)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setShowTransactions(false)
      }
    }

    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setDropdownTop(rect.bottom + 8)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

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
      <div className="p-2">
        <div className="border-gh-border h-5 w-5 animate-spin rounded-full border-2 border-t-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="text-gh-text hover:bg-gh-bg flex items-center gap-2 rounded-lg px-3 py-2 transition-colors"
        aria-label="Carteira"
      >
        <Coins className="h-5 w-5 text-yellow-600" />
        <span className="text-sm font-semibold">
          {wallet ? formatCurrency(wallet.balance) : '0,00'}
        </span>
      </button>

      {isOpen && (
        <div
          className="bg-gh-card border-gh-border fixed z-50 w-80 rounded-lg border shadow-lg"
          ref={dropdownRef}
          style={{ top: `${dropdownTop}px`, left: 'auto', right: '0' }}
        >
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
                    // TODO: Implementar modal de recarga
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

              <div className="max-h-96 overflow-y-auto">
                {transactionsData && transactionsData.transactions.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {transactionsData.transactions.map((transaction) => (
                      <div key={transaction.id} className="hover:bg-gh-bg p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 rounded-lg p-2 ${
                              transaction.type === TransactionType.CREDIT
                                ? 'bg-green-100'
                                : 'bg-red-100'
                            }`}
                          >
                            {transaction.type === TransactionType.CREDIT ? (
                              <TrendingUp className="h-5 w-5 text-green-600" />
                            ) : (
                              <TrendingDown className="h-5 w-5 text-red-600" />
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="text-gh-text text-sm font-medium">
                              {getCategoryLabel(transaction.category)}
                            </p>
                            {transaction.description && (
                              <p className="text-gh-text-secondary mt-1 text-xs">
                                {transaction.description}
                              </p>
                            )}
                            <p className="text-gh-text-secondary mt-1 text-xs">
                              {formatDate(transaction.createdAt)}
                            </p>
                          </div>

                          <div className="text-right">
                            <p
                              className={`text-sm font-semibold ${
                                transaction.type === TransactionType.CREDIT
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }`}
                            >
                              {transaction.type === TransactionType.CREDIT ? '+' : '-'}
                              {formatCurrency(transaction.amount)}
                            </p>
                            <p className="text-gh-text-secondary mt-1 text-xs">
                              Saldo: {formatCurrency(transaction.balanceAfter)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Clock className="text-gh-text-secondary mx-auto mb-3 h-12 w-12" />
                    <p className="text-gh-text-secondary">Nenhuma transação encontrada</p>
                  </div>
                )}

                {/* Paginação */}
                {transactionsData && transactionsData.totalPages > 1 && (
                  <div className="border-gh-border flex items-center justify-between border-t p-4">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="text-gh-text bg-gh-bg rounded px-3 py-1 text-sm hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    <span className="text-gh-text-secondary text-sm">
                      Página {page} de {transactionsData.totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(transactionsData.totalPages, p + 1))}
                      disabled={page === transactionsData.totalPages}
                      className="text-gh-text bg-gh-bg rounded px-3 py-1 text-sm hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Próxima
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
