import { z } from 'zod'

import { isValidDocument } from '@/lib/document-utils'

export const newPersonFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  document: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((value) => !value || isValidDocument(value), 'CPF ou CNPJ inválido'),
  address: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  state: z.string().max(2, 'Estado deve ter 2 caracteres').optional().or(z.literal('')),
  country: z.string().optional().or(z.literal('')),
  postalCode: z.string().optional().or(z.literal('')),
  website: z
    .string()
    .refine((val) => val === '' || /^https?:\/\/.+/.test(val), 'URL deve ser válida ou vazia')
    .optional()
    .or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  phones: z
    .array(
      z.object({
        number: z.string(),
        type: z.enum(['MOBILE', 'FONE', 'LANDLINE', 'WHATSAPP', 'FAX', 'COMMERCIAL']).optional(),
        owner: z.string().optional().or(z.literal('')),
        isPrimary: z.boolean().optional(),
      })
    )
    .optional(),
  responsibles: z
    .array(
      z.object({
        id: z.string().optional().or(z.literal('')),
        name: z.string().optional().or(z.literal('')),
        email: z.string().email('Email inválido').optional().or(z.literal('')),
        phones: z
          .array(
            z.object({
              number: z.string(),
              type: z
                .enum(['MOBILE', 'FONE', 'LANDLINE', 'WHATSAPP', 'FAX', 'COMMERCIAL'])
                .optional(),
              owner: z.string().optional().or(z.literal('')),
              isPrimary: z.boolean().optional(),
            })
          )
          .optional(),
      })
    )
    .optional(),
})

export type NewPersonFormData = z.infer<typeof newPersonFormSchema>
