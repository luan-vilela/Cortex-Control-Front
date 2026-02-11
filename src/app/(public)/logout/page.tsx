'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Limpa todos os dados de autenticação
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.clear()

    // Limpa cookies
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
    })

    // Redireciona para login após pequeno delay
    const timeout = setTimeout(() => {
      router.push('/auth/login')
    }, 100)

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2" />
        <p className="text-muted-foreground">Saindo...</p>
      </div>
    </div>
  )
}
