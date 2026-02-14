'use client'

import { useState } from 'react'

import { Eye } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { type Column, DataTable } from '@/components/DataTable'
import { DataTableToolbar, PageHeader } from '@/components/patterns'
import { DateRangePicker } from '@/components/patterns/DateRangePicker'
import { FilterWithBadge } from '@/components/patterns/FilterWithBadge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatDate } from '@/lib/utils'
import { ActionBadge } from '@/modules/auditoria/components/ActionBadge'
import { ModuleBadge } from '@/modules/auditoria/components/ModuleBadge'
import { useAuditLogs } from '@/modules/auditoria/hooks/useAuditoria'
import { AuditAction, type AuditLog, type GetAuditLogsFilters } from '@/modules/auditoria/types'
import { ModuleGuard } from '@/modules/workspace/components/ModuleGuard'
import { useBreadcrumb } from '@/modules/workspace/hooks'
import { useActiveWorkspace } from '@/modules/workspace/hooks/useActiveWorkspace'

export default function AuditoriaPage() {
  const router = useRouter()
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
  const [advancedOptionsEnabled, setAdvancedOptionsEnabled] = useState(false)
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  const { data: auditData = { data: [], total: 0, page: 1, limit: 20 }, isLoading } = useAuditLogs(
    activeWorkspace?.id || '',
    filters
  )

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
    })
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

  const rowActions = [
    {
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

        {/* Filtros */}
        <DataTableToolbar
          searchPlaceholder="Buscar por entidade..."
          searchValue={''}
          onSearchChange={() => {}}
          onResetFilters={handleResetFilters}
          advancedOptionsEnabled={advancedOptionsEnabled}
          onAdvancedOptionsChange={setAdvancedOptionsEnabled}
        >
          <div className="flex flex-wrap items-center gap-2">
            {/* Módulo */}
            <FilterWithBadge
              label="Módulo"
              value={filters.module}
              onRemove={() => setFilters({ ...filters, module: undefined })}
            >
              <Select
                value={filters.module || 'all'}
                onValueChange={(value) =>
                  setFilters({ ...filters, module: value === 'all' ? undefined : value })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todos os módulos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="financeiro">Financeiro</SelectItem>
                  <SelectItem value="contatos">Contatos</SelectItem>
                  <SelectItem value="ordem-servico">Ordem de Serviço</SelectItem>
                  <SelectItem value="workspace">Workspace</SelectItem>
                </SelectContent>
              </Select>
            </FilterWithBadge>

            {/* Ação */}
            <FilterWithBadge
              label="Ação"
              value={filters.action}
              onRemove={() => setFilters({ ...filters, action: undefined })}
            >
              <Select
                value={filters.action || 'all'}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    action: value === 'all' ? undefined : (value as AuditAction),
                  })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todas as ações" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value={AuditAction.CREATE}>Criação</SelectItem>
                  <SelectItem value={AuditAction.UPDATE}>Atualização</SelectItem>
                  <SelectItem value={AuditAction.DELETE}>Deleção</SelectItem>
                  <SelectItem value={AuditAction.STATUS_CHANGE}>Mudança de Status</SelectItem>
                </SelectContent>
              </Select>
            </FilterWithBadge>

            {/* Data Range */}
            <DateRangePicker
              fromDate={filters.startDate}
              toDate={filters.endDate}
              onSelect={(range) => {
                setFilters({
                  ...filters,
                  startDate: range?.from,
                  endDate: range?.to,
                })
              }}
            />
          </div>

          {/* Filtros Avançados */}
          {advancedOptionsEnabled && (
            <div className="border-gh-border bg-gh-surface-secondary mt-4 grid grid-cols-1 gap-4 rounded-md border p-4 md:grid-cols-3">
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
                  type="number"
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
        </DataTableToolbar>

        {/* Tabela */}
        <DataTable
          columns={columns}
          data={auditData.data}
          isLoading={isLoading}
          pagination={{
            currentPage: auditData.page,
            totalPages: Math.ceil(auditData.total / auditData.limit),
            pageSize: auditData.limit,
            totalItems: auditData.total,
            onPageChange: (page) => setFilters({ ...filters, page }),
          }}
          rowActions={rowActions}
        />

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
