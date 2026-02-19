'use client'

import React, { forwardRef, useImperativeHandle } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { DatePicker } from '@/components/patterns/DatePicker'
import { InputNumber } from '@/components/ui/InputNumber'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import {
  type InfoBlockFormValues,
  type InfoBlockProps,
  type InfoBlockRef,
  infoBlockSchema,
} from './infoBlock.types'

export const InfoBlockComponent = forwardRef<InfoBlockRef, InfoBlockProps>(
  ({ initialValues, onDataChange, disableDueDate = false, requireAmount = false }, ref) => {
    // Schema dinâmico baseado nas props
    const dynamicSchema = React.useMemo(() => {
      return infoBlockSchema.superRefine((data, ctx) => {
        // Validar valor obrigatório se requireAmount for true
        if (requireAmount && (!data.amount || data.amount <= 0)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Valor é obrigatório para pagamentos parcelados',
            path: ['amount'],
          })
        }

        // Validar data de vencimento se não estiver desabilitada
        if (!disableDueDate && !data.dueDate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Data de vencimento é obrigatória',
            path: ['dueDate'],
          })
        }
      })
    }, [requireAmount, disableDueDate])

    const {
      watch,
      setValue,
      reset,
      getValues,
      formState: { errors },
      trigger,
    } = useForm<InfoBlockFormValues>({
      resolver: zodResolver(dynamicSchema),
      defaultValues: {
        description: '',
        amount: 0,
        dueDate: new Date(),
        notes: '',
        ...initialValues,
      },
      mode: 'onChange',
    })

    const validate = async () => {
      const isValid = await trigger()
      return isValid
    }

    const clearDirty = () => {
      reset(getValues(), { keepValues: true })
    }

    // Expor validação para o parent
    useImperativeHandle(ref, () => ({
      validate,
      getValues,
      clearDirty,
    }))

    const handleChange = (field: keyof InfoBlockFormValues, value: any) => {
      setValue(field, value, { shouldValidate: true, shouldDirty: true })
      onDataChange?.(getValues())
    }

    return (
      <div className="space-y-4">
        {/* Descrição */}
        <div className="space-y-2">
          <Label htmlFor="description">
            Descrição <span className="text-destructive">*</span>
          </Label>
          <Input
            id="description"
            placeholder="Ex: Venda de produto, Pagamento de fornecedor..."
            value={watch('description')}
            onChange={(e) => handleChange('description', e.target.value)}
            className={errors.description ? 'border-destructive' : ''}
          />
          {errors.description && (
            <p className="text-destructive text-sm">{errors.description.message}</p>
          )}
        </div>

        <div className="flex w-full gap-3">
          {/* Valor */}
          <div className="flex-1 space-y-2">
            <Label htmlFor="amount">
              Valor {requireAmount && <span className="text-destructive">*</span>}
            </Label>
            <InputNumber
              id="amount"
              value={watch('amount')}
              onChange={(value) => handleChange('amount', value)}
              float
              min={0}
              mask="real"
              placeholder="R$ 0,00"
              className={errors.amount ? 'border-destructive' : ''}
            />
            {errors.amount && <p className="text-destructive text-sm">{errors.amount.message}</p>}
          </div>

          {/* Data de Vencimento */}
          <div className="flex-1 space-y-2">
            <Label htmlFor="dueDate">
              Data de Vencimento {!disableDueDate && <span className="text-destructive">*</span>}
            </Label>
            <DatePicker
              value={watch('dueDate')}
              onValueChange={(date) => {
                if (date && !disableDueDate) {
                  handleChange('dueDate', date)
                }
              }}
              placeholder="Selecione a data de vencimento"
              disabled={disableDueDate}
              className={errors.dueDate ? 'border-destructive' : ''}
            />
            {disableDueDate && (
              <p className="text-muted-foreground text-xs">
                Data de vencimento não disponível para pagamentos parcelados
              </p>
            )}
            {!disableDueDate && errors.dueDate && (
              <p className="text-destructive text-sm">{errors.dueDate.message}</p>
            )}
          </div>
        </div>

        {/* Notas/Observações */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notas/Observações</Label>
          <Textarea
            id="notes"
            placeholder="Informações adicionais sobre a transação..."
            value={watch('notes') || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={6}
            className={errors.notes ? 'border-destructive' : ''}
          />
          {errors.notes && <p className="text-destructive text-sm">{errors.notes.message}</p>}
        </div>
      </div>
    )
  }
)

InfoBlockComponent.displayName = 'InfoBlockComponent'
