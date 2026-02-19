'use client'

import { useEffect, useRef } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { authService } from '@/modules/auth/services/auth.service'
import { useAuthStore } from '@/modules/auth/store/auth.store'

export default function AuthCallbackClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const setAuth = useAuthStore((state) => state.setAuth)

  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const token = searchParams.get('token')
    const refreshToken = searchParams.get('refreshToken')

    if (!token || !refreshToken) {
      router.replace('/auth/login?error=no_token')
      return
    }

    const run = async () => {
      try {
        localStorage.setItem('token', token)
        localStorage.setItem('refreshToken', refreshToken)
        const user = await authService.getProfile()
        setAuth(user, token)
        router.replace('/dashboard')
      } catch (err) {
        console.error('Erro OAuth:', err)
        router.replace('/auth/login?error=oauth_failed')
      }
    }

    run()
  }, [searchParams, router, setAuth])

  return <div className="flex min-h-screen items-center justify-center">Processando login...</div>
}
