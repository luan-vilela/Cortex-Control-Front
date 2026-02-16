'use client'

import { useState } from 'react'

import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  GitBranch,
  Loader2,
  MoreVertical,
  Plus,
  Shield,
  Trash2,
  User,
  Users,
  XCircle,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/utils'
import { ProcessStatusBadge } from '@/modules/processos/components/ProcessStatusBadge'
import { ProcessTypeBadge } from '@/modules/processos/components/ProcessTypeBadge'
import {
  useDeleteProcesso,
  useProcesso,
  useUpdateProcesso,
} from '@/modules/processos/hooks/useProcessos'
import { type ActorRole, type Process, ProcessStatus } from '@/modules/processos/types'
import { ModuleGuard } from '@/modules/workspace/components/ModuleGuard'
import { useBreadcrumb } from '@/modules/workspace/hooks'
import { useActiveWorkspace } from '@/modules/workspace/hooks/useActiveWorkspace'

// ─── LABELS ──────────────────────────────────────────────────

const statusLabels: Record<ProcessStatus, string> = {
  [ProcessStatus.ABERTO]: 'Aberto',
  [ProcessStatus.EM_ANDAMENTO]: 'Em Andamento',
  [ProcessStatus.PENDENTE]: 'Pendente',
  [ProcessStatus.BLOQUEADO]: 'Bloqueado',
  [ProcessStatus.CONCLUIDO]: 'Concluído',
  [ProcessStatus.CANCELADO]: 'Cancelado',
}

const actorRoleLabels: Record<string, string> = {
  APROVADOR: 'Aprovador',
  EXECUTOR: 'Executor',
  SOLICITANTE: 'Solicitante',
  OBSERVADOR: 'Observador',
  RESPONSAVEL: 'Responsável',
}

// ─── PAGE ────────────────────────────────────────────────────

