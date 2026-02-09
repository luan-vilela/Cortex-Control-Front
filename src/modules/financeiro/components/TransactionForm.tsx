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

import { TrendingDown, TrendingUp } from 'lucide-react'

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

  const [partyType, setPartyType] = useState<TransactionActorType>(TransactionActorType.INCOME)
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>({
    mode: PaymentMode.CASH,
  })
  const [recurrenceConfig, setRecurrenceConfig] = useState<RecurrenceConfig | undefined>(undefined)
  const [interest, setInterest] = useState<InterestConfig | undefined>(undefined)

  const { mutate: createTransaction, isPending } = useCreateTransaction(workspaceId)

  const parseLocalDateString = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return date
  }

  const formatDateToLocalISO = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
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

    const payload: CreateTransactionPayload = {
      sourceType: TransactionSourceType.MANUAL,
      sourceId: 'manual-' + Date.now(),
      amount: parseFloat(formData.amount),
      description: formData.description,
      dueDate: formData.dueDate,
      notes: formData.notes || undefined,
      paymentConfig,
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
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-6">
        <div className="flex-1">
          <h2 className="text-gh-text text-xl sm:text-2xl font-bold mb-1">
            Nova Transação
          </h2>
          <p className="text-gh-text-secondary text-xs sm:text-sm">
            Preencha os detalhes da transação
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              variant="secondary"
              size="sm"
              className="flex-1 md:flex-none"
            >
              Descartar
            </Button>
          )}
          <Button
            form="transaction-form"
            type="submit"
            disabled={isPending}
            size="sm"
            className="flex-1 md:flex-none"
          >
            {isPending ? 'Salvando...' : 'Criar Transação'}
          </Button>
        </div>
      </div>

      {/* Form em Grid */}
      <form id="transaction-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 py-6">
        {/* Coluna Esquerda (2/3) */}
        <div className="lg:col-span-2 space-y-6">
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
          <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-gh-text font-semibold">Informações</h3>
            <FormInput
              type="text"
              label="Descrição"
              placeholder="Ex: Serviço de consultoria, Venda de produtos..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
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
        </div>

        {/* Coluna Direita (1/3) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Modo de Pagamento */}
          <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-gh-text font-semibold">Pagamento</h3>
            <PaymentModeConfig config={paymentConfig} onChange={setPaymentConfig} />
          </div>

          {/* Recorrência */}
          <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-gh-text font-semibold">Recorrência</h3>
            <RecurrenceConfigComponent config={recurrenceConfig} onChange={setRecurrenceConfig} />
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
