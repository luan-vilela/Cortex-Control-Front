import { InstallmentPlanType, PaymentMode } from '../../types'

import React, { forwardRef, useImperativeHandle } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { InputNumber } from '@/components/ui/InputNumber'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import {
  type PaymentBlockFormValues,
  type PaymentConfigProps,
  type PaymentConfigRef,
  paymentBlockSchema,
} from './paymentBlock.types'

export const PaymentConfigComponent = forwardRef<PaymentConfigRef, PaymentConfigProps>(
  ({ initialValues, onDataChange }, ref) => {
    const {
      watch,
      setValue,
      reset,
      getValues,
      formState: { errors },
      trigger,
    } = useForm<PaymentBlockFormValues>({
      resolver: zodResolver(paymentBlockSchema),
      defaultValues: {
        mode: PaymentMode.CASH,
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

    const handleChange = (field: string, value: any) => {
      setValue(field as any, value, { shouldValidate: true, shouldDirty: true })
      onDataChange?.(getValues())
    }

    const handleModeChange = (mode: PaymentMode) => {
      if (mode === PaymentMode.CASH) {
        reset({
          mode: PaymentMode.CASH,
        })
        onDataChange?.({ mode: PaymentMode.CASH })
      } else if (mode === PaymentMode.INSTALLMENT) {
        reset({
          mode: PaymentMode.INSTALLMENT,
          planType: InstallmentPlanType.SIMPLE,
          numberOfInstallments: 2,
          firstInstallmentDate: new Date(),
          installmentIntervalDays: 30,
        })
        onDataChange?.(getValues())
      }
    }

    const currentMode = watch('mode')

    return (
      <div className="space-y-3">
        <RadioGroup
          value={currentMode}
          onValueChange={(value) => handleModeChange(value as PaymentMode)}
        >
          <div className="grid grid-cols-2 gap-3">
            {/* À Vista */}
            <label className="border-input hover:bg-accent has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/10 dark:has-data-[state=checked]:bg-primary/20 flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors">
              <RadioGroupItem value={PaymentMode.CASH} id="payment-cash" className="mt-1" />
              <div className="flex-1">
                <p className="text-foreground font-medium">À Vista</p>
                <p className="text-muted-foreground text-xs">Pagamento único</p>
              </div>
            </label>

            {/* Parcelado */}
            <label className="border-input hover:bg-accent has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/10 dark:has-data-[state=checked]:bg-primary/20 flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors">
              <RadioGroupItem
                value={PaymentMode.INSTALLMENT}
                id="payment-installment"
                className="mt-1"
              />
              <div className="flex-1">
                <p className="text-foreground font-medium">Parcelado</p>
                <p className="text-muted-foreground text-xs">Múltiplas parcelas</p>
              </div>
            </label>
          </div>
        </RadioGroup>

        {/* Campo de Parcelas */}
        {currentMode === PaymentMode.INSTALLMENT && (
          <div className="border-border space-y-2 border-t pt-3">
            <label className="text-foreground text-sm font-medium">Número de Parcelas</label>
            <InputNumber
              value={(watch as any)('numberOfInstallments') ?? 2}
              onChange={(value) => {
                const installments = Math.max(1, Math.min(365, value || 1))
                handleChange('numberOfInstallments', installments)
              }}
              min={1}
              max={365}
              placeholder="Digite o número de parcelas"
              className={(errors as any).numberOfInstallments ? 'border-destructive' : ''}
            />
            {(errors as any).numberOfInstallments && (
              <p className="text-destructive text-sm">
                {(errors as any).numberOfInstallments.message}
              </p>
            )}
          </div>
        )}
      </div>
    )
  }
)

PaymentConfigComponent.displayName = 'PaymentConfigComponent'
