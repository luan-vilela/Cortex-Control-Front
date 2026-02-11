'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { useWorkspaces } from '@/modules/workspace/hooks'
import { useWorkspaceStore } from '@/modules/workspace/store/workspace.store'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, _hasHydrated } = useAuthStore()

  // Pré-carregar workspaces
  useWorkspaces()

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, _hasHydrated, router])

  // Carregar workspaces ao fazer login
  useEffect(() => {
    if (_hasHydrated && isAuthenticated) {
      const { fetchWorkspaces } = useWorkspaceStore.getState()
      fetchWorkspaces()
    }
  }, [_hasHydrated, isAuthenticated])

  // Mostra loading enquanto verifica autenticação
  if (!_hasHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Se não estiver autenticado, não renderiza nada (vai redirecionar)
  if (!isAuthenticated) {
    return null
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>
}
