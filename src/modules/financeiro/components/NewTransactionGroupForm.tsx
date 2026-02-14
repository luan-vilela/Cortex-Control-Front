'use client'

import {
  CalculationMethod,
  CreateTransactionGroupDto,
  GroupType,
  PlanType,
  SourceType,
  TransactionType,
} from '../types/new-architecture'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Calendar, DollarSign, User } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const transactionGroupSchema = z
  .object({
    personId: z.string().min(1, 'Selecione uma pessoa'),
    groupType: z.nativeEnum(GroupType),
    transactionType: z.nativeEnum(TransactionType),
    sourceType: z.nativeEnum(SourceType),
    sourceId: z.string().optional(),
    totalAmount: z.number().min(0.01, 'Valor deve ser maior que zero'),
    description: z.string().min(3, 'Descrição é obrigatória'),
    numberOfInstallments: z.number().min(1).optional(),
    downpaymentAmount: z.number().min(0).optional(),
    planType: z.nativeEnum(PlanType).optional(),
    calculationMethod: z.nativeEnum(CalculationMethod).optional(),
    firstDueDate: z.string().optional(),
    intervalDays: z.number().min(1).optional(),
  })
  .refine(
    (data) => {
      if (data.groupType === GroupType.INSTALLMENT) {
        return data.numberOfInstallments && data.numberOfInstallments >= 2
      }
      return true
    },
    {
      message: 'Parcelamento requer no mínimo 2 parcelas',
      path: ['numberOfInstallments'],
    }
  )
  .refine(
    (data) => {
      if (data.groupType === GroupType.INSTALLMENT) {
        return data.firstDueDate
      }
      return true
    },
    {
      message: 'Data de vencimento da primeira parcela é obrigatória',
      path: ['firstDueDate'],
    }
  )

type FormData = z.infer<typeof transactionGroupSchema>

interface NewTransactionGroupFormProps {
  workspaceId: string
  onSuccess: () => void
  onCancel: () => void
}

