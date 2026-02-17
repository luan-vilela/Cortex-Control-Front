import type React from 'react'

import { BarChart3, DollarSign, GitBranch, MessageSquare, TrendingUp, Users, Zap } from 'lucide-react'

export interface ModuleConfig {
  moduleRoutes: Record<string, string>
  moduleIcons: Record<string, React.ComponentType<{ className?: string }>>
}

export function useModuleConfig(workspaceId?: string): ModuleConfig {
  const baseId = workspaceId || ':workspaceId'

  const moduleRoutes: Record<string, string> = {
    contacts: '/contatos',
    finance: '/financeiro',
    sales: '/sales',
    conversations: '/conversations',
    automations: '/automations',
    reports: '/reports',
    auditoria: '/auditoria',
    settings: `/workspaces/${baseId}/settings`,
    members: `/workspaces/${baseId}/members`,
  }

  const moduleIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    contacts: Users,
    conversations: MessageSquare,
    automations: Zap,
    sales: TrendingUp,
    finance: DollarSign,
    reports: BarChart3,
    processos: GitBranch,
  }

  return {
    moduleRoutes,
    moduleIcons,
  }
}
