import type { InfoBlockFormValues } from '../components/info/infoBlock.types'
import type { InterestBlockFormValues } from '../components/interest/interestBlock.types'
import { InterestType } from '../components/interest/interestBlock.types'
import type { PaymentBlockFormValues } from '../components/payment/paymentBlock.types'
import { PaymentMode } from '../types'

interface ValidationResult {
  isValid: boolean
  errors: string[]
}

/**
 * Valida as regras de negócio de pagamento e juros/descontos
 * Deve ser chamado após todas as validações de formulário
 */
export function validatePayment(
  infoConfig: InfoBlockFormValues | undefined,
  paymentConfig: PaymentBlockFormValues | undefined,
  interestConfig?: InterestBlockFormValues | undefined
): ValidationResult {
  const errors: string[] = []

  // Se não houver dados, não validar
  if (!infoConfig || !paymentConfig) {
    return { isValid: true, errors: [] }
  }

  const amount = infoConfig.amount ?? 0

  // Formatar valores para exibição
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  // Validar quando modo for INSTALLMENT
  if (paymentConfig.mode === PaymentMode.INSTALLMENT) {
    const downPayment = paymentConfig.downPayment ?? 0

    // Valor de entrada deve ser menor que o valor total
    if (downPayment >= amount) {
      errors.push(
        `O valor de entrada (${formatCurrency(downPayment)}) deve ser menor que o valor total da transação (${formatCurrency(amount)}). O valor a ser parcelado nesse caso será: ${formatCurrency(amount - downPayment)}`
      )
    }

    // Valor de entrada não pode ser negativo
    if (downPayment < 0) {
      errors.push('O valor de entrada não pode ser negativo')
    }

    // Valor total deve ser maior que zero para parcelamento
    if (amount <= 0) {
      errors.push('O valor total deve ser maior que zero para pagamentos parcelados')
    }

    // Número de parcelas deve ser no mínimo 2
    if (!paymentConfig.numberOfInstallments || paymentConfig.numberOfInstallments < 2) {
      errors.push('O número de parcelas deve ser no mínimo 2')
    }

    // Data da primeira parcela é obrigatória para parcelamento
    if (!paymentConfig.firstInstallmentDate) {
      errors.push('A data da primeira parcela é obrigatória para pagamentos parcelados')
    }

    // Intervalo entre parcelas deve ser maior que zero
    if (!paymentConfig.installmentIntervalDays || paymentConfig.installmentIntervalDays <= 0) {
      errors.push('O intervalo entre parcelas deve ser maior que zero')
    }
  }

  // Validar juros/descontos se configurado
  if (interestConfig && interestConfig.type) {
    let discountAmount = 0

    // Calcular valor do desconto
    if (interestConfig.type === InterestType.PERCENTAGE && interestConfig.percentage) {
      if (interestConfig.percentage < 0) {
        // Desconto percentual
        discountAmount = Math.abs((amount * interestConfig.percentage) / 100)
      }
    } else if (interestConfig.type === InterestType.FLAT && interestConfig.flatAmount) {
      if (interestConfig.flatAmount < 0) {
        // Desconto fixo
        discountAmount = Math.abs(interestConfig.flatAmount)
      }
    }

    // Validar se desconto não é maior que o valor total
    if (discountAmount > 0 && discountAmount >= amount) {
      errors.push(
        `O desconto (${formatCurrency(discountAmount)}) não pode ser igual ou maior que o valor total da transação (${formatCurrency(amount)}). O valor final seria ${formatCurrency(amount - discountAmount)}.`
      )
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
