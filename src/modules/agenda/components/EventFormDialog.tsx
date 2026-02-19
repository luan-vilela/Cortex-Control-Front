'use client'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon, MapPin } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

import {
  AgendaEventType,
  AgendaEventPriority,
  AgendaEventStatus,
  EVENT_TYPE_LABELS,
  EVENT_TYPE_COLORS,
} from '../types'
import type { AgendaEvent, CreateEventPayload, UpdateEventPayload } from '../types'

function addMinutesToTime(time: string, minutes: number): string {
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + minutes
  const newH = Math.floor(total / 60) % 24
  const newM = total % 60
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`
}

const eventFormSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(255),
  description: z.string().optional(),
  startDate: z.date({ error: 'Data de início é obrigatória' }),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  allDay: z.boolean().default(false),
  color: z.string().optional(),
  location: z.string().max(500).optional(),
  type: z.nativeEnum(AgendaEventType).default(AgendaEventType.EVENTO),
  rrule: z.string().max(500).optional(),
})

type EventFormValues = z.infer<typeof eventFormSchema>

interface EventFormDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateEventPayload | UpdateEventPayload) => void
  event?: AgendaEvent | null
  defaultStart?: Date
  defaultEnd?: Date
  defaultAllDay?: boolean
  isLoading?: boolean
}

const RECURRENCE_OPTIONS = [
  { value: '', label: 'Sem recorrência' },
  { value: 'FREQ=DAILY', label: 'Diariamente' },
  { value: 'FREQ=WEEKLY', label: 'Semanalmente' },
  { value: 'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR', label: 'Dias úteis' },
  { value: 'FREQ=MONTHLY', label: 'Mensalmente' },
  { value: 'FREQ=YEARLY', label: 'Anualmente' },
]

const COLOR_OPTIONS = [
  { value: '#3b82f6', label: 'Azul' },
  { value: '#10b981', label: 'Verde' },
  { value: '#f59e0b', label: 'Amarelo' },
  { value: '#ef4444', label: 'Vermelho' },
  { value: '#8b5cf6', label: 'Roxo' },
  { value: '#ec4899', label: 'Rosa' },
  { value: '#6b7280', label: 'Cinza' },
  { value: '#f97316', label: 'Laranja' },
]

export function EventFormDialog({
  open,
  onClose,
  onSubmit,
  event,
  defaultStart,
  defaultEnd,
  defaultAllDay,
  isLoading = false,
}: EventFormDialogProps) {
  const isEditing = !!event

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema) as any,
    defaultValues: {
      title: '',
      description: '',
      startDate: defaultStart || new Date(),
      startTime: '09:00',
      endTime: '09:30',
      allDay: defaultAllDay ?? false,
      color: '',
      location: '',
      type: AgendaEventType.EVENTO,
      rrule: '',
    },
  })

  useEffect(() => {
    if (event) {
      const start = new Date(event.startDate)

      const end = event.endDate ? new Date(event.endDate) : null

      form.reset({
        title: event.title,
        description: event.description || '',
        startDate: start,
        startTime: event.allDay ? '09:00' : format(start, 'HH:mm'),
        endTime: end && !event.allDay ? format(end, 'HH:mm') : addMinutesToTime(event.allDay ? '09:00' : format(start, 'HH:mm'), 30),
        allDay: event.allDay,
        color: event.color || '',
        location: event.location || '',
        type: event.type,
        rrule: event.rrule || '',
      })
    } else {
      form.reset({
        title: '',
        description: '',
        startDate: defaultStart || new Date(),
        startTime: defaultStart ? format(defaultStart, 'HH:mm') : '09:00',
        endTime: defaultStart ? addMinutesToTime(format(defaultStart, 'HH:mm'), 30) : '09:30',
        allDay: defaultAllDay ?? false,
        color: '',
        location: '',
        type: AgendaEventType.EVENTO,
        rrule: '',
      })
    }
  }, [event, defaultStart, defaultEnd, defaultAllDay, form])

  const handleSubmit = (values: EventFormValues) => {
    const startDate = new Date(values.startDate)
    if (!values.allDay && values.startTime) {
      const [hours, minutes] = values.startTime.split(':').map(Number)
      startDate.setHours(hours, minutes, 0, 0)
    }

    let endDate: Date | undefined
    if (!values.allDay && values.endTime) {
      endDate = new Date(values.startDate)
      const [hours, minutes] = values.endTime.split(':').map(Number)
      endDate.setHours(hours, minutes, 0, 0)
    }

    const payload: CreateEventPayload = {
      title: values.title,
      description: values.description || undefined,
      startDate: startDate.toISOString(),
      endDate: endDate?.toISOString(),
      allDay: values.allDay,
      color: values.color || undefined,
      location: values.location || undefined,
      type: values.type,
      priority: AgendaEventPriority.MEDIA,
      status: AgendaEventStatus.CONFIRMADO,
      rrule: values.rrule || undefined,
    }

    onSubmit(payload)
  }

  const watchAllDay = form.watch('allDay')
  const watchColor = form.watch('color')
  const watchStartTime = form.watch('startTime')

  // Auto-update endTime when startTime changes (keep +30min gap)
  useEffect(() => {
    if (watchStartTime) {
      const currentEnd = form.getValues('endTime')
      const expectedEnd = addMinutesToTime(watchStartTime, 30)
      // Only auto-adjust if endTime <= startTime (invalid) or was never manually changed
      if (!currentEnd || currentEnd <= watchStartTime) {
        form.setValue('endTime', expectedEnd)
      }
    }
  }, [watchStartTime, form])

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Evento' : 'Novo Evento'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Atualize as informações do evento.'
              : 'Preencha os dados para criar um novo evento na agenda.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título *</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do evento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <textarea
                      className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Descrição do evento..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* All Day Toggle + Date row */}
            <div className="space-y-3">
              <FormField
                control={form.control}
                name="allDay"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel className="mt-0">Dia inteiro</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                {/* Start Date */}
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data *</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? format(field.value, 'dd/MM/yyyy') : 'Selecione'}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Time inputs */}
                {!watchAllDay && (
                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Início</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endTime"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Fim</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Event Type — Badges */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de evento</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(AgendaEventType).map((t) => (
                      <Badge
                        key={t}
                        variant={field.value === t ? 'default' : 'outline'}
                        className={cn(
                          'cursor-pointer select-none transition-all',
                          field.value === t
                            ? 'ring-2 ring-offset-1 ring-offset-background'
                            : 'hover:bg-accent'
                        )}
                        style={
                          field.value === t
                            ? { backgroundColor: EVENT_TYPE_COLORS[t], borderColor: EVENT_TYPE_COLORS[t], color: '#fff' }
                            : { borderColor: EVENT_TYPE_COLORS[t], color: EVENT_TYPE_COLORS[t] }
                        }
                        onClick={() => field.onChange(t)}
                      >
                        {EVENT_TYPE_LABELS[t]}
                      </Badge>
                    ))}
                  </div>
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    Localização
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Local do evento" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Color */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
                  <div className="flex gap-2">
                    {COLOR_OPTIONS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        className={cn(
                          'h-7 w-7 rounded-full border-2 transition-all',
                          field.value === c.value
                            ? 'border-foreground scale-110'
                            : 'border-transparent hover:scale-105'
                        )}
                        style={{ backgroundColor: c.value }}
                        onClick={() => field.onChange(field.value === c.value ? '' : c.value)}
                        title={c.label}
                      />
                    ))}
                    {watchColor && (
                      <button
                        type="button"
                        className="text-xs text-muted-foreground hover:text-foreground ml-2"
                        onClick={() => field.onChange('')}
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                </FormItem>
              )}
            />

            {/* Recurrence */}
            <FormField
              control={form.control}
              name="rrule"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recorrência</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sem recorrência" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {RECURRENCE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value || 'none'} value={opt.value || 'none'}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : isEditing ? 'Salvar' : 'Criar Evento'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
