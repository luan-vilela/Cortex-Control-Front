import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor para adicionar token JWT
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  },
);

// Contact API Endpoints
export const contactAPI = {
  // Contact CRUD
  createContact: (workspaceId: string, data: any) =>
    api.post(`/workspaces/${workspaceId}/contacts`, data),

  getContact: (workspaceId: string, contactId: string) =>
    api.get(`/workspaces/${workspaceId}/contacts/${contactId}`),

  listContacts: (workspaceId: string, roleType?: string, active?: string) => {
    const params = new URLSearchParams();
    if (roleType) params.append("roleType", roleType);
    if (active) params.append("active", active);
    const query = params.toString() ? `?${params.toString()}` : "";
    return api.get(`/workspaces/${workspaceId}/contacts${query}`);
  },

  updateContact: (workspaceId: string, contactId: string, data: any) =>
    api.put(`/workspaces/${workspaceId}/contacts/${contactId}`, data),

  deleteContact: (workspaceId: string, contactId: string) =>
    api.delete(`/workspaces/${workspaceId}/contacts/${contactId}`),

  restoreContact: (workspaceId: string, contactId: string) =>
    api.patch(`/workspaces/${workspaceId}/contacts/${contactId}/restore`, {}),

  hardDeleteContact: (workspaceId: string, contactId: string) =>
    api.delete(`/workspaces/${workspaceId}/contacts/${contactId}/hard`, {}),

  // Phone Management
  addPhone: (workspaceId: string, contactId: string, data: any) =>
    api.post(`/workspaces/${workspaceId}/contacts/${contactId}/phones`, data),

  updatePhone: (
    workspaceId: string,
    contactId: string,
    phoneId: string,
    data: any,
  ) =>
    api.put(
      `/workspaces/${workspaceId}/contacts/${contactId}/phones/${phoneId}`,
      data,
    ),

  deletePhone: (workspaceId: string, contactId: string, phoneId: string) =>
    api.delete(
      `/workspaces/${workspaceId}/contacts/${contactId}/phones/${phoneId}`,
    ),

  // Client Role
  addClientRole: (workspaceId: string, contactId: string, data: any) =>
    api.post(
      `/workspaces/${workspaceId}/contacts/${contactId}/client-role`,
      data,
    ),

  updateClientRole: (workspaceId: string, contactId: string, data: any) =>
    api.put(
      `/workspaces/${workspaceId}/contacts/${contactId}/client-role`,
      data,
    ),

  removeClientRole: (workspaceId: string, contactId: string) =>
    api.delete(`/workspaces/${workspaceId}/contacts/${contactId}/client-role`),

  // Supplier Role
  addSupplierRole: (workspaceId: string, contactId: string, data: any) =>
    api.post(
      `/workspaces/${workspaceId}/contacts/${contactId}/supplier-role`,
      data,
    ),

  updateSupplierRole: (workspaceId: string, contactId: string, data: any) =>
    api.put(
      `/workspaces/${workspaceId}/contacts/${contactId}/supplier-role`,
      data,
    ),

  removeSupplierRole: (workspaceId: string, contactId: string) =>
    api.delete(
      `/workspaces/${workspaceId}/contacts/${contactId}/supplier-role`,
    ),

  // Partner Role
  addPartnerRole: (workspaceId: string, contactId: string, data: any) =>
    api.post(
      `/workspaces/${workspaceId}/contacts/${contactId}/partner-role`,
      data,
    ),

  updatePartnerRole: (workspaceId: string, contactId: string, data: any) =>
    api.put(
      `/workspaces/${workspaceId}/contacts/${contactId}/partner-role`,
      data,
    ),

  removePartnerRole: (workspaceId: string, contactId: string) =>
    api.delete(`/workspaces/${workspaceId}/contacts/${contactId}/partner-role`),
};

export default api;
