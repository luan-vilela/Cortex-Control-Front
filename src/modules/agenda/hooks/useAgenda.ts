import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { useAlerts } from '@/contexts/AlertContext'

import { agendaService } from '../agenda.service'
import type {
  AgendaEvent,
  CreateEventPayload,
  CreateLinkPayload,
  CreateParticipantPayload,
  EventFilters,
  UpdateEventPayload,

} from '../types'

// Query key factory
export const agendaQueryKeys = {
  all: ['agenda'],
  events: () => [...agendaQueryKeys.all, 'events'],
  eventList: (workspaceId: string, filters?: EventFilters) => [
    ...agendaQueryKeys.events(),
    workspaceId,
    filters,
  ],
  event: (workspaceId: string, eventId: string) => [
    ...agendaQueryKeys.all,
    workspaceId,
    eventId,
  ],
}

// ─── EVENTS ─────────────────────────────────────────────────

export function useAgendaEvents(workspaceId: string, filters: EventFilters, enabled = true) {
  return useQuery<AgendaEvent[]>({
    queryKey: agendaQueryKeys.eventList(workspaceId, filters),
    queryFn: () => agendaService.getEvents(workspaceId, filters),
    enabled: enabled && !!workspaceId && !!filters.startDate && !!filters.endDate,
    staleTime: 2 * 60 * 1000,
  })
}

export function useAgendaEvent(workspaceId: string, eventId: string, enabled = true) {
  return useQuery<AgendaEvent>({
    queryKey: agendaQueryKeys.event(workspaceId, eventId),
    queryFn: () => agendaService.getEvent(workspaceId, eventId),
    enabled: enabled && !!workspaceId && !!eventId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()
  const { addAlert } = useAlerts()

  return useMutation({
    mutationFn: ({
      workspaceId,
      payload,
    }: {
      workspaceId: string
      payload: CreateEventPayload
    }) => agendaService.createEvent(workspaceId, payload),
    onSuccess: (_, { workspaceId: _workspaceId }) => {
      queryClient.invalidateQueries({
        queryKey: agendaQueryKeys.events(),
      })
      addAlert('success', 'Evento criado com sucesso.', 'Evento criado')
    },
    onError: (error: any) => {
      addAlert(
        'error',
        error?.response?.data?.message || 'Ocorreu um erro ao criar o evento.',
        'Erro ao criar evento'
      )
    },
  })
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()
  const { addAlert } = useAlerts()

  return useMutation({
    mutationFn: ({
      workspaceId,
      eventId,
      payload,
    }: {
      workspaceId: string
      eventId: string
      payload: UpdateEventPayload
    }) => agendaService.updateEvent(workspaceId, eventId, payload),
    onSuccess: (_, { workspaceId, eventId }) => {
      queryClient.invalidateQueries({
        queryKey: agendaQueryKeys.events(),
      })
      queryClient.invalidateQueries({
        queryKey: agendaQueryKeys.event(workspaceId, eventId),
      })
      addAlert('success', 'Evento atualizado com sucesso.', 'Evento atualizado')
    },
    onError: (error: any) => {
      addAlert(
        'error',
        error?.response?.data?.message || 'Ocorreu um erro ao atualizar o evento.',
        'Erro ao atualizar evento'
      )
    },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()
  const { addAlert } = useAlerts()

  return useMutation({
    mutationFn: ({ workspaceId, eventId }: { workspaceId: string; eventId: string }) =>
      agendaService.deleteEvent(workspaceId, eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: agendaQueryKeys.events(),
      })
      addAlert('success', 'Evento excluído com sucesso.', 'Evento excluído')
    },
    onError: (error: any) => {
      addAlert(
        'error',
        error?.response?.data?.message || 'Ocorreu um erro ao excluir o evento.',
        'Erro ao excluir evento'
      )
    },
  })
}

// ─── PARTICIPANTS ───────────────────────────────────────────

export function useAddParticipant() {
  const queryClient = useQueryClient()
  const { addAlert } = useAlerts()

  return useMutation({
    mutationFn: ({
      workspaceId,
      eventId,
      payload,
    }: {
      workspaceId: string
      eventId: string
      payload: CreateParticipantPayload
    }) => agendaService.addParticipant(workspaceId, eventId, payload),
    onSuccess: (_, { workspaceId, eventId }) => {
      queryClient.invalidateQueries({
        queryKey: agendaQueryKeys.event(workspaceId, eventId),
      })
      queryClient.invalidateQueries({
        queryKey: agendaQueryKeys.events(),
      })
      addAlert('success', 'Participante adicionado com sucesso.', 'Participante adicionado')
    },
    onError: (error: any) => {
      addAlert(
        'error',
        error?.response?.data?.message || 'Ocorreu um erro ao adicionar o participante.',
        'Erro ao adicionar participante'
      )
    },
  })
}

export function useRemoveParticipant() {
  const queryClient = useQueryClient()
  const { addAlert } = useAlerts()

  return useMutation({
    mutationFn: ({
      workspaceId,
      eventId,
      participantId,
    }: {
      workspaceId: string
      eventId: string
      participantId: string
    }) => agendaService.removeParticipant(workspaceId, eventId, participantId),
    onSuccess: (_, { workspaceId, eventId }) => {
      queryClient.invalidateQueries({
        queryKey: agendaQueryKeys.event(workspaceId, eventId),
      })
      queryClient.invalidateQueries({
        queryKey: agendaQueryKeys.events(),
      })
      addAlert('success', 'Participante removido com sucesso.', 'Participante removido')
    },
    onError: (error: any) => {
      addAlert(
        'error',
        error?.response?.data?.message || 'Ocorreu um erro ao remover o participante.',
        'Erro ao remover participante'
      )
    },
  })
}

// ─── LINKS ──────────────────────────────────────────────────

export function useAddLink() {
  const queryClient = useQueryClient()
  const { addAlert } = useAlerts()

  return useMutation({
    mutationFn: ({
      workspaceId,
      eventId,
      payload,
    }: {
      workspaceId: string
      eventId: string
      payload: CreateLinkPayload
    }) => agendaService.addLink(workspaceId, eventId, payload),
    onSuccess: (_, { workspaceId, eventId }) => {
      queryClient.invalidateQueries({
        queryKey: agendaQueryKeys.event(workspaceId, eventId),
      })
      addAlert('success', 'Vínculo adicionado com sucesso.', 'Vínculo adicionado')
    },
    onError: (error: any) => {
      addAlert(
        'error',
        error?.response?.data?.message || 'Ocorreu um erro ao adicionar o vínculo.',
        'Erro ao adicionar vínculo'
      )
    },
  })
}

export function useRemoveLink() {
  const queryClient = useQueryClient()
  const { addAlert } = useAlerts()

  return useMutation({
    mutationFn: ({
      workspaceId,
      eventId,
      linkId,
    }: {
      workspaceId: string
      eventId: string
      linkId: string
    }) => agendaService.removeLink(workspaceId, eventId, linkId),
    onSuccess: (_, { workspaceId, eventId }) => {
      queryClient.invalidateQueries({
        queryKey: agendaQueryKeys.event(workspaceId, eventId),
      })
      addAlert('success', 'Vínculo removido com sucesso.', 'Vínculo removido')
    },
    onError: (error: any) => {
      addAlert(
        'error',
        error?.response?.data?.message || 'Ocorreu um erro ao remover o vínculo.',
        'Erro ao remover vínculo'
      )
    },
  })
}
