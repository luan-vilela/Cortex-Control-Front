import api from '@/lib/api'

import type { AuditLog, AuditStatistics, GetAuditLogsFilters, GetAuditLogsResponse } from './types'

const AUDIT_API = '/workspaces'

export const auditoriaService = {
  /**
   * Lista logs de auditoria com filtros
   */
  async getAuditLogs(
    workspaceId: string,
    filters?: GetAuditLogsFilters
  ): Promise<GetAuditLogsResponse> {
    const response = await api.get(`${AUDIT_API}/${workspaceId}/audit/logs`, {
      params: {
        module: filters?.module,
        feature: filters?.feature,
        entityName: filters?.entityName,
        entityId: filters?.entityId,
        action: filters?.action,
        userId: filters?.userId,
        startDate: filters?.startDate?.toISOString(),
        endDate: filters?.endDate?.toISOString(),
        page: filters?.page || 1,
        limit: filters?.limit || 20,
      },
    })
    return response.data
  },

  /**
   * Obtém histórico de uma entidade específica
   */
  async getEntityHistory(
    workspaceId: string,
    entityName: string,
    entityId: number
  ): Promise<AuditLog[]> {
    const response = await api.get(
      `${AUDIT_API}/${workspaceId}/audit/entity/${entityName}/${entityId}`
    )
    return response.data
  },

  /**
   * Obtém atividade recente
   */
  async getRecentActivity(workspaceId: string, limit: number = 20): Promise<AuditLog[]> {
    const response = await api.get(`${AUDIT_API}/${workspaceId}/audit/recent`, {
      params: { limit },
    })
    return response.data
  },

  /**
   * Obtém estatísticas de auditoria
   */
  async getStatistics(
    workspaceId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<AuditStatistics> {
    const response = await api.get(`${AUDIT_API}/${workspaceId}/audit/statistics`, {
      params: {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      },
    })
    return response.data
  },
}
