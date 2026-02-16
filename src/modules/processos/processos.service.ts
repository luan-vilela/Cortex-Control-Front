import api from '@/lib/api'

import type {
  CreateProcessActorPayload,
  CreateProcessPayload,
  GetProcessesFilters,
  GetProcessesResponse,
  Process,
  ProcessActor,
  UpdateProcessActorPayload,
  UpdateProcessPayload,
} from './types'

const BASE_API = '/workspaces'

export const processosService = {
  // ─── PROCESSOS ──────────────────────────────────────────────

  async getProcesses(
    workspaceId: string,
    filters?: GetProcessesFilters
  ): Promise<GetProcessesResponse> {
    const params: Record<string, string | number> = {}

    if (filters?.status) params.status = filters.status
    if (filters?.type) params.type = filters.type
    if (filters?.obrigatorio) params.obrigatorio = filters.obrigatorio
    if (filters?.impeditivo) params.impeditivo = filters.impeditivo
    if (filters?.actorId) params.actorId = filters.actorId
    if (filters?.actorType) params.actorType = filters.actorType
    if (filters?.search) params.search = filters.search
    if (filters?.rootOnly) params.rootOnly = filters.rootOnly
    if (filters?.page) params.page = filters.page
    if (filters?.limit) params.limit = filters.limit

    const response = await api.get(`${BASE_API}/${workspaceId}/processos`, { params })
    return response.data
  },

  async getRootProcesses(workspaceId: string): Promise<Process[]> {
    const response = await api.get(`${BASE_API}/${workspaceId}/processos/roots`)
    return response.data
  },

  async getMyProcesses(
    workspaceId: string,
    filters?: GetProcessesFilters
  ): Promise<GetProcessesResponse> {
    const params: Record<string, string | number> = {}

    if (filters?.status) params.status = filters.status
    if (filters?.type) params.type = filters.type
    if (filters?.search) params.search = filters.search
    if (filters?.page) params.page = filters.page
    if (filters?.limit) params.limit = filters.limit

    const response = await api.get(`${BASE_API}/${workspaceId}/processos/my`, { params })
    return response.data
  },

  async getProcess(workspaceId: string, processId: string): Promise<Process> {
    const response = await api.get(`${BASE_API}/${workspaceId}/processos/${processId}`)
    return response.data
  },

  async getProcessTree(workspaceId: string, processId: string): Promise<Process> {
    const response = await api.get(`${BASE_API}/${workspaceId}/processos/${processId}/tree`)
    return response.data
  },

  async createProcess(workspaceId: string, data: CreateProcessPayload): Promise<Process> {
    const response = await api.post(`${BASE_API}/${workspaceId}/processos`, data)
    return response.data
  },

  async updateProcess(
    workspaceId: string,
    processId: string,
    data: UpdateProcessPayload
  ): Promise<Process> {
    const response = await api.patch(`${BASE_API}/${workspaceId}/processos/${processId}`, data)
    return response.data
  },

  async deleteProcess(workspaceId: string, processId: string): Promise<void> {
    await api.delete(`${BASE_API}/${workspaceId}/processos/${processId}`)
  },

  // ─── ATORES ─────────────────────────────────────────────────

  async getProcessActors(workspaceId: string, processId: string): Promise<ProcessActor[]> {
    const response = await api.get(`${BASE_API}/${workspaceId}/processos/${processId}/actors`)
    return response.data
  },

  async addProcessActor(
    workspaceId: string,
    processId: string,
    data: CreateProcessActorPayload
  ): Promise<ProcessActor> {
    const response = await api.post(
      `${BASE_API}/${workspaceId}/processos/${processId}/actors`,
      data
    )
    return response.data
  },

  async updateProcessActor(
    workspaceId: string,
    processId: string,
    actorId: string,
    data: UpdateProcessActorPayload
  ): Promise<ProcessActor> {
    const response = await api.patch(
      `${BASE_API}/${workspaceId}/processos/${processId}/actors/${actorId}`,
      data
    )
    return response.data
  },

  async removeProcessActor(
    workspaceId: string,
    processId: string,
    actorId: string
  ): Promise<void> {
    await api.delete(`${BASE_API}/${workspaceId}/processos/${processId}/actors/${actorId}`)
  },
}
