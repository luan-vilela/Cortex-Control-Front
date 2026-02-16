'use client'

import { useAddProcessoActor, useCreateProcesso } from '../hooks/useProcessos'
import { type ProcessTemplate, PROCESS_TEMPLATES } from '../templates'
import { ActorRole, ProcessStatus, ProcessType } from '../types'
import { SubProcessSection, type SubProcessFormItem } from './SubProcessSection'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  Building,
  DollarSign,
  FileText,
  Headphones,
  Package,
  Scale,
  Truck,
  UserPlus,
  Wrench,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { DatePicker } from '@/components/patterns/DatePicker'
import { SwitchGroupCard } from '@/components/patterns/SwitchGroupCard'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ContactSearchModal } from '@/modules/contact/components/ContactSearchModal'
import { MemberSearchModal } from '@/modules/workspace/components/MemberSearchModal'

// ─── ÍCONES DOS TEMPLATES ─────────────────────────────────

const TEMPLATE_ICONS: Record<string, React.ReactNode> = {
  Headphones: <Headphones className="h-6 w-6" />,
  DollarSign: <DollarSign className="h-6 w-6" />,
  Scale: <Scale className="h-6 w-6" />,
  Truck: <Truck className="h-6 w-6" />,
  UserPlus: <UserPlus className="h-6 w-6" />,
  Package: <Package className="h-6 w-6" />,
  Building: <Building className="h-6 w-6" />,
  FileText: <FileText className="h-6 w-6" />,
  Wrench: <Wrench className="h-6 w-6" />,
}

// ─── SCHEMA DO FORMULÁRIO ─────────────────────────────────

const processSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.nativeEnum(ProcessType),
  status: z.nativeEnum(ProcessStatus),
  obrigatorio: z.boolean(),
  impeditivo: z.boolean(),
  contactId: z.string().optional(),
  responsibleId: z.string().optional(),
})

type ProcessFormData = z.infer<typeof processSchema>

// ─── PROPS ────────────────────────────────────────────────

interface ProcessFormProps {
  workspaceId: string
  parentId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

// ─── COMPONENTE ───────────────────────────────────────────

export function ProcessForm({ workspaceId, parentId, onSuccess, onCancel }: ProcessFormProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<ProcessTemplate | null>(null)
  const [templateData, setTemplateData] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subProcesses, setSubProcesses] = useState<SubProcessFormItem[]>([])

  const createProcesso = useCreateProcesso()
  const addActor = useAddProcessoActor()

  const form = useForm<ProcessFormData>({
    resolver: zodResolver(processSchema),
    defaultValues: {
      name: '',
      type: ProcessType.OUTRO,
      status: ProcessStatus.ABERTO,
      obrigatorio: false,
      impeditivo: false,
      contactId: '',
      responsibleId: '',
    },
  })

  // ─── SELECIONAR TEMPLATE ────────────────────────────────

  const handleSelectTemplate = (template: ProcessTemplate) => {
    setSelectedTemplate(template)
    setTemplateData({})
    form.setValue('type', template.type)
    form.setValue('obrigatorio', template.obrigatorio)
    form.setValue('impeditivo', template.impeditivo)

    if (!form.getValues('name')) {
      form.setValue('name', template.name)
    }
  }

  // ─── ATUALIZAR DADOS DO TEMPLATE ───────────────────────

  const handleTemplateFieldChange = (key: string, value: any) => {
    setTemplateData((prev) => ({ ...prev, [key]: value }))
  }

  // ─── SUBMIT ─────────────────────────────────────────────

