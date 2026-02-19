'use client'

import { useState } from 'react'

import { AlertCircle, ChevronDown, ChevronRight, RotateCcw, Save, Shield } from 'lucide-react'

import {
  useDefaultMemberPermissions,
  useEnabledModules,
  useSetDefaultMemberPermissions,
} from '@/modules/workspace/hooks'
import {
  MODULE_PERMISSIONS,
  type WorkspacePermissions,
} from '@/modules/workspace/config/permissions.config'

interface DefaultPermissionsConfigProps {
  workspaceId: string
}

export function DefaultPermissionsConfig({ workspaceId }: DefaultPermissionsConfigProps) {
  const { data: defaultPermissions = [] } = useDefaultMemberPermissions(workspaceId)
  const { data: enabledModules = [] } = useEnabledModules(workspaceId)
  const setDefaultPermissionsMutation = useSetDefaultMemberPermissions(workspaceId)

  const [editingRole, setEditingRole] = useState<string | null>(null)
  const [editingPermissions, setEditingPermissions] = useState<WorkspacePermissions | null>(null)
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({})

  // Filtra módulos: mostra apenas os instalados no workspace
  const enabledModuleIds = enabledModules.map((m: any) => m.id)
  const visibleModules = MODULE_PERMISSIONS.filter((m) => enabledModuleIds.includes(m.moduleId))

  const memberConfig = defaultPermissions?.find((p: any) => p.role === 'member')

  const handleEditMember = () => {
    if (memberConfig) {
      setEditingRole('member')
      setEditingPermissions({ ...memberConfig.permissions })
      // Expandir todos os módulos ao editar
      const expanded: Record<string, boolean> = {}
      visibleModules.forEach((m) => {
        expanded[m.moduleId] = true
      })
      setExpandedModules(expanded)
    }
  }

  const handleSave = () => {
    if (!editingRole || !editingPermissions) return

    setDefaultPermissionsMutation.mutate(
      {
        role: editingRole,
        permissions: editingPermissions,
      },
      {
        onSuccess: () => {
          setEditingRole(null)
          setEditingPermissions(null)
        },
        onError: (error: any) => {
          console.error('Erro ao atualizar permissões padrão:', error)
          alert('Erro ao atualizar permissões padrão')
        },
      }
    )
  }

  const handleCancel = () => {
    setEditingRole(null)
    setEditingPermissions(null)
  }

  const togglePermission = (moduleId: string, actionKey: string) => {
    if (!editingPermissions) return

    const modulePerms = editingPermissions[moduleId] || {}
    const newValue = !modulePerms[actionKey]

    // Se está desativando "access", desativa TODAS as ações do módulo
    if (actionKey === 'access' && !newValue) {
      const allFalse: Record<string, boolean> = {}
      const config = MODULE_PERMISSIONS.find((m) => m.moduleId === moduleId)
      if (config) {
        config.actions.forEach((a) => {
          allFalse[a.key] = false
        })
      }
      setEditingPermissions({
        ...editingPermissions,
        [moduleId]: allFalse,
      })
      return
    }

    // Se está ativando qualquer ação, garante que "access" esteja ativo
    const updatedPerms = {
      ...modulePerms,
      [actionKey]: newValue,
    }
    if (newValue && actionKey !== 'access') {
      updatedPerms.access = true
    }

    setEditingPermissions({
      ...editingPermissions,
      [moduleId]: updatedPerms,
    })
  }

  const toggleModuleExpanded = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }))
  }

  const toggleAllActions = (moduleId: string, enable: boolean) => {
    if (!editingPermissions) return
    const config = MODULE_PERMISSIONS.find((m) => m.moduleId === moduleId)
    if (!config) return

    const newPerms: Record<string, boolean> = {}
    config.actions.forEach((a) => {
      newPerms[a.key] = enable
    })

    setEditingPermissions({
      ...editingPermissions,
      [moduleId]: newPerms,
    })
  }

  const isEditing = editingRole === 'member'

  const categoryLabels: Record<string, string> = {
    access: 'Acesso',
    crud: 'Operações',
    feature: 'Funcionalidades',
  }

  return (
    <div className="mb-6 rounded-lg bg-white p-6 shadow">
      <div className="mb-4 flex items-center gap-3">
        <AlertCircle className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Permissões Padrão para Membros</h3>
      </div>

      <p className="mb-4 text-sm text-gray-600">
        Configure as permissões padrão que novos membros receberão ao serem convidados.
      </p>

      {isEditing && editingPermissions ? (
        <div className="space-y-4">
          <div className="space-y-2">
            {visibleModules.map((moduleConfig) => {
              const modulePerms = editingPermissions[moduleConfig.moduleId] || {}
              const isExpanded = expandedModules[moduleConfig.moduleId] ?? false
              const hasAccess = modulePerms.access === true
              const enabledCount = Object.values(modulePerms).filter(Boolean).length
              const totalCount = moduleConfig.actions.length

              const crudActions = moduleConfig.actions.filter((a) => a.category === 'crud')
              const featureActions = moduleConfig.actions.filter((a) => a.category === 'feature')

              return (
                <div
                  key={moduleConfig.moduleId}
                  className={`rounded-lg border ${hasAccess ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200 bg-gray-50/50'}`}
                >
                  {/* Header do módulo */}
                  <div
                    className="flex cursor-pointer items-center justify-between p-3"
                    onClick={() => toggleModuleExpanded(moduleConfig.moduleId)}
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                      <Shield
                        className={`h-4 w-4 ${hasAccess ? 'text-blue-600' : 'text-gray-400'}`}
                      />
                      <span className="font-medium text-gray-900">{moduleConfig.label}</span>
                      <span className="text-xs text-gray-500">
                        {enabledCount}/{totalCount} ativas
                      </span>
                    </div>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleAllActions(moduleConfig.moduleId, true)}
                        className="rounded px-2 py-1 text-xs text-blue-600 hover:bg-blue-100"
                      >
                        Todas
                      </button>
                      <button
                        onClick={() => toggleAllActions(moduleConfig.moduleId, false)}
                        className="rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
                      >
                        Nenhuma
                      </button>
                    </div>
                  </div>

                  {/* Ações do módulo (expandido) */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 px-4 py-3">
                      {/* Acesso ao módulo */}
                      <div className="mb-3">
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="checkbox"
                            checked={hasAccess}
                            onChange={() =>
                              togglePermission(moduleConfig.moduleId, 'access')
                            }
                            className="h-4 w-4 rounded border-gray-300 text-blue-600"
                          />
                          <span className="text-sm font-medium text-gray-900">
                            Acesso ao Módulo
                          </span>
                          <span className="text-xs text-gray-500">
                            (habilita todas as outras permissões)
                          </span>
                        </label>
                      </div>

                      {hasAccess && (
                        <div className="ml-6 space-y-3">
                          {/* Operações CRUD */}
                          {crudActions.length > 0 && (
                            <div>
                              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                {categoryLabels.crud}
                              </p>
                              <div className="flex flex-wrap gap-x-4 gap-y-1">
                                {crudActions.map((action) => (
                                  <label
                                    key={action.key}
                                    className="flex cursor-pointer items-center gap-2"
                                    title={action.description}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={modulePerms[action.key] === true}
                                      onChange={() =>
                                        togglePermission(moduleConfig.moduleId, action.key)
                                      }
                                      className="h-4 w-4 rounded border-gray-300 text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">{action.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Funcionalidades extras */}
                          {featureActions.length > 0 && (
                            <div>
                              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                {categoryLabels.feature}
                              </p>
                              <div className="flex flex-wrap gap-x-4 gap-y-1">
                                {featureActions.map((action) => (
                                  <label
                                    key={action.key}
                                    className="flex cursor-pointer items-center gap-2"
                                    title={action.description}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={modulePerms[action.key] === true}
                                      onChange={() =>
                                        togglePermission(moduleConfig.moduleId, action.key)
                                      }
                                      className="h-4 w-4 rounded border-gray-300 text-blue-600"
                                    />
                                    <span className="text-sm text-gray-700">{action.label}</span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
              disabled={setDefaultPermissionsMutation.isPending}
            >
              <RotateCcw className="h-4 w-4" />
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              disabled={setDefaultPermissionsMutation.isPending}
            >
              <Save className="h-4 w-4" />
              {setDefaultPermissionsMutation.isPending ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {memberConfig ? (
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-4 space-y-2">
                {visibleModules.map((moduleConfig) => {
                  const modulePerms =
                    (memberConfig.permissions as WorkspacePermissions)?.[moduleConfig.moduleId] || {}
                  const hasAccess = modulePerms.access === true
                  const activeActions = moduleConfig.actions
                    .filter((a) => a.key !== 'access' && modulePerms[a.key] === true)
                    .map((a) => a.label)

                  return (
                    <div key={moduleConfig.moduleId} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block h-2 w-2 rounded-full ${hasAccess ? 'bg-green-500' : 'bg-gray-300'}`}
                        />
                        <span className="text-gray-900">{moduleConfig.label}</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {hasAccess
                          ? activeActions.length > 0
                            ? activeActions.join(', ')
                            : 'Somente acesso'
                          : 'Sem acesso'}
                      </span>
                    </div>
                  )
                })}
              </div>
              <button
                onClick={handleEditMember}
                className="w-full rounded-lg border border-blue-600 px-4 py-2 text-blue-600 transition-colors hover:bg-blue-50"
              >
                Editar Permissões
              </button>
            </div>
          ) : (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                Nenhuma configuração de permissões padrão definida. As permissões padrão do sistema
                serão usadas.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
