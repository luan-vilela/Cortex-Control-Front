'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Calendar,
  Clock,
  MapPin,
  Pencil,
  Trash2,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import {
  EVENT_TYPE_LABELS,
  EVENT_TYPE_COLORS,
  EVENT_STATUS_LABELS,
  type AgendaEvent,
} from '../types'

interface EventDetailSheetProps {
  open: boolean
  onClose: () => void
  event: AgendaEvent | null | undefined
  onEdit?: (event: AgendaEvent) => void
  onDelete?: (eventId: string) => void
}

export function EventDetailSheet({
  open,
  onClose,
  event,
  onEdit,
  onDelete,
}: EventDetailSheetProps) {
  if (!event) return null

  const startDate = new Date(event.startDate)
  const endDate = event.endDate ? new Date(event.endDate) : null
  const typeColor = event.color || EVENT_TYPE_COLORS[event.type] || EVENT_TYPE_COLORS.EVENTO

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full shrink-0"
              style={{ backgroundColor: typeColor }}
            />
            <SheetTitle className="text-left leading-tight">
              {event.title}
            </SheetTitle>
          </div>
          <SheetDescription className="sr-only">
            Detalhes do evento
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          {/* Type & Status badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="secondary"
              style={{ backgroundColor: `${typeColor}20`, color: typeColor }}
            >
              {EVENT_TYPE_LABELS[event.type]}
            </Badge>
            <Badge variant="outline">
              {EVENT_STATUS_LABELS[event.status]}
            </Badge>
          </div>

          {/* Date & Time */}
          <div className="flex items-start gap-3 text-sm">
            <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
            <div>
              <p>
                {format(startDate, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
              {!event.allDay && (
                <p className="text-muted-foreground">
                  <Clock className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
                  {format(startDate, 'HH:mm')}
                  {endDate && ` – ${format(endDate, 'HH:mm')}`}
                </p>
              )}
              {event.allDay && (
                <p className="text-muted-foreground">Dia inteiro</p>
              )}
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
              <p>{event.location}</p>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div className="text-sm">
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
                Descrição
              </p>
              <p className="whitespace-pre-wrap">{event.description}</p>
            </div>
          )}

          {/* Recurrence */}
          {event.rrule && (
            <div className="text-sm">
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
                Recorrência
              </p>
              <p className="text-muted-foreground">{event.rrule}</p>
            </div>
          )}

          {/* Participants */}
          {event.participants && event.participants.length > 0 && (
            <div className="text-sm">
              <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">
                Participantes ({event.participants.length})
              </p>
              <div className="space-y-1">
                {event.participants.map((p) => (
                  <p key={p.id}>{p.participantName || p.participantId}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="mt-6 flex gap-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(event)}
            >
              <Pencil className="h-4 w-4 mr-1" />
              Editar
            </Button>
          )}
          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(event.id)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Excluir
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