  const onSubmit = async (formData: ProcessFormData) => {
    setIsSubmitting(true)
    try {
      // Montar subprocessos com atores para enviar no payload
      const subProcessPayload = !parentId
        ? subProcesses.map((sub) => {
            const actors: { actorId: string; actorType: string; responsavel: boolean; papel: ActorRole }[] = []
            if (sub.contactId) {
              actors.push({
                actorId: sub.contactId,
                actorType: 'person',
                responsavel: false,
                papel: ActorRole.SOLICITANTE,
              })
            }
            if (sub.responsibleId) {
              actors.push({
                actorId: sub.responsibleId,
                actorType: 'user',
                responsavel: true,
                papel: ActorRole.RESPONSAVEL,
              })
            }
            return {
              name: sub.name,
              type: sub.type,
              schema: sub.template?.schema || undefined,
              obrigatorio: sub.obrigatorio,
              impeditivo: sub.impeditivo,
              actors: actors.length > 0 ? actors : undefined,
            }
          })
        : undefined

      const process = await createProcesso.mutateAsync({
        workspaceId,
        payload: {
          name: formData.name,
          type: formData.type,
          status: formData.status,
          obrigatorio: formData.obrigatorio,
          impeditivo: formData.impeditivo,
          schema: selectedTemplate?.schema || undefined,
          data: Object.keys(templateData).length > 0 ? templateData : undefined,
          parentId: parentId || undefined,
          subProcesses: subProcessPayload?.length ? subProcessPayload : undefined,
        },
      })

      // Adicionar contato como ator SOLICITANTE
      if (formData.contactId) {
        await addActor.mutateAsync({
          workspaceId,
          processId: process.id,
          payload: {
            actorId: formData.contactId,
            actorType: 'person',
            papel: ActorRole.SOLICITANTE,
            responsavel: false,
          },
        })
      }

      // Adicionar membro como ator RESPONSÁVEL
      if (formData.responsibleId) {
        await addActor.mutateAsync({
          workspaceId,
          processId: process.id,
          payload: {
            actorId: formData.responsibleId,
            actorType: 'user',
            papel: ActorRole.RESPONSAVEL,
            responsavel: true,
          },
        })
      }

      onSuccess?.()
    } catch (error) {
      console.error('Error creating process:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // ─── RENDERIZAR CAMPO DO TEMPLATE ──────────────────────

  const renderTemplateField = (field: ProcessTemplate['schema']['fields'][0]) => {
    const value = templateData[field.key] ?? ''

    switch (field.type) {
      case 'text':
        return (
          <div key={field.key} className={field.gridColSpan === 2 ? 'col-span-2' : ''}>
            <label className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            <Input
              value={value}
              onChange={(e) => handleTemplateFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="mt-1"
            />
          </div>
        )

      case 'textarea':
        return (
          <div key={field.key} className={field.gridColSpan === 2 ? 'col-span-2' : ''}>
            <label className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            <Textarea
              value={value}
              onChange={(e) => handleTemplateFieldChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={3}
              className="mt-1 resize-none"
            />
          </div>
        )

      case 'number':
        return (
          <div key={field.key} className={field.gridColSpan === 2 ? 'col-span-2' : ''}>
            <label className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            <Input
              type="number"
              value={value}
              onChange={(e) => handleTemplateFieldChange(field.key, Number(e.target.value))}
              placeholder={field.placeholder}
              className="mt-1"
            />
          </div>
        )

      case 'date':
        return (
          <div key={field.key} className={field.gridColSpan === 2 ? 'col-span-2' : ''}>
            <label className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            <DatePicker
              value={value ? new Date(value) : undefined}
              onValueChange={(date) =>
                handleTemplateFieldChange(field.key, date?.toISOString().split('T')[0] || '')
              }
              placeholder={field.placeholder || `Selecionar ${field.label.toLowerCase()}`}
              className="mt-1"
            />
          </div>
        )

      case 'select':
        return (
          <div key={field.key} className={field.gridColSpan === 2 ? 'col-span-2' : ''}>
            <label className="text-sm font-medium">
              {field.label}
              {field.required && <span className="text-red-500"> *</span>}
            </label>
            <Select
              value={value}
              onValueChange={(v) => handleTemplateFieldChange(field.key, v)}
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder={`Selecione ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case 'boolean':
        return (
          <div key={field.key} className="flex items-center gap-2 pt-6">
            <Checkbox
              id={field.key}
              checked={!!value}
              onCheckedChange={(checked) => handleTemplateFieldChange(field.key, !!checked)}
            />
            <label htmlFor={field.key} className="cursor-pointer text-sm font-medium">
              {field.label}
            </label>
          </div>
        )

      default:
        return null
    }
  }

  // ─── RENDER ─────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-4">
      {/* Header com Botões */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <h2 className="text-gh-text mb-1 text-xl font-bold sm:text-2xl">Novo Processo</h2>
          <p className="text-gh-text-secondary text-xs sm:text-sm">
            Selecione um template e preencha os detalhes do processo
          </p>
        </div>

        <div className="flex w-full gap-2 md:w-auto">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button
            form="process-form"
            type="submit"
            variant="default"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Criando...' : 'Criar Processo'}
          </Button>
        </div>
      </div>

      {/* Seleção de Template */}
      {!selectedTemplate && (
        <div className="space-y-4">
          <h3 className="text-gh-text text-lg font-semibold">Escolha um Template</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => handleSelectTemplate(template)}
                className={`flex flex-col items-start gap-3 rounded-lg border p-4 text-left transition-all hover:shadow-md ${template.color}`}
              >
                <div className="flex items-center gap-3">
                  {TEMPLATE_ICONS[template.icon]}
                  <span className="font-semibold">{template.name}</span>
                </div>
                <p className="text-xs opacity-80">{template.description}</p>
                <div className="flex gap-2">
                  {template.obrigatorio && (
                    <span className="rounded bg-white/60 px-2 py-0.5 text-xs font-medium">
                      Obrigatório
                    </span>
                  )}
                  {template.impeditivo && (
                    <span className="rounded bg-red-100/60 px-2 py-0.5 text-xs font-medium text-red-800">
                      Impeditivo
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Formulário (após selecionar template) */}
      {selectedTemplate && (
        <>
          {/* Chip do template selecionado */}
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 ${selectedTemplate.color}`}
            >
              {TEMPLATE_ICONS[selectedTemplate.icon]}
              <span className="text-sm font-semibold">{selectedTemplate.name}</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedTemplate(null)
                setTemplateData({})
              }}
            >
              Trocar template
            </Button>
          </div>

          <Form {...form}>
            <form
              id="process-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-3 gap-6"
            >
              {/* Coluna Esquerda (2/3) */}
              <div className="col-span-2 space-y-6">
                {/* Informações Básicas */}
                <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="text-gh-text font-semibold">Informações Básicas</h3>

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Processo</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Digite o nome do processo"
                            className="w-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex w-full gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Tipo</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={ProcessType.ATENDIMENTO}>
                                Atendimento
                              </SelectItem>
                              <SelectItem value={ProcessType.FINANCEIRO}>Financeiro</SelectItem>
                              <SelectItem value={ProcessType.ESTOQUE}>Estoque</SelectItem>
                              <SelectItem value={ProcessType.FORNECEDOR}>Fornecedor</SelectItem>
                              <SelectItem value={ProcessType.LOGISTICA}>Logística</SelectItem>
                              <SelectItem value={ProcessType.JURIDICO}>Jurídico</SelectItem>
                              <SelectItem value={ProcessType.RH}>RH</SelectItem>
                              <SelectItem value={ProcessType.OUTRO}>Outro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Status</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione o status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={ProcessStatus.ABERTO}>Aberto</SelectItem>
                              <SelectItem value={ProcessStatus.EM_ANDAMENTO}>
                                Em Andamento
                              </SelectItem>
                              <SelectItem value={ProcessStatus.PENDENTE}>Pendente</SelectItem>
                              <SelectItem value={ProcessStatus.BLOQUEADO}>Bloqueado</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <SwitchGroupCard
                      value={form.watch('obrigatorio')}
                      onValueChange={(value) => form.setValue('obrigatorio', value)}
                      title="Obrigatório"
                      description="Este processo é obrigatório para o fluxo"
                    />

                    <SwitchGroupCard
                      value={form.watch('impeditivo')}
                      onValueChange={(value) => form.setValue('impeditivo', value)}
                      title="Impeditivo"
                      description="Bloqueia avanço se não concluído"
                    />
                  </div>
                </div>

                {/* Campos do Template */}
                {selectedTemplate.schema.fields.length > 0 && (
                  <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                    <h3 className="text-gh-text font-semibold">
                      Dados do {selectedTemplate.name}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedTemplate.schema.fields.map(renderTemplateField)}
                    </div>
                  </div>
                )}

                {/* Subprocessos (apenas para processos raiz) */}
                {!parentId && (
                  <SubProcessSection
                    workspaceId={workspaceId}
                    subProcesses={subProcesses}
                    onChange={setSubProcesses}
                  />
                )}
              </div>

              {/* Coluna Direita (1/3) */}
              <div className="col-span-1 space-y-6">
                {/* Associações */}
                <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="text-gh-text font-semibold">Associações</h3>

                  <FormField
                    control={form.control}
                    name="contactId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contato / Solicitante</FormLabel>
                        <FormControl>
                          <ContactSearchModal
                            workspaceId={workspaceId}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Selecione um contato..."
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="responsibleId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Responsável</FormLabel>
                        <FormControl>
                          <MemberSearchModal
                            workspaceId={workspaceId}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Selecione um responsável..."
                            className="w-full"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Resumo do Template */}
                <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <h3 className="text-gh-text font-semibold">Resumo</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gh-text-secondary">Template:</span>
                      <span className="text-gh-text font-medium">{selectedTemplate.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gh-text-secondary">Tipo:</span>
                      <span className="text-gh-text font-medium">{form.watch('type')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gh-text-secondary">Obrigatório:</span>
                      <span className="text-gh-text font-medium">
                        {form.watch('obrigatorio') ? 'Sim' : 'Não'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gh-text-secondary">Impeditivo:</span>
                      <span className="text-gh-text font-medium">
                        {form.watch('impeditivo') ? 'Sim' : 'Não'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gh-text-secondary">Campos preenchidos:</span>
                      <span className="text-gh-text font-medium">
                        {Object.keys(templateData).filter((k) => templateData[k]).length}/
                        {selectedTemplate.schema.fields.length}
                      </span>
                    </div>
                    {!parentId && (
                      <div className="flex justify-between">
                        <span className="text-gh-text-secondary">Subprocessos:</span>
                        <span className="text-gh-text font-medium">{subProcesses.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </>
      )}
    </div>
  )
}
