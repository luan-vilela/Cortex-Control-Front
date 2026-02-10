import {
  ClienteAnalytics,
  ClienteData,
  CreateClienteDTO,
  UpdateClienteDTO,
} from '../types/cliente.types'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import api from '@/lib/api'

export const CLIENTES_QUERY_KEY = 'clientes'

export const useClientes = (workspaceId: string, filters?: Record<string, any>) => {
  return useQuery({
    queryKey: [CLIENTES_QUERY_KEY, workspaceId, filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters?.categoria) params.append('categoria', filters.categoria)
      if (filters?.status) params.append('status', filters.status)
      if (filters?.search) params.append('search', filters.search)

      const { data } = await api.get(`/workspaces/${workspaceId}/clientes?${params.toString()}`)
      return data as ClienteData[]
    },
    enabled: !!workspaceId,
  })
}

export const useCliente = (workspaceId: string, clienteId: string) => {
  return useQuery({
    queryKey: [CLIENTES_QUERY_KEY, workspaceId, clienteId],
    queryFn: async () => {
      const { data } = await api.get(`/workspaces/${workspaceId}/clientes/${clienteId}`)
      return data as ClienteData
    },
    enabled: !!workspaceId && !!clienteId,
  })
}

export const useClientesAnalytics = (workspaceId: string) => {
  return useQuery({
    queryKey: [CLIENTES_QUERY_KEY, workspaceId, 'analytics'],
    queryFn: async () => {
      const { data } = await api.get(`/workspaces/${workspaceId}/clientes/analytics`)
      return data as ClienteAnalytics
    },
    enabled: !!workspaceId,
  })
}

export const useCreateCliente = (workspaceId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (dto: CreateClienteDTO) => {
      const { data } = await api.post(`/workspaces/${workspaceId}/clientes`, dto)
      return data as ClienteData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CLIENTES_QUERY_KEY, workspaceId],
      })
    },
  })
}

export const useUpdateCliente = (workspaceId: string, clienteId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (dto: UpdateClienteDTO) => {
      const { data } = await api.patch(`/workspaces/${workspaceId}/clientes/${clienteId}`, dto)
      return data as ClienteData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CLIENTES_QUERY_KEY, workspaceId],
      })
    },
  })
}

export const useDeactivateCliente = (workspaceId: string, clienteId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.patch(
        `/workspaces/${workspaceId}/clientes/${clienteId}/deactivate`
      )
      return data as ClienteData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CLIENTES_QUERY_KEY, workspaceId],
      })
    },
  })
}

export const useActivateCliente = (workspaceId: string, clienteId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.patch(`/workspaces/${workspaceId}/clientes/${clienteId}/activate`)
      return data as ClienteData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CLIENTES_QUERY_KEY, workspaceId],
      })
    },
  })
}

export const useDeleteCliente = (workspaceId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (clienteId: string) => {
      await api.delete(`/workspaces/${workspaceId}/clientes/${clienteId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CLIENTES_QUERY_KEY, workspaceId],
      })
    },
  })
}
