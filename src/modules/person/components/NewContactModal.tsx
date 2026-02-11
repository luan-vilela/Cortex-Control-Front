'use client'

import React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import { FormInput } from '@/components/FormInput'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAlerts } from '@/contexts/AlertContext'
import { isValidCpf } from '@/lib/document-utils'
import { PhoneInput } from '@/modules/person/components/PhoneInput'
import { useCpfCnpj } from '@/modules/person/hooks/useCpfCnpj'
import { useCreatePerson } from '@/modules/person/hooks/usePersonMutations'
import { personService } from '@/modules/person/services/person.service'
import { PhoneType } from '@/modules/person/types/person.types'
import { useWorkspaceStore } from '@/modules/workspace/store/workspace.store'

const newContactSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  document: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((value) => !value || isValidCpf(value.replace(/\D/g, '')), 'CPF inválido'),
  phones: z
    .array(
      z.object({
        number: z.string(),
        type: z.nativeEnum(PhoneType).optional(),
        owner: z.string().optional().or(z.literal('')),
        isPrimary: z.boolean().optional(),
      })
    )
    .optional(),
})

type NewContactFormData = z.infer<typeof newContactSchema>

interface NewContactModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (created: any) => void
  onAttachedExisting: (existing: any) => void
}

export const NewContactModal: React.FC<NewContactModalProps> = ({
  open,
  onOpenChange,
  onCreated,
  onAttachedExisting,
}) => {
  const { activeWorkspace } = useWorkspaceStore()
  const alerts = useAlerts()
  const { formatDocument } = useCpfCnpj()

  const createMutation = useCreatePerson(activeWorkspace?.id || '')

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,

    clearErrors,
  } = useForm<NewContactFormData>({
    resolver: zodResolver(newContactSchema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    defaultValues: {
      name: '',
      email: '',
      document: '',
      phones: [],
    },
  })

  const mapFormToCreatePhones = (phones: any[] | undefined) => {
    if (!phones) return []
    return phones.map((p: any) => ({
      number: p.number || '',
      type: p?.type || 'MOBILE',
      isPrimary: !!p.isPrimary,
      owner: p.owner || undefined,
    }))
  }

  const handleSave = async (data: NewContactFormData) => {
    if (!activeWorkspace) return

    if (data.document && data.document.trim()) {
      const digits = data.document.replace(/\D/g, '')
      if (digits.length > 0) {
        const found = await personService.getPersons(activeWorkspace.id, {
          search: digits,
        })
        const match = (found || []).find(
          (p: any) => (p.document || '').replace(/\D/g, '') === digits
        )
        if (match) {
          onAttachedExisting(match)
          reset()
          onOpenChange(false)
          return
        }
      }
    }

    const payload: any = { name: data.name.trim(), active: true }
    if (data.email && data.email.trim()) payload.email = data.email.trim()
    if (data.document && data.document.trim()) payload.document = data.document.trim()
    if (data.phones && data.phones.length > 0)
      payload.phones = mapFormToCreatePhones(data.phones.filter((p) => p.number && p.number.trim()))

    createMutation.mutate(payload, {
      onSuccess: (created) => {
        onCreated(created)
        reset()
        onOpenChange(false)
      },
      onError: async (error: any) => {
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Erro ao criar contato rápido'

        console.warn('Error creating contact:', error.response?.data || error)
        alerts.error(message)
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo contato</DialogTitle>
          <DialogDescription>Cadastre um contato rápido (nome, email, telefones)</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <FormInput
                {...field}
                label="Nome"
                placeholder="Nome completo"
                onChange={(e) => {
                  field.onChange(e)
                  if (errors.name) clearErrors('name')
                }}
                error={errors.name?.message}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <FormInput
                {...field}
                label="Email"
                placeholder="email@exemplo.com"
                onChange={(e) => {
                  field.onChange(e)
                  if (errors.email) clearErrors('email')
                }}
                error={errors.email?.message}
              />
            )}
          />
          <Controller
            name="document"
            control={control}
            render={({ field }) => (
              <FormInput
                {...field}
                label="CPF"
                placeholder="000.000.000-00"
                onChange={(e: any) => {
                  const digits = (e.target.value || '').replace(/\D/g, '').slice(0, 11)
                  const formatted = formatDocument(digits)
                  field.onChange(formatted)
                  if (errors.document) clearErrors('document')
                }}
                error={errors.document?.message}
              />
            )}
          />
          <div>
            <div className="text-gh-text-secondary mb-2 text-xs">Telefones</div>
            <Controller
              name="phones"
              control={control}
              render={({ field }) => (
                <PhoneInput phones={field.value || []} onChange={field.onChange} />
              )}
            />
          </div>
        </div>

        <DialogFooter>
          <div className="flex w-full items-center justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit(handleSave)}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default NewContactModal
