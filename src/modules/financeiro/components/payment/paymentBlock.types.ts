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
    planType: z.nativeEnum(InstallmentPlanType),
    numberOfInstallments: z.number().min(1, 'Número de parcelas deve ser pelo menos 1'),
    firstInstallmentDate: z.date(),
    installmentIntervalDays: z.number(),
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
