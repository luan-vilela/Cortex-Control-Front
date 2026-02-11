import React, { forwardRef, useImperativeHandle } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { InputNumber } from '@/components/ui/InputNumber'
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
        description: '',
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

    const handleEnableInterest = () => {
      handleChange('type', InterestType.PERCENTAGE)
      handleChange('percentage', 1)
      handleChange('flatAmount', undefined)
      handleChange('description', '')
    }

    const handleDisableInterest = () => {
      handleChange('type', undefined)
      handleChange('percentage', undefined)
      handleChange('flatAmount', undefined)
      handleChange('description', '')
      onDataChange?.(undefined)
    }

    const hasInterest = !!watch('type')

    return (
      <div className="space-y-3">
        <RadioGroup
          value={hasInterest ? 'with' : 'without'}
          onValueChange={(value) => {
            if (value === 'without') {
              handleDisableInterest()
            } else {
              handleEnableInterest()
            }
          }}
        >
          {/* Opção 1: Sem Taxas ou Juros */}
          <label className="border-input hover:bg-accent has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/10 dark:has-data-[state=checked]:bg-primary/20 flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors">
            <RadioGroupItem value="without" id="interest-without" className="mt-1" />
            <div className="flex-1">
              <p className="text-foreground font-medium">Sem Taxas ou Juros</p>
              <p className="text-muted-foreground text-xs">Nenhuma taxa adicional</p>
            </div>
          </label>

          {/* Opção 2: Com Taxas ou Juros */}
          <label className="border-input hover:bg-accent has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/10 dark:has-data-[state=checked]:bg-primary/20 flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors">
            <RadioGroupItem value="with" id="interest-with" className="mt-1" />
            <div className="flex-1">
              <p className="text-foreground font-medium">Com Taxas ou Juros</p>
              <p className="text-muted-foreground text-xs">Adicionar juros ou taxas</p>
            </div>
          </label>
        </RadioGroup>

        {/* Opções de Taxas - Aparecem quando "Com Taxas ou Juros" selecionado */}
        {hasInterest && (
          <div className="border-border space-y-3 border-t pt-4">
            {/* Tipo: Percentual ou Valor Fixo */}
            <div className="flex gap-2">
              <label className="border-input hover:bg-accent flex flex-1 cursor-pointer items-center gap-2 rounded border p-2 transition-colors">
                <input
                  type="radio"
                  name="chargeType"
                  value="percentage"
                  checked={watch('type') === InterestType.PERCENTAGE}
                  onChange={() => {
                    handleChange('type', InterestType.PERCENTAGE)
                    if (!watch('percentage')) handleChange('percentage', 1)
                  }}
                  className="h-3 w-3"
                />
                <span className="text-foreground text-xs font-medium">Percentual (%)</span>
              </label>

              <label className="border-input hover:bg-accent flex flex-1 cursor-pointer items-center gap-2 rounded border p-2 transition-colors">
                <input
                  type="radio"
                  name="chargeType"
                  value="flat"
                  checked={watch('type') === InterestType.FLAT}
                  onChange={() => {
                    handleChange('type', InterestType.FLAT)
                    if (!watch('flatAmount')) handleChange('flatAmount', 0)
                  }}
                  className="h-3 w-3"
                />
                <span className="text-foreground text-xs font-medium">Valor Fixo (R$)</span>
              </label>
            </div>

            {/* Campo de Valor */}
            <div className="space-y-2">
              <label className="text-muted-foreground text-xs font-medium">
                {watch('type') === InterestType.PERCENTAGE ? 'Taxa (%)' : 'Valor (R$)'}
              </label>
              {watch('type') === InterestType.PERCENTAGE ? (
                <InputNumber
                  value={watch('percentage') ?? 0}
                  onChange={(val) => {
                    handleChange('percentage', val)
                  }}
                  float={true}
                  min={0}
                  placeholder="Ex: 2.5"
                  className={errors.percentage ? 'border-destructive' : ''}
                />
              ) : (
                <InputNumber
                  value={watch('flatAmount') ?? 0}
                  onChange={(val) => {
                    handleChange('flatAmount', val)
                  }}
                  float={true}
                  min={0}
                  placeholder="R$ 0,00"
                  mask="real"
                  className={errors.flatAmount ? 'border-destructive' : ''}
                />
              )}
              {(errors.percentage || errors.flatAmount) && (
                <p className="text-destructive text-sm">
                  {errors.percentage?.message ||
                    errors.flatAmount?.message ||
                    'Informe um valor válido'}
                </p>
              )}
            </div>

            {/* Campo de Descrição */}
            <div className="space-y-2">
              <label className="text-muted-foreground text-xs font-medium">
                Descrição (opcional)
              </label>
              <Input
                type="text"
                value={watch('description') || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Ex: Taxa de administração"
              />
            </div>
          </div>
        )}
      </div>
    )
  }
)

InterestConfigComponent.displayName = 'InterestConfigComponent'
