'use client'

import { useCallback, useState } from 'react'

import { searchCep as fetchCepData, formatCep } from '@/lib/cep-utils'

export interface UseCepResult {
  isLoading: boolean
  error: string | null
  handleCepChange: (value: string) => string
  searchCep: (cep: string) => Promise<{
    address?: string
    city?: string
    state?: string
    neighborhood?: string
  } | null>
}

/**
 * Hook para buscar e formatar CEP
 */
export const useCep = (): UseCepResult => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Formata o CEP enquanto o usuário digita
   */
  const handleCepChange = useCallback((value: string): string => {
    return formatCep(value)
  }, [])

  /**
   * Busca os dados do CEP e retorna formatados
   */
  const searchCep = useCallback(
    async (
      cep: string
    ): Promise<{
      address?: string
      city?: string
      state?: string
      neighborhood?: string
    } | null> => {
      try {
        setIsLoading(true)
        setError(null)

        const data = await fetchCepData(cep)

        if (!data) {
          setError('CEP não encontrado')
          return null
        }

        return {
          address: data.logradouro,
          city: data.localidade,
          state: data.uf,
          neighborhood: data.bairro,
        }
      } catch (err) {
        const errorMessage = 'Erro ao buscar CEP'
        setError(errorMessage)
        console.error(errorMessage, err)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  return {
    isLoading,
    error,
    handleCepChange,
    searchCep,
  }
}
