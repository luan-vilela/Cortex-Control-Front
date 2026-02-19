'use client'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  ExternalLink,
  ListChecks,
  Plus,
  X,
} from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import type { AgendaTaskItem, CreateTaskPayload, UpdateTaskPayload } from '../types/tasks'

const taskFormSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(255),
  observation: z.string().optional(),
  checklist: z
    .array(
      z.object({
        title: z.string().min(1, 'Item obrigatório'),
        checked: z.boolean().default(false),
      }),
    )
    .default([]),
  links: z
    .array(
      z.object({
        url: z.string().url('URL inválida'),
        label: z.string().optional(),
      }),
    )
    .default([]),
})

type TaskFormValues = z.infer<typeof taskFormSchema>

interface TaskFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (payload: CreateTaskPayload | UpdateTaskPayload) => void
  task?: AgendaTaskItem | null
  isLoading?: boolean
}

export function TaskFormDialog({
  open,
  onClose,
  onSubmit,
  task,
  isLoading = false,
}: TaskFormDialogProps) {
  const isEditing = !!task

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema) as any,
    defaultValues: {
      title: '',
      observation: '',
      checklist: [],
      links: [],
    },
  })

  const {
    fields: checklistFields,
    append: appendChecklist,
    remove: removeChecklist,
  } = useFieldArray({ control: form.control, name: 'checklist' })

  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({ control: form.control, name: 'links' })

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        observation: task.observation || '',
        checklist: task.checklist?.map((c) => ({
          title: c.title,
          checked: c.checked,
        })) || [],
        links: task.links?.map((l) => ({
          url: l.url,
          label: l.label || '',
        })) || [],
      })
    } else {
      form.reset({
        title: '',
        observation: '',
        checklist: [],
        links: [],
      })
    }
  }, [task, form, open])

  const handleSubmit = (values: TaskFormValues) => {
    const payload: CreateTaskPayload = {
      title: values.title,
      observation: values.observation || undefined,
      checklist: values.checklist.map((c, i) => ({
        title: c.title,
        checked: c.checked,
        order: i,
      })),
      links: values.links.map((l) => ({
        url: l.url,
        label: l.label || undefined,
      })),
    }
    onSubmit(payload)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Atualize as informações da tarefa'
              : 'Preencha os dados da nova tarefa'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 mt-2"
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da tarefa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Observation */}
            <FormField
              control={form.control}
              name="observation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observação</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrição ou notas sobre a tarefa..."
                      className="min-h-20 resize-none"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Checklist */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <ListChecks className="h-4 w-4" />
                  Checklist
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() =>
                    appendChecklist({ title: '', checked: false })
                  }
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Adicionar
                </Button>
              </div>

              {checklistFields.length > 0 && (
                <div className="space-y-2 rounded-lg border border-border/60 p-3">
                  {checklistFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`checklist.${index}.checked`}
                        render={({ field: checkField }) => (
                          <Checkbox
                            checked={checkField.value}
                            onCheckedChange={checkField.onChange}
                          />
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`checklist.${index}.title`}
                        render={({ field: titleField }) => (
                          <Input
                            placeholder={`Item ${index + 1}`}
                            className="h-8 text-sm flex-1"
                            {...titleField}
                          />
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={() => removeChecklist(index)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Links */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  <ExternalLink className="h-4 w-4" />
                  Links
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => appendLink({ url: '', label: '' })}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Adicionar
                </Button>
              </div>

              {linkFields.length > 0 && (
                <div className="space-y-2 rounded-lg border border-border/60 p-3">
                  {linkFields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <FormField
                        control={form.control}
                        name={`links.${index}.url`}
                        render={({ field: urlField }) => (
                          <Input
                            placeholder="https://..."
                            className="h-8 text-sm flex-1"
                            {...urlField}
                          />
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`links.${index}.label`}
                        render={({ field: labelField }) => (
                          <Input
                            placeholder="Rótulo"
                            className="h-8 text-sm w-28"
                            {...labelField}
                          />
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={() => removeLink(index)}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? 'Salvando...'
                  : isEditing
                    ? 'Salvar'
                    : 'Criar Tarefa'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
