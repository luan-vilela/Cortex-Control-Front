'use client'

import type { ReactNode } from 'react'

import { ModuleLayout } from '@/components/layouts/ModuleLayout'

export default function AuditoriaLayout({ children }: { children: ReactNode }) {
  // Auditoria não tem menu lateral, então o conteúdo ocupa todo o espaço
  return <ModuleLayout topNav={[]}>{children}</ModuleLayout>
}
