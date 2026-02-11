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

export const recurrenceBlockSchema = z
  .object({
    type: z
      .enum(['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'SEMIANNUAL', 'ANNUAL'])
      .optional(),
    endDateType: z.enum(['occurrences', 'date']).optional(),
    occurrences: z
      .number({
        message: 'Número de repetições deve ser pelo menos 1',
      })
      .min(1, 'Número de repetições deve ser pelo menos 1')
      .optional(),
    endDate: z.date().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.type) return

    if (data.endDateType === 'occurrences') {
      if (!data.occurrences) {
        ctx.addIssue({
          path: ['occurrences'],
          message: 'Informe a quantidade de repetições',
          code: 'custom',
        })
      }
    }

    if (data.endDateType === 'date') {
      if (!data.endDate || data.endDate === undefined) {
        ctx.addIssue({
          path: ['endDate'],
          message: 'Informe a data final',
          code: 'custom',
        })
      }
    }
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
