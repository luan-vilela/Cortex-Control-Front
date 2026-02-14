/**
 * ADAPTER: Converte payloads antigos para nova arquitetura
 *
 * Este arquivo faz a ponte entre a interface antiga (que já funciona)
 * e a nova arquitetura event-sourcing do backend.
 */
import {
  CreateTransactionPayload,
  InstallmentPlanType,
  TransactionType as OldTransactionType,
  PaymentMode,
} from './index'
import {
  CalculationMethod,
  CreateTransactionGroupDto,
  GroupType,
  TransactionType as NewTransactionType,
  PlanType,
  SourceType,
} from './new-architecture'

// ========================================
// MAPPERS DE ENUM
// ========================================

function mapSourceType(sourceType: string): SourceType {
  const mapping: Record<string, SourceType> = {
    SERVICE_ORDER: SourceType.ORDER,
    PURCHASE_ORDER: SourceType.ORDER,
    INVOICE: SourceType.INVOICE,
    MANUAL: SourceType.MANUAL,
  }
  return mapping[sourceType] || SourceType.MANUAL
}

function mapTransactionType(type: OldTransactionType): NewTransactionType {
  switch (type) {
    case 'INCOME':
      return NewTransactionType.INCOME
    case 'EXPENSE':
      return NewTransactionType.EXPENSE
    default:
      return NewTransactionType.EXPENSE
  }
}

function mapPlanType(planType: InstallmentPlanType): PlanType {
  switch (planType) {
    case InstallmentPlanType.SIMPLE:
      return PlanType.SIMPLE
    case InstallmentPlanType.PRICE_TABLE:
      return PlanType.PRICE
    case InstallmentPlanType.SAC:
      return PlanType.COMPOUND
    default:
      return PlanType.SIMPLE
  }
}

// ========================================
// ADAPTER PRINCIPAL
// ========================================

export function adaptCreateTransactionPayload(
  oldPayload: CreateTransactionPayload
): CreateTransactionGroupDto {
  const paymentConfig = oldPayload.paymentConfig

  // Determinar o tipo de grupo baseado no modo de pagamento
  const groupType =
    paymentConfig.mode === PaymentMode.CASH ? GroupType.SINGLE : GroupType.INSTALLMENT

  // Base do payload
  const adapted: CreateTransactionGroupDto = {
    groupType,
    transactionType: mapTransactionType(oldPayload.transactionType || 'EXPENSE'),
    sourceType: mapSourceType(oldPayload.sourceType),
    sourceId: oldPayload.sourceId,
    totalAmount: oldPayload.amount,
    description: oldPayload.description,
  }

  // Adicionar personId apenas se existir e for válido
  // NOTA: actors[].workspaceId NÃO é personId - é o workspace
  // Por enquanto, não enviar personId até implementar corretamente
  // if (oldPayload.personId) {
  //   adapted.personId = oldPayload.personId
  // }

  // Se for parcelamento, adicionar configurações específicas
  if (paymentConfig.mode === PaymentMode.INSTALLMENT && 'numberOfInstallments' in paymentConfig) {
    adapted.numberOfInstallments = paymentConfig.numberOfInstallments
    adapted.downpaymentAmount = paymentConfig.downPayment || 0
    adapted.planType = mapPlanType(paymentConfig.planType || InstallmentPlanType.SIMPLE)
    adapted.calculationMethod = CalculationMethod.EQUAL_INSTALLMENTS
    adapted.firstDueDate = paymentConfig.firstInstallmentDate
      ? new Date(paymentConfig.firstInstallmentDate).toISOString().split('T')[0]
      : undefined
    adapted.intervalDays = paymentConfig.installmentIntervalDays || 30
  } else {
    // À vista - usar dueDate como firstDueDate
    adapted.firstDueDate = oldPayload.dueDate
      ? new Date(oldPayload.dueDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  }

  return adapted
}

// ========================================
// RESPONSE ADAPTER (Backend -> Frontend)
// ========================================

/**
 * Converte resposta da nova API para formato antigo
 * Isso permite que os componentes existentes continuem funcionando
 */
export function adaptTransactionGroupToOldFormat(group: any): any {
  // TODO: Implementar quando tivermos endpoint de listagem
  return {
    id: group.id,
    workspaceId: group.workspaceId,
    sourceType: 'MANUAL',
    sourceId: group.sourceId || '',
    transactionType: group.transactionType === NewTransactionType.RECEIVABLE ? 'INCOME' : 'EXPENSE',
    amount: group.totalAmount,
    description: group.description,
    dueDate: group.firstDueDate,
    status: group.status,
    parties: [],
  }
}
