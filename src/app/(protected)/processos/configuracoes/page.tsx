'use client'

import { useState } from 'react'

import {
  AlertTriangle,
  Cog,
  GitBranch,
  Info,
  Layers,
  Shield,
  Tag,
  Users,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { ProcessStatus, ProcessType } from '@/modules/processos/types'
import { ModuleGuard } from '@/modules/workspace/components/ModuleGuard'
import { useBreadcrumb } from '@/modules/workspace/hooks'
import { useActiveWorkspace } from '@/modules/workspace/hooks/useActiveWorkspace'

// ─── LABELS ──────────────────────────────────────────────────

const statusLabels: Record<string, { label: string; description: string }> = {
  [ProcessStatus.ABERTO]: { label: 'Aberto', description: 'Processo recém-criado' },
  [ProcessStatus.EM_ANDAMENTO]: { label: 'Em Andamento', description: 'Processo sendo executado' },
  [ProcessStatus.PENDENTE]: { label: 'Pendente', description: 'Aguardando ação externa' },
  [ProcessStatus.BLOQUEADO]: { label: 'Bloqueado', description: 'Impedido de prosseguir' },
  [ProcessStatus.CONCLUIDO]: { label: 'Concluído', description: 'Processo finalizado com sucesso' },
  [ProcessStatus.CANCELADO]: { label: 'Cancelado', description: 'Processo descartado' },
}

const typeLabels: Record<string, { label: string; description: string; color: string }> = {
  [ProcessType.ATENDIMENTO]: {
    label: 'Atendimento',
    description: 'Processos de atendimento ao cliente',
    color: 'bg-purple-500',
  },
  [ProcessType.FINANCEIRO]: {
    label: 'Financeiro',
    description: 'Processos financeiros e contábeis',
    color: 'bg-emerald-500',
  },
  [ProcessType.ESTOQUE]: {
    label: 'Estoque',
    description: 'Controle de estoque e inventário',
    color: 'bg-amber-500',
  },
  [ProcessType.FORNECEDOR]: {
    label: 'Fornecedor',
    description: 'Gestão de fornecedores',
    color: 'bg-cyan-500',
  },
  [ProcessType.LOGISTICA]: {
    label: 'Logística',
    description: 'Processos logísticos e entregas',
    color: 'bg-indigo-500',
  },
  [ProcessType.JURIDICO]: {
    label: 'Jurídico',
    description: 'Processos jurídicos e compliance',
    color: 'bg-rose-500',
  },
  [ProcessType.RH]: {
    label: 'RH',
    description: 'Recursos humanos e pessoal',
    color: 'bg-teal-500',
  },
  [ProcessType.OUTRO]: {
    label: 'Outro',
    description: 'Processos gerais não categorizados',
    color: 'bg-slate-500',
  },
}

// ─── PAGE ────────────────────────────────────────────────────

export default function ProcessosConfiguracoesPage() {
  const { activeWorkspace } = useActiveWorkspace()
  const workspaceId = activeWorkspace?.id || ''

  const [autoInvoice, setAutoInvoice] = useState(true)
  const [requireActors, setRequireActors] = useState(false)
  const [blockOnImpeditivo, setBlockOnImpeditivo] = useState(true)

  useBreadcrumb([
    { label: 'Processos', href: '/processos' },
    { label: 'Configurações' },
  ])

  if (!workspaceId) {
    return (
      <div className="py-12 text-center">
        <p className="text-gh-text-secondary">Workspace não disponível</p>
      </div>
    )
  }

  return (
    <ModuleGuard moduleId="processos">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-gh-text text-2xl font-bold">Configurações de Processos</h1>
          <p className="text-gh-text-secondary mt-1 text-sm">
            Configure o comportamento do módulo de processos
          </p>
        </div>

        {/* General Settings */}
        <Card className="border-gh-border bg-gh-canvas">
          <CardHeader>
            <CardTitle className="text-gh-text flex items-center gap-2 text-base">
              <Cog className="h-4 w-4" />
              Configurações Gerais
            </CardTitle>
            <CardDescription className="text-gh-text-secondary">
              Comportamento padrão do módulo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-gh-text text-sm font-medium">
                  Faturamento automático ao concluir
                </Label>
                <p className="text-gh-text-secondary text-xs">
                  Ao concluir um processo pai, faturar automaticamente os lançamentos internos
                </p>
              </div>
              <Switch checked={autoInvoice} onCheckedChange={setAutoInvoice} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-gh-text text-sm font-medium">
                  Exigir atores ao criar processo
                </Label>
                <p className="text-gh-text-secondary text-xs">
                  Obriga pelo menos um ator responsável ao criar novos processos
                </p>
              </div>
              <Switch checked={requireActors} onCheckedChange={setRequireActors} />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-gh-text text-sm font-medium">
                  Bloquear pai se subprocesso impeditivo pendente
                </Label>
                <p className="text-gh-text-secondary text-xs">
                  Impede concluir um processo pai se algum subprocesso impeditivo não estiver
                  concluído
                </p>
              </div>
              <Switch checked={blockOnImpeditivo} onCheckedChange={setBlockOnImpeditivo} />
            </div>
          </CardContent>
        </Card>

        {/* Status Reference */}
        <Card className="border-gh-border bg-gh-canvas">
          <CardHeader>
            <CardTitle className="text-gh-text flex items-center gap-2 text-base">
              <Tag className="h-4 w-4" />
              Status Disponíveis
            </CardTitle>
            <CardDescription className="text-gh-text-secondary">
              Status que um processo pode assumir durante seu ciclo de vida
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {Object.entries(statusLabels).map(([status, info]) => (
                <div
                  key={status}
                  className="border-gh-border flex items-center gap-3 rounded-lg border p-3"
                >
                  <StatusDot status={status} />
                  <div>
                    <p className="text-gh-text text-sm font-medium">{info.label}</p>
                    <p className="text-gh-text-secondary text-xs">{info.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Type Reference */}
        <Card className="border-gh-border bg-gh-canvas">
          <CardHeader>
            <CardTitle className="text-gh-text flex items-center gap-2 text-base">
              <Layers className="h-4 w-4" />
              Tipos de Processo
            </CardTitle>
            <CardDescription className="text-gh-text-secondary">
              Categorias disponíveis para classificar processos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {Object.entries(typeLabels).map(([type, info]) => (
                <div
                  key={type}
                  className="border-gh-border flex items-center gap-3 rounded-lg border p-3"
                >
                  <div className={`h-3 w-3 shrink-0 rounded-full ${info.color}`} />
                  <div>
                    <p className="text-gh-text text-sm font-medium">{info.label}</p>
                    <p className="text-gh-text-secondary text-xs">{info.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actors & Permissions */}
        <Card className="border-gh-border bg-gh-canvas">
          <CardHeader>
            <CardTitle className="text-gh-text flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Papéis de Atores
            </CardTitle>
            <CardDescription className="text-gh-text-secondary">
              Funções que um ator pode desempenhar em um processo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <RoleCard
                role="Executor"
                description="Responsável pela execução das tarefas do processo"
                icon={<Cog className="h-4 w-4 text-blue-500" />}
              />
              <RoleCard
                role="Aprovador"
                description="Responsável por aprovar ou rejeitar etapas"
                icon={<Shield className="h-4 w-4 text-green-500" />}
              />
              <RoleCard
                role="Solicitante"
                description="Pessoa que solicitou a abertura do processo"
                icon={<GitBranch className="h-4 w-4 text-purple-500" />}
              />
              <RoleCard
                role="Observador"
                description="Acompanha o processo sem poder de ação"
                icon={<Info className="h-4 w-4 text-gray-500" />}
              />
              <RoleCard
                role="Responsável"
                description="Responsável principal pelo andamento geral"
                icon={<AlertTriangle className="h-4 w-4 text-yellow-500" />}
              />
            </div>
          </CardContent>
        </Card>

        {/* Info banner */}
        <div className="border-gh-border bg-gh-bg flex items-start gap-3 rounded-lg border p-4">
          <Info className="text-gh-text-secondary mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="text-gh-text text-sm font-medium">Sobre as configurações</p>
            <p className="text-gh-text-secondary mt-1 text-xs">
              As configurações de comportamento acima serão salvas automaticamente quando a
              funcionalidade de persistência for habilitada. Por enquanto, servem como referência
              visual das opções futuras do módulo.
            </p>
          </div>
        </div>
      </div>
    </ModuleGuard>
  )
}

// ─── COMPONENTS ──────────────────────────────────────────────

function StatusDot({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    [ProcessStatus.ABERTO]: 'bg-blue-500',
    [ProcessStatus.EM_ANDAMENTO]: 'bg-yellow-500',
    [ProcessStatus.PENDENTE]: 'bg-orange-500',
    [ProcessStatus.BLOQUEADO]: 'bg-red-500',
    [ProcessStatus.CONCLUIDO]: 'bg-green-500',
    [ProcessStatus.CANCELADO]: 'bg-gray-500',
  }
  return <div className={`h-3 w-3 shrink-0 rounded-full ${colorMap[status] || 'bg-gray-400'}`} />
}

function RoleCard({
  role,
  description,
  icon,
}: {
  role: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <div className="border-gh-border flex items-start gap-3 rounded-lg border p-3">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-gh-text text-sm font-medium">{role}</p>
        <p className="text-gh-text-secondary text-xs">{description}</p>
      </div>
    </div>
  )
}
