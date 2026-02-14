'use client'

import { TrendingDown, TrendingUp, Wallet } from 'lucide-react'

interface TransactionSummaryCardsProps {
  totalIncome: number
  totalExpense: number
  balance: number
  isLoading?: boolean
}

export function TransactionSummaryCards({
  totalIncome,
  totalExpense,
  balance,
  isLoading,
}: TransactionSummaryCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
          >
            <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-4 h-8 w-32 rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Total Entradas */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gh-text-secondary text-sm font-medium">Total de Entradas</p>
            <p className="mt-2 text-3xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>

      {/* Total Saídas */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gh-text-secondary text-sm font-medium">Total de Saídas</p>
            <p className="mt-2 text-3xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
          </div>
          <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
            <TrendingDown className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>

      {/* Balanço */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gh-text-secondary text-sm font-medium">Balanço</p>
            <p
              className={`mt-2 text-3xl font-bold ${
                balance >= 0 ? 'text-blue-600' : 'text-orange-600'
              }`}
            >
              {formatCurrency(balance)}
            </p>
          </div>
          <div
            className={`rounded-full p-3 ${
              balance >= 0
                ? 'bg-blue-100 dark:bg-blue-900/20'
                : 'bg-orange-100 dark:bg-orange-900/20'
            }`}
          >
            <Wallet className={`h-6 w-6 ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
          </div>
        </div>
      </div>
    </div>
  )
}
