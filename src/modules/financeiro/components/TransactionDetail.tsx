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
  Calendar,
  Clock,
  CreditCard,
  FileText,
  Info,
  Percent,
  Receipt,
  Repeat,
  TrendingDown,
  TrendingUp,
  User,
  Users,
} from 'lucide-react'

import { formatCurrency, formatDate } from '@/lib/utils'

import { SourceBadge } from './SourceBadge'
import { StatusBadge } from './StatusBadge'

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

export function TransactionDetail({ transaction }: { transaction: FinanceiroTransaction }) {
  const isIncome = transaction.transactionType === TransactionType.INCOME

  return (
    <div className="space-y-6">
      {/* Header com Tipo e Status */}
      <div className="border-gh-border flex items-start justify-between border-b pb-6">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            {isIncome ? (
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            ) : (
              <div className="rounded-full bg-red-100 p-2 dark:bg-red-900/30">
                <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            )}
            <div>
              <h1 className="text-gh-text text-2xl font-bold">{transaction.description}</h1>
              <p className="text-gh-text-secondary mt-1 text-sm">
                Transação #{transaction.id} • {isIncome ? 'Entrada' : 'Saída'}
              </p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-3xl font-bold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(Number(transaction.amount))}
          </p>
          {transaction.originalAmount && transaction.originalAmount !== transaction.amount && (
            <p className="text-gh-text-secondary mt-1 text-xs">
              Original: {formatCurrency(Number(transaction.originalAmount))}
            </p>
          )}
          <div className="mt-3">
            <StatusBadge status={transaction.status} showIcon={true} />
          </div>
        </div>
      </div>

      {/* Grid de Informações Principais */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Origem */}
        <div className="border-gh-border bg-gh-card hover:border-gh-text-secondary rounded-lg border p-5 transition-colors">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="text-gh-text-secondary h-4 w-4" />
            <p className="text-gh-text-secondary text-xs font-semibold tracking-wide uppercase">
              Origem
            </p>
          </div>
          <div className="mb-3">
            <SourceBadge sourceType={transaction.sourceType} showIcon={true} />
          </div>
          <div className="space-y-2">
            <p className="text-gh-text text-sm">
              <span className="font-medium">ID da Origem:</span> {transaction.sourceId}
            </p>
            {transaction.orderNumber && (
              <p className="text-gh-text text-sm">
                <span className="font-medium">Número do Pedido:</span> {transaction.orderNumber}
              </p>
            )}
            {/* Informações de parcelamento */}
            {transaction.installmentNumber && transaction.installmentTotal && (
              <div className="border-gh-border mt-3 border-t pt-3">
                <p className="text-gh-text text-sm">
                  <span className="font-medium">Parcela:</span> {transaction.installmentNumber}/
                  {transaction.installmentTotal}
                </p>
                {transaction.installmentInterest !== undefined &&
                  transaction.installmentInterest > 0 && (
                    <p className="text-gh-text text-sm">
                      <span className="font-medium">Juros:</span>{' '}
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(transaction.installmentInterest)}
                    </p>
                  )}
                {transaction.installmentAmortization !== undefined && (
                  <p className="text-gh-text text-sm">
                    <span className="font-medium">Amortização:</span>{' '}
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      transaction.installmentAmortization
                    )}
                  </p>
                )}
                {transaction.outstandingBalance !== undefined && (
                  <p className="text-gh-text text-sm">
                    <span className="font-medium">Saldo Devedor:</span>{' '}
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      transaction.outstandingBalance
                    )}
                  </p>
                )}
              </div>
            )}
            {/* Entrada (downpayment) */}
            {transaction.isDownpayment && (
              <div className="border-gh-border mt-3 border-t pt-3">
                <p className="text-gh-text-secondary text-xs font-semibold">ENTRADA</p>
                {transaction.originalAmount && (
                  <p className="text-gh-text text-sm">
                    <span className="font-medium">Valor Total:</span>{' '}
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      transaction.originalAmount
                    )}
                  </p>
                )}
                {transaction.installmentTotal && (
                  <p className="text-gh-text text-sm">
                    <span className="font-medium">Parcelas:</span> {transaction.installmentTotal}x
                  </p>
                )}
              </div>
            )}
            {transaction.sourceMetadata && Object.keys(transaction.sourceMetadata).length > 0 && (
              <details className="mt-3">
                <summary className="text-gh-text-secondary hover:text-gh-text cursor-pointer text-xs">
                  Ver metadados customizados
                </summary>
                <pre className="bg-gh-hover mt-2 overflow-auto rounded p-2 text-xs">
                  {JSON.stringify(transaction.sourceMetadata, null, 2)}
                </pre>
              </details>
            )}
          </div>
        </div>

        {/* Datas */}
        <div className="border-gh-border bg-gh-card hover:border-gh-text-secondary rounded-lg border p-5 transition-colors">
          <div className="mb-4 flex items-center gap-2">
            <Calendar className="text-gh-text-secondary h-4 w-4" />
            <p className="text-gh-text-secondary text-xs font-semibold tracking-wide uppercase">
              Datas
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Clock className="text-gh-text-secondary mt-0.5 h-4 w-4" />
              <div>
                <p className="text-gh-text-secondary text-xs">Vencimento</p>
                <p className="text-gh-text text-sm font-medium">
                  {formatDate(new Date(transaction.dueDate))}
                </p>
              </div>
            </div>
            {transaction.paidDate && (
              <div className="flex items-start gap-2">
                <Receipt className="mt-0.5 h-4 w-4 text-green-600" />
                <div>
                  <p className="text-gh-text-secondary text-xs">Pagamento</p>
                  <p className="text-sm font-medium text-green-600">
                    {formatDate(new Date(transaction.paidDate))}
                  </p>
                </div>
              </div>
            )}
            <div className="border-gh-border space-y-2 border-t pt-3">
              <div>
                <p className="text-gh-text-secondary mb-1 text-xs">Criado em</p>
                <p className="text-gh-text text-sm">
                  {formatDate(new Date(transaction.createdAt))}
                </p>
                {transaction.createdBy && (
                  <p className="text-gh-text-secondary mt-1 text-xs">
                    por <span className="text-gh-text font-medium">{transaction.createdBy}</span>
                  </p>
                )}
                {transaction.sourceType && (
                  <p className="text-gh-text-secondary mt-1 text-xs">
                    via <span className="text-gh-text font-medium">{transaction.sourceType}</span>
                  </p>
                )}
              </div>
              <div>
                <p className="text-gh-text-secondary text-xs">
                  Atualizado em {formatDate(new Date(transaction.updatedAt))}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forma de Pagamento */}
      {transaction.paymentConfig && (
        <div className="border-gh-border bg-gh-card hover:border-gh-text-secondary rounded-lg border p-5 transition-colors">
          <div className="mb-4 flex items-center gap-2">
            <CreditCard className="text-gh-text-secondary h-4 w-4" />
            <p className="text-gh-text-secondary text-xs font-semibold tracking-wide uppercase">
              Forma de Pagamento
            </p>
          </div>
          <div className="mb-3 flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              {paymentModeLabels[transaction.paymentConfig.mode]}
            </span>
          </div>
          {transaction.paymentConfig.mode === PaymentMode.INSTALLMENT &&
            transaction.installmentPlan && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gh-text-secondary text-xs">Parcelas</p>
                  <p className="text-gh-text text-sm font-medium">
                    {transaction.installmentPlan.numberOfInstallments}x
                  </p>
                </div>
                <div>
                  <p className="text-gh-text-secondary text-xs">Tipo de Plano</p>
                  <p className="text-gh-text text-sm font-medium">
                    {planTypeLabels[transaction.installmentPlan.planType]}
                  </p>
                </div>
                {transaction.installmentPlan.downPayment && (
                  <div>
                    <p className="text-gh-text-secondary text-xs">Entrada</p>
                    <p className="text-gh-text text-sm font-medium">
                      {formatCurrency(Number(transaction.installmentPlan.downPayment))}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-gh-text-secondary text-xs">Primeira Parcela</p>
                  <p className="text-gh-text text-sm font-medium">
                    {formatDate(new Date(transaction.installmentPlan.firstInstallmentDate))}
                  </p>
                </div>
                <div>
                  <p className="text-gh-text-secondary text-xs">Intervalo</p>
                  <p className="text-gh-text text-sm font-medium">
                    {transaction.installmentPlan.installmentIntervalDays} dias
                  </p>
                </div>
              </div>
            )}
        </div>
      )}

      {/* Juros e Taxas */}
      {transaction.interestConfig && (
        <div className="border-gh-border bg-gh-card hover:border-gh-text-secondary rounded-lg border p-5 transition-colors">
          <div className="mb-4 flex items-center gap-2">
            <Percent className="text-gh-text-secondary h-4 w-4" />
            <p className="text-gh-text-secondary text-xs font-semibold tracking-wide uppercase">
              Juros e Multas
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {transaction.interestConfig.percentage && (
              <div>
                <p className="text-gh-text-secondary text-xs">Juros (%)</p>
                <p className="text-gh-text text-sm font-medium">
                  {transaction.interestConfig.percentage}%
                </p>
              </div>
            )}
            {transaction.interestConfig.flatAmount && (
              <div>
                <p className="text-gh-text-secondary text-xs">Valor Fixo</p>
                <p className="text-gh-text text-sm font-medium">
                  {formatCurrency(Number(transaction.interestConfig.flatAmount))}
                </p>
              </div>
            )}
            {transaction.interestConfig.penaltyPercentage && (
              <div>
                <p className="text-gh-text-secondary text-xs">Multa (%)</p>
                <p className="text-gh-text text-sm font-medium">
                  {transaction.interestConfig.penaltyPercentage}%
                </p>
              </div>
            )}
            {transaction.interestConfig.interestPercentage && (
              <div>
                <p className="text-gh-text-secondary text-xs">Mora (%)</p>
                <p className="text-gh-text text-sm font-medium">
                  {transaction.interestConfig.interestPercentage}%{' '}
                  {transaction.interestConfig.interestPeriod === 'MONTHLY' ? 'ao mês' : 'ao ano'}
                </p>
              </div>
            )}
          </div>
          {transaction.interestConfig.description && (
            <div className="border-gh-border mt-3 border-t pt-3">
              <p className="text-gh-text-secondary text-xs">Descrição</p>
              <p className="text-gh-text mt-1 text-sm">{transaction.interestConfig.description}</p>
            </div>
          )}
        </div>
      )}

      {/* Recorrência */}
      {transaction.recurrenceConfig && (
        <div className="border-gh-border bg-gh-card hover:border-gh-text-secondary rounded-lg border p-5 transition-colors">
          <div className="mb-4 flex items-center gap-2">
            <Repeat className="text-gh-text-secondary h-4 w-4" />
            <p className="text-gh-text-secondary text-xs font-semibold tracking-wide uppercase">
              Recorrência
            </p>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-gh-text-secondary text-xs">Frequência</p>
              <p className="text-gh-text text-sm font-medium">
                {recurrenceTypeLabels[transaction.recurrenceConfig.recurrenceType]}
              </p>
            </div>
            {transaction.recurrenceConfig.recurrenceOccurrences && (
              <div>
                <p className="text-gh-text-secondary text-xs">Ocorrências</p>
                <p className="text-gh-text text-sm font-medium">
                  {transaction.recurrenceConfig.recurrenceOccurrences}x
                </p>
              </div>
            )}
            {transaction.recurrenceConfig.recurrenceEndDate && (
              <div>
                <p className="text-gh-text-secondary text-xs">Data Final</p>
                <p className="text-gh-text text-sm font-medium">
                  {formatDate(new Date(transaction.recurrenceConfig.recurrenceEndDate))}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Partes Envolvidas */}
      <div className="border-gh-border bg-gh-card hover:border-gh-text-secondary rounded-lg border p-5 transition-colors">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="text-gh-text-secondary h-4 w-4" />
            <p className="text-gh-text-secondary text-xs font-semibold tracking-wide uppercase">
              Partes Envolvidas
            </p>
          </div>
          <span className="text-gh-text-secondary rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium dark:bg-blue-900/30">
            {transaction.parties.length} {transaction.parties.length === 1 ? 'parte' : 'partes'}
          </span>
        </div>
        <div className="space-y-3">
          {transaction.parties.map((party) => {
            const metadata = party.partyMetadata || {}
            const user = party.user

            // Prioridade: metadata.name > user.name > 'Sistema'
            const displayName = metadata.name || user?.name || 'Sistema'
            const displayEmail = metadata.email || user?.email
            const displayPhone = metadata.phone
            const createdVia = user?.createdVia

            const hasExtendedInfo =
              metadata.document || displayEmail || displayPhone || metadata.personType || user

            return (
              <div
                key={party.id}
                className="border-gh-border dark:bg-gh-hover hover:border-gh-text-secondary rounded-lg border bg-white p-4 transition-all hover:shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-1 items-start gap-3">
                    <div
                      className={`rounded-full p-2.5 ${
                        party.partyType === TransactionActorType.INCOME
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : 'bg-red-100 dark:bg-red-900/30'
                      }`}
                    >
                      <User
                        className={`h-5 w-5 ${
                          party.partyType === TransactionActorType.INCOME
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <p className="text-gh-text truncate text-base font-semibold">
                          {displayName}
                        </p>
                        {party.partyStatus && (
                          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium whitespace-nowrap text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            {party.partyStatus}
                          </span>
                        )}
                      </div>

                      <p className="text-gh-text-secondary mb-3 text-xs font-medium">
                        {party.partyType && partyTypeLabels[party.partyType]}
                        {metadata.personType &&
                          ` • ${metadata.personType === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}`}
                      </p>

                      {/* Informações de Contato */}
                      {hasExtendedInfo && (
                        <div className="mt-3 space-y-2">
                          {metadata.document && (
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-gh-text-secondary font-medium">Documento:</span>
                              <span className="text-gh-text">{metadata.document}</span>
                            </div>
                          )}
                          {displayEmail && (
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-gh-text-secondary font-medium">E-mail:</span>
                              <a
                                href={`mailto:${displayEmail}`}
                                className="text-blue-600 hover:underline dark:text-blue-400"
                              >
                                {displayEmail}
                              </a>
                            </div>
                          )}
                          {displayPhone && (
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-gh-text-secondary font-medium">Telefone:</span>
                              <a
                                href={`tel:${displayPhone}`}
                                className="text-blue-600 hover:underline dark:text-blue-400"
                              >
                                {displayPhone}
                              </a>
                            </div>
                          )}
                          {metadata.address && (
                            <div className="flex items-start gap-2 text-xs">
                              <span className="text-gh-text-secondary font-medium whitespace-nowrap">
                                Endereço:
                              </span>
                              <span className="text-gh-text">{metadata.address}</span>
                            </div>
                          )}
                          {metadata.personId && (
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-gh-text-secondary font-medium">
                                ID Contato:
                              </span>
                              <span className="text-gh-text font-mono">{metadata.personId}</span>
                            </div>
                          )}

                          {createdVia && (
                            <div className="flex items-start gap-2 text-xs">
                              <span className="text-gh-text-secondary font-medium whitespace-nowrap">
                                Criado via:
                              </span>
                              <span className="text-gh-text">{createdVia}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Mostrar todos os outros metadados */}
                      {Object.keys(metadata).length > 0 && (
                        <details className="mt-3">
                          <summary className="text-gh-text-secondary hover:text-gh-text cursor-pointer text-xs font-medium">
                            📋 Ver todos os metadados ({Object.keys(metadata).length} campos)
                          </summary>
                          <div className="bg-gh-card border-gh-border mt-2 max-w-full overflow-auto rounded border p-3">
                            <table className="w-full text-xs">
                              <tbody>
                                {Object.entries(metadata).map(([key, value]) => (
                                  <tr key={key} className="border-gh-border border-b last:border-0">
                                    <td className="text-gh-text-secondary py-1.5 pr-3 align-top font-medium">
                                      {key}:
                                    </td>
                                    <td className="text-gh-text py-1.5">
                                      {typeof value === 'object'
                                        ? JSON.stringify(value, null, 2)
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
              </div>
            )
          })}
        </div>

        {transaction.parties.length === 0 && (
          <div className="text-gh-text-secondary py-8 text-center text-sm">
            <Users className="mx-auto mb-2 h-8 w-8 opacity-50" />
            <p>Nenhuma parte envolvida nesta transação</p>
          </div>
        )}
      </div>

      {/* Notas */}
      {transaction.notes && (
        <div className="border-gh-border bg-gh-card hover:border-gh-text-secondary rounded-lg border p-5 transition-colors">
          <div className="mb-4 flex items-center gap-2">
            <Info className="text-gh-text-secondary h-4 w-4" />
            <p className="text-gh-text-secondary text-xs font-semibold tracking-wide uppercase">
              Observações
            </p>
          </div>
          <p className="text-gh-text text-sm leading-relaxed whitespace-pre-wrap">
            {transaction.notes}
          </p>
        </div>
      )}
    </div>
  )
}
