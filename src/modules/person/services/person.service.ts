import api from "@/lib/api";
import {
  AllContacts,
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
  ): Promise<AllContacts> {
    const response = await api.post(`/workspaces/${workspaceId}/persons`, data);
    return response.data;
  },

  // Listar pessoas
  async getPersons(
    workspaceId: string,
    filters?: PersonFilters,
  ): Promise<AllContacts[]> {
    const params = new URLSearchParams();

    if (filters?.entityType) params.append("entityType", filters.entityType);
    if (filters?.active !== undefined)
      params.append("active", String(filters.active));
    if (filters?.search) params.append("search", filters.search);

    const response = await api.get(
      `/workspaces/${workspaceId}/persons?${params.toString()}`,
    );
    return response.data;
  },

  // Obter pessoa por ID
  async getPerson(workspaceId: string, personId: string): Promise<AllContacts> {
    const response = await api.get(
      `/workspaces/${workspaceId}/persons/${personId}`,
    );
    return response.data;
  },

  // Atualizar pessoa
  async updatePerson(
    workspaceId: string,
    personId: string,
    data: UpdatePersonDto,
  ): Promise<AllContacts> {
    const response = await api.patch(
      `/workspaces/${workspaceId}/persons/${personId}`,
      data,
    );
    return response.data;
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
  async restorePerson(
    workspaceId: string,
    personId: string,
  ): Promise<AllContacts> {
    const response = await api.patch(
      `/workspaces/${workspaceId}/persons/${personId}/restore`,
    );
    return response.data;
  },

  // Obter estatísticas
  async getStats(workspaceId: string): Promise<PersonStats> {
    const response = await api.get(`/workspaces/${workspaceId}/persons/stats`);
    return response.data;
  },
};

// Funções para Leads
export const createLead = async (
  workspaceId: string,
  data: any,
): Promise<any> => {
  const response = await api.post(`/workspaces/${workspaceId}/leads`, data);
  return response.data;
};

export const getLeads = async (
  workspaceId: string,
  filters?: {
    search?: string;
    status?: string;
    active?: boolean;
  },
): Promise<any[]> => {
  const params = new URLSearchParams();

  if (filters?.status) params.append("status", filters.status);
  if (filters?.active !== undefined)
    params.append("active", String(filters.active));
  if (filters?.search) params.append("search", filters.search);

  const response = await api.get(
    `/workspaces/${workspaceId}/leads?${params.toString()}`,
  );
  return response.data;
};

export const getLead = async (
  workspaceId: string,
  leadId: string,
): Promise<any> => {
  const response = await api.get(`/workspaces/${workspaceId}/leads/${leadId}`);
  return response.data;
};

export const updateLead = async (
  workspaceId: string,
  leadId: string,
  data: any,
): Promise<any> => {
  const response = await api.patch(
    `/workspaces/${workspaceId}/leads/${leadId}`,
    data,
  );
  return response.data;
};

export const deleteLead = async (
  workspaceId: string,
  leadId: string,
): Promise<void> => {
  await api.delete(`/workspaces/${workspaceId}/leads/${leadId}`);
};

export const hardDeleteLead = async (
  workspaceId: string,
  leadId: string,
): Promise<void> => {
  await api.delete(`/workspaces/${workspaceId}/leads/${leadId}/hard`);
};

export const restoreLead = async (
  workspaceId: string,
  leadId: string,
): Promise<any> => {
  const response = await api.patch(
    `/workspaces/${workspaceId}/leads/${leadId}/restore`,
  );
  return response.data;
};

export const getLeadStats = async (workspaceId: string): Promise<any> => {
  const response = await api.get(`/workspaces/${workspaceId}/leads/stats`);
  return response.data;
};
