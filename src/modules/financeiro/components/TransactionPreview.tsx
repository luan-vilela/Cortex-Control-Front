'use client'

import { PaymentMode, TransactionType } from '../types'
import {
  type InstallmentResult,
  calculateCashPaymentAdjustment,
  calculatePriceTableInstallments,
  calculateSACInstallments,
  calculateSimpleInstallments,
} from '../utils/installmentCalculations'

import { useMemo } from 'react'

import { TrendingDown, TrendingUp } from 'lucide-react'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { type InfoBlockFormValues } from './info/infoBlock.types'
import { type InterestBlockFormValues, InterestType } from './interest/interestBlock.types'
import { type PaymentBlockFormValues } from './payment'
import {
  BasicInfoSection,
  InterestSection,
  PaymentSection,
  PenaltySection,
  RecurrenceSection,
  TotalSection,
} from './preview-sections'
import { type RecurrenceBlockFormValues } from './recurrence/recurrenceBlock.types'

interface TransactionPreviewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transactionType: TransactionType
  infoConfig: InfoBlockFormValues
  paymentConfig: PaymentBlockFormValues
  recurrenceConfig?: RecurrenceBlockFormValues
  interestConfig?: InterestBlockFormValues
}

export function TransactionPreview({
  open,
  onOpenChange,
  transactionType,
  infoConfig,
  paymentConfig,
  recurrenceConfig,
  interestConfig,
}: TransactionPreviewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  // Memoizar cálculos pesados - só executa quando o Sheet está aberto
  const calculatedValues = useMemo(() => {
    if (!open) {
      return {
        installments: [],
        installmentAmount: 0,
        financed: 0,
        totalAmount: infoConfig.amount,
        adjustmentAmount: 0,
        adjustmentLabel: '',
        baseAmount: infoConfig.amount,
      }
    }

    const baseAmount = infoConfig.amount
    const planType = (paymentConfig as any).planType || 'SIMPLE'

    // Calcular ajustes (juros/taxas) para pagamento à vista
    let cashAdjustment = { adjustmentAmount: 0, adjustmentLabel: '' }
    if (paymentConfig.mode === PaymentMode.CASH && interestConfig?.type) {
      const adjustmentValue =
        interestConfig.type === InterestType.PERCENTAGE
          ? interestConfig.percentage
          : interestConfig.flatAmount

      cashAdjustment = calculateCashPaymentAdjustment(
        baseAmount,
        interestConfig.type,
        adjustmentValue
      )
    }

    // Calcular parcelas usando as funções utilitárias (elas fazem TUDO internamente)
    let result: InstallmentResult | undefined

    if (paymentConfig.mode === PaymentMode.INSTALLMENT && paymentConfig.numberOfInstallments) {
      const downPaymentAmount = paymentConfig.downPayment || 0
      const n = paymentConfig.numberOfInstallments
      const interestPercentage =
        interestConfig?.type === InterestType.PERCENTAGE ? interestConfig.percentage : undefined
      const flatAmount =
        interestConfig?.type === InterestType.FLAT ? interestConfig.flatAmount : undefined

      if (planType === 'PRICE_TABLE') {
        result = calculatePriceTableInstallments(
          baseAmount,
          downPaymentAmount,
          n,
          interestPercentage
        )
      } else if (planType === 'SAC') {
        result = calculateSACInstallments(baseAmount, downPaymentAmount, n, interestPercentage)
      } else {
        result = calculateSimpleInstallments(
          baseAmount,
          downPaymentAmount,
          n,
          interestPercentage,
          flatAmount
        )
      }
    }

    // Extrair resultados das utils
    const installments = result?.installments || []
    const installmentAmount = result?.installmentAmount || 0
    const financed = result?.financed || 0
    // Para à vista: totalAmount = base + ajuste | Para parcelado: usa o resultado calculado
    const totalAmount = result?.totalAmount || baseAmount + cashAdjustment.adjustmentAmount
    // Para parcelado, usa o adjustmentAmount calculado pelas funções | Para à vista, usa cashAdjustment
    const finalAdjustmentAmount = result?.adjustmentAmount || cashAdjustment.adjustmentAmount
    const finalAdjustmentLabel = result
      ? cashAdjustment.adjustmentLabel
      : cashAdjustment.adjustmentLabel

    return {
      installments,
      installmentAmount,
      financed,
      totalAmount,
      adjustmentAmount: finalAdjustmentAmount,
      adjustmentLabel: finalAdjustmentLabel,
      baseAmount,
    }
  }, [open, infoConfig, paymentConfig, interestConfig])

  const downPaymentAmount =
    paymentConfig.mode === PaymentMode.INSTALLMENT ? paymentConfig.downPayment || 0 : 0

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto p-3 pb-12 sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {transactionType === TransactionType.INCOME ? (
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
          <BasicInfoSection
            description={infoConfig.description}
            baseAmount={calculatedValues.baseAmount}
            dueDate={infoConfig.dueDate || new Date()}
            notes={infoConfig.notes}
            formatCurrency={formatCurrency}
          />

          {/* Taxas e Ajustes */}
          {interestConfig?.type && (
            <InterestSection
              interestType={interestConfig.type}
              adjustmentLabel={calculatedValues.adjustmentLabel}
              adjustmentAmount={calculatedValues.adjustmentAmount}
              description={interestConfig.description}
              formatCurrency={formatCurrency}
            />
          )}

          {/* Multa e Mora */}
          <PenaltySection
            penaltyPercentage={interestConfig?.penaltyPercentage}
            interestPercentage={interestConfig?.interestPercentage}
            interestPeriod={interestConfig?.interestPeriod}
          />

          {/* Forma de Pagamento */}
          <PaymentSection
            mode={paymentConfig.mode}
            formatCurrency={formatCurrency}
            downPaymentAmount={downPaymentAmount}
            numberOfInstallments={
              paymentConfig.mode === PaymentMode.INSTALLMENT
                ? paymentConfig.numberOfInstallments
                : undefined
            }
            installmentAmount={calculatedValues.installmentAmount}
            firstInstallmentDate={
              paymentConfig.mode === PaymentMode.INSTALLMENT
                ? paymentConfig.firstInstallmentDate
                : undefined
            }
            installmentIntervalDays={
              paymentConfig.mode === PaymentMode.INSTALLMENT
                ? paymentConfig.installmentIntervalDays
                : undefined
            }
            financed={calculatedValues.financed}
            installments={calculatedValues.installments}
          />

          {/* Recorrência */}
          {recurrenceConfig?.type && (
            <RecurrenceSection
              type={recurrenceConfig.type}
              startDate={infoConfig.dueDate || new Date()}
              endDateType={recurrenceConfig.endDateType}
              occurrences={recurrenceConfig.occurrences}
              endDate={recurrenceConfig.endDate}
              transactionAmount={calculatedValues.totalAmount}
              formatCurrency={formatCurrency}
            />
          )}

          {/* Valor Total */}
          <TotalSection
            totalAmount={calculatedValues.totalAmount}
            baseAmount={calculatedValues.baseAmount}
            adjustmentAmount={calculatedValues.adjustmentAmount}
            formatCurrency={formatCurrency}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
