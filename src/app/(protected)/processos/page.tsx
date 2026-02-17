'use client'

import { useMemo, useRef, useState } from 'react'

import { endOfMonth, startOfMonth } from 'date-fns'
import {
  Check,
  CheckCircle2,
  ChevronsUpDown,
  Eye,
  LayoutGrid,
  List,
  Plus,
  Trash2,
  User,
  X,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { DateRange } from 'react-day-picker'

import { type Column, DataTable, type RowAction } from '@/components/DataTable'
import { DataTableToolbar, PageHeader } from '@/components/patterns'
import { DateRangePicker } from '@/components/patterns/DateRangePicker'
import { FilterWithBadge } from '@/components/patterns/FilterWithBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import { usePersons } from '@/modules/person/hooks/usePersonQueries'
import { ProcessosKanban } from '@/modules/processos/components/ProcessosKanban'
import { ProcessStatusBadge } from '@/modules/processos/components/ProcessStatusBadge'
import { ProcessTypeBadge } from '@/modules/processos/components/ProcessTypeBadge'
import {
  useDeleteProcesso,
  useMyProcessos,
  useProcessos,
  useUpdateProcesso,
} from '@/modules/processos/hooks/useProcessos'
import {
  type GetProcessesFilters,
  ProcessStatus,
  ProcessType,
} from '@/modules/processos/types'
import { ModuleGuard } from '@/modules/workspace/components/ModuleGuard'
import { usePermission } from '@/modules/workspace/hooks/usePermission'
import { useBreadcrumb } from '@/modules/workspace/hooks'
import { useActiveWorkspace } from '@/modules/workspace/hooks/useActiveWorkspace'
import { useWorkspaceMembers } from '@/modules/workspace/hooks/useWorkspaceQueries'

export default function ProcessosPage() {
  const router = useRouter()
  const { activeWorkspace } = useActiveWorkspace()
  const { hasPermission } = usePermission()

  useBreadcrumb([
    {
      label: 'Processos',
      href: '/processos',
    },
  ])

  // Carregar contatos e membros para os filtros de select
  const { data: personsData = [] } = usePersons(activeWorkspace?.id || '')
  const { data: membersData = [] } = useWorkspaceMembers(activeWorkspace?.id || '')

  const contactOptions = (Array.isArray(personsData) ? personsData : []).map((p: any) => ({
    value: p.id,
    label: p.name || p.email || p.document || 'Sem nome',
  }))

  const memberOptions = (Array.isArray(membersData) ? membersData : []).map((m: any) => ({
    value: m.id,
    label: m.user?.name || m.user?.email || 'Sem nome',
  }))

  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [viewMode, setViewMode] = useState<'all' | 'my'>('all')
  const [displayMode, setDisplayMode] = useState<'list' | 'kanban'>('list')
  const [statusFilter, setStatusFilter] = useState<ProcessStatus | undefined>()
  const [typeFilter, setTypeFilter] = useState<ProcessType | undefined>()
  const [obrigatorioFilter, setObrigatorioFilter] = useState<string | undefined>()
  const [impeditivoFilter, setImpeditivoFilter] = useState<string | undefined>()
  const [contactFilter, setContactFilter] = useState<string | undefined>()
  const [memberFilter, setMemberFilter] = useState<string | undefined>()
  const defaultDateRange = useMemo<DateRange>(() => {
    const now = new Date()
    return { from: startOfMonth(now), to: endOfMonth(now) }
  }, [])
  const [dateRange, setDateRange] = useState<DateRange | undefined>(defaultDateRange)

  const hasActiveFilters = !!(statusFilter || typeFilter || obrigatorioFilter || impeditivoFilter || contactFilter || memberFilter || (dateRange && (dateRange.from?.getTime() !== defaultDateRange.from?.getTime() || dateRange.to?.getTime() !== defaultDateRange.to?.getTime())))

  const handleResetFilters = () => {
    setStatusFilter(undefined)
    setTypeFilter(undefined)
    setObrigatorioFilter(undefined)
    setImpeditivoFilter(undefined)
    setContactFilter(undefined)
    setMemberFilter(undefined)
    setDateRange(defaultDateRange)
  }

  // Debounce para a busca
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const handleSearch = (value: string) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    searchTimeoutRef.current = setTimeout(() => setDebouncedSearch(value), 400)
  }

  // Helper para formatar Date para YYYY-MM-DD
  const formatDateToISO = (date: Date | undefined) => {
    if (!date) return undefined
    return date.toISOString().split('T')[0]
  }

  // Montar filtros para API (aba 'Todos' mostra apenas processos raiz)
  const serverFilters: GetProcessesFilters = {
    page: 1,
    limit: 50,
    rootOnly: 'true',
    ...(statusFilter && { status: statusFilter }),
    ...(typeFilter && { type: typeFilter }),
    ...(obrigatorioFilter && { obrigatorio: obrigatorioFilter }),
    ...(impeditivoFilter && { impeditivo: impeditivoFilter }),
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(contactFilter && { actorId: contactFilter, actorType: 'person' }),
    ...(memberFilter && { actorId: memberFilter, actorType: 'user' }),
    ...(dateRange?.from && { startDate: formatDateToISO(dateRange.from) }),
    ...(dateRange?.to && { endDate: formatDateToISO(dateRange.to) }),
  }

  const { data: allProcessosData = { data: [], meta: { total: 0, page: 1, limit: 50, totalPages: 1 } }, isLoading: isLoadingAll } =
    useProcessos(
      activeWorkspace?.id || '',
      serverFilters,
      !!activeWorkspace?.id && viewMode === 'all'
    )

  const myFilters: GetProcessesFilters = {
    page: 1,
    limit: 50,
    ...(statusFilter && { status: statusFilter }),
    ...(typeFilter && { type: typeFilter }),
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(dateRange?.from && { startDate: formatDateToISO(dateRange.from) }),
    ...(dateRange?.to && { endDate: formatDateToISO(dateRange.to) }),
  }

  const { data: myProcessosData = { data: [], meta: { total: 0, page: 1, limit: 50, totalPages: 1 } }, isLoading: isLoadingMy } =
    useMyProcessos(
      activeWorkspace?.id || '',
      myFilters,
      !!activeWorkspace?.id && viewMode === 'my'
    )

  const processosData = viewMode === 'all' ? allProcessosData : myProcessosData
  const isLoading = viewMode === 'all' ? isLoadingAll : isLoadingMy

  const { mutate: deleteProcesso } = useDeleteProcesso()
  const { mutate: updateProcesso } = useUpdateProcesso()

  if (!activeWorkspace?.id) {
    return (
      <div className="py-12 text-center">
        <p className="text-gh-text-secondary">Workspace não disponível</p>
      </div>
    )
  }

  const columns: Column[] = [
    {
      key: 'name',
      label: 'Nome',
      render: (value) => <p className="text-gh-text truncate font-medium">{value}</p>,
    },
    ...(viewMode === 'my'
      ? [
          {
            key: 'parent',
            label: 'Processo Pai',
            render: (value: any) =>
              value ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/processos/${value.id}`)
                  }}
                  className="text-gh-text hover:underline truncate text-sm font-medium"
                >
                  {value.name}
                </button>
              ) : (
                <span className="text-gh-text-secondary text-sm">—</span>
              ),
          } as Column,
        ]
      : []),
    {
      key: 'type',
      label: 'Tipo',
      render: (value) => <ProcessTypeBadge type={value} />,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <ProcessStatusBadge status={value} />,
    },
    {
      key: 'obrigatorio',
      label: 'Obrigatório',
      render: (value) =>
        value ? (
          <Badge variant="default">Sim</Badge>
        ) : (
          <span className="text-gh-text-secondary text-sm">Não</span>
        ),
    },
    {
      key: 'impeditivo',
      label: 'Impeditivo',
      render: (value) =>
        value ? (
          <Badge variant="destructive">Sim</Badge>
        ) : (
          <span className="text-gh-text-secondary text-sm">Não</span>
        ),
    },
    {
      key: 'children',
      label: 'Subprocessos',
      render: (value) => (
        <span className="text-gh-text-secondary text-sm">
          {Array.isArray(value) ? value.length : 0}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Criado em',
      render: (value) => (
        <span className="text-gh-text-secondary text-sm">
          {value ? formatDate(value) : '-'}
        </span>
      ),
    },
    {
      key: 'closedAt',
      label: 'Encerrado em',
      render: (value) => (
        <span className="text-gh-text-secondary text-sm">
          {value ? formatDate(value) : '-'}
        </span>
      ),
    },
  ]

  const rowActions: RowAction[] = [
    {
      id: 'view',
      label: 'Visualizar',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row) => router.push(`/processos/${row.id}`),
    },
    ...(hasPermission('processos', 'update')
      ? [
          {
            id: 'mark-done',
            label: 'Marcar como Concluído',
            icon: <CheckCircle2 className="h-4 w-4" />,
            onClick: (row: any) => {
              if (row.status !== ProcessStatus.CONCLUIDO) {
                updateProcesso({
                  workspaceId: activeWorkspace?.id || '',
                  processId: row.id,
                  payload: { status: ProcessStatus.CONCLUIDO },
                })
              }
            },
          },
        ]
      : []),
    ...(hasPermission('processos', 'delete')
      ? [
          {
            id: 'delete',
            label: 'Deletar',
            icon: <Trash2 className="h-4 w-4" />,
            onClick: (row: any) => {
              if (confirm('Tem certeza que deseja deletar este processo?')) {
                deleteProcesso({ workspaceId: activeWorkspace?.id || '', processId: row.id })
              }
            },
            variant: 'destructive' as const,
          },
        ]
      : []),
  ]



  return (
    <ModuleGuard moduleId="processos">
      <div className="space-y-6">
        <PageHeader
          title="Processos"
          description="Gerencie processos, fluxos e subprocessos do seu workspace"
          action={
            hasPermission('processos', 'create')
              ? {
                  label: 'Novo Processo',
                  onClick: () => router.push('/processos/new'),
                  icon: <Plus className="h-4 w-4" />,
                }
              : undefined
          }
        />

        {/* Toggle: Todos vs Meus Processos + Lista vs Kanban */}
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-lg border border-gh-border bg-gh-card p-1 w-fit">
          <button
            onClick={() => setViewMode('all')}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              viewMode === 'all'
                ? 'bg-gh-canvas text-gh-text shadow-sm'
                : 'text-gh-text-secondary hover:text-gh-text'
            )}
          >
            <List size={14} />
            Todos os Processos
          </button>
          <button
            onClick={() => setViewMode('my')}
            className={cn(
              'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              viewMode === 'my'
                ? 'bg-gh-canvas text-gh-text shadow-sm'
                : 'text-gh-text-secondary hover:text-gh-text'
            )}
          >
            <User size={14} />
            Meus Processos
          </button>
        </div>

        {/* Toggle: Lista vs Kanban */}
        <div className="flex items-center gap-1 rounded-lg border border-gh-border bg-gh-card p-1">
          <button
            onClick={() => setDisplayMode('list')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors',
              displayMode === 'list'
                ? 'bg-gh-canvas text-gh-text shadow-sm'
                : 'text-gh-text-secondary hover:text-gh-text'
            )}
            title="Visualização em lista"
          >
            <List size={14} />
            Lista
          </button>
          <button
            onClick={() => setDisplayMode('kanban')}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors',
              displayMode === 'kanban'
                ? 'bg-gh-canvas text-gh-text shadow-sm'
                : 'text-gh-text-secondary hover:text-gh-text'
            )}
            title="Visualização em kanban"
          >
            <LayoutGrid size={14} />
            Kanban
          </button>
        </div>
        </div>

        <DataTableToolbar
          searchPlaceholder="Pesquisar por nome..."
          onSearch={handleSearch}
          exportData={processosData.data || []}
          exportFilename="processos"
        />

        <div className="flex flex-wrap items-center gap-3">
          <FilterWithBadge
            label="Status"
            options={[
              { value: ProcessStatus.ABERTO, label: 'Aberto' },
              { value: ProcessStatus.EM_ANDAMENTO, label: 'Em Andamento' },
              { value: ProcessStatus.PENDENTE, label: 'Pendente' },
              { value: ProcessStatus.BLOQUEADO, label: 'Bloqueado' },
              { value: ProcessStatus.CONCLUIDO, label: 'Concluído' },
              { value: ProcessStatus.CANCELADO, label: 'Cancelado' },
            ]}
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as ProcessStatus | undefined)}
            width="w-56"
          />

          <FilterWithBadge
            label="Tipo"
            options={[
              { value: ProcessType.ATENDIMENTO, label: 'Atendimento' },
              { value: ProcessType.FINANCEIRO, label: 'Financeiro' },
              { value: ProcessType.ESTOQUE, label: 'Estoque' },
              { value: ProcessType.FORNECEDOR, label: 'Fornecedor' },
              { value: ProcessType.LOGISTICA, label: 'Logística' },
              { value: ProcessType.JURIDICO, label: 'Jurídico' },
              { value: ProcessType.RH, label: 'RH' },
              { value: ProcessType.OUTRO, label: 'Outro' },
            ]}
            value={typeFilter}
            onValueChange={(v) => setTypeFilter(v as ProcessType | undefined)}
            width="w-48"
          />

          <FilterWithBadge
            label="Obrigatório"
            options={[
              { value: 'true', label: 'Sim' },
              { value: 'false', label: 'Não' },
            ]}
            value={obrigatorioFilter}
            onValueChange={(v) => setObrigatorioFilter(v as string | undefined)}
            width="w-40"
          />

          <FilterWithBadge
            label="Impeditivo"
            options={[
              { value: 'true', label: 'Sim' },
              { value: 'false', label: 'Não' },
            ]}
            value={impeditivoFilter}
            onValueChange={(v) => setImpeditivoFilter(v as string | undefined)}
            width="w-40"
          />

          <DateRangePicker
            value={dateRange}
            onValueChange={setDateRange}
            placeholder="Período de criação"
            maxDays={31}
            className="h-8 w-64 text-sm"
          />

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="h-8 w-56 justify-between text-sm font-normal"
              >
                {memberFilter
                  ? memberOptions.find((o) => o.value === memberFilter)?.label || 'Responsável'
                  : 'Responsável'}
                <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0">
              <Command>
                <CommandInput placeholder="Pesquisar membro..." />
                <CommandList>
                  <CommandEmpty>Nenhum membro encontrado.</CommandEmpty>
                  <CommandGroup>
                    {memberFilter && (
                      <CommandItem
                        value="__clear__"
                        onSelect={() => setMemberFilter(undefined)}
                        className="text-muted-foreground"
                      >
                        Limpar filtro
                      </CommandItem>
                    )}
                    {memberOptions.map((opt) => (
                      <CommandItem
                        key={opt.value}
                        value={opt.label}
                        onSelect={() =>
                          setMemberFilter(
                            memberFilter === opt.value ? undefined : (opt.value as string)
                          )
                        }
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            memberFilter === opt.value ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {opt.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

                    <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="h-8 w-56 justify-between text-sm font-normal"
              >
                {contactFilter
                  ? contactOptions.find((o) => o.value === contactFilter)?.label || 'Solicitante'
                  : 'Solicitante'}
                <ChevronsUpDown className="ml-2 h-3.5 w-3.5 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0">
              <Command>
                <CommandInput placeholder="Pesquisar contato..." />
                <CommandList>
                  <CommandEmpty>Nenhum contato encontrado.</CommandEmpty>
                  <CommandGroup>
                    {contactFilter && (
                      <CommandItem
                        value="__clear__"
                        onSelect={() => setContactFilter(undefined)}
                        className="text-muted-foreground"
                      >
                        Limpar filtro
                      </CommandItem>
                    )}
                    {contactOptions.map((opt) => (
                      <CommandItem
                        key={opt.value}
                        value={opt.label}
                        onSelect={() =>
                          setContactFilter(
                            contactFilter === opt.value ? undefined : (opt.value as string)
                          )
                        }
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            contactFilter === opt.value ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                        {opt.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-8 gap-1 text-sm"
            >
              <X className="h-3.5 w-3.5" />
              Limpar filtros
            </Button>
          )}
        </div>

        {displayMode === 'list' ? (
          <DataTable
            headers={columns}
            data={processosData.data || []}
            isLoading={isLoading}
            emptyMessage="Nenhum processo encontrado"
            rowActions={rowActions}
            pageSize={10}
            maxPageSize={100}
          />
        ) : (
          <ProcessosKanban
            data={processosData.data || []}
            workspaceId={activeWorkspace?.id || ''}
            isLoading={isLoading}
          />
        )}
      </div>
    </ModuleGuard>
  )
}
