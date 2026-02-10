'use client'

import { Order } from '../types'

import { Eye, Trash2 } from 'lucide-react'
import Link from 'next/link'

import { formatCurrency, formatDate } from '@/lib/utils'

import { OrderPriorityBadge } from './OrderPriorityBadge'
import { OrderStatusBadge } from './OrderStatusBadge'

export function OrderList({
  orders,
  workspaceId,
  isLoading = false,
  onDelete,
}: {
  orders: Order[]
  workspaceId: string
  isLoading?: boolean
  onDelete?: (id: string) => void
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="border-gh-hover h-12 w-12 animate-spin rounded-full border-b-2"></div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gh-text-secondary text-sm">Nenhuma ordem de serviço encontrada</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="divide-gh-border min-w-full divide-y">
        <thead className="bg-gh-bg">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Ordem
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Cliente
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Valor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Prioridade
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
              Prazo
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-gh-border divide-y bg-white">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gh-bg transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <p className="text-gh-text truncate text-sm font-medium">{order.title}</p>
                  {order.description && (
                    <p className="text-gh-text-secondary max-w-xs truncate text-xs">
                      {order.description}
                    </p>
                  )}
                </div>
              </td>
              <td className="text-gh-text px-6 py-4 text-sm whitespace-nowrap">
                {order.client?.name || '-'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <p className="text-gh-text text-sm font-semibold">{formatCurrency(order.value)}</p>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <OrderPriorityBadge priority={order.priority} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <OrderStatusBadge status={order.status} />
              </td>
              <td className="text-gh-text-secondary px-6 py-4 text-sm whitespace-nowrap">
                {order.dueDate ? formatDate(new Date(order.dueDate)) : '-'}
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center gap-1 rounded px-3 py-1 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-800"
                  >
                    <Eye className="h-4 w-4" />
                    Ver
                  </Link>
                  {onDelete && (
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        if (confirm('Tem certeza que deseja deletar esta ordem de serviço?')) {
                          onDelete(order.id)
                        }
                      }}
                      className="inline-flex items-center gap-1 rounded px-3 py-1 text-red-600 transition-colors hover:bg-red-50 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                      Deletar
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
