'use client'

import { Briefcase, Handshake, ShoppingCart, TrendingUp, Users } from 'lucide-react'

import { ModuleLayout, type ModuleMenuGroup } from '@/components/layouts/ModuleLayout'
import { usePersonStats } from '@/modules/person/hooks/usePersonQueries'
import { useWorkspaceStore } from '@/modules/workspace/store/workspace.store'

const getNavTopItems = (stats: any): ModuleMenuGroup[] => [
  {
    label: 'Todos os Contatos',
    href: '/contatos',
    icon: Users,
    badge: stats?.byType?.PERSON || 0,
  },
  {
    label: 'Clientes',
    href: '/contatos/clientes',
    icon: ShoppingCart,
    badge: stats?.byType?.CLIENTE || 0,
  },
  {
    label: 'Fornecedores',
    href: '/contatos/fornecedores',
    icon: Briefcase,
    badge: stats?.byType?.FORNECEDOR || 0,
  },
  {
    label: 'Parceiros',
    href: '/contatos/parceiros',
    icon: Handshake,
    badge: stats?.byType?.PARCEIRO || 0,
  },
  {
    label: 'Sem Papéis',
    href: '/contatos/sem-papeis',
    icon: TrendingUp,
    badge: stats?.byType?.LEAD || 0,
  },
]

export default function ContatosLayout({ children }: { children: React.ReactNode }) {
  const { activeWorkspace } = useWorkspaceStore()
  const { data: stats } = usePersonStats(activeWorkspace?.id || '')

  if (!activeWorkspace) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <p className="text-gh-text-secondary">Selecione um workspace para continuar</p>
      </div>
    )
  }

  const navTopItems = getNavTopItems(stats)

  return (
    <ModuleLayout topNav={navTopItems} menuTitle="Contatos">
      {children}
    </ModuleLayout>
  )
}
