export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  STATUS_CHANGE = 'STATUS_CHANGE',
}

export interface AuditLog {
  id: number
  module: string
  feature?: string
  entityName: string
  entityId: number
  action: AuditAction
  oldValue?: Record<string, any>
  newValue?: Record<string, any>
  userId: string
  workspaceId: string
  ipAddress?: string
  userAgent?: string
  createdAt: string
  user?: {
    id: string
    name: string
    email: string
  }
  workspace?: {
    id: string
    name: string
  }
}

export interface GetAuditLogsFilters {
  module?: string
  feature?: string
  entityName?: string
  entityId?: number
  action?: AuditAction
  userId?: string
  startDate?: Date
  endDate?: Date
  page?: number
  limit?: number
}

export interface GetAuditLogsResponse {
  data: AuditLog[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface AuditStatistics {
  totalActions: number
  actionBreakdown: Record<string, number>
  moduleBreakdown: Record<string, number>
  topUsers: Array<{ userId: string; count: number }>
}