export function NewTransactionGroupForm({
  workspaceId,
  onSuccess,
  onCancel,
}: NewTransactionGroupFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(transactionGroupSchema),
    defaultValues: {
      groupType: GroupType.SINGLE,
      transactionType: TransactionType.PAYABLE,
      sourceType: SourceType.MANUAL,
      planType: PlanType.SIMPLE,
      calculationMethod: CalculationMethod.EQUAL_INSTALLMENTS,
      intervalDays: 30,
      downpaymentAmount: 0,
    },
  })

  const groupType = watch('groupType')
  const transactionType = watch('transactionType')

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const payload: CreateTransactionGroupDto = {
        personId: data.personId,
        groupType: data.groupType,
        sourceType: data.sourceType,
        sourceId: data.sourceId,
        totalAmount: data.totalAmount,
        description: data.description,
      }

      // Add installment-specific fields
      if (data.groupType === GroupType.INSTALLMENT) {
        payload.numberOfInstallments = data.numberOfInstallments
        payload.downpaymentAmount = data.downpaymentAmount
        payload.planType = data.planType
        payload.calculationMethod = data.calculationMethod
        payload.firstDueDate = data.firstDueDate
        payload.intervalDays = data.intervalDays
      }

      // Call API to create transaction group
      const { createTransactionGroup } = await import('../services/new-finance.service')
      await createTransactionGroup(workspaceId, payload)

      onSuccess()
    } catch (err: any) {
      console.error('Error creating transaction group:', err)
      setError(
        err.response?.data?.message ||
          err.message ||
          'Erro ao criar transação. Verifique se o backend está configurado.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div className="border-gh-border border-b pb-4">
        <h1 className="text-gh-text-primary text-2xl font-bold">Nova Transação Financeira</h1>
        <p className="text-gh-text-secondary mt-1 text-sm">
          Crie uma nova transação usando a arquitetura event-sourcing
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-md border border-red-500 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="border-gh-border bg-gh-bg-default space-y-4 rounded-lg border p-4">
        <h3 className="text-gh-text-primary font-semibold">Informações Básicas</h3>

        {/* Transaction Type */}
        <div>
          <label className="text-gh-text-primary mb-2 block text-sm font-medium">
            Tipo de Transação
          </label>
          <select
            {...register('transactionType')}
            className="border-gh-border bg-gh-bg-input text-gh-text-primary w-full rounded-md border px-3 py-2"
          >
            <option value={TransactionType.RECEIVABLE}>A Receber</option>
            <option value={TransactionType.PAYABLE}>A Pagar</option>
          </select>
        </div>

        {/* Person */}
        <div>
          <label className="text-gh-text-primary mb-2 block text-sm font-medium">
            Pessoa <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="text-gh-text-tertiary absolute top-2.5 left-3 h-5 w-5" />
            <input
              {...register('personId')}
              placeholder="ID da pessoa (cliente/fornecedor)"
              className="border-gh-border bg-gh-bg-input text-gh-text-primary w-full rounded-md border py-2 pr-3 pl-10"
            />
          </div>
          {errors.personId && (
            <p className="mt-1 text-sm text-red-500">{errors.personId.message}</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="text-gh-text-primary mb-2 block text-sm font-medium">
            Valor Total <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <DollarSign className="text-gh-text-tertiary absolute top-2.5 left-3 h-5 w-5" />
            <input
              {...register('totalAmount', { valueAsNumber: true })}
              type="number"
              step="0.01"
              placeholder="0.00"
              className="border-gh-border bg-gh-bg-input text-gh-text-primary w-full rounded-md border py-2 pr-3 pl-10"
            />
          </div>
          {errors.totalAmount && (
            <p className="mt-1 text-sm text-red-500">{errors.totalAmount.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="text-gh-text-primary mb-2 block text-sm font-medium">
            Descrição <span className="text-red-500">*</span>
          </label>
          <input
            {...register('description')}
            placeholder="Descrição da transação"
            className="border-gh-border bg-gh-bg-input text-gh-text-primary w-full rounded-md border px-3 py-2"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>
      </div>

      {/* Payment Configuration */}
      <div className="border-gh-border bg-gh-bg-default space-y-4 rounded-lg border p-4">
        <h3 className="text-gh-text-primary font-semibold">Configuração de Pagamento</h3>

        {/* Group Type */}
        <div>
          <label className="text-gh-text-primary mb-2 block text-sm font-medium">
            Tipo de Transação
          </label>
          <select
            {...register('groupType')}
            className="border-gh-border bg-gh-bg-input text-gh-text-primary w-full rounded-md border px-3 py-2"
          >
            <option value={GroupType.SINGLE}>À Vista</option>
            <option value={GroupType.INSTALLMENT}>Parcelado</option>
            <option value={GroupType.RECURRENT}>Recorrente</option>
            <option value={GroupType.CONTRACT}>Contrato</option>
          </select>
        </div>

        {/* Installment Configuration */}
        {groupType === GroupType.INSTALLMENT && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gh-text-primary mb-2 block text-sm font-medium">
                  Número de Parcelas <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('numberOfInstallments', { valueAsNumber: true })}
                  type="number"
                  min="2"
                  placeholder="2"
                  className="border-gh-border bg-gh-bg-input text-gh-text-primary w-full rounded-md border px-3 py-2"
                />
                {errors.numberOfInstallments && (
                  <p className="mt-1 text-sm text-red-500">{errors.numberOfInstallments.message}</p>
                )}
              </div>

              <div>
                <label className="text-gh-text-primary mb-2 block text-sm font-medium">
                  Valor de Entrada
                </label>
                <input
                  {...register('downpaymentAmount', { valueAsNumber: true })}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="border-gh-border bg-gh-bg-input text-gh-text-primary w-full rounded-md border px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="text-gh-text-primary mb-2 block text-sm font-medium">
                Data da Primeira Parcela <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="text-gh-text-tertiary absolute top-2.5 left-3 h-5 w-5" />
                <input
                  {...register('firstDueDate')}
                  type="date"
                  className="border-gh-border bg-gh-bg-input text-gh-text-primary w-full rounded-md border py-2 pr-3 pl-10"
                />
              </div>
              {errors.firstDueDate && (
                <p className="mt-1 text-sm text-red-500">{errors.firstDueDate.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gh-text-primary mb-2 block text-sm font-medium">
                  Tipo de Plano
                </label>
                <select
                  {...register('planType')}
                  className="border-gh-border bg-gh-bg-input text-gh-text-primary w-full rounded-md border px-3 py-2"
                >
                  <option value={PlanType.SIMPLE}>Simples</option>
                  <option value={PlanType.PRICE}>Tabela Price</option>
                  <option value={PlanType.COMPOUND}>Juros Compostos</option>
                </select>
              </div>

              <div>
                <label className="text-gh-text-primary mb-2 block text-sm font-medium">
                  Intervalo (dias)
                </label>
                <input
                  {...register('intervalDays', { valueAsNumber: true })}
                  type="number"
                  min="1"
                  placeholder="30"
                  className="border-gh-border bg-gh-bg-input text-gh-text-primary w-full rounded-md border px-3 py-2"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Source Info */}
      <div className="border-gh-border bg-gh-bg-default space-y-4 rounded-lg border p-4">
        <h3 className="text-gh-text-primary font-semibold">Origem</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-gh-text-primary mb-2 block text-sm font-medium">
              Tipo de Origem
            </label>
            <select
              {...register('sourceType')}
              className="border-gh-border bg-gh-bg-input text-gh-text-primary w-full rounded-md border px-3 py-2"
            >
              <option value={SourceType.MANUAL}>Manual</option>
              <option value={SourceType.ORDER}>Pedido</option>
              <option value={SourceType.INVOICE}>Nota Fiscal</option>
              <option value={SourceType.CONTRACT}>Contrato</option>
              <option value={SourceType.EXPENSE}>Despesa</option>
            </select>
          </div>

          <div>
            <label className="text-gh-text-primary mb-2 block text-sm font-medium">
              ID de Origem
            </label>
            <input
              {...register('sourceId')}
              placeholder="ID do pedido, contrato, etc"
              className="border-gh-border bg-gh-bg-input text-gh-text-primary w-full rounded-md border px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-gh-border flex justify-end gap-3 border-t pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="border-gh-border bg-gh-bg-default text-gh-text-primary hover:bg-gh-bg-subtle rounded-md border px-4 py-2 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-gh-btn-primary-bg text-gh-btn-primary-text hover:bg-gh-btn-primary-hover rounded-md px-4 py-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Criando...' : 'Criar Transação'}
        </button>
      </div>
    </form>
  )
}
