import {
  type AllContacts,
  type CreatePersonDto,
  type PersonFilters,
  type PersonStats,
  type UpdatePersonDto,
} from '../types/person.types'

import api from '@/lib/api'
import { buildQueryParams } from '@/lib/utils'

export const personService = {
  // Criar pessoa
  async createPerson(workspaceId: string, data: CreatePersonDto): Promise<AllContacts> {
    const response = await api.post(`/workspaces/${workspaceId}/persons`, data)
    return response.data
  },

  // Listar pessoas
  async getPersons(workspaceId: string, filters?: PersonFilters): Promise<AllContacts[]> {
    const queryString = buildQueryParams(filters)
    const response = await api.get(
      `/workspaces/${workspaceId}/persons${queryString ? `?${queryString}` : ''}`
    )
    return response.data
  },

  // Obter pessoa por ID
  async getPerson(workspaceId: string, personId: string): Promise<AllContacts> {
    const response = await api.get(`/workspaces/${workspaceId}/persons/${personId}`)
    return response.data
  },

  // Atualizar pessoa
  async updatePerson(
    workspaceId: string,
    personId: string,
    data: UpdatePersonDto
  ): Promise<AllContacts> {
    const response = await api.patch(`/workspaces/${workspaceId}/persons/${personId}`, data)
    return response.data
  },

  // Remover pessoa (soft delete)
  async deletePerson(workspaceId: string, personId: string): Promise<void> {
    await api.delete(`/workspaces/${workspaceId}/persons/${personId}`)
  },

  // Remover pessoa permanentemente (hard delete)
  async hardDeletePerson(workspaceId: string, personId: string): Promise<void> {
    await api.delete(`/workspaces/${workspaceId}/persons/${personId}/hard`)
  },

  // Reativar pessoa
  async restorePerson(workspaceId: string, personId: string): Promise<AllContacts> {
    const response = await api.patch(`/workspaces/${workspaceId}/persons/${personId}/restore`)
    return response.data
  },

  // Obter estatísticas
  async getStats(workspaceId: string): Promise<PersonStats> {
    const response = await api.get(`/workspaces/${workspaceId}/persons/stats`)
    return response.data
  },
}
