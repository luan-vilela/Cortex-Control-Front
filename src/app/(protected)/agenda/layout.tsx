'use client'

import type { ReactNode } from 'react'

import { Calendar, CheckSquare } from 'lucide-react'

import { ModuleLayout, type ModuleMenuGroup } from '@/components/layouts/ModuleLayout'

const topNavItems: ModuleMenuGroup[] = [
  {
    label: 'Agenda',
    href: '/agenda',
    icon: Calendar,
  },
]

export default function AgendaLayout({ children }: { children: ReactNode }) {
  return (
    <ModuleLayout topNav={topNavItems}>
      {children}
    </ModuleLayout>
  )
}
