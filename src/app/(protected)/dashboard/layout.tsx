'use client'

import { ModuleLayout } from '@/components/layouts/ModuleLayout'
import { useWorkspaceStore } from '@/modules/workspace/store/workspace.store'

export default function ContatosLayout({ children }: { children: React.ReactNode }) {
  const { activeWorkspace } = useWorkspaceStore()

  if (!activeWorkspace) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <p className="text-gh-text-secondary">Selecione um workspace para continuar</p>
      </div>
    )
  }

  return (
    <ModuleLayout topNav={[]} menuTitle="Contatos">
      {children}
    </ModuleLayout>
  )
}
