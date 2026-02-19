'use client'

import { useMemo, useState } from 'react'

import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  GitBranch,
  Loader2,
  Timer,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { PeriodPicker, getDefaultPeriodValue } from '@/components/patterns/PeriodPicker'
import type { PeriodValue } from '@/components/patterns/PeriodPicker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'
import { useProcessoReports } from '@/modules/processos/hooks/useProcessos'
import type { ProcessReportsFilters } from '@/modules/processos/types'
import { ProcessStatus, ProcessType } from '@/modules/processos/types'
import { ModuleGuard } from '@/modules/workspace/components/ModuleGuard'
import { useBreadcrumb } from '@/modules/workspace/hooks'
import { useActiveWorkspace } from '@/modules/workspace/hooks/useActiveWorkspace'

// ─── LABELS ──────────────────────────────────────────────────

const statusLabels: Record<string, string> = {
  [ProcessStatus.ABERTO]: 'Aberto',
  [ProcessStatus.EM_ANDAMENTO]: 'Em Andamento',
  [ProcessStatus.PENDENTE]: 'Pendente',
  [ProcessStatus.BLOQUEADO]: 'Bloqueado',
  [ProcessStatus.CONCLUIDO]: 'Concluído',
  [ProcessStatus.CANCELADO]: 'Cancelado',
}

const statusColors: Record<string, string> = {
  [ProcessStatus.ABERTO]: 'bg-blue-500',
  [ProcessStatus.EM_ANDAMENTO]: 'bg-yellow-500',
  [ProcessStatus.PENDENTE]: 'bg-orange-500',
  [ProcessStatus.BLOQUEADO]: 'bg-red-500',
  [ProcessStatus.CONCLUIDO]: 'bg-green-500',
  [ProcessStatus.CANCELADO]: 'bg-gray-500',
}

const typeLabels: Record<string, string> = {
  [ProcessType.ATENDIMENTO]: 'Atendimento',
  [ProcessType.FINANCEIRO]: 'Financeiro',
  [ProcessType.ESTOQUE]: 'Estoque',
  [ProcessType.FORNECEDOR]: 'Fornecedor',
  [ProcessType.LOGISTICA]: 'Logística',
  [ProcessType.JURIDICO]: 'Jurídico',
  [ProcessType.RH]: 'RH',
  [ProcessType.OUTRO]: 'Outro',
}

const typeColors: Record<string, string> = {
  [ProcessType.ATENDIMENTO]: 'bg-purple-500',
  [ProcessType.FINANCEIRO]: 'bg-emerald-500',
  [ProcessType.ESTOQUE]: 'bg-amber-500',
  [ProcessType.FORNECEDOR]: 'bg-cyan-500',
  [ProcessType.LOGISTICA]: 'bg-indigo-500',
  [ProcessType.JURIDICO]: 'bg-rose-500',
  [ProcessType.RH]: 'bg-teal-500',
  [ProcessType.OUTRO]: 'bg-slate-500',
}

const monthLabels: Record<string, string> = {
  '01': 'Jan',
  '02': 'Fev',
  '03': 'Mar',
  '04': 'Abr',
  '05': 'Mai',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Ago',
  '09': 'Set',
  '10': 'Out',
  '11': 'Nov',
  '12': 'Dez',
}

function formatMonth(ym: string) {
  const [year, month] = ym.split('-')
  return `${monthLabels[month] || month}/${year?.slice(2)}`
}

function formatDateShort(dateStr: string) {
  const [, month, day] = dateStr.split('-')
  return `${day}/${month}`
}

// ─── PAGE ────────────────────────────────────────────────────

