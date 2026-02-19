'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import {
  ArrowDownCircle,
  ArrowUpCircle,
  Archive,
  DollarSign,
  FileCheck,
  History,
  Loader2,
  Plus,
  RotateCcw,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'

import { DatePicker } from '@/components/patterns/DatePicker'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { InputNumber } from '@/components/ui/InputNumber'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatDate } from '@/lib/utils'
import {
  useArchiveProcessoEntry,
  useArchivedProcessoEntries,
  useCreateProcessoTransaction,
  useInvoiceProcessTree,
  useProcessoFinance,
  useProcessoFinanceSummary,
} from '@/modules/processos/hooks/useProcessos'
import type { CreateProcessFinanceEntryPayload, ProcessFinanceEntry } from '@/modules/processos/types'

// ─── HELPERS ────────────────────────────────────────────────

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

// ─── MAIN COMPONENT ─────────────────────────────────────────

interface ProcessFinanceCardProps {
  workspaceId: string
  processId: string
  isRoot?: boolean
  invoicedAt?: string | null
}

export function ProcessFinanceCard({ workspaceId, processId, isRoot = false, invoicedAt }: ProcessFinanceCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false)
  const [archivedModalOpen, setArchivedModalOpen] = useState(false)

  const {
    data: financeData,
    isLoading: loadingEntries,
    refetch: refetchEntries,
  } = useProcessoFinance(workspaceId, processId)

  const entries = financeData?.entries || []
  const currentProcessId = financeData?.currentProcessId || processId

  const {
    data: summary,
    isLoading: loadingSummary,
    refetch: refetchSummary,
  } = useProcessoFinanceSummary(workspaceId, processId)

  const {
    data: archivedData,
  } = useArchivedProcessoEntries(workspaceId, processId)

  const archivedEntries = archivedData?.entries || []

  const { mutate: archiveEntry, isPending: isArchiving } = useArchiveProcessoEntry()

  const handleCreated = () => {
    refetchEntries()
    refetchSummary()
  }

  const handleArchive = (entryId: string) => {
    archiveEntry({ workspaceId, processId, entryId, archive: true })
  }

  const handleRestore = (entryId: string) => {
    archiveEntry({ workspaceId, processId, entryId, archive: false })
  }

  const isLoading = loadingEntries || loadingSummary
  const canInvoice = isRoot && !invoicedAt && summary && (summary.totalExpense > 0 || summary.totalIncome > 0)

  return (
    <div className="bg-gh-card border-gh-border rounded-lg border shadow-sm">
      <div className="p-6">
        {/* Header */}
        <div className="mb-4 flex items-center gap-2">
          <DollarSign size={18} className="text-gh-text-secondary" />
          <h2 className="text-gh-text text-lg font-semibold">Financeiro</h2>
          <Badge variant="outline" className="ml-auto">
            {entries.length}
          </Badge>
          {archivedEntries.length > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setArchivedModalOpen(true)}
                    className="text-gh-text-secondary hover:text-gh-text flex items-center gap-1 rounded-md px-1.5 py-1 transition-colors hover:bg-amber-100 dark:hover:bg-amber-900/30"
                  >
                    <History size={15} className="text-amber-500" />
                    <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                      {archivedEntries.length}
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{archivedEntries.length} {archivedEntries.length === 1 ? 'item arquivado' : 'itens arquivados'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {invoicedAt && (
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              <FileCheck size={12} className="mr-1" />
              Faturado em {formatDate(new Date(invoicedAt))}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs"
            onClick={() => setModalOpen(true)}
          >
            <Plus size={14} />
            Adicionar
          </Button>
        </div>

        {/* Summary Cards */}
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="text-gh-text-secondary h-5 w-5 animate-spin" />
          </div>
        ) : summary ? (
          <>
            <div className="mb-4 grid grid-cols-3 gap-3">
              <SummaryItem
                icon={<TrendingUp size={14} className="text-green-500" />}
                label="Receitas"
                value={formatCurrency(summary.totalIncome)}
                valueClass="text-green-600 dark:text-green-400"
              />
              <SummaryItem
                icon={<TrendingDown size={14} className="text-red-500" />}
                label="Despesas"
                value={formatCurrency(summary.totalExpense)}
                valueClass="text-red-600 dark:text-red-400"
              />
              <SummaryItem
                icon={<DollarSign size={14} className="text-blue-500" />}
                label="Saldo"
                value={formatCurrency(summary.balance)}
                valueClass={
                  summary.balance >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }
              />
            </div>

            {/* Botão Faturar — apenas para root com despesas */}
            {canInvoice && (
              <div className="mb-4">
                <Button
                  onClick={() => setInvoiceModalOpen(true)}
                  className="w-full gap-2 bg-blue-600 text-white hover:bg-blue-700"
                  size="sm"
                >
                  <FileCheck size={16} />
                  Faturar Processo — {formatCurrency(summary.totalExpense + summary.totalIncome)}
                </Button>
              </div>
            )}

            <Separator className="mb-4" />
          </>
        ) : null}

        {/* Entry List */}
        {!isLoading && entries.length > 0 ? (
          <div className="space-y-2">
            {entries.map((entry) => (
              <EntryItem
                key={entry.id}
                entry={entry}
                currentProcessId={currentProcessId}
                onArchive={() => handleArchive(entry.id)}
                isArchiving={isArchiving}
              />
            ))}
          </div>
        ) : !isLoading ? (
          <p className="text-gh-text-secondary py-4 text-center text-sm">
            Nenhum lançamento financeiro vinculado.
          </p>
        ) : null}
      </div>

      {/* Modal: Adicionar Lançamento */}
      <AddEntryModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        workspaceId={workspaceId}
        processId={processId}
        onCreated={handleCreated}
      />

      {/* Modal: Faturar Processo */}
      {canInvoice && (
        <InvoiceModal
          open={invoiceModalOpen}
          onOpenChange={setInvoiceModalOpen}
          workspaceId={workspaceId}
          processId={processId}
          totalExpense={summary.totalExpense}
          totalIncome={summary.totalIncome}
          onInvoiced={handleCreated}
        />
      )}

      {/* Modal: Itens Arquivados */}
      <ArchivedEntriesModal
        open={archivedModalOpen}
        onOpenChange={setArchivedModalOpen}
        entries={archivedEntries}
        currentProcessId={currentProcessId}
        onRestore={handleRestore}
        isRestoring={isArchiving}
      />
    </div>
  )
}

