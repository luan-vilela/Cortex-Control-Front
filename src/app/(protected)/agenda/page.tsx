'use client'

import { useCallback, useMemo, useState } from 'react'

import { addMonths, endOfMonth, startOfMonth, subMonths } from 'date-fns'
import {
  Calendar,
  CheckSquare,
  Plus,
  X,
} from 'lucide-react'

import { PageHeader } from '@/components/patterns'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ModuleGuard } from '@/modules/workspace/components/ModuleGuard'
import { usePermission } from '@/modules/workspace/hooks/usePermission'
import { useBreadcrumb } from '@/modules/workspace/hooks'
import { useActiveWorkspace } from '@/modules/workspace/hooks/useActiveWorkspace'

import { AgendaCalendar } from '@/modules/agenda/components/AgendaCalendar'
import { EventFormDialog } from '@/modules/agenda/components/EventFormDialog'
import { EventDetailSheet } from '@/modules/agenda/components/EventDetailSheet'
import { TaskKanbanBoard } from '@/modules/agenda/components/TaskKanbanBoard'
import { TaskFormDialog } from '@/modules/agenda/components/TaskFormDialog'
import {
  useAgendaEvents,
  useAgendaEvent,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
} from '@/modules/agenda/hooks/useAgenda'
import {
  useAgendaTasks,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useMoveTask,
} from '@/modules/agenda/hooks/useTasks'
import {
  EVENT_TYPE_LABELS,
  EVENT_PRIORITY_LABELS,
  EVENT_STATUS_LABELS,
  type AgendaEvent,
  type CreateEventPayload,
  type UpdateEventPayload,
  type EventFilters,
} from '@/modules/agenda/types'
import type {
  AgendaTaskItem,
  AgendaTaskStatus,
  CreateTaskPayload,
  UpdateTaskPayload,
} from '@/modules/agenda/types/tasks'

