import { z } from 'zod'

export const RECURRENCE_LABELS = {
  DAILY: 'Diária',
  WEEKLY: 'Semanal',
  BIWEEKLY: 'Quinzenal',
  MONTHLY: 'Mensal',
  QUARTERLY: 'Trimestral',
  SEMIANNUAL: 'Semestral',
  ANNUAL: 'Anual',
} as const

export const recurrenceBlockSchema = z.object({
  type: z
    .enum(['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'SEMIANNUAL', 'ANNUAL'])
    .optional(),
  occurrences: z
    .number()
    .min(1, { message: 'Número de repetições deve ser pelo menos 1' })
    .optional(),
  endDate: z.date().optional(),
})

export type RecurrenceBlockFormValues = z.infer<typeof recurrenceBlockSchema>

export interface RecurrenceConfigComponentProps {
  initialValues?: Partial<RecurrenceBlockFormValues>
  onDataChange?: (values: RecurrenceBlockFormValues) => void
}

export interface RecurrenceConfigComponentRef {
  validate: () => Promise<boolean>
  getValues: () => RecurrenceBlockFormValues
  clearDirty: () => void
}
