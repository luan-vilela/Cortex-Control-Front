import { z } from 'zod'

import { isValidCpf } from '@/lib/document-utils'

export const basicInfoSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  document: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => {
      if (!val) return true
      const digits = val.replace(/\D/g, '')
      return isValidCpf(digits)
    }, 'CPF inválido'),
})

export const phonesSchema = z.array(
  z.object({
    number: z.string(),
    type: z.enum(['MOBILE', 'FONE', 'LANDLINE', 'WHATSAPP', 'FAX', 'COMMERCIAL']).optional(),
    owner: z.string().optional().or(z.literal('')),
    isPrimary: z.boolean().optional(),
  })
)

export const newContactSchema = basicInfoSchema.extend({ phones: phonesSchema })

export type BasicInfo = z.infer<typeof basicInfoSchema>
export type Phones = z.infer<typeof phonesSchema>
export type NewContactForm = z.infer<typeof newContactSchema>
