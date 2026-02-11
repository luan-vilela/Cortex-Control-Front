'use client'

import { forwardRef, useImperativeHandle, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { DatePicker } from '@/components/patterns/DatePicker'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import {
  RECURRENCE_LABELS,
  type RecurrenceBlockFormValues,
  type RecurrenceConfigComponentProps,
  type RecurrenceConfigComponentRef,
  recurrenceBlockSchema,
} from './recurrenceBlock.types'

export const RecurrenceConfigComponent = forwardRef<
  RecurrenceConfigComponentRef,
  RecurrenceConfigComponentProps
>(({ initialValues, onDataChange }, ref) => {
  const [endDateType, setEndDateType] = useState<'occurrences' | 'date'>('occurrences')
  const {
    watch,
    trigger,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RecurrenceBlockFormValues>({
    resolver: zodResolver(recurrenceBlockSchema),
    defaultValues: {
      type: 'MONTHLY',
      occurrences: 1,
      endDate: undefined,
      ...initialValues,
    },
  })

  const validate = async () => {
    const isValid = await trigger()
    return isValid
  }

  const clearDirty = () => {
    reset(getValues(), { keepValues: true })
  }

  useImperativeHandle(ref, () => ({
    validate,
    getValues,
    clearDirty,
  }))

  // Atualiza valores e notifica parent
  const handleChange = (field: keyof RecurrenceBlockFormValues, value: any) => {
    setValue(field, value, { shouldValidate: false, shouldDirty: true })
    onDataChange?.(getValues())
  }

  return (
    <div className="space-y-3">
      <RadioGroup
        value={watch('type') ? 'with' : 'without'}
        onValueChange={(value) => {
          if (value === 'without') {
            handleChange('type', undefined)
            handleChange('occurrences', 1)
            handleChange('endDate', undefined)
          } else {
            handleChange('type', 'MONTHLY')
            handleChange('occurrences', 1)
            setEndDateType('occurrences')
          }
        }}
      >
        {/* Opção 1: Sem Recorrência */}
        <label className="border-input hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10 dark:has-[[data-state=checked]]:bg-primary/20 flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors">
          <RadioGroupItem value="without" id="recurrence-without" className="mt-1" />
          <div className="flex-1">
            <p className="text-foreground font-medium">Sem Recorrência</p>
            <p className="text-muted-foreground text-xs">Transação única</p>
          </div>
        </label>

        {/* Opção 2: Com Recorrência */}
        <label className="border-input hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10 dark:has-[[data-state=checked]]:bg-primary/20 flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors">
          <RadioGroupItem value="with" id="recurrence-with" className="mt-1" />
          <div className="flex-1">
            <p className="text-foreground font-medium">Com Recorrência</p>
            <p className="text-muted-foreground text-xs">Repetir transação periodicamente</p>
          </div>
        </label>
      </RadioGroup>

      {/* Opções de Recorrência - Aparecem quando "Com Recorrência" selecionado */}
      {watch('type') && (
        <div className="border-border space-y-3 border-t pt-4">
          {/* Tipo de Frequência */}
          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium">Frequência</label>
            <select
              value={watch('type')}
              onChange={(e) => handleChange('type', e.target.value)}
              className="border-input bg-background text-foreground w-full rounded border px-3 py-2 text-sm"
            >
              {Object.entries(RECURRENCE_LABELS).map(([type, label]) => (
                <option key={type} value={type}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Opção: Quantidade vs Data */}
          <div className="flex gap-3">
            <label className="border-input hover:bg-accent flex flex-1 cursor-pointer items-center gap-2 rounded border p-2 transition-colors">
              <input
                type="radio"
                name="endDateType"
                value="occurrences"
                checked={endDateType === 'occurrences'}
                onChange={() => setEndDateType('occurrences')}
                className="h-3 w-3"
              />
              <span className="text-foreground text-xs font-medium">Quantidade</span>
            </label>

            <label className="border-input hover:bg-accent flex flex-1 cursor-pointer items-center gap-2 rounded border p-2 transition-colors">
              <input
                type="radio"
                name="endDateType"
                value="date"
                checked={endDateType === 'date'}
                onChange={() => setEndDateType('date')}
                className="h-3 w-3"
              />
              <span className="text-foreground text-xs font-medium">Data Final</span>
            </label>
          </div>

          {/* Campo de Quantidade ou Data */}
          {endDateType === 'occurrences' ? (
            <div className="space-y-2">
              <label className="text-muted-foreground text-xs font-medium">
                Número de Repetições (1-365)
              </label>
              <Input
                type="number"
                min="1"
                value={watch('occurrences') || ''}
                onChange={(e) => handleChange('occurrences', parseInt(e.target.value, 10))}
                placeholder="12"
                className={errors.occurrences ? 'border-destructive' : ''}
              />
              {errors.occurrences && (
                <p className="text-destructive text-sm">{errors.occurrences.message}</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-muted-foreground text-xs font-medium">Data Final</label>
              <DatePicker
                value={watch('endDate')}
                onValueChange={(date) => handleChange('endDate', date)}
                placeholder="Selecionar data final"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
})

RecurrenceConfigComponent.displayName = 'RecurrenceConfigComponent'
