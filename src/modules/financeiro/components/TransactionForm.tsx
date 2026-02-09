'use client'

import { useCreateTransaction } from '../hooks/useFinance'
import {
  type CreateTransactionPayload,
  type InterestConfig,
  type PaymentConfig,
  PaymentMode,
  type RecurrenceConfig,
  TransactionActorType,
  TransactionSourceType,
} from '../types'

import { useState } from 'react'

import { ChevronDown, ChevronUp, TrendingDown, TrendingUp } from 'lucide-react'

import { FormInput } from '@/components/FormInput'
import { FormTextarea } from '@/components/FormTextarea'
import { DatePicker } from '@/components/patterns/DatePicker'
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

  const [showAdvanced, setShowAdvanced] = useState(false)
  const [partyType, setPartyType] = useState<TransactionActorType>(TransactionActorType.INCOME)
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>({
    mode: PaymentMode.CASH,
  })
  const [recurrenceConfig, setRecurrenceConfig] = useState<RecurrenceConfig | undefined>()
  const [interest, setInterest] = useState<InterestConfig | undefined>()

  const { mutate: createTransaction, isPending } = useCreateTransaction(workspaceId)

  /**
   * Converte string de data (YYYY-MM-DD) para Date em timezone local
   * Evita problema onde new Date("2026-02-08") cria data em UTC
   */
  const parseLocalDateString = (dateStr: string): Date => {
    console.log('[TransactionForm] parseLocalDateString - input:', dateStr)
    const [year, month, day] = dateStr.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    console.log('[TransactionForm] parseLocalDateString - output:', date)
    console.log('[TransactionForm] parseLocalDateString - toString():', date.toString())
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
    console.log('[TransactionForm] formatDateToLocalISO - input:', date)
    console.log('[TransactionForm] formatDateToLocalISO - output:', result)
    return result
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.description.trim()) {
      alert('Descrição é obrigatória')
      return
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Valor deve ser maior que zero')
      return
    }

    console.log('[TransactionForm] handleSubmit - formData.dueDate:', formData.dueDate)

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
        setShowAdvanced(false)
        onSuccess?.()
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 px-4 py-6">
      {/* Tipo de Transação - RadioGroup Cards em Linha */}
      <div className="space-y-3">
        <h3 className="text-gh-text text-lg font-semibold">Tipo de Transação</h3>
        <RadioGroup
          value={partyType}
          onValueChange={(value) => setPartyType(value as TransactionActorType)}
          className="grid max-w-2xl grid-cols-2 gap-4"
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

      {/* Descrição */}
      <FormInput
        type="text"
        label="Descrição"
        placeholder="Ex: Serviço de consultoria, Venda de produtos..."
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />

      {/* Valor e Data */}
      <div className="grid grid-cols-2 gap-3">
        <FormInput
          type="number"
          label="Valor"
          step="0.01"
          min="0"
          placeholder="0,00"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />
        <div className="space-y-2">
          <label className="text-gh-text text-sm font-medium">Vencimento</label>
          <DatePicker
            value={parseLocalDateString(formData.dueDate)}
            onValueChange={(date) => {
              if (date) {
                const dateString = formatDateToLocalISO(date)
                console.log('[TransactionForm] DatePicker onValueChange:', date)
                console.log('[TransactionForm] DatePicker converted to string:', dateString)
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

      {/* Notas */}
      <FormTextarea
        label="Notas (opcional)"
        placeholder="Adicione observações sobre essa transação..."
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        rows={2}
      />

      {/* Configurações Avançadas */}
      <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="group flex w-full items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900"
        >
          <span className="text-gh-text text-sm font-medium group-hover:text-blue-600">
            Configurações Avançadas
          </span>
          {showAdvanced ? (
            <ChevronUp className="text-gh-text-secondary h-4 w-4" />
          ) : (
            <ChevronDown className="text-gh-text-secondary h-4 w-4" />
          )}
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-900">
            {/* Modo de Pagamento */}
            <div>
              <PaymentModeConfig config={paymentConfig} onChange={setPaymentConfig} />
            </div>

            {/* Recorrência */}
            <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
              <RecurrenceConfigComponent config={recurrenceConfig} onChange={setRecurrenceConfig} />
            </div>

            {/* Juros */}
            <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
              <InterestConfigComponent interest={interest} onChange={setInterest} />
            </div>
          </div>
        )}
      </div>

      {/* Botões */}
      <div className="flex gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? 'Salvando...' : 'Criar Transação'}
        </Button>
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="outline" className="flex-1">
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}
