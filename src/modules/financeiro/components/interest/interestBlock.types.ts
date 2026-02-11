import { z } from 'zod'

export enum InterestType {
  PERCENTAGE = 'PERCENTAGE',
  FLAT = 'FLAT',
}

export const interestBlockSchema = z
  .object({
    type: z.nativeEnum(InterestType).optional(),
    percentage: z.number().optional(),
    flatAmount: z.number().optional(),
    description: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.type) return

    if (data.type === InterestType.PERCENTAGE) {
      if (!data.percentage || data.percentage <= 0) {
        ctx.addIssue({
          path: ['percentage'],
          message: 'Taxa percentual deve ser maior que 0',
          code: 'custom',
        })
      }
    }

    if (data.type === InterestType.FLAT) {
      if (!data.flatAmount || data.flatAmount <= 0) {
        ctx.addIssue({
          path: ['flatAmount'],
          message: 'Valor fixo deve ser maior que 0',
          code: 'custom',
        })
      }
    }
  })

export type InterestBlockFormValues = z.infer<typeof interestBlockSchema>

export const INTEREST_LABELS: Record<InterestType, string> = {
  [InterestType.PERCENTAGE]: 'Percentual',
  [InterestType.FLAT]: 'Valor Fixo',
}

export interface InterestConfigProps {
  initialValues?: InterestBlockFormValues
  onDataChange?: (data: InterestBlockFormValues | undefined) => void
}

export interface InterestConfigRef {
  validate: () => Promise<boolean>
  getValues: () => InterestBlockFormValues
  clearDirty: () => void
}
