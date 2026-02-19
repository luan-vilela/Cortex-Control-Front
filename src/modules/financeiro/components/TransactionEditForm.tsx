'use client'

import { useUpdateTransaction } from '../hooks/useFinance'
import {
  type FinanceiroTransaction,
  type UpdateTransactionPayload,
  TransactionStatus,
  TransactionType,
} from '../types'

import { useState } from 'react'

import { AlertCircle, TrendingDown, TrendingUp, X } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field'

interface TransactionEditFormProps {
  workspaceId: string
  transaction: FinanceiroTransaction
  onSuccess?: () => void
  onCancel?: () => void
}

/**
 * Converte Date para string ISO local (YYYY-MM-DD)
 */
function formatDateToLocalISO(date?: Date | string): string {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function TransactionEditForm({
  workspaceId,
  transaction,
  onSuccess,
  onCancel,
}: TransactionEditFormProps) {
  const [transactionType, setTransactionType] = useState<TransactionType>(
    transaction.transactionType || TransactionType.INCOME
  )
  const [description, setDescription] = useState(transaction.description || '')
  const [amount, setAmount] = useState(Number(transaction.amount) || 0)
  const [dueDate, setDueDate] = useState(formatDateToLocalISO(transaction.dueDate))
  const [notes, setNotes] = useState(transaction.notes || '')
  const [status, setStatus] = useState<TransactionStatus>(transaction.status)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const { mutate: updateTransaction, isPending } = useUpdateTransaction(
    workspaceId,
    transaction.id
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    const errors: string[] = []
    if (!description.trim()) errors.push('Descrição é obrigatória')
    if (amount <= 0) errors.push('Valor deve ser maior que zero')
    if (!dueDate) errors.push('Data de vencimento é obrigatória')

    if (errors.length > 0) {
      setValidationErrors(errors)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setValidationErrors([])

    const payload: UpdateTransactionPayload = {
      description,
      amount,
      dueDate,
      notes: notes || undefined,
      transactionType,
      status,
    }

    updateTransaction(payload, {
      onSuccess: () => {
        onSuccess?.()
      },
    })
  }

  const statusOptions: { value: TransactionStatus; label: string; color: string }[] = [
    { value: TransactionStatus.PENDING, label: 'Pendente', color: 'text-yellow-600' },
    { value: TransactionStatus.PAID, label: 'Pago', color: 'text-green-600' },
    { value: TransactionStatus.OVERDUE, label: 'Vencido', color: 'text-red-600' },
    { value: TransactionStatus.CANCELED, label: 'Cancelado', color: 'text-gray-600' },
  ]

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between px-4 py-4">
        <div>
          <h1 className="text-gh-text text-2xl font-bold">Editar Transação</h1>
          <p className="text-gh-text-secondary text-sm">
            Alterando: {transaction.description}
          </p>
        </div>
        <div className="flex gap-3">
          {onCancel && (
            <Button type="button" onClick={onCancel} variant="outline">
              Cancelar
            </Button>
          )}
          <Button form="edit-transaction-form" type="submit" disabled={isPending}>
            {isPending ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </div>

      {/* Validation Errors */}
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

      {/* Form */}
      <form
        id="edit-transaction-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-3 gap-6 px-4 py-6"
      >
        {/* Left Column (2/3) */}
        <div className="col-span-2 space-y-6">
          {/* Transaction Type */}
          <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-gh-text font-semibold">Tipo de Transação</h3>
            <RadioGroup
              value={transactionType}
              onValueChange={(value) => setTransactionType(value as TransactionType)}
              className="grid grid-cols-2 gap-4"
            >
              <FieldLabel htmlFor="edit-income-type" className="cursor-pointer">
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
                      value={TransactionType.INCOME}
                      id="edit-income-type"
                      className="mt-1"
                    />
                  </div>
                </Field>
              </FieldLabel>

              <FieldLabel htmlFor="edit-expense-type" className="cursor-pointer">
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
                      value={TransactionType.EXPENSE}
                      id="edit-expense-type"
                      className="mt-1"
                    />
                  </div>
                </Field>
              </FieldLabel>
            </RadioGroup>
          </div>

          {/* Info Fields */}
          <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-gh-text font-semibold">Informações</h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-description">Descrição *</Label>
                <Input
                  id="edit-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descrição da transação"
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-amount">Valor (R$) *</Label>
                  <Input
                    id="edit-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount || ''}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    placeholder="0,00"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-due-date">Vencimento *</Label>
                  <Input
                    id="edit-due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-notes">Observações</Label>
                <Textarea
                  id="edit-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Observações opcionais"
                  rows={3}
                  className="mt-1.5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1/3) */}
        <div className="col-span-1 space-y-6">
          {/* Status */}
          <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <h3 className="text-gh-text font-semibold">Status</h3>
            <RadioGroup
              value={status}
              onValueChange={(value) => setStatus(value as TransactionStatus)}
              className="space-y-2"
            >
              {statusOptions.map((opt) => (
                <label
                  key={opt.value}
                  htmlFor={`edit-status-${opt.value}`}
                  className="border-gh-border hover:bg-gh-hover flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors"
                >
                  <RadioGroupItem value={opt.value} id={`edit-status-${opt.value}`} />
                  <span className={`text-sm font-medium ${opt.color}`}>{opt.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          {/* Info Card */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/30">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">ℹ️ Informação</p>
            <p className="mt-1 text-xs text-blue-700 dark:text-blue-400">
              Alterações em parcelamento, recorrência e juros não são possíveis após a criação da
              transação. Apenas os campos básicos podem ser editados.
            </p>
          </div>
        </div>
      </form>
    </>
  )
}
