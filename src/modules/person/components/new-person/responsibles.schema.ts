import { z } from 'zod'

export const responsibleSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string(),
  email: z.string().optional(),
  phones: z
    .array(
      z.object({
        number: z.string(),
        type: z.enum(['MOBILE', 'LANDLINE', 'WHATSAPP', 'FAX', 'COMMERCIAL']).optional(),
        owner: z.string().optional(),
        isPrimary: z.boolean().optional(),
      })
    )
    .optional(),
})

export const responsiblesSchema = z.array(responsibleSchema)

export const responsiblesFormSchema = z.object({
  responsibles: responsiblesSchema,
})

export type Responsible = z.infer<typeof responsibleSchema>
export type Responsibles = z.infer<typeof responsiblesSchema>
export type ResponsibleFormValues = z.infer<typeof responsiblesFormSchema>
