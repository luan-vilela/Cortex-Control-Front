'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Shield, Save, RotateCcw } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import {
  MODULE_PERMISSIONS,
  getPermissionPreset,
  type WorkspacePermissions,
} from '@/modules/workspace/config/permissions.config'

interface MemberPermissionsModalProps {
  isOpen: boolean
  onClose: () => void
  memberName: string
  memberEmail: string
  role: string
  permissions: WorkspacePermissions
  onRoleChange: (role: string) => void
  onTogglePermission: (moduleId: string, actionKey: string) => void
  onSetPermissions: (permissions: WorkspacePermissions) => void
  onSave: () => void
  isSaving: boolean
  isOwner?: boolean
  /** IDs dos módulos habilitados no workspace. Se informado, filtra a lista. */
  enabledModuleIds?: string[]
}

export function MemberPermissionsModal({
  isOpen,
  onClose,
  memberName,
  memberEmail,
  role,
  permissions,
  onRoleChange,
  onTogglePermission,
  onSetPermissions,
  onSave,
  isSaving,
  isOwner = false,
  enabledModuleIds,
}: MemberPermissionsModalProps) {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({})

  // Filtra módulos: mostra apenas os instalados no workspace
  const visibleModules = enabledModuleIds
    ? MODULE_PERMISSIONS.filter((m) => enabledModuleIds.includes(m.moduleId))
    : MODULE_PERMISSIONS

  const toggleModuleExpanded = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }))
  }

  const expandAll = () => {
    const expanded: Record<string, boolean> = {}
    visibleModules.forEach((m) => {
      expanded[m.moduleId] = true
    })
    setExpandedModules(expanded)
  }

  const collapseAll = () => {
    setExpandedModules({})
  }

  const toggleAllActions = (moduleId: string, enable: boolean) => {
    const config = MODULE_PERMISSIONS.find((m) => m.moduleId === moduleId)
    if (!config) return

    const newModulePerms: Record<string, boolean> = {}
    config.actions.forEach((a) => {
      newModulePerms[a.key] = enable
    })

    onSetPermissions({
      ...permissions,
      [moduleId]: newModulePerms,
    })
  }

  const applyPreset = (preset: string) => {
    const presetPermissions = getPermissionPreset(preset)
    onSetPermissions(presetPermissions)
    onRoleChange(preset)
  }

  const handleTogglePermission = (moduleId: string, actionKey: string) => {
    const modulePerms = permissions[moduleId] || {}
    const newValue = !modulePerms[actionKey]

    // Se está desativando "access", desativa TODAS as ações do módulo
    if (actionKey === 'access' && !newValue) {
      const config = MODULE_PERMISSIONS.find((m) => m.moduleId === moduleId)
      if (config) {
        const allFalse: Record<string, boolean> = {}
        config.actions.forEach((a) => {
          allFalse[a.key] = false
        })
        onSetPermissions({
          ...permissions,
          [moduleId]: allFalse,
        })
      }
      return
    }

    // Se está ativando qualquer ação, garante que "access" esteja ativo
    if (newValue && actionKey !== 'access') {
      const updatedPerms = {
        ...modulePerms,
        [actionKey]: newValue,
        access: true,
      }
      onSetPermissions({
        ...permissions,
        [moduleId]: updatedPerms,
      })
      return
    }

    onTogglePermission(moduleId, actionKey)
  }

  const categoryLabels: Record<string, string> = {
    access: 'Acesso',
    crud: 'Operações',
    feature: 'Funcionalidades',
  }

  const initials = memberName
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?'

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-3xl" blur="sm">
      <Modal.Header onClose={onClose}>Editar Permissões</Modal.Header>

      <Modal.Body>
        <div className="max-h-[70vh] overflow-y-auto space-y-4">
          {/* Info do membro */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium text-white ${
              isOwner ? 'bg-purple-500' : 'bg-blue-500'
            }`}>
              {initials}
            </div>
            <div>
              <p className="font-medium text-gh-text">{memberName}</p>
              <p className="text-sm text-gh-text-secondary">{memberEmail}</p>
            </div>
          </div>

          {/* Seletor de função */}
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gh-text mb-1">Função</label>
              <select
                value={role}
                onChange={(e) => onRoleChange(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white"
                disabled={isOwner}
              >
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
                <option value="member">Member</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gh-text-secondary mr-1">Preset:</span>
              <button
                onClick={() => applyPreset('admin')}
                className="rounded px-2.5 py-1 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors"
              >
                Admin
              </button>
              <button
                onClick={() => applyPreset('member')}
                className="rounded px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
              >
                Member
              </button>
            </div>
          </div>

          {/* Controle de expandir/recolher */}
          <div className="flex items-center justify-between pt-2">
            <h4 className="text-sm font-semibold text-gh-text">Permissões por Módulo</h4>
            <div className="flex gap-2">
              <button
                onClick={expandAll}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Expandir tudo
              </button>
              <span className="text-xs text-gray-300">|</span>
              <button
                onClick={collapseAll}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Recolher tudo
              </button>
            </div>
          </div>

          {/* Módulos */}
          <div className="space-y-2">
            {visibleModules.map((moduleConfig) => {
              const modulePerms = permissions[moduleConfig.moduleId] || {}
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
                            onChange={() => handleTogglePermission(moduleConfig.moduleId, 'access')}
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
                                        handleTogglePermission(moduleConfig.moduleId, action.key)
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
                                        handleTogglePermission(moduleConfig.moduleId, action.key)
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
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button
          onClick={onClose}
          className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
          disabled={isSaving}
        >
          <RotateCcw className="h-4 w-4" />
          Cancelar
        </button>
        <button
          onClick={onSave}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          disabled={isSaving}
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Salvando...' : 'Salvar'}
        </button>
      </Modal.Footer>
    </Modal>
  )
}
