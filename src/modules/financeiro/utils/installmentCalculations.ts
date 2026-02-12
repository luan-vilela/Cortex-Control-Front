export interface InstallmentData {
  number: number
  value: number
  interest: number
  amortization: number
  saldoDevedor: number
}

export interface InstallmentResult {
  installments: InstallmentData[]
  installmentAmount: number
  financed: number
  totalAmount: number
  adjustmentAmount: number
}

/**
 * Calcula parcelas simples (divisão direta)
 * Para SIMPLE: taxa/ajuste é aplicado como acréscimo ao valor base e distribuído igualmente nas parcelas
 */
export function calculateSimpleInstallments(
  baseAmount: number,
  downPayment: number,
  numberOfInstallments: number,
  interestPercentage?: number, // Taxa em porcentagem (ex: 10 para 10%)
  flatAmount?: number // Valor fixo de ajuste
): InstallmentResult {
  // Para SIMPLE, calcular o ajuste (percentual ou fixo)
  let adjustmentAmount = 0
  if (interestPercentage !== undefined) {
    adjustmentAmount = (baseAmount * interestPercentage) / 100
  } else if (flatAmount !== undefined) {
    adjustmentAmount = flatAmount
  }

  const totalAmount = baseAmount + adjustmentAmount
  const financed = totalAmount - downPayment
  const installmentAmount = financed / numberOfInstallments

  // Distribuir juros igualmente entre as parcelas
  const interestPerInstallment = adjustmentAmount / numberOfInstallments

  let saldoDevedor = financed
  const installments: InstallmentData[] = []

  for (let i = 0; i < numberOfInstallments; i++) {
    const interest = interestPerInstallment
    const amortization = installmentAmount - interest
    const value = installmentAmount
    saldoDevedor = saldoDevedor - amortization

    installments.push({
      number: i + 1,
      value,
      interest,
      amortization,
      saldoDevedor: saldoDevedor < 0.01 ? 0 : saldoDevedor,
    })
  }

  return {
    installments,
    installmentAmount,
    financed,
    totalAmount,
    adjustmentAmount,
  }
}

/**
 * Calcula parcelas pela Tabela Price (parcelas fixas com juros compostos)
 * Para PRICE: taxa percentual é APENAS taxa de juros, NÃO aumenta o valor base
 */
export function calculatePriceTableInstallments(
  baseAmount: number,
  downPayment: number,
  numberOfInstallments: number,
  interestPercentage?: number // Taxa em porcentagem (ex: 10 para 10%)
): InstallmentResult {
  const financed = baseAmount - downPayment
  const n = numberOfInstallments
  const i = interestPercentage ? interestPercentage / 100 : 0

  let installmentAmount: number
  if (i === 0) {
    installmentAmount = financed / n
  } else {
    // Fórmula da Tabela Price: PMT = PV * (i * (1+i)^n) / ((1+i)^n - 1)
    installmentAmount = (financed * (i * Math.pow(1 + i, n))) / (Math.pow(1 + i, n) - 1)
  }

  let saldoDevedor = financed
  const installments: InstallmentData[] = []

  for (let idx = 0; idx < n; idx++) {
    const interest = saldoDevedor * i
    const amortization = installmentAmount - interest
    const value = installmentAmount
    saldoDevedor = saldoDevedor - amortization

    installments.push({
      number: idx + 1,
      value,
      interest,
      amortization,
      saldoDevedor: saldoDevedor < 0.01 ? 0 : saldoDevedor,
    })
  }

  // Total = entrada + soma de todas as parcelas
  const totalAmount = downPayment + installmentAmount * n
  // Ajuste = total pago - valor base (juros totais pagos)
  const adjustmentAmount = totalAmount - baseAmount

  return {
    installments,
    installmentAmount,
    financed,
    totalAmount,
    adjustmentAmount,
  }
}

/**
 * Calcula parcelas pelo SAC (Sistema de Amortização Constante)
 * Para SAC: taxa percentual é APENAS taxa de juros, NÃO aumenta o valor base
 */
export function calculateSACInstallments(
  baseAmount: number,
  downPayment: number,
  numberOfInstallments: number,
  interestPercentage?: number // Taxa em porcentagem (ex: 10 para 10%)
): InstallmentResult {
  const financed = baseAmount - downPayment
  const n = numberOfInstallments
  const i = interestPercentage ? interestPercentage / 100 : 0
  const constantAmortization = financed / n

  let saldoDevedor = financed
  const installments: InstallmentData[] = []

  for (let idx = 0; idx < n; idx++) {
    const interest = saldoDevedor * i
    const amortization = constantAmortization
    const value = amortization + interest
    saldoDevedor = saldoDevedor - amortization

    installments.push({
      number: idx + 1,
      value,
      interest,
      amortization,
      saldoDevedor: saldoDevedor < 0.01 ? 0 : saldoDevedor,
    })
  }

  const installmentAmount = installments[0]?.value || 0

  // Total = entrada + soma de todas as parcelas
  const totalAmount = downPayment + installments.reduce((acc, inst) => acc + inst.value, 0)
  // Ajuste = total pago - valor base (juros totais pagos)
  const adjustmentAmount = totalAmount - baseAmount

  return {
    installments,
    installmentAmount,
    financed,
    totalAmount,
    adjustmentAmount,
  }
}

/**
 * Calcula ajustes (juros/taxas) para pagamento à vista
 * Suporta tanto valor percentual quanto valor fixo
 */
export function calculateCashPaymentAdjustment(
  baseAmount: number,
  adjustmentType: 'PERCENTAGE' | 'FLAT',
  adjustmentValue?: number
): {
  baseAmount: number
  adjustmentAmount: number
  totalAmount: number
  adjustmentLabel: string
} {
  let adjustmentAmount = 0
  let adjustmentLabel = ''

  if (adjustmentType === 'PERCENTAGE' && adjustmentValue !== undefined) {
    adjustmentAmount = baseAmount * (adjustmentValue / 100)
    adjustmentLabel = `${adjustmentValue}%`
  } else if (adjustmentType === 'FLAT' && adjustmentValue !== undefined) {
    adjustmentAmount = adjustmentValue
    adjustmentLabel = 'Valor Fixo'
  }

  const totalAmount = baseAmount + adjustmentAmount

  return {
    baseAmount,
    adjustmentAmount,
    totalAmount,
    adjustmentLabel,
  }
}