export default function AgendaPage() {
  const { activeWorkspace } = useActiveWorkspace()
  const { hasPermission } = usePermission()
  const workspaceId = activeWorkspace?.id || ''

  useBreadcrumb([
    {
      label: 'Agenda',
      href: '/agenda',
    },
  ])

  // Active tab
  const [activeTab, setActiveTab] = useState<string>('agenda')

  // ── AGENDA STATE ──────────────────────────────────────────

  const [dateRange, setDateRange] = useState(() => ({
    start: subMonths(startOfMonth(new Date()), 1).toISOString(),
    end: addMonths(endOfMonth(new Date()), 1).toISOString(),
  }))

  const [typeFilter, setTypeFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const filters = useMemo<EventFilters>(
    () => ({
      startDate: dateRange.start,
      endDate: dateRange.end,
      ...(typeFilter && { type: typeFilter as any }),
      ...(priorityFilter && { priority: priorityFilter as any }),
      ...(statusFilter && { status: statusFilter as any }),
    }),
    [dateRange, typeFilter, priorityFilter, statusFilter],
  )

  const hasActiveFilters = !!(typeFilter || priorityFilter || statusFilter)

  const [formOpen, setFormOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<AgendaEvent | null>(null)
  const [detailEvent, setDetailEvent] = useState<AgendaEvent | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [defaultDate, setDefaultDate] = useState<{ start: Date; end: Date; allDay: boolean } | undefined>()

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const { data: fullEvent } = useAgendaEvent(
    workspaceId,
    selectedEventId || '',
    !!selectedEventId,
  )

  const {
    data: events = [],
    isLoading,
    isFetching,
    refetch,
  } = useAgendaEvents(workspaceId, filters, !!workspaceId)

  const createEvent = useCreateEvent()
  const updateEvent = useUpdateEvent()
  const deleteEvent = useDeleteEvent()

  // ── TASKS STATE ───────────────────────────────────────────

  const [taskFormOpen, setTaskFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<AgendaTaskItem | null>(null)

  const {
    data: tasks = [],
    isLoading: tasksLoading,
    refetch: refetchTasks,
  } = useAgendaTasks(workspaceId, undefined, !!workspaceId)

  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()
  const moveTask = useMoveTask()

  // ── AGENDA HANDLERS ───────────────────────────────────────

  const handleDatesChange = useCallback((start: Date, end: Date) => {
    setDateRange({
      start: start.toISOString(),
      end: end.toISOString(),
    })
  }, [])

  const handleEventClick = useCallback(
    (eventId: string) => {
      const found = events.find((e) => e.id === eventId)
      if (found) {
        setDetailEvent(found)
        setDetailOpen(true)
        setSelectedEventId(eventId)
      }
    },
    [events],
  )

  const handleDateSelect = useCallback(
    (start: Date, end: Date, allDay: boolean) => {
      if (!hasPermission('agenda', 'create')) return
      setEditingEvent(null)
      setDefaultDate({ start, end, allDay })
      setFormOpen(true)
    },
    [hasPermission],
  )

  const handleEventDrop = useCallback(
    (eventId: string, start: Date, end: Date | null) => {
      if (!hasPermission('agenda', 'update')) return
      const payload: UpdateEventPayload = {
        startDate: start.toISOString(),
        ...(end && { endDate: end.toISOString() }),
      }
      updateEvent.mutate(
        { workspaceId, eventId, payload },
        { onSuccess: () => refetch() },
      )
    },
    [workspaceId, updateEvent, refetch, hasPermission],
  )

  const handleCreate = useCallback(
    (payload: CreateEventPayload | UpdateEventPayload) => {
      createEvent.mutate(
        { workspaceId, payload: payload as CreateEventPayload },
        {
          onSuccess: () => {
            setFormOpen(false)
            setDefaultDate(undefined)
            refetch()
          },
        },
      )
    },
    [workspaceId, createEvent, refetch],
  )

  const handleUpdate = useCallback(
    (payload: CreateEventPayload | UpdateEventPayload) => {
      if (!editingEvent) return
      updateEvent.mutate(
        { workspaceId, eventId: editingEvent.id, payload: payload as UpdateEventPayload },
        {
          onSuccess: () => {
            setFormOpen(false)
            setEditingEvent(null)
            setDetailOpen(false)
            refetch()
          },
        },
      )
    },
    [workspaceId, editingEvent, updateEvent, refetch],
  )

  const handleDelete = useCallback(
    (eventId: string) => {
      deleteEvent.mutate(
        { workspaceId, eventId },
        {
          onSuccess: () => {
            setDetailOpen(false)
            setDetailEvent(null)
            setSelectedEventId(null)
            refetch()
          },
        },
      )
    },
    [workspaceId, deleteEvent, refetch],
  )

  const handleEditFromDetail = useCallback(
    (event: AgendaEvent) => {
      setDetailOpen(false)
      setEditingEvent(event)
      setFormOpen(true)
    },
    [],
  )

  const handleNewEvent = useCallback(() => {
    setEditingEvent(null)
    setDefaultDate(undefined)
    setFormOpen(true)
  }, [])

  const clearFilters = useCallback(() => {
    setTypeFilter('')
    setPriorityFilter('')
    setStatusFilter('')
  }, [])

  // ── TASK HANDLERS ─────────────────────────────────────────

  const handleNewTask = useCallback(() => {
    setEditingTask(null)
    setTaskFormOpen(true)
  }, [])

  const handleEditTask = useCallback((task: AgendaTaskItem) => {
    setEditingTask(task)
    setTaskFormOpen(true)
  }, [])

  const handleTaskClick = useCallback((task: AgendaTaskItem) => {
    setEditingTask(task)
    setTaskFormOpen(true)
  }, [])

  const handleCreateTask = useCallback(
    (payload: CreateTaskPayload | UpdateTaskPayload) => {
      createTask.mutate(
        { workspaceId, payload: payload as CreateTaskPayload },
        {
          onSuccess: () => {
            setTaskFormOpen(false)
            refetchTasks()
          },
        },
      )
    },
    [workspaceId, createTask, refetchTasks],
  )

  const handleUpdateTask = useCallback(
    (payload: CreateTaskPayload | UpdateTaskPayload) => {
      if (!editingTask) return
      updateTask.mutate(
        { workspaceId, taskId: editingTask.id, payload: payload as UpdateTaskPayload },
        {
          onSuccess: () => {
            setTaskFormOpen(false)
            setEditingTask(null)
            refetchTasks()
          },
        },
      )
    },
    [workspaceId, editingTask, updateTask, refetchTasks],
  )

  const handleDeleteTask = useCallback(
    (taskId: string) => {
      deleteTask.mutate(
        { workspaceId, taskId },
        { onSuccess: () => refetchTasks() },
      )
    },
    [workspaceId, deleteTask, refetchTasks],
  )

  const handleMoveTask = useCallback(
    (taskId: string, newStatus: AgendaTaskStatus, order: number) => {
      moveTask.mutate(
        { workspaceId, taskId, payload: { status: newStatus, order } },
        { onSuccess: () => refetchTasks() },
      )
    },
    [workspaceId, moveTask, refetchTasks],
  )

  const canCreate = hasPermission('agenda', 'create')

  return (
    <ModuleGuard moduleId="agenda">
      <div className="flex flex-col gap-6 p-6">
        <PageHeader
          title="Agenda"
          description="Gerencie seus eventos, reuniões e tarefas"
          action={
            canCreate
              ? {
                  label: activeTab === 'agenda' ? 'Novo Evento' : 'Nova Tarefa',
                  onClick: activeTab === 'agenda' ? handleNewEvent : handleNewTask,
                  icon: <Plus className="h-4 w-4" />,
                }
              : undefined
          }
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <TabsList>
              <TabsTrigger value="agenda" className="gap-1.5">
                <Calendar className="h-4 w-4" />
                Agenda
              </TabsTrigger>
              <TabsTrigger value="tarefas" className="gap-1.5">
                <CheckSquare className="h-4 w-4" />
                Tarefas
              </TabsTrigger>
            </TabsList>

            {/* Filters only for agenda tab */}
            {activeTab === 'agenda' && (
              <div className="flex items-center gap-2 flex-wrap">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(EVENT_PRIORITY_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(EVENT_STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Limpar
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Agenda tab */}
          <TabsContent value="agenda" className="mt-4">
            <div className="bg-card p-4 relative">
              {/* Loading overlay - não desmonta o calendário */}
              {isFetching && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/50">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              )}
              <AgendaCalendar
                events={events}
                onEventClick={handleEventClick}
                onDateSelect={handleDateSelect}
                onEventDrop={handleEventDrop}
                onEventResize={handleEventDrop}
                onDatesChange={handleDatesChange}
              />
            </div>
          </TabsContent>

          {/* Tarefas tab */}
          <TabsContent value="tarefas" className="mt-4">
            {tasksLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            ) : (
              <TaskKanbanBoard
                tasks={tasks}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onClick={handleTaskClick}
                onMoveTask={handleMoveTask}
                onAddTask={handleNewTask}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Event Form Dialog */}
      <EventFormDialog
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditingEvent(null)
          setDefaultDate(undefined)
        }}
        event={editingEvent}
        onSubmit={editingEvent ? handleUpdate : handleCreate}
        isLoading={createEvent.isPending || updateEvent.isPending}
        defaultStart={defaultDate?.start}
        defaultEnd={defaultDate?.end}
        defaultAllDay={defaultDate?.allDay}
      />

      {/* Event Detail Sheet */}
      <EventDetailSheet
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false)
          setDetailEvent(null)
          setSelectedEventId(null)
        }}
        event={fullEvent || detailEvent}
        onEdit={handleEditFromDetail}
        onDelete={handleDelete}
      />

      {/* Task Form Dialog */}
      <TaskFormDialog
        open={taskFormOpen}
        onClose={() => {
          setTaskFormOpen(false)
          setEditingTask(null)
        }}
        task={editingTask}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        isLoading={createTask.isPending || updateTask.isPending}
      />
    </ModuleGuard>
  )
}
