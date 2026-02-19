import api from '@/lib/api'

import type {
  AgendaEvent,
  CreateEventPayload,
  CreateLinkPayload,
  CreateParticipantPayload,
  EventFilters,
  UpdateEventPayload,
  AgendaEventParticipant,
  AgendaEventLink,
} from './types'

const BASE_API = '/workspaces'

export const agendaService = {
  // ─── EVENTS ─────────────────────────────────────────────────

  async getEvents(workspaceId: string, filters: EventFilters): Promise<AgendaEvent[]> {
    const params: Record<string, string> = {
      startDate: filters.startDate,
      endDate: filters.endDate,
    }

    if (filters.type) params.type = filters.type
    if (filters.priority) params.priority = filters.priority
    if (filters.status) params.status = filters.status
    if (filters.createdBy) params.createdBy = filters.createdBy
    if (filters.participantId) params.participantId = filters.participantId
    if (filters.search) params.search = filters.search

    const response = await api.get(`${BASE_API}/${workspaceId}/agenda`, { params })
    return response.data
  },

  async getEvent(workspaceId: string, eventId: string): Promise<AgendaEvent> {
    const response = await api.get(`${BASE_API}/${workspaceId}/agenda/${eventId}`)
    return response.data
  },

  async createEvent(workspaceId: string, data: CreateEventPayload): Promise<AgendaEvent> {
    const response = await api.post(`${BASE_API}/${workspaceId}/agenda`, data)
    return response.data
  },

  async updateEvent(
    workspaceId: string,
    eventId: string,
    data: UpdateEventPayload
  ): Promise<AgendaEvent> {
    const response = await api.patch(`${BASE_API}/${workspaceId}/agenda/${eventId}`, data)
    return response.data
  },

  async deleteEvent(workspaceId: string, eventId: string): Promise<void> {
    await api.delete(`${BASE_API}/${workspaceId}/agenda/${eventId}`)
  },

  // ─── PARTICIPANTS ───────────────────────────────────────────

  async addParticipant(
    workspaceId: string,
    eventId: string,
    data: CreateParticipantPayload
  ): Promise<AgendaEventParticipant> {
    const response = await api.post(
      `${BASE_API}/${workspaceId}/agenda/${eventId}/participants`,
      data
    )
    return response.data
  },

  async removeParticipant(
    workspaceId: string,
    eventId: string,
    participantId: string
  ): Promise<void> {
    await api.delete(
      `${BASE_API}/${workspaceId}/agenda/${eventId}/participants/${participantId}`
    )
  },

  // ─── LINKS ──────────────────────────────────────────────────

  async addLink(
    workspaceId: string,
    eventId: string,
    data: CreateLinkPayload
  ): Promise<AgendaEventLink> {
    const response = await api.post(
      `${BASE_API}/${workspaceId}/agenda/${eventId}/links`,
      data
    )
    return response.data
  },

  async removeLink(
    workspaceId: string,
    eventId: string,
    linkId: string
  ): Promise<void> {
    await api.delete(
      `${BASE_API}/${workspaceId}/agenda/${eventId}/links/${linkId}`
    )
  },
}
