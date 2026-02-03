import api from "@/lib/api";
import {
  Person,
  CreatePersonDto,
  UpdatePersonDto,
  PersonStats,
  PersonFilters,
} from "../types/person.types";

export const personService = {
  // Criar pessoa
  async createPerson(
    workspaceId: string,
    data: CreatePersonDto,
  ): Promise<Person> {
    const response = await api.post(`/workspaces/${workspaceId}/persons`, data);
    return response.data.person;
  },

  // Listar pessoas
  async getPersons(
    workspaceId: string,
    filters?: PersonFilters,
  ): Promise<{ persons: Person[]; total: number }> {
    const params = new URLSearchParams();

    if (filters?.type) params.append("type", filters.type);
    if (filters?.active !== undefined)
      params.append("active", String(filters.active));
    if (filters?.search) params.append("search", filters.search);

    const response = await api.get(
      `/workspaces/${workspaceId}/persons?${params.toString()}`,
    );
    return response.data;
  },

  // Obter pessoa por ID
  async getPerson(workspaceId: string, personId: string): Promise<Person> {
    const response = await api.get(
      `/workspaces/${workspaceId}/persons/${personId}`,
    );
    return response.data.person;
  },

  // Atualizar pessoa
  async updatePerson(
    workspaceId: string,
    personId: string,
    data: UpdatePersonDto,
  ): Promise<Person> {
    const response = await api.patch(
      `/workspaces/${workspaceId}/persons/${personId}`,
      data,
    );
    return response.data.person;
  },

  // Remover pessoa (soft delete)
  async deletePerson(workspaceId: string, personId: string): Promise<void> {
    await api.delete(`/workspaces/${workspaceId}/persons/${personId}`);
  },

  // Remover pessoa permanentemente (hard delete)
  async hardDeletePerson(workspaceId: string, personId: string): Promise<void> {
    await api.delete(`/workspaces/${workspaceId}/persons/${personId}/hard`);
  },

  // Reativar pessoa
  async restorePerson(workspaceId: string, personId: string): Promise<Person> {
    const response = await api.patch(
      `/workspaces/${workspaceId}/persons/${personId}/restore`,
    );
    return response.data.person;
  },

  // Obter estatísticas
  async getStats(workspaceId: string): Promise<PersonStats> {
    const response = await api.get(`/workspaces/${workspaceId}/persons/stats`);
    return response.data.stats;
  },
};
