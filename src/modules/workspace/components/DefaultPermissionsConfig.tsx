'use client'

import { useState } from 'react'

import { AlertCircle, RotateCcw, Save } from 'lucide-react'

import {
  useDefaultMemberPermissions,
  useSetDefaultMemberPermissions,
} from '@/modules/workspace/hooks'
import type { WorkspacePermissions } from '@/modules/workspace/types/workspace.types'

interface DefaultPermissionsConfigProps {
  workspaceId: string
}

const moduleLabels: Record<string, string> = {
  contacts: 'Contatos',
  conversations: 'Conversas',
  automations: 'Automações',
  settings: 'Configurações',
  members: 'Membros',
  customers: 'Clientes',
}

const permissionLabels: Record<string, string> = {
  read: 'Visualizar',
  write: 'Editar',
  delete: 'Deletar',
}

export function DefaultPermissionsConfig({ workspaceId }: DefaultPermissionsConfigProps) {
  const { data: defaultPermissions = [] } = useDefaultMemberPermissions(workspaceId)
  const setDefaultPermissionsMutation = useSetDefaultMemberPermissions(workspaceId)

  const [editingRole, setEditingRole] = useState<string | null>(null)
  const [editingPermissions, setEditingPermissions] = useState<WorkspacePermissions | null>(null)

  const memberConfig = defaultPermissions?.find((p: any) => p.role === 'member')

  const handleEditMember = () => {
    if (memberConfig) {
      setEditingRole('member')
      setEditingPermissions({ ...memberConfig.permissions })
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

  const togglePermission = (
    module: keyof WorkspacePermissions,
    permission: 'read' | 'write' | 'delete'
  ) => {
    if (!editingPermissions) return

    setEditingPermissions({
      ...editingPermissions,
      [module]: {
        ...editingPermissions[module],
        [permission]: !editingPermissions[module][permission],
      },
    })
  }

  const isEditing = editingRole === 'member'

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
          <div className="rounded-lg border border-gray-200 p-4">
            <h4 className="mb-3 font-semibold text-gray-900">Configurar Permissões</h4>
            <div className="space-y-3">
              {Object.entries(editingPermissions).map(([module, perms]) => (
                <div key={module} className="border-l-4 border-blue-200 pl-4">
                  <p className="mb-2 font-medium text-gray-900">
                    {moduleLabels[module as keyof typeof moduleLabels] || module}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {['read', 'write', 'delete'].map((perm) => (
                      <label key={perm} className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={perms[perm as keyof typeof perms]}
                          onChange={() =>
                            togglePermission(
                              module as keyof WorkspacePermissions,
                              perm as 'read' | 'write' | 'delete'
                            )
                          }
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">{permissionLabels[perm]}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
                {Object.entries(
                  memberConfig.permissions as Record<string, Record<string, unknown>>
                ).map(([module, perms]) => {
                  const activePerms = Object.entries(perms as Record<string, unknown>)
                    .filter(([, value]) => value)
                    .map(([key]) => permissionLabels[key as keyof typeof permissionLabels])
                    .join(', ')

                  return (
                    <div key={module} className="flex items-center justify-between">
                      <span className="text-gray-900">
                        {moduleLabels[module as keyof typeof moduleLabels] || module}
                      </span>
                      <span className="text-sm text-gray-600">
                        {activePerms || 'Sem permissões'}
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
