import { useQuery } from '@tanstack/react-query'

import api from '@/lib/api'

/**
 * Hook para verificar quais papéis (roles) uma pessoa tem
 * Retorna array com os papéis: ['Cliente', 'Fornecedor', 'Parceiro']
 */
export function usePersonRoles(workspaceId: string, personId: string) {
  return useQuery({
    queryKey: ['person-roles', workspaceId, personId],
    queryFn: async () => {
      const response = await api.get(`/workspaces/${workspaceId}/persons/${personId}/roles`)
      return response.data
    },
    enabled: !!workspaceId && !!personId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