export default function ProcessoDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { activeWorkspace } = useActiveWorkspace()
  const [isChangingStatus, setIsChangingStatus] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const processId = params.id as string
  const workspaceId = activeWorkspace?.id || ''

  const {
    data: processo,
    isLoading,
    error,
    refetch,
  } = useProcesso(workspaceId, processId, !!workspaceId && !!processId)

  useBreadcrumb(
    processo
      ? [
          { label: 'Processos', href: '/processos' },
          { label: processo.name },
        ]
      : [{ label: 'Processos', href: '/processos' }]
  )

  const { mutate: updateProcesso } = useUpdateProcesso()
  const { mutate: deleteProcesso } = useDeleteProcesso()

  // ─── HANDLERS ────────────────────────────────────────────────

  const handleStatusChange = (newStatus: ProcessStatus) => {
    setIsChangingStatus(true)
    updateProcesso(
      {
        workspaceId,
        processId,
        payload: { status: newStatus },
      },
      {
        onSuccess: () => {
          refetch()
          setIsChangingStatus(false)
        },
        onSettled: () => {
          setIsChangingStatus(false)
        },
      }
    )
  }

  const handleDelete = () => {
    if (!confirm('Tem certeza que deseja deletar este processo? Esta ação não pode ser desfeita.')) {
      return
    }

    setIsDeleting(true)
    deleteProcesso(
      { workspaceId, processId },
      {
        onSuccess: () => {
          router.push('/processos')
        },
        onSettled: () => {
          setIsDeleting(false)
        },
      }
    )
  }

  // ─── LOADING STATE ───────────────────────────────────────────

  if (!workspaceId) {
    return (
      <div className="py-12 text-center">
        <p className="text-gh-text-secondary">Workspace não disponível</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <ModuleGuard moduleId="processos">
        <div className="min-h-screen p-6">
          <div className="mx-auto max-w-5xl">
            <div className="flex items-center justify-center py-24">
              <Loader2 className="text-gh-text-secondary h-8 w-8 animate-spin" />
            </div>
          </div>
        </div>
      </ModuleGuard>
    )
  }

  if (!processo) {
    return (
      <ModuleGuard moduleId="processos">
        <div className="min-h-screen p-6">
          <div className="mx-auto max-w-5xl py-12 text-center">
            <div className="bg-gh-card border-gh-border rounded-lg border p-12 shadow-sm">
              <XCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
              <h2 className="text-gh-text mb-2 text-xl font-semibold">Processo não encontrado</h2>
              <p className="text-gh-text-secondary mb-4">
                O processo que você está procurando não existe ou foi removido.
              </p>
              {error && (
                <p className="mb-6 text-sm text-red-600">
                  {(error as any)?.message || 'Erro ao carregar processo'}
                </p>
              )}
              <Button
                onClick={() => router.push('/processos')}
                variant="outline"
                className="gap-2"
              >
                <ArrowLeft size={16} />
                Voltar para Processos
              </Button>
            </div>
          </div>
        </div>
      </ModuleGuard>
    )
  }

  // ─── DATA HELPERS ────────────────────────────────────────────

  const responsaveis = processo.actors?.filter((a) => a.responsavel) || []
  const solicitantes =
    processo.actors?.filter((a) => a.papel === 'SOLICITANTE' && !a.responsavel) || []
  const outrosAtores =
    processo.actors?.filter((a) => a.papel !== 'SOLICITANTE' && !a.responsavel) || []
  const children = processo.children || []
  const schemaFields = processo.schema ? Object.entries(processo.schema) : []
  const dataFields = processo.data ? Object.entries(processo.data) : []

  // ─── RENDER ──────────────────────────────────────────────────

  return (
    <ModuleGuard moduleId="processos">
      <div className="min-h-screen p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/processos')}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Voltar para Processos
            </Button>

            <div className="flex items-center gap-2">
              {/* Ação rápida: Novo Subprocesso */}
              <Button
                onClick={() => router.push(`/processos/new?parentId=${processId}`)}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Plus size={16} />
                Novo Subprocesso
              </Button>

              {/* Ação rápida: Concluir */}
              {processo.status !== ProcessStatus.CONCLUIDO &&
                processo.status !== ProcessStatus.CANCELADO && (
                  <Button
                    onClick={() => handleStatusChange(ProcessStatus.CONCLUIDO)}
                    disabled={isChangingStatus}
                    className="gap-2 bg-green-600 text-white hover:bg-green-700"
                    size="sm"
                  >
                    <CheckCircle2 size={16} />
                    Concluir
                  </Button>
                )}

              {/* Menu de Ações */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Ações</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Alterar Status */}
                  <DropdownMenuLabel className="text-gh-text-secondary text-xs font-normal">
                    Alterar Status
                  </DropdownMenuLabel>
                  {Object.values(ProcessStatus)
                    .filter((s) => s !== processo.status)
                    .map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        disabled={isChangingStatus}
                      >
                        {statusLabels[status]}
                      </DropdownMenuItem>
                    ))}
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="text-red-600 focus:bg-red-50 focus:text-red-600 dark:focus:bg-red-950/20"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Deletar Processo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* ─── CARD PRINCIPAL: INFORMAÇÕES GERAIS ─────────────── */}
          <div className="bg-gh-card border-gh-border rounded-lg border shadow-sm">
            <div className="p-6">
              {/* Título e badges */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <h1 className="text-gh-text text-2xl font-bold">{processo.name}</h1>
                  <div className="flex flex-wrap items-center gap-2">
                    <ProcessStatusBadge status={processo.status} />
                    <ProcessTypeBadge type={processo.type} />
                    {processo.obrigatorio && (
                      <Badge className="gap-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                        <Shield size={12} />
                        Obrigatório
                      </Badge>
                    )}
                    {processo.impeditivo && (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle size={12} />
                        Impeditivo
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Grid de informações */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <InfoItem
                  icon={<Clock size={16} />}
                  label="Criado em"
                  value={formatDate(processo.createdAt)}
                />
                <InfoItem
                  icon={<Clock size={16} />}
                  label="Atualizado em"
                  value={formatDate(processo.updatedAt)}
                />
                <InfoItem
                  icon={<Clock size={16} />}
                  label="Encerrado em"
                  value={processo.closedAt ? formatDate(processo.closedAt) : '—'}
                />
                {processo.parentId && (
                  <InfoItem
                    icon={<GitBranch size={16} />}
                    label="Processo Pai"
                    value={
                      <Button
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-sm"
                        onClick={() => router.push(`/processos/${processo.parentId}`)}
                      >
                        {processo.parent?.name || processo.parentId}
                        <ChevronRight size={14} />
                      </Button>
                    }
                  />
                )}
              </div>
            </div>
          </div>

          {/* Grid de 2 colunas: Atores + Subprocessos */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* ─── CARD: ATORES / ENVOLVIDOS ────────────────────── */}
            <div className="bg-gh-card border-gh-border rounded-lg border shadow-sm">
              <div className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Users size={18} className="text-gh-text-secondary" />
                  <h2 className="text-gh-text text-lg font-semibold">Envolvidos</h2>
                  <Badge variant="outline" className="ml-auto">
                    {processo.actors?.length || 0}
                  </Badge>
                </div>

                {processo.actors?.length === 0 ? (
                  <p className="text-gh-text-secondary py-4 text-center text-sm">
                    Nenhum ator vinculado a este processo.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {/* Responsáveis */}
                    {responsaveis.length > 0 && (
                      <ActorSection title="Responsáveis" actors={responsaveis} />
                    )}

                    {/* Solicitantes */}
                    {solicitantes.length > 0 && (
                      <ActorSection title="Solicitantes" actors={solicitantes} />
                    )}

                    {/* Outros atores */}
                    {outrosAtores.length > 0 && (
                      <ActorSection title="Outros" actors={outrosAtores} />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ─── CARD: SUBPROCESSOS ───────────────────────────── */}
            <div className="bg-gh-card border-gh-border rounded-lg border shadow-sm">
              <div className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <GitBranch size={18} className="text-gh-text-secondary" />
                  <h2 className="text-gh-text text-lg font-semibold">Subprocessos</h2>
                  <Badge variant="outline" className="ml-auto">
                    {children.length}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1 text-xs"
                    onClick={() => router.push(`/processos/new?parentId=${processId}`)}
                  >
                    <Plus size={14} />
                    Adicionar
                  </Button>
                </div>

                {children.length === 0 ? (
                  <p className="text-gh-text-secondary py-4 text-center text-sm">
                    Nenhum subprocesso vinculado.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {children.map((child) => (
                      <ChildProcessItem
                        key={child.id}
                        child={child}
                        onClick={() => router.push(`/processos/${child.id}`)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─── CARD: DADOS DINÂMICOS (schema/data) ─────────── */}
          {(schemaFields.length > 0 || dataFields.length > 0) && (
            <div className="bg-gh-card border-gh-border rounded-lg border shadow-sm">
              <div className="p-6">
                <div className="mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-gh-text-secondary" />
                  <h2 className="text-gh-text text-lg font-semibold">Dados do Processo</h2>
                </div>

                {dataFields.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {dataFields.map(([key, value]) => {
                      const schemaInfo = processo.schema?.[key]
                      const label =
                        typeof schemaInfo === 'object' && schemaInfo?.label
                          ? schemaInfo.label
                          : key
                      return (
                        <div
                          key={key}
                          className="bg-gh-canvas border-gh-border rounded-md border p-3"
                        >
                          <p className="text-gh-text-secondary mb-1 text-xs font-medium uppercase tracking-wide">
                            {label}
                          </p>
                          <p className="text-gh-text text-sm">
                            {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                ) : schemaFields.length > 0 ? (
                  <p className="text-gh-text-secondary text-sm">
                    Schema definido mas sem dados preenchidos.
                  </p>
                ) : null}
              </div>
            </div>
          )}

          {/* Debug Info (development only) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-2">
              <summary className="text-gh-text-secondary hover:text-gh-text bg-gh-card border-gh-border cursor-pointer rounded-lg border px-4 py-2 text-xs">
                🔍 Ver dados brutos (debug)
              </summary>
              <pre className="bg-gh-card border-gh-border mt-2 overflow-auto rounded-lg border p-4 text-xs">
                {JSON.stringify(processo, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    </ModuleGuard>
  )
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-gh-text-secondary mt-0.5">{icon}</div>
      <div>
        <p className="text-gh-text-secondary text-xs font-medium uppercase tracking-wide">
          {label}
        </p>
        <div className="text-gh-text mt-0.5 text-sm">{value}</div>
      </div>
    </div>
  )
}

function ActorSection({
  title,
  actors,
}: {
  title: string
  actors: { id: string; actorId: string; actorType: string; papel: ActorRole; responsavel: boolean }[]
}) {
  return (
    <div>
      <p className="text-gh-text-secondary mb-2 text-xs font-medium uppercase tracking-wide">
        {title}
      </p>
      <div className="space-y-2">
        {actors.map((actor) => (
          <div
            key={actor.id}
            className="bg-gh-canvas border-gh-border flex items-center gap-3 rounded-md border p-3"
          >
            <div className="bg-gh-border flex h-8 w-8 items-center justify-center rounded-full">
              <User size={14} className="text-gh-text-secondary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-gh-text truncate text-sm font-medium">
                {actor.actorId.slice(0, 8)}...
              </p>
              <p className="text-gh-text-secondary text-xs">
                {actor.actorType === 'person' ? 'Contato' : 'Membro'} ·{' '}
                {actorRoleLabels[actor.papel] || actor.papel}
              </p>
            </div>
            {actor.responsavel && (
              <Badge variant="default" className="shrink-0 text-xs">
                Responsável
              </Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ChildProcessItem({ child, onClick }: { child: Process; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-gh-canvas border-gh-border hover:bg-gh-hover flex w-full items-center gap-3 rounded-md border p-3 text-left transition-colors"
    >
      <div className="min-w-0 flex-1">
        <p className="text-gh-text truncate text-sm font-medium">{child.name}</p>
        <div className="mt-1 flex items-center gap-2">
          <ProcessStatusBadge status={child.status} />
          <ProcessTypeBadge type={child.type} />
        </div>
      </div>
      <ChevronRight size={16} className="text-gh-text-secondary shrink-0" />
    </button>
  )
}