// ─── SUB-COMPONENTS ─────────────────────────────────────────

function SummaryItem({
  icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ReactNode
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="bg-gh-canvas border-gh-border rounded-md border p-3">
      <div className="mb-1 flex items-center gap-1.5">
        {icon}
        <span className="text-gh-text-secondary text-xs">{label}</span>
      </div>
      <p className={`text-sm font-semibold ${valueClass || 'text-gh-text'}`}>{value}</p>
    </div>
  )
}

function EntryItem({
  entry,
  currentProcessId,
  onArchive,
  isArchiving,
}: {
  entry: ProcessFinanceEntry
  currentProcessId: string
  onArchive?: () => void
  isArchiving?: boolean
}) {
  const router = useRouter()
  const isIncome = entry.transactionType === 'INCOME'
  const isSubprocess = entry.processId !== currentProcessId

  return (
    <div className="bg-gh-canvas border-gh-border group flex items-center gap-3 rounded-md border p-3">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isIncome
            ? 'bg-green-100 dark:bg-green-900/30'
            : 'bg-red-100 dark:bg-red-900/30'
        }`}
      >
        {isIncome ? (
          <ArrowUpCircle size={14} className="text-green-600 dark:text-green-400" />
        ) : (
          <ArrowDownCircle size={14} className="text-red-600 dark:text-red-400" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-gh-text truncate text-sm font-medium">
          {entry.description || (isIncome ? 'Receita' : 'Despesa')}
        </p>
        <p className="text-gh-text-secondary text-xs">
          {isSubprocess && (
            <>
              <button
                type="button"
                className="cursor-pointer font-medium text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
                onClick={() => router.push(`/processos/${entry.processId}`)}
              >
                Subprocesso
              </button>
              {' · '}
            </>
          )}
          {isIncome ? 'Entrada' : 'Saída'}
          {entry.dueDate && ` · Vencimento: ${formatDate(entry.dueDate)}`}
        </p>
      </div>
      <span
        className={`shrink-0 text-sm font-semibold ${
          isIncome
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400'
        }`}
      >
        {isIncome ? '+' : '-'} {formatCurrency(Number(entry.amount))}
      </span>
      {onArchive && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                disabled={isArchiving}
                onClick={onArchive}
                className="text-gh-text-secondary hover:text-amber-600 dark:hover:text-amber-400 shrink-0 rounded-md p-1 opacity-0 transition-all group-hover:opacity-100 hover:bg-amber-100 dark:hover:bg-amber-900/30 disabled:opacity-50"
              >
                <Archive size={14} />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Arquivar lançamento</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  )
}

// ─── MODAL: ADICIONAR LANÇAMENTO ────────────────────────────

function AddEntryModal({
  open,
  onOpenChange,
  workspaceId,
  processId,
  onCreated,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
  processId: string
  onCreated: () => void
}) {
  const [transactionType, setTransactionType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE')
  const [amount, setAmount] = useState(0)
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date())

  const { mutate: createEntry, isPending } = useCreateProcessoTransaction()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (amount <= 0) return

    const payload: CreateProcessFinanceEntryPayload = {
      transactionType,
      amount,
      description: description || undefined,
      dueDate: dueDate ? dueDate.toISOString().split('T')[0] : undefined,
    }

    createEntry(
      { workspaceId, processId, payload },
      {
        onSuccess: () => {
          onCreated()
          onOpenChange(false)
          setTransactionType('EXPENSE')
          setAmount(0)
          setDescription('')
          setDueDate(new Date())
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Lançamento Financeiro</DialogTitle>
          <DialogDescription>
            Registrar uma receita ou despesa interna deste processo.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo */}
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              value={transactionType}
              onValueChange={(v) => setTransactionType(v as 'INCOME' | 'EXPENSE')}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXPENSE">
                  <span className="flex items-center gap-2">
                    <ArrowDownCircle size={14} className="text-red-500" />
                    Despesa (Saída)
                  </span>
                </SelectItem>
                <SelectItem value="INCOME">
                  <span className="flex items-center gap-2">
                    <ArrowUpCircle size={14} className="text-green-500" />
                    Receita (Entrada)
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Valor */}
          <div className="space-y-2">
            <Label>Valor (R$)</Label>
            <InputNumber
              value={amount}
              onChange={setAmount}
              float
              mask="real"
              min={0}
              placeholder="R$ 0,00"
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input
              type="text"
              placeholder="Ex: Compra de peça, Mão de obra..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Data de vencimento */}
          <div className="space-y-2">
            <Label>Data de Vencimento</Label>
            <DatePicker
              value={dueDate}
              onValueChange={setDueDate}
              placeholder="Selecionar data"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending || amount <= 0}
              className={
                transactionType === 'INCOME'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : transactionType === 'INCOME' ? (
                <ArrowUpCircle className="mr-2 h-4 w-4" />
              ) : (
                <ArrowDownCircle className="mr-2 h-4 w-4" />
              )}
              {transactionType === 'INCOME' ? 'Registrar Receita' : 'Registrar Despesa'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── MODAL: FATURAR PROCESSO ────────────────────────────────

function InvoiceModal({
  open,
  onOpenChange,
  workspaceId,
  processId,
  totalExpense,
  totalIncome,
  onInvoiced,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  workspaceId: string
  processId: string
  totalExpense: number
  totalIncome: number
  onInvoiced: () => void
}) {
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [description, setDescription] = useState('')

  const { mutate: invoice, isPending } = useInvoiceProcessTree()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!dueDate) return

    invoice(
      {
        workspaceId,
        processId,
        payload: {
          dueDate: dueDate.toISOString().split('T')[0],
          description: description || undefined,
        },
      },
      {
        onSuccess: () => {
          onInvoiced()
          onOpenChange(false)
          setDueDate(undefined)
          setDescription('')
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck size={20} className="text-blue-500" />
            Faturar Processo
          </DialogTitle>
          <DialogDescription>
            Serão geradas transações reais no financeiro com as despesas e receitas de
            todo o processo e subprocessos. Informe a data de vencimento.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Resumo */}
          <div className="bg-gh-canvas border-gh-border rounded-md border p-4 space-y-3">
            <p className="text-gh-text-secondary mb-1 text-xs font-medium uppercase tracking-wide">
              Resumo a Faturar
            </p>
            {totalExpense > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gh-text-secondary">Despesas</span>
                <span className="text-lg font-bold text-red-600 dark:text-red-400">
                  {formatCurrency(totalExpense)}
                </span>
              </div>
            )}
            {totalIncome > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gh-text-secondary">Receitas</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(totalIncome)}
                </span>
              </div>
            )}
            <p className="text-gh-text-secondary mt-1 text-xs">
              Serão geradas transações reais no financeiro para despesas e receitas
            </p>
          </div>

          {/* Data de vencimento */}
          <div className="space-y-2">
            <Label>Data de Vencimento da Fatura</Label>
            <DatePicker
              value={dueDate}
              onValueChange={setDueDate}
              placeholder="Selecionar data de vencimento"
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label>Descrição (opcional)</Label>
            <Input
              type="text"
              placeholder="Ex: Faturamento conserto #123..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending || !dueDate}
              className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileCheck className="mr-2 h-4 w-4" />
              )}
              Gerar Fatura
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── MODAL: ITENS ARQUIVADOS ────────────────────────────────

function ArchivedEntriesModal({
  open,
  onOpenChange,
  entries,
  currentProcessId,
  onRestore,
  isRestoring,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  entries: ProcessFinanceEntry[]
  currentProcessId: string
  onRestore: (entryId: string) => void
  isRestoring: boolean
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History size={20} className="text-amber-500" />
            Lançamentos Arquivados
          </DialogTitle>
          <DialogDescription>
            {entries.length === 0
              ? 'Nenhum lançamento arquivado.'
              : `${entries.length} ${entries.length === 1 ? 'lançamento arquivado' : 'lançamentos arquivados'}. Você pode restaurá-los clicando no ícone de restaurar.`}
          </DialogDescription>
        </DialogHeader>

        {entries.length > 0 ? (
          <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {entries.map((entry) => {
              const isIncome = entry.transactionType === 'INCOME'
              const isSubprocess = entry.processId !== currentProcessId

              return (
                <div
                  key={entry.id}
                  className="bg-gh-canvas border-gh-border flex items-center gap-3 rounded-md border p-3 opacity-75"
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isIncome
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : 'bg-red-100 dark:bg-red-900/30'
                    }`}
                  >
                    {isIncome ? (
                      <ArrowUpCircle size={14} className="text-green-600 dark:text-green-400" />
                    ) : (
                      <ArrowDownCircle size={14} className="text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-gh-text truncate text-sm font-medium">
                      {entry.description || (isIncome ? 'Receita' : 'Despesa')}
                    </p>
                    <p className="text-gh-text-secondary text-xs">
                      {isSubprocess && 'Subprocesso · '}
                      {isIncome ? 'Entrada' : 'Saída'}
                      {entry.dueDate && ` · Vencimento: ${formatDate(entry.dueDate)}`}
                      {entry.archivedAt && ` · Arquivado em: ${formatDate(entry.archivedAt)}`}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-sm font-semibold ${
                      isIncome
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {isIncome ? '+' : '-'} {formatCurrency(Number(entry.amount))}
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          disabled={isRestoring}
                          onClick={() => onRestore(entry.id)}
                          className="text-gh-text-secondary hover:text-blue-600 dark:hover:text-blue-400 shrink-0 rounded-md p-1 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-50"
                        >
                          <RotateCcw size={14} />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Restaurar lançamento</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-gh-text-secondary flex flex-col items-center justify-center py-8">
            <Archive size={32} className="mb-2 opacity-40" />
            <p className="text-sm">Nenhum item arquivado</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
