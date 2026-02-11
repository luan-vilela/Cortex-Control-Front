'use client'

import type { ReactNode } from 'react'

import { ModuleLayout } from '@/components/layouts/ModuleLayout'

export default function FinanceLayout({ children }: { children: ReactNode }) {
  // Finance não tem menu lateral, então o conteúdo ocupa todo o espaço
  return <ModuleLayout topNav={[]}>{children}</ModuleLayout>
}
