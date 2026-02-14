'use client'

import { useActiveWorkspace, useEnabledModules } from '../hooks'

import { type ReactNode } from 'react'

import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ModuleGuardProps {
  children: ReactNode
  moduleId: string
  fallback?: ReactNode
  workspaceId?: string
}

/**
 * Componente que protege conteúdo baseado na habilitação do módulo
 * Se o módulo não estiver habilitado, mostra um aviso e opcionalmente redireciona
 */
export function ModuleGuard({ children, moduleId, fallback }: ModuleGuardProps) {
  const router = useRouter()
  const { activeWorkspace } = useActiveWorkspace()
  const workspaceId = activeWorkspace?.id || ''
  const { data: enabledModules = [], isLoading } = useEnabledModules(workspaceId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="border-gh-hover h-12 w-12 animate-spin rounded-full border-b-2"></div>
      </div>
    )
  }

  const isEnabled = enabledModules.some((m: any) => m.id === moduleId)

  console.log('Módulos habilitados:', enabledModules, workspaceId, isEnabled)

  if (!isEnabled) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="bg-gh-bg flex min-h-screen items-center justify-center">
        <div className="max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-yellow-100 p-3">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Módulo Desativado</h1>
          <p className="mb-6 text-gray-600">
            O módulo solicitado está desativado neste workspace. Entre em contato com o
            administrador para ativá-lo.
          </p>
          <button
            onClick={() => router.push('/workspaces')}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Voltar aos Workspaces
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
