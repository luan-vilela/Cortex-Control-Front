'use client'

import type { ReactNode } from 'react'

import { ClipboardList, Cog, PieChart } from 'lucide-react'

import { ModuleLayout } from '@/components/layouts/ModuleLayout'

export default function ProcessosLayout({ children }: { children: ReactNode }) {
  return (
    <ModuleLayout
      topNav={[
        { label: 'Gerenciar', href: '/processos', icon: ClipboardList },
        { label: 'Relatórios', href: '/processos/relatorios', icon: PieChart },
        { label: 'Configurações', href: '/processos/configuracoes', icon: Cog },
      ]}
    >
      {children}
    </ModuleLayout>
  )
}
