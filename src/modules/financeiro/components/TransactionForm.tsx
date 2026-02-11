'use client'

import { useCreateTransaction } from '../hooks/useFinance'
import {
  type CreateTransactionPayload,
  PaymentMode,
  TransactionActorType,
  TransactionSourceType,
} from '../types'
import { validatePayment } from '../utils/validatePayment'

import { useState } from 'react'

import { AlertCircle, Eye, TrendingDown, TrendingUp, X } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useFormRefValidation } from '@/hooks/useFormRefValidation'

import { TransactionPreview } from './TransactionPreview'
import {
  InfoBlockComponent,
  InterestConfigComponent,
  PaymentConfigComponent,
  RecurrenceConfigComponent,
} from './index'
import { type InfoBlockFormValues } from './info/infoBlock.types'
import { type InterestBlockFormValues } from './interest/interestBlock.types'
import { type PaymentBlockFormValues } from './payment'
import { type RecurrenceBlockFormValues } from './recurrence/recurrenceBlock.types'

interface TransactionFormProps {
  workspaceId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function TransactionForm({ workspaceId, onSuccess, onCancel }: TransactionFormProps) {
  const { validate, setRef, getRef } = useFormRefValidation()

  const [partyType, setPartyType] = useState<TransactionActorType>(TransactionActorType.INCOME)
  const [infoConfig, setInfoConfig] = useState<InfoBlockFormValues>({
    description: '',
    amount: 0,
    dueDate: new Date(),
    notes: '',
  })
  const [paymentConfig, setPaymentConfig] = useState<PaymentBlockFormValues>({
    mode: PaymentMode.CASH,
  })
  const [recurrenceConfig, setRecurrenceConfig] = useState<RecurrenceBlockFormValues | undefined>(
    undefined
  )
  const [interestConfig, setInterestConfig] = useState<InterestBlockFormValues | undefined>(
    undefined
  )
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const { mutate: createTransaction, isPending } = useCreateTransaction(workspaceId)

  const handlePaymentConfigChange = (config: PaymentBlockFormValues | undefined) => {
    if (!config) return
    setPaymentConfig(config)

    // Se for Parcelado, desabilita recorrência
    if (config.mode === PaymentMode.INSTALLMENT) {
      setRecurrenceConfig(undefined)
    }
  }

  /**
   * Converte string de data (YYYY-MM-DD) para Date em timezone local
   * Evita problema onde new Date("2026-02-08") cria data em UTC
   */
  const parseLocalDateString = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return date
  }
  /**
   * Converte Date para string ISO local (YYYY-MM-DD)
   * IMPORTANTE: Usa getFullYear/getMonth/getDate (local) não UTC!
   * Isso preserva a data local sem conversão para UTC
   */
  const formatDateToLocalISO = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const result = `${year}-${month}-${day}`
    return result
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const isFormValid = await validate('TransactionForm')

    if (!isFormValid) return

    // Validar regras de negócio de pagamento e descontos
    const paymentValidation = validatePayment(infoConfig, paymentConfig, interestConfig)
    if (!paymentValidation.isValid) {
      setValidationErrors(paymentValidation.errors)
      // Scroll para o topo para ver o banner
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // Converter PaymentBlockFormValues para PaymentConfig (tipo esperado pela API)
    const apiPaymentConfig =
      paymentConfig.mode === PaymentMode.CASH
        ? { mode: PaymentMode.CASH }
        : {
            mode: PaymentMode.INSTALLMENT,
            planType: paymentConfig.planType,
            numberOfInstallments: paymentConfig.numberOfInstallments,
            firstInstallmentDate: paymentConfig.firstInstallmentDate,
            installmentIntervalDays: paymentConfig.installmentIntervalDays,
          }

    // Formata a data para string YYYY-MM-DD
    const dueDateString = formatDateToLocalISO(infoConfig.dueDate)

    const payload: CreateTransactionPayload = {
      sourceType: TransactionSourceType.MANUAL,
      sourceId: 'manual-' + Date.now(),
      amount: infoConfig.amount,
      description: infoConfig.description,
      dueDate: dueDateString, // Send as YYYY-MM-DD string, backend parses correctly
      notes: infoConfig.notes || undefined,
      paymentConfig: apiPaymentConfig as any,
      // Adiciona o workspace como ator com o tipo selecionado (INCOME/EXPENSE)
      actors: [
        {
          workspaceId,
          actorType: partyType,
        },
      ],
    }

    createTransaction(payload, {
      onSuccess: () => {
        setInfoConfig({
          description: '',
          amount: 0,
          dueDate: new Date(),
          notes: '',
        })
        setPaymentConfig({ mode: PaymentMode.CASH })
        setRecurrenceConfig(undefined)
        setInterestConfig(undefined)
        setPartyType(TransactionActorType.INCOME)
        onSuccess?.()
      },
    })
  }

