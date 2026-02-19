import { auditoriaService } from '../auditoria.service'
import type { GetAuditLogsFilters } from '../types'

import { useQuery } from '@tanstack/react-query'

export function useAuditLogs(workspaceId: string, filters?: GetAuditLogsFilters) {
  return useQuery({
    queryKey: ['audit-logs', workspaceId, filters],
    queryFn: () => auditoriaService.getAuditLogs(workspaceId, filters),
    enabled: !!workspaceId,
  })
}

export function useEntityHistory(
  workspaceId: string,
  entityName: string,
  entityId: number,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ['audit-entity-history', workspaceId, entityName, entityId],
    queryFn: () => auditoriaService.getEntityHistory(workspaceId, entityName, entityId),
    enabled: enabled && !!workspaceId && !!entityName && !!entityId,
  })
}

export function useRecentActivity(workspaceId: string, limit: number = 20) {
  return useQuery({
    queryKey: ['audit-recent-activity', workspaceId, limit],
    queryFn: () => auditoriaService.getRecentActivity(workspaceId, limit),
    enabled: !!workspaceId,
  })
}

export function useAuditStatistics(workspaceId: string, startDate?: Date, endDate?: Date) {
  return useQuery({
    queryKey: ['audit-statistics', workspaceId, startDate, endDate],
    queryFn: () => auditoriaService.getStatistics(workspaceId, startDate, endDate),
    enabled: !!workspaceId,
  })
}
