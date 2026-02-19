/**
 * ADAPTER: Converte payloads antigos para nova arquitetura
 *
 * Este arquivo faz a ponte entre a interface antiga (que já funciona)
 * e a nova arquitetura event-sourcing do backend.
 */
import {
  type CreateTransactionPayload,
  InstallmentPlanType,
  type TransactionType as OldTransactionType,
  PaymentMode,
} from './index'
import {
  CalculationMethod,
  type CreateTransactionGroupDto,
  GroupType,
  TransactionType as NewTransactionType,
  PlanType,
  SourceType,
  FineType,
  InterestType,
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
    transactionType: mapTransactionType(oldPayload.transactionType || ('EXPENSE' as OldTransactionType)),
    sourceType: mapSourceType(oldPayload.sourceType),
    sourceId: oldPayload.sourceId,
    totalAmount: oldPayload.amount,
    description: oldPayload.description,
    downPaymentIsPaid: false,
    personId: ''
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
    adapted.downPaymentIsPaid = paymentConfig.downPaymentIsPaid ?? false
    adapted.planType = mapPlanType(paymentConfig.planType || InstallmentPlanType.SIMPLE)
    adapted.calculationMethod = CalculationMethod.FIXED // Por enquanto, usar FIXED como default
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

  // Adicionar recorrência se existir
  if (oldPayload.recurrenceConfig?.type) {
    adapted.recurrenceConfig = {
      frequency: oldPayload.recurrenceConfig.type as any,
      // Enviar apenas occurrences OU endDate, nunca ambos
      occurrences: oldPayload.recurrenceConfig.endDate
        ? undefined
        : oldPayload.recurrenceConfig.occurrences,
      endDate: oldPayload.recurrenceConfig.endDate
        ? new Date(oldPayload.recurrenceConfig.endDate).toISOString().split('T')[0]
        : undefined,
    }
  }

  // Aplicar taxas imediatas (Aba 1 - "Taxas e Ajustes")
  if (oldPayload.interestConfig?.type) {
    adapted.chargeConfig = {
      chargeType: oldPayload.interestConfig.type,
      chargeValue:
        oldPayload.interestConfig.type === 'PERCENTAGE'
          ? oldPayload.interestConfig.percentage!
          : oldPayload.interestConfig.flatAmount!,
      description: oldPayload.interestConfig.description || undefined,
    }
  }

  // Adicionar configuração de juros/multa de atraso (Aba 2 - "Multa e Mora")
  // Apenas se tiver penaltyPercentage OU interestPercentage
  if (
    oldPayload.interestConfig &&
    (oldPayload.interestConfig.penaltyPercentage || oldPayload.interestConfig.interestPercentage)
  ) {
    adapted.interestConfig = {
      fineType: FineType.PERCENTAGE, // Multa sempre em percentual
      fineValue: oldPayload.interestConfig.penaltyPercentage || 0,
      interestType: oldPayload.interestConfig.interestPeriod === 'ANNUAL' ? InterestType.MONTHLY : InterestType.DAILY,
      interestValue: oldPayload.interestConfig.interestPercentage || 0,
      graceDays: 0,
      description: oldPayload.interestConfig.description,
    }
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
    transactionType: group.transactionType === NewTransactionType.INCOME ? 'INCOME' : 'EXPENSE',
    amount: group.totalAmount,
    description: group.description,
    dueDate: group.firstDueDate,
    status: group.status,
    parties: [],
  }
}
