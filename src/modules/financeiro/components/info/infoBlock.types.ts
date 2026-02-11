import { z } from 'zod'

// Zod schema para validação das informações básicas
export const infoBlockSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.number().min(0, 'Valor não pode ser negativo'),
  dueDate: z.date('Data de vencimento é obrigatória'),
  notes: z.string().optional(),
})

export type InfoBlockFormValues = z.infer<typeof infoBlockSchema>

export interface InfoBlockProps {
  initialValues?: Partial<InfoBlockFormValues>
  onDataChange?: (values: InfoBlockFormValues | undefined) => void
}

export interface InfoBlockRef {
  validate: () => Promise<boolean>
  getValues: () => InfoBlockFormValues
  clearDirty: () => void
}
