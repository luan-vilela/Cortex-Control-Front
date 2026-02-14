'use client'

import { useState } from 'react'

import { Eye } from 'lucide-react'

import { type Column, DataTable, type RowAction } from '@/components/DataTable'
import { DataTableToolbar, PageHeader } from '@/components/patterns'
import { DateRangePicker } from '@/components/patterns/DateRangePicker'
import { FilterWithBadge } from '@/components/patterns/FilterWithBadge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatDate } from '@/lib/utils'
import { ActionBadge } from '@/modules/auditoria/components/ActionBadge'
import { ModuleBadge } from '@/modules/auditoria/components/ModuleBadge'
import { useAuditLogs } from '@/modules/auditoria/hooks/useAuditoria'
import { AuditAction, type AuditLog, type GetAuditLogsFilters } from '@/modules/auditoria/types'
import { ModuleGuard } from '@/modules/workspace/components/ModuleGuard'
import { useBreadcrumb } from '@/modules/workspace/hooks'
import { useActiveWorkspace } from '@/modules/workspace/hooks/useActiveWorkspace'

export default function AuditoriaPage() {
  const { activeWorkspace } = useActiveWorkspace()

  useBreadcrumb([
    {
      label: 'Auditoria',
      href: '/auditoria',
    },
  ])

  // Estado para filtros
  const [filters, setFilters] = useState<GetAuditLogsFilters>({
    page: 1,
    limit: 20,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [advancedOptionsEnabled, setAdvancedOptionsEnabled] = useState(false)
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  const { data: auditData = { data: [], total: 0, page: 1, limit: 20 }, isLoading } = useAuditLogs(
    activeWorkspace?.id || '',
    {
      ...filters,
      entityName: searchTerm || undefined,
    }
  )

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
    })
    setSearchTerm('')
  }

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log)
  }

  if (!activeWorkspace?.id) {
    return (
      <div className="py-12 text-center">
        <p className="text-gh-text-secondary">Workspace não disponível</p>
      </div>
    )
  }

  // Definir colunas
  const columns: Column[] = [
    {
      key: 'createdAt',
      label: 'Data/Hora',
      render: (value) => (
        <div className="text-sm">
          <p className="text-gh-text font-medium">{formatDate(value)}</p>
          <p className="text-gh-text-secondary text-xs">
            {new Date(value).toLocaleTimeString('pt-BR')}
          </p>
        </div>
      ),
    },
    {
      key: 'user',
      label: 'Usuário',
      render: (_, row) => (
        <div className="text-sm">
          <p className="text-gh-text font-medium">{row.user?.name || 'N/A'}</p>
          <p className="text-gh-text-secondary truncate text-xs">{row.user?.email || '-'}</p>
        </div>
      ),
    },
    {
      key: 'module',
      label: 'Módulo',
      render: (_, row) => <ModuleBadge module={row.module} feature={row.feature} />,
    },
    {
      key: 'action',
      label: 'Ação',
      render: (value) => <ActionBadge action={value as AuditAction} />,
    },
    {
      key: 'entityName',
      label: 'Entidade',
      render: (value, row) => (
        <div className="text-sm">
          <p className="text-gh-text font-medium">{value}</p>
          <p className="text-gh-text-secondary text-xs">ID: {row.entityId}</p>
        </div>
      ),
    },
    {
      key: 'ipAddress',
      label: 'IP',
      render: (value) => <p className="text-gh-text-secondary font-mono text-xs">{value || '-'}</p>,
    },
  ]

  const rowActions: RowAction[] = [
    {
      id: 'view-details',
      label: 'Ver Detalhes',
      icon: <Eye className="h-4 w-4" />,
      onClick: handleViewDetails,
    },
  ]

  return (
    <ModuleGuard moduleId="auditoria">
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Auditoria"
          description="Registro completo de ações realizadas no sistema"
        />

        {/* Barra de Busca */}
        <DataTableToolbar
          searchPlaceholder="Buscar por entidade..."
          onSearch={setSearchTerm}
          exportData={auditData.data || []}
          exportFilename="auditoria"
        />

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Módulo */}
          <FilterWithBadge
            label="Módulo"
            options={[
              { value: 'financeiro', label: 'Financeiro' },
              { value: 'contatos', label: 'Contatos' },
              { value: 'ordem-servico', label: 'Ordem de Serviço' },
              { value: 'workspace', label: 'Workspace' },
            ]}
            value={filters.module}
            onValueChange={(value) =>
              setFilters({ ...filters, module: value as string | undefined })
            }
            width="w-48"
          />

          {/* Ação */}
          <FilterWithBadge
            label="Ação"
            options={[
              { value: AuditAction.CREATE, label: 'Criação' },
              { value: AuditAction.UPDATE, label: 'Atualização' },
              { value: AuditAction.DELETE, label: 'Deleção' },
              { value: AuditAction.STATUS_CHANGE, label: 'Mudança de Status' },
            ]}
            value={filters.action}
            onValueChange={(value) =>
              setFilters({ ...filters, action: value as AuditAction | undefined })
            }
            width="w-52"
          />

          {/* Data Range */}
          <DateRangePicker
            value={{
              from: filters.startDate,
              to: filters.endDate,
            }}
            onValueChange={(range) => {
              setFilters({
                ...filters,
                startDate: range?.from,
                endDate: range?.to,
              })
            }}
            placeholder="Selecionar período"
          />
        </div>

        {/* Filtros Avançados */}
        {advancedOptionsEnabled && (
          <div className="border-gh-border bg-gh-surface-secondary grid grid-cols-1 gap-4 rounded-md border p-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="entityName">Nome da Entidade</Label>
              <Input
                id="entityName"
                placeholder="Ex: Transaction, Contact"
                value={filters.entityName || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    entityName: e.target.value || undefined,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="entityId">ID da Entidade</Label>
              <Input
                id="entityId"
                placeholder="Ex: 123"
                value={filters.entityId || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    entityId: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="feature">Feature</Label>
              <Input
                id="feature"
                placeholder="Ex: controle-contas"
                value={filters.feature || ''}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    feature: e.target.value || undefined,
                  })
                }
              />
            </div>
          </div>
        )}

        {/* Botão de Opções Avançadas */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setAdvancedOptionsEnabled(!advancedOptionsEnabled)}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            {advancedOptionsEnabled ? 'Desabilitar Opções Avançadas' : 'Opções Avançadas'}
          </button>
          {(filters.module ||
            filters.action ||
            filters.startDate ||
            filters.endDate ||
            filters.entityName ||
            filters.entityId ||
            filters.feature) && (
            <button
              onClick={handleResetFilters}
              className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Limpar Filtros
            </button>
          )}
        </div>

        {/* Tabela */}
        <DataTable
          headers={columns}
          data={auditData.data}
          isLoading={isLoading}
          rowActions={rowActions}
          stickyPagination={false}
        />

        {/* Paginação Manual */}
        {auditData.total > 0 && (
          <div className="border-gh-border flex items-center justify-between border-t px-4 py-4">
            <p className="text-gh-text-secondary text-sm">
              Mostrando <strong>{(auditData.page - 1) * auditData.limit + 1}</strong> até{' '}
              <strong>{Math.min(auditData.page * auditData.limit, auditData.total)}</strong> de{' '}
              <strong>{auditData.total}</strong> resultados
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters({ ...filters, page: Math.max(1, auditData.page - 1) })}
                disabled={auditData.page === 1}
              >
                ‹ Anterior
              </Button>

              <div className="flex items-center gap-1">
                {Array.from(
                  { length: Math.min(5, Math.ceil(auditData.total / auditData.limit)) },
                  (_, i) => {
                    const totalPages = Math.ceil(auditData.total / auditData.limit)
                    let pageNum = i + 1
                    if (totalPages > 5 && auditData.page > 3) {
                      pageNum = Math.max(1, auditData.page - 2) + i
                    }
                    return pageNum <= totalPages ? pageNum : null
                  }
                )
                  .filter(Boolean)
                  .map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={auditData.page === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilters({ ...filters, page: pageNum as number })}
                      className="h-8 w-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilters({
                    ...filters,
                    page: Math.min(
                      Math.ceil(auditData.total / auditData.limit),
                      auditData.page + 1
                    ),
                  })
                }
                disabled={auditData.page === Math.ceil(auditData.total / auditData.limit)}
              >
                Próxima ›
              </Button>
            </div>
          </div>
        )}

        {/* Dialog de Detalhes */}
        <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes do Log de Auditoria</DialogTitle>
              <DialogDescription>Informações completas sobre a ação realizada</DialogDescription>
            </DialogHeader>

            {selectedLog && (
              <div className="space-y-4">
                {/* Informações Básicas */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground text-xs">Data/Hora</Label>
                    <p className="text-sm font-medium">
                      {formatDate(selectedLog.createdAt)} às{' '}
                      {new Date(selectedLog.createdAt).toLocaleTimeString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Usuário</Label>
                    <p className="text-sm font-medium">{selectedLog.user?.name || 'N/A'}</p>
                    <p className="text-muted-foreground text-xs">{selectedLog.user?.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Módulo</Label>
                    <div className="mt-1">
                      <ModuleBadge module={selectedLog.module} feature={selectedLog.feature} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Ação</Label>
                    <div className="mt-1">
                      <ActionBadge action={selectedLog.action} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Entidade</Label>
                    <p className="text-sm font-medium">{selectedLog.entityName}</p>
                    <p className="text-muted-foreground text-xs">ID: {selectedLog.entityId}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">IP Address</Label>
                    <p className="font-mono text-sm">{selectedLog.ipAddress || '-'}</p>
                  </div>
                </div>

                {/* User Agent */}
                {selectedLog.userAgent && (
                  <div>
                    <Label className="text-muted-foreground text-xs">User Agent</Label>
                    <p className="text-muted-foreground font-mono text-xs break-all">
                      {selectedLog.userAgent}
                    </p>
                  </div>
                )}

                {/* Valores Antigos */}
                {selectedLog.oldValue && (
                  <div>
                    <Label className="text-muted-foreground text-xs">Valor Anterior</Label>
                    <pre className="bg-muted mt-2 overflow-x-auto rounded-md p-3 text-xs">
                      {JSON.stringify(selectedLog.oldValue, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Valores Novos */}
                {selectedLog.newValue && (
                  <div>
                    <Label className="text-muted-foreground text-xs">Novo Valor</Label>
                    <pre className="bg-muted mt-2 overflow-x-auto rounded-md p-3 text-xs">
                      {JSON.stringify(selectedLog.newValue, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ModuleGuard>
  )
}
