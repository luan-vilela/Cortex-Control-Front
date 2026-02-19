'use client'

import {
  type FinanceiroTransaction,
  InstallmentPlanType,
  PaymentMode,
  RecurrenceType,
  TransactionActorType,
  TransactionType,
} from '../types'

import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  CreditCard,
  FileText,
  Info,
  Mail,
  MapPin,
  Percent,
  Phone,
  Repeat,
  Users,
} from 'lucide-react'

import { formatCurrency, formatDate } from '@/lib/utils'

import { SourceBadge } from './SourceBadge'
import { StatusBadge } from './StatusBadge'

// --- Label Maps ---

const partyTypeLabels: Record<TransactionActorType, string> = {
  [TransactionActorType.INCOME]: 'Entrada',
  [TransactionActorType.EXPENSE]: 'Saída',
}

const paymentModeLabels: Record<PaymentMode, string> = {
  [PaymentMode.CASH]: 'À Vista',
  [PaymentMode.INSTALLMENT]: 'Parcelado',
}

const planTypeLabels: Record<InstallmentPlanType, string> = {
  [InstallmentPlanType.SIMPLE]: 'Parcelamento Simples',
  [InstallmentPlanType.SAC]: 'SAC (Amortização Constante)',
  [InstallmentPlanType.PRICE_TABLE]: 'Tabela Price',
}

const recurrenceTypeLabels: Record<RecurrenceType, string> = {
  [RecurrenceType.DAILY]: 'Diário',
  [RecurrenceType.WEEKLY]: 'Semanal',
  [RecurrenceType.MONTHLY]: 'Mensal',
  [RecurrenceType.YEARLY]: 'Anual',
}

// --- Helper Components ---

function SectionCard({
  icon: Icon,
  title,
  badge,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  badge?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="border-gh-border bg-gh-card overflow-hidden rounded-xl border">
      <div className="border-gh-border flex items-center justify-between border-b px-5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="bg-gh-hover flex h-7 w-7 items-center justify-center rounded-lg">
            <Icon className="text-gh-text-secondary h-3.5 w-3.5" />
          </div>
          <h3 className="text-gh-text text-sm font-semibold">{title}</h3>
        </div>
        {badge}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-gh-text-secondary mb-0.5 text-[11px] font-medium uppercase tracking-wider">
        {label}
      </p>
      <div className="text-gh-text text-sm font-medium">{value}</div>
    </div>
  )
}

function QuickStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border-gh-border bg-gh-card rounded-xl border px-4 py-3 text-center">
      <p className="text-gh-text-secondary mb-1 text-[11px] font-medium uppercase tracking-wider">
        {label}
      </p>
      <div className="text-gh-text text-sm font-semibold">{value}</div>
    </div>
  )
}

