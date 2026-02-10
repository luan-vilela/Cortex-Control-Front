'use client'

import React, { useRef } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'

import { FormInput } from '@/components/FormInput'
import { FormTextarea } from '@/components/FormTextarea'
import { Button } from '@/components/ui/button'
import { useAlerts } from '@/contexts/AlertContext'
import { AddressSection } from '@/modules/person/components/NewPersonAddressSection'
import { BasicInfoSection } from '@/modules/person/components/NewPersonBasicInfoSection'
import { PhonesSection } from '@/modules/person/components/NewPersonPhonesSection'
import { ResponsiblesBlock } from '@/modules/person/components/new-person/responsibles.block'
import { type Responsibles } from '@/modules/person/components/new-person/responsibles.schema'
import { useNewPersonForm } from '@/modules/person/hooks/useNewPersonForm'
import { useCreatePerson } from '@/modules/person/hooks/usePersonMutations'
import {
  type NewPersonFormData,
  newPersonFormSchema,
} from '@/modules/person/schemas/new-person.schema'
import { ModuleGuard } from '@/modules/workspace/components/ModuleGuard'
import { useBreadcrumb } from '@/modules/workspace/hooks'
import { useWorkspaceStore } from '@/modules/workspace/store/workspace.store'

export default function NewPersonPage() {
  const router = useRouter()
  const { activeWorkspace } = useWorkspaceStore()
  const alerts = useAlerts()
  const { handleCepBlur, formatCepInput } = useNewPersonForm()
  const createMutation = useCreatePerson(activeWorkspace?.id || '')
  const responsiblesRef = useRef<any>(null)

  const handleResponsiblesChange = (responsibles?: Responsibles) => {
    // Quando os responsáveis mudam, podemos propagar para o form principal se necessário
    // Por enquanto, mantemos isolado no bloco
    console.log('Responsibles changed:', responsibles)
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<NewPersonFormData>({
    resolver: zodResolver(newPersonFormSchema),
    defaultValues: {
      name: '',
      email: '',
      document: '',
      address: '',
      city: '',
      state: '',
      country: 'Brasil',
      postalCode: '',
      website: '',
      notes: '',
      phones: undefined,
      responsibles: undefined,
    },
  })

  useBreadcrumb([
    {
      label: 'Contatos',
      href: '/contatos',
    },
    {
      label: 'Nova Pessoa',
      href: '/contatos/new',
    },
  ])

  const onSubmit = async (data: NewPersonFormData) => {
    // Validação adicional: verificar se nome está vazio
    if (!data.name || data.name.trim() === '') {
      alerts.error('Nome é obrigatório. Por favor, preencha o campo nome antes de salvar.')
      // Sinalizar erro no campo de responsáveis também
      responsiblesRef.current?.setFieldError('É necessário preencher o nome antes de salvar.')
      return
    }

    // Validar o bloco de responsáveis
    const responsiblesValid = await responsiblesRef.current?.validate()

    if (!responsiblesValid) {
      alerts.error('Por favor, corrija os erros nos campos de responsáveis.')
      return
    }

    // Preparar dados limpos
    const cleanData: any = {
      name: data.name,
      active: true,
    }

    if (data.email && data.email.trim()) cleanData.email = data.email
    if (data.document && data.document.trim()) cleanData.document = data.document
    if (data.website && data.website.trim()) cleanData.website = data.website
    if (data.address && data.address.trim()) cleanData.address = data.address
    if (data.city && data.city.trim()) cleanData.city = data.city
    if (data.state && data.state.trim()) cleanData.state = data.state
    if (data.country && data.country.trim()) cleanData.country = data.country
    if (data.postalCode && data.postalCode.trim()) cleanData.postalCode = data.postalCode
    if (data.notes && data.notes.trim()) cleanData.notes = data.notes
    if (data.phones && data.phones.length > 0) {
      cleanData.phones = data.phones.filter((p) => p.number?.trim())
    }

    // Obter responsáveis do bloco
    const responsiblesData = responsiblesRef.current?.getValues()
    if (responsiblesData && responsiblesData.length > 0) {
      const validResponsibles = responsiblesData.filter(
        (r: any) => r.id && r.id.toString().trim() && r.name && r.name.trim()
      )
      if (validResponsibles.length > 0) {
        cleanData.responsibles = validResponsibles
        // Also provide array of ids for backend convenience
        cleanData.responsibleIds = validResponsibles.map((r: any) => r.id).filter(Boolean)
      }
    }

    createMutation.mutate(cleanData, {
      onSuccess: () => {
        alerts.success('Pessoa criada com sucesso!')
        router.push('/contatos')
      },
      onError: (error: any) => {
        alerts.error(error.response?.data?.message || 'Erro ao criar pessoa')
      },
    })
  }

  if (!activeWorkspace) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gh-text-secondary">Selecione um workspace</p>
      </div>
    )
  }

  return (
    <ModuleGuard moduleId="contacts" workspaceId={activeWorkspace?.id}>
      <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* Header com Botões */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <h2 className="text-gh-text mb-1 text-xl font-bold sm:text-2xl">Nova Pessoa</h2>
            <p className="text-gh-text-secondary text-xs sm:text-sm">
              Cadastre uma nova pessoa. Os papéis são definidos automaticamente pelo sistema com
              base nas ações e processos do sistema.
            </p>
          </div>

          <div className="flex w-full gap-2 md:w-auto">
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 md:flex-none"
              onClick={() => router.push('/contatos')}
            >
              Descartar
            </Button>
            <Button
              variant="default"
              size="sm"
              type="submit"
              form="new-person-form"
              disabled={createMutation.isPending}
              className="flex-1 md:flex-none"
            >
              {createMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>

        {/* Formulário */}
        <form id="new-person-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <BasicInfoSection control={control} errors={errors} />
          <PhonesSection control={control} />
          <AddressSection
            control={control}
            errors={errors}
            setValue={setValue}
            formatCepInput={formatCepInput}
            onCepBlur={handleCepBlur}
          />
          <div className="bg-gh-card border-gh-border rounded-md border p-4 sm:p-6">
            <h3 className="text-gh-text mb-4 text-sm font-semibold sm:text-base">Website</h3>

            <Controller
              name="website"
              control={control}
              render={({ field }) => (
                <FormInput
                  {...field}
                  type="url"
                  placeholder="https://exemplo.com"
                  error={errors.website?.message}
                />
              )}
            />
          </div>
          <div className="bg-gh-card border-gh-border rounded-md border p-4 sm:p-6">
            <h3 className="text-gh-text mb-4 text-sm font-semibold sm:text-base">Observações</h3>

            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <FormTextarea
                  {...field}
                  rows={4}
                  placeholder="Notas, comentários ou informações adicionais..."
                  error={errors.notes?.message}
                />
              )}
            />
          </div>
          <ResponsiblesBlock ref={responsiblesRef} onChange={handleResponsiblesChange} />{' '}
        </form>
      </div>
    </ModuleGuard>
  )
}
