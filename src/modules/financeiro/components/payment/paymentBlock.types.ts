import { InstallmentPlanType, PaymentMode } from '../../types'

import { z } from 'zod'

// Zod schema para validação
export const paymentBlockSchema = z.discriminatedUnion('mode', [
  // Schema para pagamento à vista
  z.object({
    mode: z.literal(PaymentMode.CASH),
  }),
  // Schema para pagamento parcelado
  z.object({
    mode: z.literal(PaymentMode.INSTALLMENT),
    numberOfInstallments: z.number().min(2, 'Número de parcelas deve ser no mínimo 2'),
    downPayment: z.number().min(0, 'Entrada deve ser maior ou igual a zero').optional(),
    downPaymentDate: z.date().optional(),
    downPaymentIsPaid: z.boolean().optional(),
    planType: z.nativeEnum(InstallmentPlanType),
    firstInstallmentDate: z.date('Data da primeira parcela é obrigatória'),
    installmentIntervalDays: z.number().min(1, 'Intervalo deve ser pelo menos 1 dia'),
  }),
])

export type PaymentBlockFormValues = z.infer<typeof paymentBlockSchema>

export interface PaymentConfigProps {
  initialValues?: PaymentBlockFormValues
  onDataChange?: (values: PaymentBlockFormValues | undefined) => void
}

export interface PaymentConfigRef {
  validate: () => Promise<boolean>
  getValues: () => PaymentBlockFormValues
  clearDirty: () => void
}
