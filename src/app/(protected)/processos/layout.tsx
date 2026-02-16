'use client'

import type { ReactNode } from 'react'

import { ModuleLayout } from '@/components/layouts/ModuleLayout'

export default function ProcessosLayout({ children }: { children: ReactNode }) {
  return <ModuleLayout topNav={[]}>{children}</ModuleLayout>
}
