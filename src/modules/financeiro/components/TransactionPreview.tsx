'use client'

import { PaymentMode, TransactionActorType } from '../types'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  Percent,
  Repeat,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
// Import necessário adicionado acima
import { AlertCircle } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import { type InfoBlockFormValues } from './info/infoBlock.types'
import { type InterestBlockFormValues, InterestType } from './interest/interestBlock.types'
import { type PaymentBlockFormValues } from './payment'
import { type RecurrenceBlockFormValues } from './recurrence/recurrenceBlock.types'

interface TransactionPreviewProps {
  partyType: TransactionActorType
  infoConfig: InfoBlockFormValues
  paymentConfig: PaymentBlockFormValues
  recurrenceConfig?: RecurrenceBlockFormValues
  interestConfig?: InterestBlockFormValues
  children: React.ReactNode
}

export function TransactionPreview({
  partyType,
  infoConfig,
  paymentConfig,
  recurrenceConfig,
  interestConfig,
  children,
}: TransactionPreviewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  // Função para calcular número de ocorrências baseado em data inicial e final
  const calculateOccurrencesByDate = (startDate: Date, endDate: Date, type: string): number => {
    let count = 0
    const current = new Date(startDate)
    const end = new Date(endDate)

    while (current <= end) {
      count++

      // Avançar para próxima data baseado no tipo
      if (type === 'DAILY') {
        current.setDate(current.getDate() + 1)
      } else if (type === 'WEEKLY') {
        current.setDate(current.getDate() + 7)
      } else if (type === 'BIWEEKLY') {
        current.setDate(current.getDate() + 14)
      } else if (type === 'MONTHLY') {
        current.setMonth(current.getMonth() + 1)
      } else if (type === 'QUARTERLY') {
        current.setMonth(current.getMonth() + 3)
      } else if (type === 'SEMIANNUAL') {
        current.setMonth(current.getMonth() + 6)
      } else if (type === 'ANNUAL') {
        current.setFullYear(current.getFullYear() + 1)
      }
    }

    return count
  }

  // Calcular valores
  const baseAmount = infoConfig.amount

  // Calcular ajuste de taxas/juros (Aba 1 - imediato)
  let adjustmentAmount = 0
  let adjustmentLabel = ''
  if (interestConfig?.type) {
    if (interestConfig.type === InterestType.PERCENTAGE && interestConfig.percentage) {
      adjustmentAmount = baseAmount * (interestConfig.percentage / 100)
      adjustmentLabel = `${interestConfig.percentage}%`
    } else if (interestConfig.type === InterestType.FLAT && interestConfig.flatAmount) {
      adjustmentAmount = interestConfig.flatAmount
      adjustmentLabel = formatCurrency(interestConfig.flatAmount)
    }
  }

  const totalAmount = baseAmount + adjustmentAmount

  // Calcular parcelas
  let installmentAmount = 0
  let downPaymentAmount = 0
  if (paymentConfig.mode === PaymentMode.INSTALLMENT && paymentConfig.numberOfInstallments) {
    downPaymentAmount = paymentConfig.downPayment || 0
    const remainingAmount = totalAmount - downPaymentAmount
    installmentAmount = remainingAmount / paymentConfig.numberOfInstallments
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto p-3 pb-12 sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {partyType === TransactionActorType.INCOME ? (
              <>
                <TrendingUp className="h-5 w-5 text-green-600" />
                Resumo da Entrada
              </>
            ) : (
              <>
                <TrendingDown className="h-5 w-5 text-red-600" />
                Resumo da Saída
              </>
            )}
          </SheetTitle>
          <SheetDescription>
            Visualize todos os detalhes da transação antes de criar
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Informações Básicas */}
          <div className="bg-card space-y-3 rounded-lg border p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <FileText className="h-4 w-4" />
              Informações Básicas
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Descrição:</span>
                <span className="font-medium">{infoConfig.description || '—'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Valor Base:</span>
                <span className="font-medium">{formatCurrency(baseAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Vencimento:</span>
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="h-3 w-3" />
                  {format(infoConfig.dueDate, 'dd/MM/yyyy', { locale: ptBR })}
                </span>
              </div>
              {infoConfig.notes && (
                <div className="border-t pt-2">
                  <p className="text-muted-foreground mb-1 text-xs">Observações:</p>
                  <p className="text-sm">{infoConfig.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Taxas e Ajustes */}
          {interestConfig?.type && (
            <div className="bg-card space-y-3 rounded-lg border p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Percent className="h-4 w-4" />
                Taxas e Ajustes
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tipo:</span>
                  <Badge variant="secondary">
                    {interestConfig.type === InterestType.PERCENTAGE ? 'Percentual' : 'Valor Fixo'}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Valor do Ajuste:</span>
                  <span className="font-medium text-blue-600">
                    {adjustmentLabel} = {formatCurrency(adjustmentAmount)}
                  </span>
                </div>
                {interestConfig.description && (
                  <div className="border-t pt-2">
                    <p className="text-muted-foreground mb-1 text-xs">Descrição:</p>
                    <p className="text-sm">{interestConfig.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Multa e Mora (se configurado) */}
          {(interestConfig?.penaltyPercentage || interestConfig?.interestPerMonth) && (
            <div className="space-y-3 rounded-lg border border-orange-200 bg-orange-50/50 p-4 dark:border-orange-900 dark:bg-orange-950/20">
              <div className="flex items-center gap-2 text-sm font-medium text-orange-700 dark:text-orange-400">
                <AlertCircle className="h-4 w-4" />
                Multa e Mora (Atraso)
              </div>
              <Separator className="bg-orange-200 dark:bg-orange-900" />
              <div className="space-y-2 text-sm">
                {interestConfig.penaltyPercentage && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Multa:</span>
                    <span className="font-medium">{interestConfig.penaltyPercentage} %</span>
                  </div>
                )}
                {interestConfig.interestPerMonth && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Juros ao Mês:</span>
                    <span className="font-medium">{interestConfig.interestPerMonth} %</span>
                  </div>
                )}
                <div className="border-t border-orange-200 pt-2 dark:border-orange-900">
                  <p className="text-muted-foreground text-xs italic">
                    * Valores aplicados apenas em caso de atraso no pagamento
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Forma de Pagamento */}
          <div className="bg-card space-y-3 rounded-lg border p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <CreditCard className="h-4 w-4" />
              Forma de Pagamento
            </div>
            <Separator />
            {paymentConfig.mode === PaymentMode.CASH ? (
              <div className="text-sm">
                <Badge variant="outline">À Vista</Badge>
                <p className="text-muted-foreground mt-2">
                  Pagamento integral na data de vencimento
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Forma:</span>
                  <Badge variant="outline">Parcelado</Badge>
                </div>
                {downPaymentAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Entrada:</span>
                    <span className="font-medium">{formatCurrency(downPaymentAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Parcelas:</span>
                  <span className="font-medium">
                    {paymentConfig.numberOfInstallments}x de {formatCurrency(installmentAmount)}
                  </span>
                </div>
                {paymentConfig.firstInstallmentDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">1ª Parcela:</span>
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="h-3 w-3" />
                      {format(paymentConfig.firstInstallmentDate, 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Intervalo:</span>
                  <span className="font-medium">{paymentConfig.installmentIntervalDays} dias</span>
                </div>
              </div>
            )}
          </div>

          {/* Recorrência */}
          {recurrenceConfig && recurrenceConfig.type && (
            <div className="bg-card space-y-3 rounded-lg border p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Repeat className="h-4 w-4" />
                Recorrência
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tipo:</span>
                  <Badge variant="secondary">
                    {recurrenceConfig.type === 'DAILY' && 'Diária'}
                    {recurrenceConfig.type === 'WEEKLY' && 'Semanal'}
                    {recurrenceConfig.type === 'BIWEEKLY' && 'Quinzenal'}
                    {recurrenceConfig.type === 'MONTHLY' && 'Mensal'}
                    {recurrenceConfig.type === 'QUARTERLY' && 'Trimestral'}
                    {recurrenceConfig.type === 'SEMIANNUAL' && 'Semestral'}
                    {recurrenceConfig.type === 'ANNUAL' && 'Anual'}
                  </Badge>
                </div>

                {recurrenceConfig.endDateType === 'occurrences' && recurrenceConfig.occurrences && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quantidade:</span>
                      <span className="font-medium">{recurrenceConfig.occurrences} transações</span>
                    </div>
                    <div className="border-t pt-2">
                      <p className="text-muted-foreground mb-2 text-xs">Datas das transações:</p>
                      <div className="space-y-1">
                        {Array.from({ length: Math.min(5, recurrenceConfig.occurrences) }).map(
                          (_, index) => {
                            const date = new Date(infoConfig.dueDate)

                            // Adicionar intervalo baseado no tipo
                            if (recurrenceConfig.type === 'DAILY') {
                              date.setDate(date.getDate() + index)
                            } else if (recurrenceConfig.type === 'WEEKLY') {
                              date.setDate(date.getDate() + index * 7)
                            } else if (recurrenceConfig.type === 'BIWEEKLY') {
                              date.setDate(date.getDate() + index * 14)
                            } else if (recurrenceConfig.type === 'MONTHLY') {
                              date.setMonth(date.getMonth() + index)
                            } else if (recurrenceConfig.type === 'QUARTERLY') {
                              date.setMonth(date.getMonth() + index * 3)
                            } else if (recurrenceConfig.type === 'SEMIANNUAL') {
                              date.setMonth(date.getMonth() + index * 6)
                            } else if (recurrenceConfig.type === 'ANNUAL') {
                              date.setFullYear(date.getFullYear() + index)
                            }

                            return (
                              <div
                                key={index}
                                className="text-muted-foreground flex items-center gap-2 text-xs"
                              >
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {index + 1}ª - {format(date, 'dd/MM/yyyy', { locale: ptBR })}
                                </span>
                              </div>
                            )
                          }
                        )}
                        {recurrenceConfig.occurrences > 5 && (
                          <div className="text-muted-foreground pt-2 text-xs italic">
                            + {recurrenceConfig.occurrences - 5} transações adicionais
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {recurrenceConfig.endDateType === 'date' && recurrenceConfig.endDate && (
                  <>
                    {(() => {
                      const totalOccurrences = calculateOccurrencesByDate(
                        infoConfig.dueDate,
                        recurrenceConfig.endDate,
                        recurrenceConfig.type
                      )

                      return (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Quantidade:</span>
                            <span className="font-medium">{totalOccurrences} transações</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Até:</span>
                            <span className="flex items-center gap-1 font-medium">
                              <Calendar className="h-3 w-3" />
                              {format(recurrenceConfig.endDate, 'dd/MM/yyyy', { locale: ptBR })}
                            </span>
                          </div>
                          <div className="border-t pt-2">
                            <p className="text-muted-foreground mb-2 text-xs">
                              Datas das transações:
                            </p>
                            <div className="space-y-1">
                              {Array.from({ length: Math.min(5, totalOccurrences) }).map(
                                (_, index) => {
                                  const date = new Date(infoConfig.dueDate)

                                  // Adicionar intervalo baseado no tipo
                                  if (recurrenceConfig.type === 'DAILY') {
                                    date.setDate(date.getDate() + index)
                                  } else if (recurrenceConfig.type === 'WEEKLY') {
                                    date.setDate(date.getDate() + index * 7)
                                  } else if (recurrenceConfig.type === 'BIWEEKLY') {
                                    date.setDate(date.getDate() + index * 14)
                                  } else if (recurrenceConfig.type === 'MONTHLY') {
                                    date.setMonth(date.getMonth() + index)
                                  } else if (recurrenceConfig.type === 'QUARTERLY') {
                                    date.setMonth(date.getMonth() + index * 3)
                                  } else if (recurrenceConfig.type === 'SEMIANNUAL') {
                                    date.setMonth(date.getMonth() + index * 6)
                                  } else if (recurrenceConfig.type === 'ANNUAL') {
                                    date.setFullYear(date.getFullYear() + index)
                                  }

                                  return (
                                    <div
                                      key={index}
                                      className="text-muted-foreground flex items-center gap-2 text-xs"
                                    >
                                      <Calendar className="h-3 w-3" />
                                      <span>
                                        {index + 1}ª -{' '}
                                        {format(date, 'dd/MM/yyyy', { locale: ptBR })}
                                      </span>
                                    </div>
                                  )
                                }
                              )}
                              {totalOccurrences > 5 && (
                                <div className="text-muted-foreground pt-2 text-xs italic">
                                  + {totalOccurrences - 5} transações adicionais
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )
                    })()}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Valor Total */}

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Valor Total</span>
            </div>
            <div className="pl-2 text-left">
              <p className="text-primary text-3xl font-bold">{formatCurrency(totalAmount)}</p>
              {adjustmentAmount !== 0 && (
                <p className="text-muted-foreground text-xs">
                  Base: {formatCurrency(baseAmount)} {adjustmentAmount > 0 ? '+' : ''}{' '}
                  {formatCurrency(adjustmentAmount)}
                </p>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
