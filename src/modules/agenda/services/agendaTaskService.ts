import api from '@/lib/api'

import type {
  AgendaTaskItem,
  CreateTaskPayload,
  UpdateTaskPayload,
  MoveTaskPayload,
  TaskFilters,
  TaskChecklistItem,
} from '../types/tasks'

const BASE_API = '/workspaces'

export const agendaTaskService = {
  async getTasks(
    workspaceId: string,
    filters?: TaskFilters,
  ): Promise<AgendaTaskItem[]> {
    const params: Record<string, string> = {}
    if (filters?.status) params.status = filters.status
    if (filters?.search) params.search = filters.search
    const { data } = await api.get(
      `${BASE_API}/${workspaceId}/agenda/tasks`,
      { params },
    )
    return data
  },

  async getTask(
    workspaceId: string,
    taskId: string,
  ): Promise<AgendaTaskItem> {
    const { data } = await api.get(
      `${BASE_API}/${workspaceId}/agenda/tasks/${taskId}`,
    )
    return data
  },

  async createTask(
    workspaceId: string,
    payload: CreateTaskPayload,
  ): Promise<AgendaTaskItem> {
    const { data } = await api.post(
      `${BASE_API}/${workspaceId}/agenda/tasks`,
      payload,
    )
    return data
  },

  async updateTask(
    workspaceId: string,
    taskId: string,
    payload: UpdateTaskPayload,
  ): Promise<AgendaTaskItem> {
    const { data } = await api.patch(
      `${BASE_API}/${workspaceId}/agenda/tasks/${taskId}`,
      payload,
    )
    return data
  },

  async deleteTask(
    workspaceId: string,
    taskId: string,
  ): Promise<void> {
    await api.delete(`${BASE_API}/${workspaceId}/agenda/tasks/${taskId}`)
  },

  async moveTask(
    workspaceId: string,
    taskId: string,
    payload: MoveTaskPayload,
  ): Promise<AgendaTaskItem> {
    const { data } = await api.patch(
      `${BASE_API}/${workspaceId}/agenda/tasks/${taskId}/move`,
      payload,
    )
    return data
  },

  async toggleChecklistItem(
    workspaceId: string,
    taskId: string,
    checklistItemId: string,
  ): Promise<TaskChecklistItem> {
    const { data } = await api.patch(
      `${BASE_API}/${workspaceId}/agenda/tasks/${taskId}/checklist/${checklistItemId}/toggle`,
    )
    return data
  },
}
