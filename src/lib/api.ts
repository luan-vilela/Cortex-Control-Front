import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Variáveis para controle de refresh token
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

// Interceptor para adicionar token JWT
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para tratar erros com refresh token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config

    // Detecta erros de conexão (ERR_CONNECTION_REFUSED, ERR_NETWORK, etc)
    const isConnectionError =
      error.code === 'ERR_NETWORK' ||
      error.code === 'ERR_CONNECTION_REFUSED' ||
      error.message === 'Network Error' ||
      !error.response

    // Se houver erro de conexão, faz logout
    if (isConnectionError) {
      if (typeof window !== 'undefined') {
        const isAuthPage =
          window.location.pathname.includes('/auth/login') ||
          window.location.pathname.includes('/logout')
        if (!isAuthPage) {
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          window.location.href = '/logout'
        }
      }
      return Promise.reject(error)
    }

    // Se for 401 e não for a rota de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (
        originalRequest.url?.includes('/auth/refresh') ||
        originalRequest.url?.includes('/auth/login')
      ) {
        // Se falhou no refresh ou login, faz logout
        if (typeof window !== 'undefined') {
          const isAuthPage =
            window.location.pathname.includes('/auth/login') ||
            window.location.pathname.includes('/logout')
          if (!isAuthPage) {
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')
            window.location.href = '/logout'
          }
        }
        return Promise.reject(error)
      }

      if (isRefreshing) {
        // Se já está refreshing, coloca na fila
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return api(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1

      // Limite de tentativas configurável via .env
      const maxRetries = parseInt(process.env.NEXT_PUBLIC_MAX_REFRESH_RETRIES || '5', 10)
      if (originalRequest._retryCount > maxRetries) {
        if (typeof window !== 'undefined') {
          const isAuthPage =
            window.location.pathname.includes('/auth/login') ||
            window.location.pathname.includes('/logout')
          if (!isAuthPage) {
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')
            window.location.href = '/logout'
          }
        }
        return Promise.reject(error)
      }

      isRefreshing = true

      const refreshToken =
        typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null

      if (!refreshToken) {
        isRefreshing = false
        if (typeof window !== 'undefined') {
          const isAuthPage =
            window.location.pathname.includes('/auth/login') ||
            window.location.pathname.includes('/logout')
          if (!isAuthPage) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/logout'
          }
        }
        return Promise.reject(error)
      }

      try {
        const response = await api.post('/auth/refresh', { refreshToken })
        const { accessToken, refreshToken: newRefreshToken } = response.data

        if (typeof window !== 'undefined') {
          localStorage.setItem('token', accessToken)
          localStorage.setItem('refreshToken', newRefreshToken)
        }

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }

        processQueue(null, accessToken)
        isRefreshing = false

        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        isRefreshing = false

        if (typeof window !== 'undefined') {
          const isAuthPage =
            window.location.pathname.includes('/auth/login') ||
            window.location.pathname.includes('/logout')
          if (!isAuthPage) {
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')
            window.location.href = '/logout'
          }
        }

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Contact API Endpoints
export const contactAPI = {
  // Contact CRUD
  createContact: (workspaceId: string, data: any) =>
    api.post(`/workspaces/${workspaceId}/contacts`, data),

  getContact: (workspaceId: string, contactId: string) =>
    api.get(`/workspaces/${workspaceId}/contacts/${contactId}`),

  listContacts: (workspaceId: string, roleType?: string, active?: string) => {
    const params = new URLSearchParams()
    if (roleType) params.append('roleType', roleType)
    if (active) params.append('active', active)
    const query = params.toString() ? `?${params.toString()}` : ''
    return api.get(`/workspaces/${workspaceId}/contacts${query}`)
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

  updatePhone: (workspaceId: string, contactId: string, phoneId: string, data: any) =>
    api.put(`/workspaces/${workspaceId}/contacts/${contactId}/phones/${phoneId}`, data),

  deletePhone: (workspaceId: string, contactId: string, phoneId: string) =>
    api.delete(`/workspaces/${workspaceId}/contacts/${contactId}/phones/${phoneId}`),

  // Client Role
  addClientRole: (workspaceId: string, contactId: string, data: any) =>
    api.post(`/workspaces/${workspaceId}/contacts/${contactId}/client-role`, data),

  updateClientRole: (workspaceId: string, contactId: string, data: any) =>
    api.put(`/workspaces/${workspaceId}/contacts/${contactId}/client-role`, data),

  removeClientRole: (workspaceId: string, contactId: string) =>
    api.delete(`/workspaces/${workspaceId}/contacts/${contactId}/client-role`),

  // Supplier Role
  addSupplierRole: (workspaceId: string, contactId: string, data: any) =>
    api.post(`/workspaces/${workspaceId}/contacts/${contactId}/supplier-role`, data),

  updateSupplierRole: (workspaceId: string, contactId: string, data: any) =>
    api.put(`/workspaces/${workspaceId}/contacts/${contactId}/supplier-role`, data),

  removeSupplierRole: (workspaceId: string, contactId: string) =>
    api.delete(`/workspaces/${workspaceId}/contacts/${contactId}/supplier-role`),

  // Partner Role
  addPartnerRole: (workspaceId: string, contactId: string, data: any) =>
    api.post(`/workspaces/${workspaceId}/contacts/${contactId}/partner-role`, data),

  updatePartnerRole: (workspaceId: string, contactId: string, data: any) =>
    api.put(`/workspaces/${workspaceId}/contacts/${contactId}/partner-role`, data),

  removePartnerRole: (workspaceId: string, contactId: string) =>
    api.delete(`/workspaces/${workspaceId}/contacts/${contactId}/partner-role`),
}

export default api
