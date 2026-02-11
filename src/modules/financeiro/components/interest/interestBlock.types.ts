import { z } from 'zod'

export enum InterestType {
  PERCENTAGE = 'PERCENTAGE',
  FLAT = 'FLAT',
}

export const interestBlockSchema = z.object({
  type: z.nativeEnum(InterestType),
  percentage: z.number().optional(),
  flatAmount: z.number().optional(),
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