  return (
    <>
      {/* Header com Título e Botões */}
      <div className="mb-6 flex items-center justify-between px-4 py-4">
        <div>
          <h1 className="text-gh-text text-2xl font-bold">Nova Transação</h1>
          <p className="text-gh-text-secondary text-sm">Preencha os detalhes da transação</p>
        </div>
        <div className="flex gap-3">
          {onCancel && (
            <Button type="button" onClick={onCancel} variant="outline">
              Cancelar
            </Button>
          )}
          <TransactionPreview
            partyType={partyType}
            infoConfig={infoConfig}
            paymentConfig={paymentConfig}
            recurrenceConfig={recurrenceConfig}
            interestConfig={interestConfig}
          >
            <Button type="button" variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              Visualizar
            </Button>
          </TransactionPreview>
          <Button form="transaction-form" type="submit" disabled={isPending}>
            {isPending ? 'Salvando...' : 'Criar Transação'}
          </Button>
        </div>
      </div>

      {/* Banner de Erro de Validação */}
      {validationErrors.length > 0 && (
        <div className="px-4 pb-4">
          <Alert variant="destructive" className="relative">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro de Validação</AlertTitle>
            <AlertDescription className="mt-2 space-y-2">
              {validationErrors.map((error, index) => (
                <div key={index} className="text-sm">
                  • {error}
                </div>
              ))}
            </AlertDescription>
            <button
              onClick={() => setValidationErrors([])}
              className="absolute top-2 right-2 rounded-sm opacity-70 transition-opacity hover:opacity-100"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </button>
          </Alert>
        </div>
      )}

      {/* Form em Grid 2 Colunas */}
      <form
        id="transaction-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-3 gap-6 px-4 py-6"
      >
        {/* Coluna Esquerda (2/3) */}
        <div className="col-span-2 space-y-6">
          {/* Tipo de Transação */}
          <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-gh-text font-semibold">Tipo de Transação</h3>
            <RadioGroup
              value={partyType}
              onValueChange={(value) => setPartyType(value as TransactionActorType)}
              className="grid grid-cols-2 gap-4"
            >
              <FieldLabel htmlFor="income-type" className="cursor-pointer">
                <Field orientation="horizontal" className="flex flex-col">
                  <div className="flex w-full items-start justify-between gap-4">
                    <FieldContent>
                      <FieldTitle className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        Entrada
                      </FieldTitle>
                      <FieldDescription>Vendas, serviços, investimentos</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem
                      value={TransactionActorType.INCOME}
                      id="income-type"
                      className="mt-1"
                    />
                  </div>
                </Field>
              </FieldLabel>

              <FieldLabel htmlFor="expense-type" className="cursor-pointer">
                <Field orientation="horizontal" className="flex flex-col">
                  <div className="flex w-full items-start justify-between gap-4">
                    <FieldContent>
                      <FieldTitle className="flex items-center gap-3">
                        <TrendingDown className="h-5 w-5 text-red-600" />
                        Saída
                      </FieldTitle>
                      <FieldDescription>Despesas, custos, pagamentos</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem
                      value={TransactionActorType.EXPENSE}
                      id="expense-type"
                      className="mt-1"
                    />
                  </div>
                </Field>
              </FieldLabel>
            </RadioGroup>
          </div>

          {/* Informações */}
          <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-gh-text font-semibold">Informações</h3>
            <InfoBlockComponent
              ref={(ref) => setRef('TransactionForm', 'InfoBlockComponentRef', ref)}
              initialValues={infoConfig}
              onDataChange={setInfoConfig}
              disableDueDate={paymentConfig.mode === PaymentMode.INSTALLMENT}
              requireAmount={paymentConfig.mode === PaymentMode.INSTALLMENT}
            />
          </div>

          {/* Pagamento */}
          <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-gh-text font-semibold">Pagamento</h3>
            <PaymentConfigComponent
              ref={(ref) => setRef('TransactionForm', 'PaymentConfigComponentRef', ref)}
              initialValues={paymentConfig}
              onDataChange={handlePaymentConfigChange}
            />
          </div>
        </div>

        {/* Coluna Direita (1/3) */}
        <div className="col-span-1 space-y-6">
          {/* Recorrência - Desabilitada se Parcelado */}
          <div
            className={`space-y-3 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800 ${paymentConfig?.mode === PaymentMode.INSTALLMENT ? 'pointer-events-none opacity-50' : ''}`}
          >
            <h3 className="text-gh-text font-semibold">Recorrência</h3>
            <RecurrenceConfigComponent
              ref={(ref) => setRef('TransactionForm', 'RecurrenceConfigComponentRef', ref)}
              initialValues={recurrenceConfig}
              onDataChange={setRecurrenceConfig}
              // error={errors.recurrence}
            />
            {paymentConfig?.mode === PaymentMode.INSTALLMENT && (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Recorrência não disponível para pagamentos parcelados
              </p>
            )}
          </div>

          {/* Juros/Taxas */}
          <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-gh-text font-semibold">Juros/Taxas</h3>
            <InterestConfigComponent
              ref={(ref) => setRef('TransactionForm', 'InterestConfigComponentRef', ref)}
              initialValues={interestConfig}
              onDataChange={setInterestConfig}
            />
          </div>
        </div>
      </form>
    </>
  )
}