function TimelineItem({
  label,
  date,
  sub,
  color = 'default',
}: {
  label: string
  date: string
  sub?: string
  color?: 'default' | 'emerald' | 'amber'
}) {
  const dotColors = {
    default: 'bg-gh-text-secondary/50',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
  }

  return (
    <div className="flex items-start gap-3">
      <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dotColors[color]}`} />
      <div>
        <p className="text-gh-text-secondary text-[11px] font-medium uppercase tracking-wider">
          {label}
        </p>
        <p className="text-gh-text text-sm font-medium">{date}</p>
        {sub && <p className="text-gh-text-secondary text-xs">{sub}</p>}
      </div>
    </div>
  )
}

// --- Main Component ---

export function TransactionDetail({
  transaction,
}: {
  transaction: FinanceiroTransaction
}) {
  const isIncome = transaction.transactionType === TransactionType.INCOME
  const hasInstallment = !!(transaction.installmentNumber && transaction.installmentTotal)
  const parties = transaction.parties || []

  return (
    <div className="space-y-6">
      {/* ===== HERO SECTION ===== */}
      <div className="border-gh-border bg-gh-card rounded-xl border p-6 text-center sm:p-8">
        <div className="mb-4 inline-flex">
          <div
            className={`rounded-2xl p-4 ${
              isIncome
                ? 'bg-emerald-50 dark:bg-emerald-900/20'
                : 'bg-red-50 dark:bg-red-900/20'
            }`}
          >
            {isIncome ? (
              <ArrowDownLeft className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <ArrowUpRight className="h-7 w-7 text-red-600 dark:text-red-400" />
            )}
          </div>
        </div>

        <p
          className={`text-4xl font-bold tracking-tight sm:text-5xl ${
            isIncome
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-red-600 dark:text-red-400'
          }`}
        >
          {isIncome ? '+' : '−'} {formatCurrency(Number(transaction.amount))}
        </p>

        {transaction.originalAmount &&
          transaction.originalAmount !== transaction.amount && (
            <p className="text-gh-text-secondary mt-1.5 text-sm line-through">
              Original: {formatCurrency(Number(transaction.originalAmount))}
            </p>
          )}

        <h2 className="text-gh-text mt-3 text-lg font-semibold">
          {transaction.description}
        </h2>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <StatusBadge status={transaction.status} showIcon />
          <SourceBadge sourceType={transaction.sourceType} showIcon />
          {hasInstallment && (
            <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
              Parcela {transaction.installmentNumber}/{transaction.installmentTotal}
            </span>
          )}
        </div>
      </div>

      {/* ===== QUICK STATS ===== */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <QuickStat
          label="Vencimento"
          value={formatDate(new Date(transaction.dueDate))}
        />
        <QuickStat label="Tipo" value={isIncome ? 'Entrada' : 'Saída'} />
        <QuickStat
          label="Pagamento"
          value={
            transaction.paidDate ? (
              <span className="text-emerald-600 dark:text-emerald-400">
                {formatDate(new Date(transaction.paidDate))}
              </span>
            ) : (
              <span className="text-gh-text-secondary">—</span>
            )
          }
        />
        <QuickStat
          label="Criado em"
          value={formatDate(new Date(transaction.createdAt))}
        />
      </div>

      {/* ===== MAIN CONTENT GRID ===== */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* --- Left Column (2/3) --- */}
        <div className="space-y-6 lg:col-span-2">
          {/* Source Details */}
          <SectionCard icon={FileText} title="Detalhes da Origem">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InfoItem
                  label="Origem"
                  value={<SourceBadge sourceType={transaction.sourceType} showIcon />}
                />
                {transaction.sourceId && (
                  <InfoItem
                    label="ID da Origem"
                    value={
                      <span className="font-mono text-xs">{transaction.sourceId}</span>
                    }
                  />
                )}
                {transaction.orderNumber && (
                  <InfoItem label="Nº do Pedido" value={transaction.orderNumber} />
                )}
                {transaction.createdBy && (
                  <InfoItem label="Criado por" value={transaction.createdBy} />
                )}
              </div>

              {/* Installment Details */}
              {hasInstallment && (
                <div className="border-gh-border border-t pt-4">
                  <p className="text-gh-text-secondary mb-3 text-[11px] font-semibold uppercase tracking-wider">
                    Parcelamento
                  </p>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <InfoItem
                      label="Parcela"
                      value={`${transaction.installmentNumber}/${transaction.installmentTotal}`}
                    />
                    {transaction.installmentInterest !== undefined &&
                      transaction.installmentInterest > 0 && (
                        <InfoItem
                          label="Juros"
                          value={formatCurrency(transaction.installmentInterest)}
                        />
                      )}
                    {transaction.installmentAmortization !== undefined && (
                      <InfoItem
                        label="Amortização"
                        value={formatCurrency(transaction.installmentAmortization)}
                      />
                    )}
                    {transaction.outstandingBalance !== undefined && (
                      <InfoItem
                        label="Saldo Devedor"
                        value={formatCurrency(transaction.outstandingBalance)}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Downpayment */}
              {transaction.isDownpayment && (
                <div className="border-gh-border border-t pt-4">
                  <p className="text-gh-text-secondary mb-3 text-[11px] font-semibold uppercase tracking-wider">
                    Entrada
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {transaction.originalAmount && (
                      <InfoItem
                        label="Valor Total"
                        value={formatCurrency(Number(transaction.originalAmount))}
                      />
                    )}
                    {transaction.installmentTotal && (
                      <InfoItem
                        label="Parcelas"
                        value={`${transaction.installmentTotal}x`}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Custom Metadata */}
              {transaction.sourceMetadata &&
                Object.keys(transaction.sourceMetadata).length > 0 && (
                  <details className="border-gh-border border-t pt-4">
                    <summary className="text-gh-text-secondary hover:text-gh-text cursor-pointer text-xs font-medium">
                      Metadados ({Object.keys(transaction.sourceMetadata).length} campos)
                    </summary>
                    <pre className="bg-gh-hover mt-2 overflow-auto rounded-lg p-3 text-xs">
                      {JSON.stringify(transaction.sourceMetadata, null, 2)}
                    </pre>
                  </details>
                )}
            </div>
          </SectionCard>

          {/* Parties */}
          <SectionCard
            icon={Users}
            title="Partes Envolvidas"
            badge={
              parties.length > 0 ? (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {parties.length}
                </span>
              ) : undefined
            }
          >
            {parties.length === 0 ? (
              <div className="text-gh-text-secondary py-6 text-center text-sm">
                <Users className="mx-auto mb-2 h-6 w-6 opacity-40" />
                <p>Nenhuma parte envolvida</p>
              </div>
            ) : (
              <div className="space-y-3">
                {parties.map((party) => {
                  const metadata = party.partyMetadata || {}
                  const user = party.user
                  const displayName = metadata.name || user?.name || 'Sistema'
                  const displayEmail = metadata.email || user?.email
                  const displayPhone = metadata.phone
                  const initials = displayName
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase()

                  return (
                    <div
                      key={party.id}
                      className="border-gh-border hover:border-gh-text-secondary/30 rounded-lg border p-4 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            party.partyType === TransactionActorType.INCOME
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                          }`}
                        >
                          {initials}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-gh-text truncate font-semibold">
                              {displayName}
                            </p>
                            {party.partyStatus && (
                              <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                                {party.partyStatus}
                              </span>
                            )}
                          </div>

                          <p className="text-gh-text-secondary text-xs">
                            {party.partyType && partyTypeLabels[party.partyType]}
                            {metadata.personType &&
                              ` • ${metadata.personType === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}`}
                          </p>

                          {/* Contact Row */}
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                            {metadata.document && (
                              <span className="text-gh-text-secondary inline-flex items-center gap-1 text-xs">
                                📄 {metadata.document}
                              </span>
                            )}
                            {displayEmail && (
                              <a
                                href={`mailto:${displayEmail}`}
                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400"
                              >
                                <Mail className="h-3 w-3" />
                                {displayEmail}
                              </a>
                            )}
                            {displayPhone && (
                              <a
                                href={`tel:${displayPhone}`}
                                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline dark:text-blue-400"
                              >
                                <Phone className="h-3 w-3" />
                                {displayPhone}
                              </a>
                            )}
                            {metadata.address && (
                              <span className="text-gh-text-secondary inline-flex items-center gap-1 text-xs">
                                <MapPin className="h-3 w-3" />
                                {metadata.address}
                              </span>
                            )}
                          </div>

                          {/* Extra metadata */}
                          {Object.keys(metadata).length > 0 && (
                            <details className="mt-2">
                              <summary className="text-gh-text-secondary hover:text-gh-text cursor-pointer text-[11px]">
                                Mais detalhes ({Object.keys(metadata).length} campos)
                              </summary>
                              <div className="bg-gh-hover border-gh-border mt-1.5 overflow-auto rounded border p-2">
                                <table className="w-full text-[11px]">
                                  <tbody>
                                    {Object.entries(metadata).map(([key, value]) => (
                                      <tr
                                        key={key}
                                        className="border-gh-border border-b last:border-0"
                                      >
                                        <td className="text-gh-text-secondary py-1 pr-2 font-medium">
                                          {key}
                                        </td>
                                        <td className="text-gh-text py-1">
                                          {typeof value === 'object'
                                            ? JSON.stringify(value)
                                            : String(value)}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </details>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </SectionCard>

          {/* Notes */}
          {transaction.notes && (
            <SectionCard icon={Info} title="Observações">
              <p className="text-gh-text text-sm leading-relaxed whitespace-pre-wrap">
                {transaction.notes}
              </p>
            </SectionCard>
          )}
        </div>

        {/* --- Right Column (1/3) --- */}
        <div className="space-y-6">
          {/* Timeline */}
          <SectionCard icon={Calendar} title="Linha do Tempo">
            <div className="space-y-4">
              <TimelineItem
                label="Vencimento"
                date={formatDate(new Date(transaction.dueDate))}
                color="amber"
              />
              {transaction.paidDate && (
                <TimelineItem
                  label="Pagamento"
                  date={formatDate(new Date(transaction.paidDate))}
                  color="emerald"
                />
              )}
              <TimelineItem
                label="Criado"
                date={formatDate(new Date(transaction.createdAt))}
                sub={transaction.createdBy ? `por ${transaction.createdBy}` : undefined}
              />
              <TimelineItem
                label="Atualizado"
                date={formatDate(new Date(transaction.updatedAt))}
              />
            </div>
          </SectionCard>

          {/* Payment Config */}
          {transaction.paymentConfig && (
            <SectionCard icon={CreditCard} title="Forma de Pagamento">
              <div className="space-y-4">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {paymentModeLabels[transaction.paymentConfig.mode]}
                </span>

                {transaction.paymentConfig.mode === PaymentMode.INSTALLMENT &&
                  transaction.installmentPlan && (
                    <div className="grid grid-cols-2 gap-3">
                      <InfoItem
                        label="Parcelas"
                        value={`${transaction.installmentPlan.numberOfInstallments}x`}
                      />
                      <InfoItem
                        label="Plano"
                        value={planTypeLabels[transaction.installmentPlan.planType]}
                      />
                      {transaction.installmentPlan.downPayment && (
                        <InfoItem
                          label="Entrada"
                          value={formatCurrency(
                            Number(transaction.installmentPlan.downPayment)
                          )}
                        />
                      )}
                      <InfoItem
                        label="1ª Parcela"
                        value={formatDate(
                          new Date(transaction.installmentPlan.firstInstallmentDate)
                        )}
                      />
                      <InfoItem
                        label="Intervalo"
                        value={`${transaction.installmentPlan.installmentIntervalDays} dias`}
                      />
                    </div>
                  )}
              </div>
            </SectionCard>
          )}

          {/* Interest Config */}
          {transaction.interestConfig && (
            <SectionCard icon={Percent} title="Juros e Multas">
              <div className="grid grid-cols-2 gap-3">
                {transaction.interestConfig.percentage && (
                  <InfoItem
                    label="Juros (%)"
                    value={`${transaction.interestConfig.percentage}%`}
                  />
                )}
                {transaction.interestConfig.flatAmount && (
                  <InfoItem
                    label="Valor Fixo"
                    value={formatCurrency(Number(transaction.interestConfig.flatAmount))}
                  />
                )}
                {transaction.interestConfig.penaltyPercentage && (
                  <InfoItem
                    label="Multa (%)"
                    value={`${transaction.interestConfig.penaltyPercentage}%`}
                  />
                )}
                {transaction.interestConfig.interestPercentage && (
                  <InfoItem
                    label="Mora (%)"
                    value={`${transaction.interestConfig.interestPercentage}% ${
                      transaction.interestConfig.interestPeriod === 'MONTHLY'
                        ? 'ao mês'
                        : 'ao ano'
                    }`}
                  />
                )}
              </div>
              {transaction.interestConfig.description && (
                <div className="border-gh-border mt-3 border-t pt-3">
                  <InfoItem
                    label="Descrição"
                    value={transaction.interestConfig.description}
                  />
                </div>
              )}
            </SectionCard>
          )}

          {/* Recurrence Config */}
          {transaction.recurrenceConfig && (
            <SectionCard icon={Repeat} title="Recorrência">
              <div className="space-y-3">
                <InfoItem
                  label="Frequência"
                  value={recurrenceTypeLabels[transaction.recurrenceConfig.recurrenceType]}
                />
                {transaction.recurrenceConfig.recurrenceOccurrences && (
                  <InfoItem
                    label="Ocorrências"
                    value={`${transaction.recurrenceConfig.recurrenceOccurrences}x`}
                  />
                )}
                {transaction.recurrenceConfig.recurrenceEndDate && (
                  <InfoItem
                    label="Data Final"
                    value={formatDate(
                      new Date(transaction.recurrenceConfig.recurrenceEndDate)
                    )}
                  />
                )}
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  )
}
