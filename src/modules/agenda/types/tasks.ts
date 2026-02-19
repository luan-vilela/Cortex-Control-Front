// ─── TASK TYPES ─────────────────────────────────────────────

export enum AgendaTaskStatus {
  PENDENTE = 'PENDENTE',
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDO = 'CONCLUIDO',
}

export const TASK_STATUS_LABELS: Record<AgendaTaskStatus, string> = {
  [AgendaTaskStatus.PENDENTE]: 'Pendentes',
  [AgendaTaskStatus.EM_ANDAMENTO]: 'Em Andamento',
  [AgendaTaskStatus.CONCLUIDO]: 'Concluídas',
}

export const TASK_STATUS_COLORS: Record<AgendaTaskStatus, string> = {
  [AgendaTaskStatus.PENDENTE]: '#f59e0b',
  [AgendaTaskStatus.EM_ANDAMENTO]: '#3b82f6',
  [AgendaTaskStatus.CONCLUIDO]: '#10b981',
}

export interface TaskChecklistItem {
  id: string
  taskId: string
  title: string
  checked: boolean
  order: number
  createdAt: string
}

export interface TaskLink {
  id: string
  taskId: string
  url: string
  label: string | null
  createdAt: string
}

export interface AgendaTaskItem {
  id: string
  workspaceId: string
  title: string
  observation: string | null
  status: AgendaTaskStatus
  order: number
  createdBy: string
  deletedAt: string | null
  checklist: TaskChecklistItem[]
  links: TaskLink[]
  createdAt: string
  updatedAt: string
}

// ─── PAYLOADS ───────────────────────────────────────────────

export interface CreateChecklistPayload {
  title: string
  order?: number
}

export interface CreateTaskLinkPayload {
  url: string
  label?: string
}

export interface CreateTaskPayload {
  title: string
  observation?: string
  status?: AgendaTaskStatus
  order?: number
  checklist?: CreateChecklistPayload[]
  links?: CreateTaskLinkPayload[]
}

export interface UpdateTaskPayload {
  title?: string
  observation?: string
  status?: AgendaTaskStatus
  order?: number
  checklist?: {
    id?: string
    title: string
    checked?: boolean
    order?: number
  }[]
  links?: {
    id?: string
    url: string
    label?: string
  }[]
}

export interface MoveTaskPayload {
  status: AgendaTaskStatus
  order: number
}

export interface TaskFilters {
  status?: AgendaTaskStatus
  search?: string
}
