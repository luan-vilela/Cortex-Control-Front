'use client'

import { useState } from 'react'

import { Edit, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { type Column, DataTable, type RowAction } from '@/components/DataTable'
import { DataTableToolbar, PageHeader } from '@/components/patterns'
import { useAlerts } from '@/contexts/AlertContext'
import { formatDocument } from '@/lib/masks'
import { useDeletePerson } from '@/modules/person/hooks/usePersonMutations'
import { usePersons } from '@/modules/person/hooks/usePersonQueries'
import { ModuleGuard } from '@/modules/workspace/components/ModuleGuard'
import { useBreadcrumb } from '@/modules/workspace/hooks'
import { useWorkspaceStore } from '@/modules/workspace/store/workspace.store'

export default function PersonsPage() {
  const router = useRouter()
  const { activeWorkspace } = useWorkspaceStore()
  const alerts = useAlerts()

  useBreadcrumb([
    {
      label: 'Contatos',
      href: '/contatos',
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')

  const { data, isLoading } = usePersons(activeWorkspace?.id || '')
  const deleteMutation = useDeletePerson(activeWorkspace?.id || '')

  const handleDelete = async (personId: string, personName: string) => {
    if (!confirm(`Tem certeza que deseja remover ${personName}?`)) return

    deleteMutation.mutate(personId, {
      onSuccess: () => {
        alerts.success('Pessoa removida com sucesso!')
      },
      onError: (error: any) => {
        alerts.error(error.response?.data?.message || 'Erro ao remover pessoa')
      },
    })
  }

  if (!activeWorkspace) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gh-text-secondary">Selecione um workspace</p>
      </div>
    )
  }

  // Definir colunas
  const columns: Column[] = [
    {
      key: 'name',
      label: 'Nome',
      render: (_, row) => <span className="text-gh-text font-medium">{row.name}</span>,
    },
    {
      key: 'email',
      label: 'Email',
      render: (email) => <span className="text-gh-text-secondary text-sm">{email || '-'}</span>,
    },
    {
      key: 'phones',
      label: 'Telefone',
      render: (phones) => {
        const primaryPhone = phones?.find((p: any) => p.isPrimary)
        const phone = primaryPhone || phones?.[0]
        return <span className="text-gh-text-secondary text-sm">{phone?.number || '-'}</span>
      },
    },
    {
      key: 'document',
      label: 'Documento',
      render: (document) => {
        if (!document) return <span className="text-gh-text-secondary text-sm">-</span>
        const formatted = formatDocument(document)
        const isCpf = document.length === 11
        const type = isCpf ? 'CPF' : 'CNPJ'
        return (
          <div className="text-sm">
            <span className="text-gh-text-secondary text-xs font-medium">{type}</span>
            <p className="text-gh-text font-mono">{formatted}</p>
          </div>
        )
      },
    },
  ]

  // Definir row actions
  const rowActions: RowAction[] = [
    {
      id: 'edit',
      label: 'Editar',
      icon: <Edit className="h-4 w-4" />,
      onClick: (row) => router.push(`/contatos/${row.id}`),
    },
    {
      id: 'delete',
      label: 'Deletar',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (row) => handleDelete(row.id, row.name),
      variant: 'destructive',
    },
  ]

  return (
    <ModuleGuard moduleId="contacts" workspaceId={activeWorkspace?.id}>
      <div className="space-y-6">
        <PageHeader
          title="Contatos"
          description="Gerenciar pessoas, clientes, fornecedores e parceiros"
          action={{
            label: 'Novo Contato',
            onClick: () => router.push(`/contatos/new`),
            icon: <Plus className="h-4 w-4" />,
          }}
        />

        <DataTableToolbar
          searchPlaceholder="Pesquisar por nome, email ou documento..."
          onSearch={setSearchTerm}
          exportData={data || []}
          exportFilename="contatos"
        />

        <DataTable
          headers={columns}
          data={data || []}
          isLoading={isLoading}
          selectable={false}
          onRowClick={(row) => router.push(`/contatos/${row.id}`)}
          emptyMessage={
            searchTerm
              ? 'Tente ajustar os termos de pesquisa ou limpar os filtros.'
              : 'Comece criando seu primeiro contato.'
          }
          rowActions={rowActions}
          pageSize={10}
        />
      </div>
    </ModuleGuard>
  )
}
