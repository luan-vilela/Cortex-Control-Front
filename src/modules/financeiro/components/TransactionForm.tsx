'use client'

import { useCreateTransaction } from '../hooks/useFinance'
import {
  type CreateTransactionPayload,
  type InstallmentPaymentConfig,
  type InterestConfig,
  type PaymentConfig,
  PaymentMode,
  type RecurrenceConfig,
  TransactionActorType,
  TransactionSourceType,
} from '../types'

import { useState } from 'react'

import { TrendingDown, TrendingUp } from 'lucide-react'

import { FormInput } from '@/components/FormInput'
import { FormTextarea } from '@/components/FormTextarea'
import { DatePicker } from '@/components/patterns/DatePicker'
import { InputNumber } from '@/components/ui/InputNumber'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { InterestConfigComponent, PaymentModeConfig, RecurrenceConfigComponent } from './index'

interface TransactionFormProps {
  workspaceId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function TransactionForm({ workspaceId, onSuccess, onCancel }: TransactionFormProps) {
  // Função helper para gerar data inicial em hora local
  const getInitialLocalDate = (): string => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    dueDate: getInitialLocalDate(),
    notes: '',
  })

  const [errors, setErrors] = useState({
    description: '',
    amount: '',
    installments: '',
  })

  const [partyType, setPartyType] = useState<TransactionActorType>(TransactionActorType.INCOME)
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>({
    mode: PaymentMode.CASH,
  })
  const [recurrenceConfig, setRecurrenceConfig] = useState<RecurrenceConfig | undefined>(undefined)
  const [interest, setInterest] = useState<InterestConfig | undefined>(undefined)

  const { mutate: createTransaction, isPending } = useCreateTransaction(workspaceId)

  const handlePaymentConfigChange = (config: PaymentConfig) => {
    setPaymentConfig(config)
    // Se for Parcelado, desabilita recorrência
    if (config.mode === PaymentMode.INSTALLMENT) {
      setRecurrenceConfig(undefined)
      // Limpar erro se o valor for válido
      const numInstallments = (config as InstallmentPaymentConfig).numberOfInstallments
      if (numInstallments && numInstallments >= 1) {
        setErrors((prev) => ({ ...prev, installments: '' }))
      }
    } else {
      // Limpar erro quando não for parcelado
      setErrors((prev) => ({ ...prev, installments: '' }))
    }
  }

  /**
   * Handler para mudanças em recorrência
   * Se ativar recorrência (config !== undefined), muda pagamento para À Vista
   */
  const handleRecurrenceConfigChange = (config: RecurrenceConfig | undefined) => {
    setRecurrenceConfig(config)
    // Se ativar recorrência, muda para À Vista
    if (config !== undefined) {
      setPaymentConfig({ mode: PaymentMode.CASH })
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Limpar erros anteriores
    setErrors({ description: '', amount: '', installments: '' })

    let hasErrors = false

    if (!formData.description.trim()) {
      setErrors((prev) => ({ ...prev, description: 'Descrição é obrigatória' }))
      hasErrors = true
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setErrors((prev) => ({ ...prev, amount: 'Valor deve ser maior que zero' }))
      hasErrors = true
    }

    if (paymentConfig.mode === PaymentMode.INSTALLMENT) {
      const numInstallments = (paymentConfig as InstallmentPaymentConfig).numberOfInstallments
      if (!numInstallments || numInstallments < 1) {
        setErrors((prev) => ({ ...prev, installments: 'Número de parcelas deve ser pelo menos 1' }))
        hasErrors = true
      }
    }

    if (hasErrors) {
      return
    }

    const payload: CreateTransactionPayload = {
      sourceType: TransactionSourceType.MANUAL,
      sourceId: 'manual-' + Date.now(),
      amount: parseFloat(formData.amount),
      description: formData.description,
      dueDate: formData.dueDate, // Send as YYYY-MM-DD string, backend parses correctly
      notes: formData.notes || undefined,
      paymentConfig,
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
        setFormData({
          description: '',
          amount: '',
          dueDate: getInitialLocalDate(),
          notes: '',
        })
        setPaymentConfig({ mode: PaymentMode.CASH })
        setRecurrenceConfig(undefined)
        setInterest(undefined)
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
          <Button
            form="transaction-form"
            type="submit"
            disabled={isPending}
            className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? 'Salvando...' : 'Criar Transação'}
          </Button>
        </div>
      </div>

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
            <FormInput
              type="text"
              label="Descrição"
              placeholder="Ex: Serviço de consultoria, Venda de produtos..."
              value={formData.description}
              error={errors.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value })
                // Limpar erro quando usuário começar a digitar
                if (errors.description) {
                  setErrors((prev) => ({ ...prev, description: '' }))
                }
              }}
            />
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-gh-text text-sm font-medium">Valor</label>
                <InputNumber
                  value={parseFloat(formData.amount) || 0}
                  onChange={(val) => {
                    setFormData({ ...formData, amount: val.toString() })
                    // Limpar erro quando usuário começar a digitar
                    if (errors.amount) {
                      setErrors((prev) => ({ ...prev, amount: '' }))
                    }
                  }}
                  float={true}
                  min={0}
                  placeholder="R$ 0,00"
                  mask="real"
                  className={errors.amount ? 'border-destructive' : ''}
                />
                {errors.amount && <p className="text-destructive text-sm">{errors.amount}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-gh-text text-sm font-medium">Vencimento</label>
                <DatePicker
                  value={parseLocalDateString(formData.dueDate)}
                  onValueChange={(date) => {
                    if (date) {
                      const dateString = formatDateToLocalISO(date)
                      setFormData({
                        ...formData,
                        dueDate: dateString,
                      })
                    }
                  }}
                  placeholder="Selecionar data"
                />
              </div>
            </div>
            <FormTextarea
              label="Notas (opcional)"
              placeholder="Adicione observações sobre essa transação..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
            />
          </div>

          {/* Pagamento */}
          <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-gh-text font-semibold">Pagamento</h3>
            <PaymentModeConfig
              config={paymentConfig}
              onChange={handlePaymentConfigChange}
              error={errors.installments}
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
              config={recurrenceConfig}
              onChange={handleRecurrenceConfigChange}
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
            <InterestConfigComponent interest={interest} onChange={setInterest} />
          </div>
        </div>
      </form>
    </>
  )
}
