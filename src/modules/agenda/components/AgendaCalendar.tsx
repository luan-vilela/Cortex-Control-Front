'use client'

import { useMemo, useRef } from 'react'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import type {
  DateSelectArg,
  EventClickArg,
  EventDropArg,
  EventInput,
  DatesSetArg,
} from '@fullcalendar/core'
import type { EventResizeDoneArg } from '@fullcalendar/interaction'

import type { AgendaEvent } from '../types'
import { EVENT_TYPE_COLORS, AgendaEventType } from '../types'

interface AgendaCalendarProps {
  events: AgendaEvent[]
  onEventClick?: (eventId: string) => void
  onDateSelect?: (start: Date, end: Date, allDay: boolean) => void
  onEventDrop?: (eventId: string, newStart: Date, newEnd: Date | null) => void
  onEventResize?: (eventId: string, newStart: Date, newEnd: Date) => void
  onDatesChange?: (start: Date, end: Date) => void
  initialView?: string
}

export function AgendaCalendar({
  events,
  onEventClick,
  onDateSelect,
  onEventDrop,
  onEventResize,
  onDatesChange,
  initialView = 'timeGridWeek',
}: AgendaCalendarProps) {
  const calendarRef = useRef<FullCalendar>(null)

  // Convert API events to FullCalendar format
  const calendarEvents: EventInput[] = useMemo(() => {
    return events.map((event) => ({
      id: event.id,
      title: event.title,
      start: event.startDate,
      end: event.endDate || undefined,
      allDay: event.allDay,
      backgroundColor: event.color || EVENT_TYPE_COLORS[event.type] || EVENT_TYPE_COLORS[AgendaEventType.EVENTO],
      borderColor: event.color || EVENT_TYPE_COLORS[event.type] || EVENT_TYPE_COLORS[AgendaEventType.EVENTO],
      extendedProps: {
        description: event.description,
        location: event.location,
        type: event.type,
        priority: event.priority,
        status: event.status,
        originalEventId: event.originalEventId,
        isRecurrenceInstance: event.isRecurrenceInstance,
        participantCount: event.participants?.length || 0,
      },
    }))
  }, [events])

  const handleEventClick = (info: EventClickArg) => {
    const eventId = info.event.extendedProps.originalEventId || info.event.id
    onEventClick?.(eventId)
  }

  const handleDateSelect = (info: DateSelectArg) => {
    onDateSelect?.(info.start, info.end, info.allDay)
  }

  const handleEventDrop = (info: EventDropArg) => {
    const eventId =
      info.event.extendedProps.originalEventId || info.event.id
    onEventDrop?.(eventId, info.event.start!, info.event.end)
  }

  const handleEventResize = (info: EventResizeDoneArg) => {
    const eventId =
      info.event.extendedProps.originalEventId || info.event.id
    onEventResize?.(eventId, info.event.start!, info.event.end!)
  }

  const handleDatesSet = (info: DatesSetArg) => {
    onDatesChange?.(info.start, info.end)
  }

  return (
    <div className="agenda-calendar">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView={initialView}
        locale={ptBrLocale}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
        }}
        buttonText={{
          today: 'Hoje',
          month: 'Mês',
          week: 'Semana',
          day: 'Dia',
          list: 'Agenda',
        }}
        events={calendarEvents}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        nowIndicator={true}
        eventClick={handleEventClick}
        select={handleDateSelect}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        datesSet={handleDatesSet}
        height="auto"
        stickyHeaderDates={true}
        eventDisplay="block"
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
          hour12: false,
        }}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
          hour12: false,
        }}
        slotMinTime="00:00:00"
        slotMaxTime="23:59:59"
        allDayText="Dia todo"
        noEventsText="Nenhum evento neste período"
        moreLinkText={(n) => `+${n} mais`}
      />
    </div>
  )
}
