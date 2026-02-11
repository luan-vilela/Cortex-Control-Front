'use client'

import { useCallback, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface UseURLStateOptions {
  defaultPage?: number
  defaultPageSize?: number
  defaultSort?: string
}

/**
 * Hook para sincronizar table state com URL query params
 * Padrão shadcn-admin para tabelas URL-driven
 */
export function useURLTableState(options: UseURLStateOptions = {}) {
  const {
    defaultPage = 1,
    defaultPageSize = 10,
    defaultSort = '',
  } = options

  const searchParams = useSearchParams()
  const router = useRouter()

  const page = parseInt(searchParams.get('page') ?? String(defaultPage))
  const pageSize = parseInt(
    searchParams.get('pageSize') ?? String(defaultPageSize)
  )
  const sort = searchParams.get('sort') ?? defaultSort
  const search = searchParams.get('search') ?? ''

  const updateUrl = useCallback(
    (updates: Record<string, string | number | undefined>) => {
      const params = new URLSearchParams(searchParams)

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '') {
          params.delete(key)
        } else {
          params.set(key, String(value))
        }
      })

      router.push(`?${params.toString()}`, { scroll: false })
    },
    [searchParams, router]
  )

  const reset = useCallback(() => {
    router.push('', { scroll: false })
  }, [router])

  return {
    page,
    pageSize,
    sort,
    search,
    updateUrl,
    reset,
  }
}

/**
 * Hook para gerenciar drawer state
 * Padrão shadcn-admin
 */
export function useDrawerState(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return { isOpen, open, close, toggle, setIsOpen }
}
