// ─── ENUMS ──────────────────────────────────────────────────

export enum AgendaEventType {
  REUNIAO = 'REUNIAO',
  TAREFA = 'TAREFA',
  LEMBRETE = 'LEMBRETE',
  EVENTO = 'EVENTO',
  OUTRO = 'OUTRO',
}

export enum AgendaEventPriority {
  BAIXA = 'BAIXA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
  URGENTE = 'URGENTE',
}

export enum AgendaEventStatus {
  PENDENTE = 'PENDENTE',
  CONFIRMADO = 'CONFIRMADO',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDO = 'CONCLUIDO',
  CANCELADO = 'CANCELADO',
}

export enum ParticipantStatus {
  PENDENTE = 'PENDENTE',
  ACEITO = 'ACEITO',
  RECUSADO = 'RECUSADO',
  TENTATIVA = 'TENTATIVA',
}

// ─── INTERFACES ─────────────────────────────────────────────

export interface AgendaEventParticipant {
  id: string
  eventId: string
  participantType: 'user' | 'person'
  participantId: string
  status: ParticipantStatus
  createdAt: string
  // Hydrated by backend
  participantName?: string
}

export interface AgendaEventLink {
  id: string
  eventId: string
  linkType: 'process' | 'transaction' | 'person'
  linkId: string
  createdAt: string
  // Hydrated by backend
  linkLabel?: string
}

export interface AgendaEvent {
  id: string
  workspaceId: string
  title: string
  description: string | null
  startDate: string
  endDate: string | null
  allDay: boolean
  color: string | null
  location: string | null
  type: AgendaEventType
  priority: AgendaEventPriority
  status: AgendaEventStatus
  rrule: string | null
  recurrenceEnd: string | null
  recurrenceParentId: string | null
  createdBy: string
  deletedAt: string | null
  participants: AgendaEventParticipant[]
  links: AgendaEventLink[]
  createdAt: string
  updatedAt: string
  // For recurrence instances
  originalEventId?: string
  isRecurrenceInstance?: boolean
}

// ─── PAYLOADS ───────────────────────────────────────────────

export interface CreateParticipantPayload {
  participantType: 'user' | 'person'
  participantId: string
  status?: ParticipantStatus
}

export interface CreateLinkPayload {
  linkType: 'process' | 'transaction' | 'person'
  linkId: string
}

export interface CreateEventPayload {
  title: string
  description?: string
  startDate: string
  endDate?: string
  allDay?: boolean
  color?: string
  location?: string
  type?: AgendaEventType
  priority?: AgendaEventPriority
  status?: AgendaEventStatus
  rrule?: string
  recurrenceEnd?: string
  participants?: CreateParticipantPayload[]
  links?: CreateLinkPayload[]
}

export interface UpdateEventPayload {
  title?: string
  description?: string
  startDate?: string
  endDate?: string
  allDay?: boolean
  color?: string
  location?: string
  type?: AgendaEventType
  priority?: AgendaEventPriority
  status?: AgendaEventStatus
  rrule?: string
  recurrenceEnd?: string
  participants?: CreateParticipantPayload[]
  links?: CreateLinkPayload[]
}

export interface EventFilters {
  startDate: string
  endDate: string
  type?: AgendaEventType
  priority?: AgendaEventPriority
  status?: AgendaEventStatus
  createdBy?: string
  participantId?: string
  search?: string
}

// ─── LABEL MAPS ─────────────────────────────────────────────

export const EVENT_TYPE_LABELS: Record<AgendaEventType, string> = {
  [AgendaEventType.REUNIAO]: 'Reunião',
  [AgendaEventType.TAREFA]: 'Tarefa',
  [AgendaEventType.LEMBRETE]: 'Lembrete',
  [AgendaEventType.EVENTO]: 'Evento',
  [AgendaEventType.OUTRO]: 'Outro',
}

export const EVENT_PRIORITY_LABELS: Record<AgendaEventPriority, string> = {
  [AgendaEventPriority.BAIXA]: 'Baixa',
  [AgendaEventPriority.MEDIA]: 'Média',
  [AgendaEventPriority.ALTA]: 'Alta',
  [AgendaEventPriority.URGENTE]: 'Urgente',
}

export const EVENT_STATUS_LABELS: Record<AgendaEventStatus, string> = {
  [AgendaEventStatus.PENDENTE]: 'Pendente',
  [AgendaEventStatus.CONFIRMADO]: 'Confirmado',
  [AgendaEventStatus.EM_ANDAMENTO]: 'Em Andamento',
  [AgendaEventStatus.CONCLUIDO]: 'Concluído',
  [AgendaEventStatus.CANCELADO]: 'Cancelado',
}

export const EVENT_TYPE_COLORS: Record<AgendaEventType, string> = {
  [AgendaEventType.REUNIAO]: '#3b82f6',  // blue-500
  [AgendaEventType.TAREFA]: '#f59e0b',   // amber-500
  [AgendaEventType.LEMBRETE]: '#8b5cf6', // violet-500
  [AgendaEventType.EVENTO]: '#10b981',   // emerald-500
  [AgendaEventType.OUTRO]: '#6b7280',    // gray-500
}

export const PRIORITY_COLORS: Record<AgendaEventPriority, string> = {
  [AgendaEventPriority.BAIXA]: 'text-gray-500',
  [AgendaEventPriority.MEDIA]: 'text-blue-500',
  [AgendaEventPriority.ALTA]: 'text-orange-500',
  [AgendaEventPriority.URGENTE]: 'text-red-500',
}