export default function ProcessosRelatoriosPage() {
  const { activeWorkspace } = useActiveWorkspace()
  const workspaceId = activeWorkspace?.id || ''

  const [periodValue, setPeriodValue] = useState<PeriodValue>(() => getDefaultPeriodValue('month'))
  const filters = useMemo<ProcessReportsFilters>(
    () => ({ startDate: periodValue.startDate, endDate: periodValue.endDate }),
    [periodValue.startDate, periodValue.endDate],
  )

  useBreadcrumb([
    { label: 'Processos', href: '/processos' },
    { label: 'Relatórios' },
  ])

  const {
    data: reports,
    isLoading,
    error,
  } = useProcessoReports(workspaceId, filters, !!workspaceId)

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gh-text text-2xl font-bold">Relatórios de Processos</h1>
            <p className="text-gh-text-secondary mt-1 text-sm">
              Visão geral e métricas do módulo de processos
            </p>
          </div>
          <PeriodPicker value={periodValue} onValueChange={setPeriodValue} />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="text-gh-text-secondary h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-red-500" />
            <p className="text-gh-text-secondary">Erro ao carregar relatórios</p>
          </div>
        ) : reports ? (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <KPICard
                title="Total de Processos"
                value={reports.totals.total}
                icon={GitBranch}
                description={`${reports.totals.root} raiz · ${reports.totals.sub} sub`}
              />
              <KPICard
                title="Em Aberto"
                value={reports.totals.open}
                icon={Clock}
                description={
                  reports.totals.total > 0
                    ? `${((reports.totals.open / reports.totals.total) * 100).toFixed(0)}% do total`
                    : '0%'
                }
                color="text-yellow-500"
              />
              <KPICard
                title="Concluídos"
                value={reports.totals.concluded}
                icon={CheckCircle2}
                description={
                  reports.avgConclusionDays !== null
                    ? `Média: ${reports.avgConclusionDays} dias`
                    : 'Sem dados'
                }
                color="text-green-500"
              />
              <KPICard
                title="Atrasados (+30d)"
                value={reports.totals.overdue}
                icon={AlertTriangle}
                description={
                  reports.totals.open > 0
                    ? `${((reports.totals.overdue / reports.totals.open) * 100).toFixed(0)}% dos abertos`
                    : '0%'
                }
                color="text-red-500"
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Status Distribution */}
              <Card className="border-gh-border bg-gh-canvas">
                <CardHeader>
                  <CardTitle className="text-gh-text flex items-center gap-2 text-base">
                    <BarChart3 className="h-4 w-4" />
                    Processos por Status
                  </CardTitle>
                  <CardDescription className="text-gh-text-secondary">
                    Distribuição atual dos processos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {reports.byStatus.length === 0 ? (
                    <p className="text-gh-text-secondary py-8 text-center text-sm">
                      Nenhum processo encontrado
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {reports.byStatus
                        .sort((a, b) => b.count - a.count)
                        .map((item) => {
                          const pct =
                            reports.totals.total > 0
                              ? (item.count / reports.totals.total) * 100
                              : 0
                          return (
                            <div key={item.status}>
                              <div className="mb-1 flex items-center justify-between text-sm">
                                <span className="text-gh-text">
                                  {statusLabels[item.status] || item.status}
                                </span>
                                <span className="text-gh-text-secondary">
                                  {item.count} ({pct.toFixed(0)}%)
                                </span>
                              </div>
                              <div className="bg-gh-bg h-2 overflow-hidden rounded-full">
                                <div
                                  className={`h-full rounded-full transition-all ${statusColors[item.status] || 'bg-gray-400'}`}
                                  style={{ width: `${Math.max(pct, 2)}%` }}
                                />
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Type Distribution */}
              <Card className="border-gh-border bg-gh-canvas">
                <CardHeader>
                  <CardTitle className="text-gh-text flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4" />
                    Processos por Tipo
                  </CardTitle>
                  <CardDescription className="text-gh-text-secondary">
                    Distribuição por categoria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {reports.byType.length === 0 ? (
                    <p className="text-gh-text-secondary py-8 text-center text-sm">
                      Nenhum processo encontrado
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {reports.byType
                        .sort((a, b) => b.count - a.count)
                        .map((item) => {
                          const pct =
                            reports.totals.total > 0
                              ? (item.count / reports.totals.total) * 100
                              : 0
                          return (
                            <div key={item.type}>
                              <div className="mb-1 flex items-center justify-between text-sm">
                                <span className="text-gh-text">
                                  {typeLabels[item.type] || item.type}
                                </span>
                                <span className="text-gh-text-secondary">
                                  {item.count} ({pct.toFixed(0)}%)
                                </span>
                              </div>
                              <div className="bg-gh-bg h-2 overflow-hidden rounded-full">
                                <div
                                  className={`h-full rounded-full transition-all ${typeColors[item.type] || 'bg-gray-400'}`}
                                  style={{ width: `${Math.max(pct, 2)}%` }}
                                />
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Processos Abertos por Dia (Root vs Sub) */}
            <Card className="border-gh-border bg-gh-canvas">
              <CardHeader>
                <CardTitle className="text-gh-text flex items-center gap-2 text-base">
                  <Calendar className="h-4 w-4" />
                  Processos Abertos por Dia
                </CardTitle>
                <CardDescription className="text-gh-text-secondary">
                  Comparação entre processos raiz e subprocessos criados por dia
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reports.dailyOpened.length === 0 ? (
                  <p className="text-gh-text-secondary py-8 text-center text-sm">
                    Nenhum processo encontrado no período
                  </p>
                ) : (
                  <DailyOpenedChart data={reports.dailyOpened} />
                )}
              </CardContent>
            </Card>

            {/* Tempo Médio de Vida por Categoria */}
            <Card className="border-gh-border bg-gh-canvas">
              <CardHeader>
                <CardTitle className="text-gh-text flex items-center gap-2 text-base">
                  <Timer className="h-4 w-4" />
                  Tempo Médio de Vida por Categoria
                </CardTitle>
                <CardDescription className="text-gh-text-secondary">
                  Média de dias entre criação e conclusão, agrupado por tipo
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reports.avgLifetimeByType.length === 0 ? (
                  <p className="text-gh-text-secondary py-8 text-center text-sm">
                    Nenhum processo concluído encontrado
                  </p>
                ) : (
                  <AvgLifetimeChart data={reports.avgLifetimeByType} />
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="border-gh-border bg-gh-canvas">
              <CardHeader>
                <CardTitle className="text-gh-text flex items-center gap-2 text-base">
                  <TrendingUp className="h-4 w-4" />
                  Timeline de Criação
                </CardTitle>
                <CardDescription className="text-gh-text-secondary">
                  Quantidade de processos, custos e receitas por mês
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reports.timeline.length === 0 ? (
                  <p className="text-gh-text-secondary py-8 text-center text-sm">
                    Sem dados de timeline
                  </p>
                ) : (
                  <TimelineChart data={reports.timeline} />
                )}
              </CardContent>
            </Card>

            {/* Financial Row */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Finance Summary */}
              <Card className="border-gh-border bg-gh-canvas">
                <CardHeader>
                  <CardTitle className="text-gh-text flex items-center gap-2 text-base">
                    <DollarSign className="h-4 w-4" />
                    Resumo Financeiro
                  </CardTitle>
                  <CardDescription className="text-gh-text-secondary">
                    Lançamentos internos de processos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FinanceSummaryCards summary={reports.finance.summary} />
                </CardContent>
              </Card>

              {/* Top Expenses */}
              <Card className="border-gh-border bg-gh-canvas">
                <CardHeader>
                  <CardTitle className="text-gh-text flex items-center gap-2 text-base">
                    <ArrowDownRight className="h-4 w-4" />
                    Top 10 Processos por Despesa
                  </CardTitle>
                  <CardDescription className="text-gh-text-secondary">
                    Processos com maior custo acumulado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {reports.finance.topByExpense.length === 0 ? (
                    <p className="text-gh-text-secondary py-8 text-center text-sm">
                      Nenhuma despesa registrada
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {reports.finance.topByExpense.map((item, index) => (
                        <Link
                          key={item.processId}
                          href={`/processos/${item.processId}`}
                          className="border-gh-border hover:bg-gh-hover flex items-center justify-between rounded-md border p-3 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-gh-text-secondary flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-xs font-bold text-red-500">
                              {index + 1}
                            </span>
                            <div>
                              <p className="text-gh-text text-sm font-medium">{item.processName}</p>
                              <p className="text-gh-text-secondary text-xs">
                                {item.entryCount} lançamento{item.entryCount !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-red-500">
                            {formatCurrency(item.totalExpense)}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        ) : null}
      </div>
    </ModuleGuard>
  )
}

// ─── COMPONENTS ──────────────────────────────────────────────

function KPICard({
  title,
  value,
  icon: Icon,
  description,
  color,
}: {
  title: string
  value: number
  icon: any
  description?: string
  color?: string
}) {
  return (
    <Card className="border-gh-border bg-gh-canvas">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gh-text-secondary text-xs font-medium uppercase tracking-wider">
              {title}
            </p>
            <p className={`mt-2 text-3xl font-bold ${color || 'text-gh-text'}`}>{value}</p>
            {description && (
              <p className="text-gh-text-secondary mt-1 text-xs">{description}</p>
            )}
          </div>
          <div className={`rounded-lg p-2 ${color ? 'bg-current/10' : 'bg-gh-bg'}`}>
            <Icon className={`h-5 w-5 ${color || 'text-gh-text-secondary'}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const timelineChartConfig = {
  count: {
    label: 'Processos',
    color: 'var(--color-blue-500)',
  },
  expense: {
    label: 'Custo',
    color: 'var(--color-red-500)',
  },
  income: {
    label: 'Receita',
    color: 'var(--color-green-500)',
  },
} satisfies ChartConfig

function TimelineChart({
  data,
}: {
  data: { month: string; count: number; expense: number; income: number }[]
}) {
  const chartData = useMemo(
    () =>
      data.map((d) => ({
        ...d,
        label: formatMonth(d.month),
      })),
    [data],
  )

  return (
    <ChartContainer className="h-[280px] w-full" config={timelineChartConfig}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{ left: 0, right: 12, top: 12 }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          axisLine={false}
          dataKey="label"
          tickLine={false}
          tickMargin={8}
          fontSize={11}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickMargin={4}
          fontSize={11}
          width={40}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              indicator="line"
              labelFormatter={(value: any) => String(value)}
              formatter={(value: any, name: string) => {
                if (name === 'count') return [String(value), 'Processos']
                return [
                  `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                  name === 'expense' ? 'Custo' : 'Receita',
                ]
              }}
            />
          }
          cursor={false}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="income"
          fill="var(--color-green-500)"
          fillOpacity={0.1}
          stroke="var(--color-green-500)"
          strokeWidth={2}
          type="monotone"
          dot={false}
        />
        <Area
          dataKey="expense"
          fill="var(--color-red-500)"
          fillOpacity={0.15}
          stroke="var(--color-red-500)"
          strokeWidth={2}
          type="monotone"
          dot={false}
        />
        <Area
          dataKey="count"
          fill="var(--color-blue-500)"
          fillOpacity={0.2}
          stroke="var(--color-blue-500)"
          strokeWidth={2}
          type="monotone"
          dot={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}

function FinanceSummaryCards({
  summary,
}: {
  summary: { transactionType: string; total: number; count: number }[]
}) {
  const income = summary.find((s) => s.transactionType === 'INCOME')
  const expense = summary.find((s) => s.transactionType === 'EXPENSE')

  const totalIncome = income?.total || 0
  const totalExpense = expense?.total || 0
  const balance = totalIncome - totalExpense

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-3">
          <div className="flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4 text-green-500" />
            <span className="text-gh-text-secondary text-xs">Receitas</span>
          </div>
          <p className="mt-1 text-lg font-bold text-green-500">{formatCurrency(totalIncome)}</p>
          <p className="text-gh-text-secondary text-xs">{income?.count || 0} lançamentos</p>
        </div>
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
          <div className="flex items-center gap-2">
            <ArrowDownRight className="h-4 w-4 text-red-500" />
            <span className="text-gh-text-secondary text-xs">Despesas</span>
          </div>
          <p className="mt-1 text-lg font-bold text-red-500">{formatCurrency(totalExpense)}</p>
          <p className="text-gh-text-secondary text-xs">{expense?.count || 0} lançamentos</p>
        </div>
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <span className="text-gh-text-secondary text-sm">Saldo</span>
        <span
          className={`text-lg font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}
        >
          {formatCurrency(balance)}
        </span>
      </div>
    </div>
  )
}

function DailyOpenedChart({
  data,
}: {
  data: { date: string; rootCount: number; subCount: number }[]
}) {
  const maxCount = useMemo(
    () => Math.max(...data.map((d) => d.rootCount + d.subCount), 1),
    [data]
  )

  // Agrupar por semana se muitos dados (> 60 dias)
  const chartData = useMemo(() => {
    if (data.length <= 60) return data
    // Agrupar em blocos de 7 dias
    const grouped: typeof data = []
    for (let i = 0; i < data.length; i += 7) {
      const chunk = data.slice(i, i + 7)
      grouped.push({
        date: chunk[0].date,
        rootCount: chunk.reduce((s, d) => s + d.rootCount, 0),
        subCount: chunk.reduce((s, d) => s + d.subCount, 0),
      })
    }
    return grouped
  }, [data])

  const maxGrouped = useMemo(
    () => Math.max(...chartData.map((d) => d.rootCount + d.subCount), 1),
    [chartData]
  )

  return (
    <div>
      {/* Legenda */}
      <div className="mb-4 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-blue-500" />
          <span className="text-gh-text-secondary text-xs">Raiz</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-orange-500" />
          <span className="text-gh-text-secondary text-xs">Subprocessos</span>
        </div>
      </div>
      <div className="flex h-52 items-end gap-[2px] overflow-x-auto">
        {chartData.map((item) => {
          const total = item.rootCount + item.subCount
          const rootPct = (item.rootCount / maxGrouped) * 100
          const subPct = (item.subCount / maxGrouped) * 100
          return (
            <div
              key={item.date}
              className="group flex min-w-[12px] flex-1 flex-col items-center gap-1"
            >
              <span className="text-gh-text-secondary text-[10px] opacity-0 transition-opacity group-hover:opacity-100">
                {total}
              </span>
              <div className="flex w-full flex-1 flex-col items-stretch justify-end">
                {item.subCount > 0 && (
                  <div
                    className="w-full bg-orange-500 transition-all group-hover:bg-orange-400"
                    style={{ height: `${Math.max(subPct, 2)}%` }}
                  />
                )}
                {item.rootCount > 0 && (
                  <div
                    className="w-full rounded-t bg-blue-500 transition-all group-hover:bg-blue-400"
                    style={{ height: `${Math.max(rootPct, 2)}%` }}
                  />
                )}
              </div>
              <span className="text-gh-text-secondary text-[8px] leading-none">
                {formatDateShort(item.date)}
              </span>
            </div>
          )
        })}
      </div>
      {data.length > 60 && (
        <p className="text-gh-text-secondary mt-2 text-center text-[10px]">
          Dados agrupados por semana ({data.length} dias)
        </p>
      )}
    </div>
  )
}

function AvgLifetimeChart({
  data,
}: {
  data: { type: string; avgDays: number; count: number }[]
}) {
  const maxDays = useMemo(() => Math.max(...data.map((d) => d.avgDays), 1), [data])

  return (
    <div className="space-y-3">
      {data.map((item) => {
        const pct = (item.avgDays / maxDays) * 100
        const color = typeColors[item.type] || 'bg-gray-400'
        return (
          <div key={item.type}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-gh-text">{typeLabels[item.type] || item.type}</span>
              <div className="flex items-center gap-2">
                <span className="text-gh-text-secondary text-xs">
                  {item.count} processo{item.count !== 1 ? 's' : ''}
                </span>
                <span className="text-gh-text font-semibold">
                  {item.avgDays} dia{item.avgDays !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <div className="bg-gh-bg h-2.5 overflow-hidden rounded-full">
              <div
                className={`h-full rounded-full transition-all ${color}`}
                style={{ width: `${Math.max(pct, 3)}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
