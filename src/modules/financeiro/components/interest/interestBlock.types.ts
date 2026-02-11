import { z } from 'zod'

export enum InterestType {
  PERCENTAGE = 'PERCENTAGE',
  FLAT = 'FLAT',
}

export const interestBlockSchema = z
  .object({
    // Aba 1: Taxas e Ajustes (altera valor agora)
    type: z.nativeEnum(InterestType).optional(),
    percentage: z.number().optional(),
    flatAmount: z.number().optional(),
    description: z.string().optional(),

    // Aba 2: Multa e Mora (metadados para futuro)
    penaltyPercentage: z.number().optional(), // Multa fixa %
    interestPerMonth: z.number().optional(), // Juros de mora % ao mês
  })
  .superRefine((data, ctx) => {
    if (!data.type) return

    if (data.type === InterestType.PERCENTAGE) {
      if (data.percentage === undefined || data.percentage === 0) {
        ctx.addIssue({
          path: ['percentage'],
          message:
            'Taxa percentual não pode ser zero. Use valores positivos para juros ou negativos para desconto',
          code: 'custom',
        })
      }
    }

    if (data.type === InterestType.FLAT) {
      if (data.flatAmount === undefined || data.flatAmount === 0) {
        ctx.addIssue({
          path: ['flatAmount'],
          message:
            'Valor não pode ser zero. Use valores positivos para juros ou negativos para desconto',
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
