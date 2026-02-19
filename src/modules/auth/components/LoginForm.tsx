'use client'

import { LoginFormData, loginSchema } from '../schemas/auth.schema'
import { authService } from '../services/auth.service'
import { useAuthStore } from '../store/auth.store'

import React, { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Chrome, LogIn } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { FormInput } from '@/components/FormInput'
import { Button } from '@/components/ui/button'

export function LoginForm() {
  const router = useRouter()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await authService.login(data)
      localStorage.setItem('refreshToken', response.refreshToken)
      setAuth(response.user, response.accessToken)

      router.push('/dashboard')
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || 'Erro ao fazer login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gh-card w-full max-w-md space-y-8 rounded-xl p-8 shadow-lg">
      {/* Header */}
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-600">
          <LogIn className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-gh-text text-3xl font-bold">Bem-vindo</h2>
        <p className="text-gh-text-secondary mt-2">Faça login na sua conta Cortex Control</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormInput
          label="Email"
          type="email"
          placeholder="seu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <FormInput
          label="Senha"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="border-gh-border h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gh-text-secondary ml-2 text-sm">Lembrar-me</span>
          </label>

          <Link
            href="/auth/forgot-password"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Esqueceu a senha?
          </Link>
        </div>

        <Button type="submit" variant="default" size="lg" disabled={isLoading} className="w-full">
          Entrar
        </Button>
      </form>

      {/* OAuth */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="border-gh-border w-full border-t" />
        </div>
        <div className="relative flex justify-center">
          <span className="text-gh-text-secondary bg-white px-4 text-xs">ou</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => authService.loginWithGoogle()}
          className="border-gh-border hover:border-gh-border hover:bg-gh-bg group flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 transition-all duration-200"
        >
          <Chrome className="text-gh-text-secondary group-hover:text-gh-text h-4 w-4" />
          <span className="text-gh-text group-hover:text-gh-text text-sm font-medium">Google</span>
        </button>
        <button
          type="button"
          onClick={() => authService.loginWithFacebook()}
          className="border-gh-border hover:border-gh-border hover:bg-gh-bg group flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 transition-all duration-200"
        >
          <svg
            className="text-gh-text-secondary h-4 w-4 group-hover:text-blue-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="text-gh-text text-sm font-medium group-hover:text-blue-600">
            Facebook
          </span>
        </button>
      </div>

      {/* Register Link */}
      <div className="text-center">
        <p className="text-gh-text-secondary text-sm">
          Não tem uma conta?{' '}
          <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-700">
            Criar conta grátis
          </Link>
        </p>
      </div>
    </div>
  )
}
