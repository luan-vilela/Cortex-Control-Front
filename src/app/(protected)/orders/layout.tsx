'use client'

import type { ReactNode } from 'react'

import { ModuleLayout } from '@/components/layouts/ModuleLayout'

export default function OrdersLayout({ children }: { children: ReactNode }) {
  // Orders não tem menu lateral, então o conteúdo ocupa todo o espaço
  return <ModuleLayout topNav={[]}>{children}</ModuleLayout>
}
