import React, { forwardRef, useImperativeHandle } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import {
  type InterestBlockFormValues,
  type InterestConfigProps,
  type InterestConfigRef,
  InterestType,
  interestBlockSchema,
} from './interestBlock.types'

export const InterestConfigComponent = forwardRef<InterestConfigRef, InterestConfigProps>(
  ({ initialValues, onDataChange }, ref) => {
    const {
      watch,
      setValue,
      reset,
      getValues,
      formState: { errors },
      trigger,
    } = useForm<InterestBlockFormValues>({
      resolver: zodResolver(interestBlockSchema),
      defaultValues: {
        type: InterestType.PERCENTAGE,
        percentage: undefined,
        flatAmount: undefined,
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

    const handleChange = (field: keyof InterestBlockFormValues, value: any) => {
      setValue(field, value, { shouldValidate: false, shouldDirty: true })
      onDataChange?.(getValues())
    }

    return (
      <div className="space-y-3">
        <RadioGroup
          value={watch('type')}
          onValueChange={(value) => {
            handleChange('type', value as InterestType)
            handleChange('percentage', undefined)
            handleChange('flatAmount', undefined)
          }}
        >
          <label className="border-input hover:bg-accent has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/10 dark:has-data-[state=checked]:bg-primary/20 flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors">
            <RadioGroupItem
              value={InterestType.PERCENTAGE}
              id="interest-percentage"
              className="mt-1"
            />
            <div className="flex-1">
              <p className="text-foreground font-medium">Percentual</p>
              <p className="text-muted-foreground text-xs">Taxa em % sobre valor</p>
            </div>
          </label>
          <label className="border-input hover:bg-accent has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/10 dark:has-data-[state=checked]:bg-primary/20 flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors">
            <RadioGroupItem value={InterestType.FLAT} id="interest-flat" className="mt-1" />
            <div className="flex-1">
              <p className="text-foreground font-medium">Valor Fixo</p>
              <p className="text-muted-foreground text-xs">Valor fixo por transação</p>
            </div>
          </label>
        </RadioGroup>

        {watch('type') === InterestType.PERCENTAGE && (
          <div className="space-y-2">
            <label className="text-muted-foreground text-xs font-medium">Taxa Percentual (%)</label>
            <Input
              type="number"
              min="0.01"
              step="0.01"
              value={watch('percentage') ?? ''}
              onChange={(e) => handleChange('percentage', parseFloat(e.target.value))}
              placeholder="Ex: 2.5"
              className={errors.percentage ? 'border-destructive' : ''}
            />
            {errors.percentage && (
              <p className="text-destructive text-sm">Informe uma taxa válida</p>
            )}
          </div>
        )}
        {watch('type') === InterestType.FLAT && (
          <div className="space-y-2">
            <label className="text-muted-foreground text-xs font-medium">Valor Fixo (R$)</label>
            <Input
              type="number"
              min="0.01"
              step="0.01"
              value={watch('flatAmount') ?? ''}
              onChange={(e) => handleChange('flatAmount', parseFloat(e.target.value))}
              placeholder="Ex: 10.00"
              className={errors.flatAmount ? 'border-destructive' : ''}
            />
            {errors.flatAmount && (
              <p className="text-destructive text-sm">Informe um valor válido</p>
            )}
          </div>
        )}
      </div>
    )
  }
)

InterestConfigComponent.displayName = 'InterestConfigComponent'

// if (interest) {
//   if (interest.type === InterestType.PERCENTAGE) {
//     if (!interest.percentage || interest.percentage <= 0) {
//       setErrors((prev) => ({ ...prev, interest: 'Taxa percentual deve ser maior que 0' }))
//       hasErrors = true
//     }
//   } else if (interest.type === InterestType.FLAT) {
//     if (!interest.flatAmount || interest.flatAmount <= 0) {
//       setErrors((prev) => ({ ...prev, interest: 'Valor fixo deve ser maior que 0' }))
//       hasErrors = true
//     }
//   }
// }
