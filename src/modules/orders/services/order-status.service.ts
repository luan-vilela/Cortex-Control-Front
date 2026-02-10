import { OrderStatus } from '../types'

/**
 * Valida se uma transição de status é permitida
 */
export const validateStatusTransition = (from: OrderStatus, to: OrderStatus): boolean => {
  const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.DRAFT]: [OrderStatus.OPEN, OrderStatus.CANCELED],
    [OrderStatus.OPEN]: [OrderStatus.SCHEDULED, OrderStatus.CANCELED],
    [OrderStatus.SCHEDULED]: [OrderStatus.IN_PROGRESS, OrderStatus.CANCELED],
    [OrderStatus.IN_PROGRESS]: [
      OrderStatus.WAITING_CLIENT,
      OrderStatus.WAITING_RESOURCES,
      OrderStatus.COMPLETED,
      OrderStatus.CANCELED,
    ],
    [OrderStatus.WAITING_CLIENT]: [OrderStatus.IN_PROGRESS, OrderStatus.CANCELED],
    [OrderStatus.WAITING_RESOURCES]: [OrderStatus.IN_PROGRESS, OrderStatus.CANCELED],
    [OrderStatus.COMPLETED]: [OrderStatus.INVOICED, OrderStatus.CANCELED],
    [OrderStatus.INVOICED]: [OrderStatus.CLOSED, OrderStatus.CANCELED],
    [OrderStatus.CLOSED]: [], // Estado final
    [OrderStatus.CANCELED]: [], // Estado final
  }

  return allowedTransitions[from]?.includes(to) ?? false
}

/**
 * Retorna o próximo status possível para um determinado status atual
 */
export const getNextPossibleStatuses = (currentStatus: OrderStatus): OrderStatus[] => {
  const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.DRAFT]: [OrderStatus.OPEN, OrderStatus.CANCELED],
    [OrderStatus.OPEN]: [OrderStatus.SCHEDULED, OrderStatus.CANCELED],
    [OrderStatus.SCHEDULED]: [OrderStatus.IN_PROGRESS, OrderStatus.CANCELED],
    [OrderStatus.IN_PROGRESS]: [
      OrderStatus.WAITING_CLIENT,
      OrderStatus.WAITING_RESOURCES,
      OrderStatus.COMPLETED,
      OrderStatus.CANCELED,
    ],
    [OrderStatus.WAITING_CLIENT]: [OrderStatus.IN_PROGRESS, OrderStatus.CANCELED],
    [OrderStatus.WAITING_RESOURCES]: [OrderStatus.IN_PROGRESS, OrderStatus.CANCELED],
    [OrderStatus.COMPLETED]: [OrderStatus.INVOICED, OrderStatus.CANCELED],
    [OrderStatus.INVOICED]: [OrderStatus.CLOSED, OrderStatus.CANCELED],
    [OrderStatus.CLOSED]: [], // Estado final
    [OrderStatus.CANCELED]: [], // Estado final
  }

  return allowedTransitions[currentStatus] || []
}

/**
 * Verifica se um status é final (não pode ser alterado)
 */
export const isFinalStatus = (status: OrderStatus): boolean => {
  return [OrderStatus.CLOSED, OrderStatus.CANCELED].includes(status)
}

/**
 * Retorna o status padrão para novas ordens
 */
export const getDefaultStatus = (): OrderStatus => {
  return OrderStatus.DRAFT
}

/**
 * Labels descritivos para os status (para uso em interfaces)
 */
export const getStatusLabel = (status: OrderStatus): string => {
  const labels: Record<OrderStatus, string> = {
    [OrderStatus.DRAFT]: 'Rascunho',
    [OrderStatus.OPEN]: 'Aberta',
    [OrderStatus.SCHEDULED]: 'Agendada',
    [OrderStatus.IN_PROGRESS]: 'Em Execução',
    [OrderStatus.WAITING_CLIENT]: 'Aguardando Cliente',
    [OrderStatus.WAITING_RESOURCES]: 'Aguardando Recursos',
    [OrderStatus.COMPLETED]: 'Concluída',
    [OrderStatus.INVOICED]: 'Faturada',
    [OrderStatus.CLOSED]: 'Encerrada',
    [OrderStatus.CANCELED]: 'Cancelada',
  }

  return labels[status] || status
}

/**
 * Descrições detalhadas dos status
 */
export const getStatusDescription = (status: OrderStatus): string => {
  const descriptions: Record<OrderStatus, string> = {
    [OrderStatus.DRAFT]: 'Ordem em elaboração, ainda não formalizada',
    [OrderStatus.OPEN]: 'Ordem formalizada e pronta para agendamento',
    [OrderStatus.SCHEDULED]: 'Ordem com data/hora definida para execução',
    [OrderStatus.IN_PROGRESS]: 'Ordem em execução no campo ou oficina',
    [OrderStatus.WAITING_CLIENT]: 'Execução pausada aguardando ação do cliente',
    [OrderStatus.WAITING_RESOURCES]: 'Execução pausada aguardando materiais/recursos',
    [OrderStatus.COMPLETED]: 'Execução operacional finalizada com sucesso',
    [OrderStatus.INVOICED]: 'Ordem faturada/cobrança emitida',
    [OrderStatus.CLOSED]: 'Ordem finalizada e paga (estado final)',
    [OrderStatus.CANCELED]: 'Ordem cancelada permanentemente (estado final)',
  }

  return descriptions[status] || ''
}
