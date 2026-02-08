'use client'

import type { ReactNode } from 'react'

import {
  AlertTriangle,
  Archive,
  BarChart3,
  CheckCircle,
  CreditCard,
  Package,
  PauseCircle,
  Settings,
  Users,
} from 'lucide-react'
import { useParams } from 'next/navigation'

import { ModuleLayout } from '@/components/layouts/ModuleLayout'
import type { ModuleMenuGroup } from '@/components/layouts/ModuleLayout'
import { useEnabledModules, useWorkspace } from '@/modules/workspace/hooks'
import { WorkspaceStatus } from '@/modules/workspace/types/workspace.types'

const statusConfig = {
  [WorkspaceStatus.ACTIVE]: {
    label: 'Ativo',
    icon: CheckCircle,
    color: 'text-green-600',
    dotColor: 'bg-green-500',
  },
  [WorkspaceStatus.INACTIVE]: {
    label: 'Inativo',
    icon: PauseCircle,
    color: 'text-gray-600',
    dotColor: 'bg-gray-500',
  },
  [WorkspaceStatus.SUSPENDED]: {
    label: 'Suspenso',
    icon: AlertTriangle,
    color: 'text-red-600',
    dotColor: 'bg-red-500',
  },
  [WorkspaceStatus.ARCHIVED]: {
    label: 'Arquivado',
    icon: Archive,
    color: 'text-yellow-600',
    dotColor: 'bg-yellow-500',
  },
}

const getMenuItems = (workspaceId: string): ModuleMenuGroup[] => [
  {
    section: 'management',
    label: 'Gerencia do Workspace',
    items: [
      {
        label: 'Configurações',
        href: `/workspaces/${workspaceId}/settings`,
        icon: Settings,
      },
      {
        label: 'Membros',
        href: `/workspaces/${workspaceId}/members`,
        icon: Users,
      },
      {
        label: 'Módulos',
        href: `/workspaces/${workspaceId}/modules`,
        icon: Package,
      },
    ],
  },
  {
    section: 'billing',
    label: 'Faturamento',
    items: [
      {
        label: 'Relatórios',
        href: `/workspaces/${workspaceId}/billing/reports`,
        icon: BarChart3,
      },
      {
        label: 'Cobrança',
        href: `/workspaces/${workspaceId}/billing/settings`,
        icon: CreditCard,
      },
    ],
  },
]

const getNavItems = (workspaceId: string): ModuleMenuGroup[] => [
  {
    label: 'Configurações',
    href: `/workspaces/${workspaceId}/settings`,
    icon: Settings,
  },
  {
    label: 'Membros',
    href: `/workspaces/${workspaceId}/members`,
    icon: Users,
  },
  {
    label: 'Módulos',
    href: `/workspaces/${workspaceId}/modules`,
    icon: Package,
  },
  {
    label: 'Relatórios',
    href: `/workspaces/${workspaceId}/billing/reports`,
    icon: BarChart3,
  },
  {
    label: 'Cobrança',
    href: `/workspaces/${workspaceId}/billing/settings`,
    icon: CreditCard,
  },
]

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const params = useParams()
  const workspaceId = params.id as string
  const { data: enabledModules = [] } = useEnabledModules(workspaceId)
  const { data: workspace } = useWorkspace(workspaceId)

  const navItems = getNavItems(workspaceId)
  const menuItems = getMenuItems(workspaceId)
  const title = workspace
    ? `${statusConfig[workspace.status as WorkspaceStatus]?.label || 'Workspace'} (${enabledModules.length} módulos)`
    : 'Workspace'

  return (
    <ModuleLayout menuItems={menuItems} topNav={navItems} menuTitle={title}>
      {children}
    </ModuleLayout>
  )
}
