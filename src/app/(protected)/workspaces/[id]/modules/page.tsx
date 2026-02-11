'use client'

import { useMemo, useState } from 'react'
import React from 'react'

import * as LucideIcons from 'lucide-react'
import {
  ArrowLeft,
  ArrowUpRight,
  Filter,
  Info,
  MessageSquare,
  Search,
  Wrench,
  Zap,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { NotificationBell } from '@/components/NotificationBell'
import { UserMenu } from '@/components/UserMenu'
import { WalletDisplay } from '@/components/WalletDisplay'
import { useAlerts } from '@/contexts/AlertContext'
import {
  useAvailableModules,
  useBreadcrumb,
  useEnabledModules,
  useWorkspace,
} from '@/modules/workspace/hooks'
import { workspaceService } from '@/modules/workspace/services/workspace.service'

type CategoryType = 'all' | 'core' | 'communication' | 'automation' | 'integration'

type StatusFilter = 'all' | 'active' | 'inactive'

export default function ModulesMarketplacePage() {
  const router = useRouter()
  const params = useParams()
  const workspaceId = params.id as string
  const alerts = useAlerts()

  useBreadcrumb([
    {
      label: 'Workspaces',
      href: `/workspaces/`,
    },
    {
      label: 'Gerenciar Módulos',
      href: `/workspaces/${workspaceId}/modules`,
    },
  ])

  const { data: workspace } = useWorkspace(workspaceId)
  const { data: enabledModules = [], refetch } = useEnabledModules(workspaceId)
  const {
    data: availableModules = [],
    isLoading: modulesLoading,
    refetch: refetchAvailableModules,
  } = useAvailableModules()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all')
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all')
  const [installing, setInstalling] = useState<string | null>(null)

  const canManage = workspace?.isOwner || workspace?.role === 'admin'

  // Filtrar módulos por busca e categoria
  const filteredModules = useMemo(() => {
    let result = availableModules

    // Filtro por categoria
    if (selectedCategory !== 'all') {
      result = result.filter((m: any) => m.category === selectedCategory)
    }

    // Filtro por status
    if (selectedStatus !== 'all') {
      const isActive = (m: any) => enabledModules.some((em: any) => em.id === m.id)
      result = result.filter((m: any) => (selectedStatus === 'active' ? isActive(m) : !isActive(m)))
    }

    // Filtro por busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (m: any) =>
          m.name.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query) ||
          m.id.toLowerCase().includes(query)
      )
    }

    return result
  }, [searchQuery, selectedCategory, selectedStatus, availableModules, enabledModules])

  const handleToggleModule = async (moduleId: string, isEnabled: boolean) => {
    if (!canManage) {
      alerts.error('Você não tem permissão para gerenciar módulos')
      return
    }

    const selectedModule = availableModules.find((m: any) => m.id === moduleId)
    const required = selectedModule?.required
    if (required && isEnabled) {
      alerts.error(`${moduleId} é um módulo obrigatório`)
      return
    }

    setInstalling(moduleId)
    try {
      // Extrair apenas os IDs dos módulos habilitados
      const enabledModuleIds = enabledModules.map((m: any) => m.id)
      const newModules = isEnabled
        ? enabledModuleIds.filter((id: string) => id !== moduleId)
        : [...enabledModuleIds, moduleId]

      await workspaceService.updateEnabledModules(workspaceId, newModules)
      await refetch()
      await refetchAvailableModules()
      alerts.success(`Módulo ${isEnabled ? 'desinstalado' : 'instalado'} com sucesso`)
    } catch (error: any) {
      console.error('Erro ao atualizar módulos:', error)
      alerts.error(error.response?.data?.message || 'Erro ao atualizar módulo')
    } finally {
      setInstalling(null)
    }
  }

  const ModuleCard = ({ module }: { module: any }) => {
    const isEnabled = enabledModules.some((m: any) => m.id === module.id)
    const required = module.required
    const IconComponent =
      LucideIcons[module.icon as keyof typeof LucideIcons] || LucideIcons.Package
    const isLoading = installing === module.id

    return (
      <div className="border-gh-border overflow-hidden rounded-lg border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        {/* Header com Ícone e Botão */}
        <div className="border-gh-border flex items-start justify-between border-b p-6">
          <div className="bg-gh-bg text-gh-text rounded-lg p-3">
            {React.createElement(IconComponent as React.ElementType, {
              className: 'w-6 h-6',
            })}
          </div>
          <button
            onClick={() => handleToggleModule(module.id, isEnabled)}
            disabled={!canManage || isLoading || required}
            className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors ${
              required
                ? 'cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400'
                : isEnabled
                  ? 'border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100'
                  : 'text-gh-text border-gh-border hover:bg-gh-bg bg-white'
            }`}
          >
            {isLoading && (
              <div className="h-3 w-3 animate-spin rounded-full border border-current border-t-transparent" />
            )}
            {required ? 'Obrigatório' : isEnabled ? 'Ativo' : 'Desativado'}
          </button>
        </div>

        {/* Conteúdo */}
        <div className="space-y-4 p-6">
          <div
            className="group cursor-pointer"
            onClick={() => router.push(`/workspaces/${workspaceId}/modules/${module.id}`)}
          >
            <h3 className="text-gh-text text-base font-semibold transition-colors group-hover:text-blue-600">
              {module.name}
            </h3>
            <p className="text-gh-text-secondary mt-2 text-sm leading-relaxed">
              {module.description}
            </p>
          </div>

          {/* Dependências */}
          {module.dependencies && module.dependencies.length > 0 && (
            <div className="space-y-2">
              <p className="text-gh-text-secondary text-xs font-semibold uppercase">
                Dependências:
              </p>
              <div className="flex flex-wrap gap-2">
                {module.dependencies.map((depId: string) => {
                  const depModule = availableModules.find((m: any) => m.id === depId)
                  const DepIconComponent =
                    LucideIcons[depModule?.icon as keyof typeof LucideIcons] || LucideIcons.Package
                  return (
                    <div key={depId} className="group relative" title={depModule?.name}>
                      <div className="bg-gh-bg text-gh-text hover:bg-gh-hover cursor-help rounded-lg p-2 transition-colors">
                        {React.createElement(DepIconComponent as React.ElementType, {
                          className: 'w-4 h-4',
                        })}
                      </div>
                      {/* Tooltip */}
                      <div className="bg-gh-text pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 transform rounded px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity group-hover:opacity-100">
                        {depModule?.name || depId}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Badges de Status */}
          <div className="flex flex-wrap gap-2 pt-2">
            {required && (
              <span className="rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-600">
                Obrigatório
              </span>
            )}
            {isEnabled && (
              <span className="rounded bg-green-50 px-2 py-1 text-xs font-medium text-green-600">
                Ativo
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  const categoryOptions: {
    value: CategoryType
    label: string
    icon: React.ReactNode
  }[] = [
    { value: 'all', label: 'Todos', icon: null },
    {
      value: 'core',
      label: 'Principais',
      icon: <Wrench className="h-4 w-4" />,
    },
    {
      value: 'communication',
      label: 'Comunicação',
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      value: 'automation',
      label: 'Automação',
      icon: <Zap className="h-4 w-4" />,
    },
  ]

  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'active', label: 'Ativos' },
    { value: 'inactive', label: 'Desativados' },
  ]

  return (
    <div className="bg-gh-bg min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gh-text text-3xl font-bold">Marketplace de Módulos</h1>
          <p className="text-gh-text-secondary mt-1">
            Integre novos serviços e expanda as funcionalidades do seu workspace
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {!canManage && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                Você não tem permissão para instalar/desinstalar módulos. Apenas owner ou admin
                podem gerenciar módulos.
              </p>
            </div>
          )}

          {/* Barra de Pesquisa */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="text-gh-text-secondary absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform" />
              <input
                type="text"
                placeholder="Pesquisar módulos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-gh-border text-gh-text placeholder:text-gh-text-secondary w-full rounded-lg border bg-white py-2.5 pr-4 pl-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Filtros por Categoria */}
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    selectedCategory === cat.value
                      ? 'bg-blue-600 text-white'
                      : 'border-gh-border text-gh-text hover:bg-gh-hover border bg-white'
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Filtros por Status */}
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  onClick={() => setSelectedStatus(status.value)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    selectedStatus === status.value
                      ? 'bg-green-600 text-white'
                      : 'border-gh-border text-gh-text hover:bg-gh-hover border bg-white'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Informações de Resultado */}
          <div>
            <p className="text-gh-text-secondary text-sm">
              {filteredModules.length === 0
                ? 'Nenhum módulo encontrado com esses filtros'
                : `${filteredModules.length} módulo${filteredModules.length !== 1 ? 's' : ''} encontrado${filteredModules.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {/* Grid de Módulos */}
          {modulesLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="border-gh-hover h-12 w-12 animate-spin rounded-full border-b-2"></div>
            </div>
          ) : filteredModules.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredModules.map((module: any) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <Search className="text-gh-text-secondary mx-auto mb-4 h-16 w-16" />
              <h3 className="text-gh-text mb-2 text-xl font-semibold">Nenhum módulo encontrado</h3>
              <p className="text-gh-text-secondary mb-6">
                Tente ajustar seus filtros ou termos de busca
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                  setSelectedStatus('all')
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
