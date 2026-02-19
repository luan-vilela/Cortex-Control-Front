'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { ProcessForm } from '@/modules/processos/components/ProcessForm'
import { useProcesso } from '@/modules/processos/hooks/useProcessos'
import { ModuleGuard } from '@/modules/workspace/components/ModuleGuard'
import { useBreadcrumb } from '@/modules/workspace/hooks'
import { useActiveWorkspace } from '@/modules/workspace/hooks/useActiveWorkspace'

export default function NewProcessoPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { activeWorkspace } = useActiveWorkspace()

  const parentId = searchParams.get('parentId') || undefined
  const workspaceId = activeWorkspace?.id || ''

  const { data: parentProcess } = useProcesso(
    workspaceId,
    parentId || '',
    !!workspaceId && !!parentId
  )

  useBreadcrumb([
    {
      label: 'Processos',
      href: '/processos',
    },
    ...(parentProcess
      ? [
          {
            label: parentProcess.name,
            href: `/processos/${parentProcess.id}`,
          },
        ]
      : []),
    {
      label: parentId ? 'Novo Subprocesso' : 'Novo Processo',
      href: '/processos/new',
    },
  ])

  const handleSuccess = () => {
    if (parentId) {
      router.push(`/processos/${parentId}`)
    } else {
      router.push('/processos')
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <ModuleGuard moduleId="processos">
      <div className="min-h-screen p-6">
        <div className="mx-auto w-full">
          {parentId && parentProcess && (
            <div className="bg-gh-card border-gh-border mb-6 rounded-lg border p-4">
              <p className="text-gh-text-secondary text-xs font-medium uppercase tracking-wide">
                Criando subprocesso de
              </p>
              <p className="text-gh-text mt-1 font-semibold">{parentProcess.name}</p>
            </div>
          )}
          <ProcessForm
            workspaceId={workspaceId}
            parentId={parentId}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </ModuleGuard>
  )
}
