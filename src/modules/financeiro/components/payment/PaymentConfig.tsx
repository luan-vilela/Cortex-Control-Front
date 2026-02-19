import { InstallmentPlanType, PaymentMode } from '../../types'

import { forwardRef, useImperativeHandle } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { DatePicker } from '@/components/patterns/DatePicker'
import { InputNumber } from '@/components/ui/InputNumber'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

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
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)

        reset({
          mode: PaymentMode.INSTALLMENT,
          numberOfInstallments: 2,
          downPayment: 0,
          planType: InstallmentPlanType.SIMPLE,
          firstInstallmentDate: tomorrow,
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

        {/* Campos de Parcelamento */}
        {currentMode === PaymentMode.INSTALLMENT && (
          <div className="border-border mt-6 space-y-3 border-t pt-3">
            <p className="text-primary/50 pb-2 text-sm font-normal">Detalhes do Parcelamento</p>

            {/* Tabs para tipo de amortização */}
            <div className="flex flex-col gap-2">
              <Label>Tipo de Amortização</Label>
              <div className="w-full">
                <Tabs
                  value={(watch as any)('planType') ?? 'SIMPLE'}
                  onValueChange={(value) => handleChange('planType', value)}
                  className="w-full"
                >
                  <TabsList className="flex w-full gap-2">
                    <TabsTrigger value="SIMPLE">Simples</TabsTrigger>
                    <TabsTrigger value="PRICE_TABLE">Price</TabsTrigger>
                    <TabsTrigger value="SAC">SAC</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
            {/* Valor de Entrada */}
            <div className="flex w-full gap-3">
              <div className="flex-1 space-y-2">
                <Label htmlFor="numberOfInstallments">Número de Parcelas</Label>
                <InputNumber
                  id="numberOfInstallments"
                  value={(watch as any)('numberOfInstallments') ?? 2}
                  onChange={(value) => {
                    const installments = Math.max(2, Math.min(365, value || 2))
                    handleChange('numberOfInstallments', installments)
                  }}
                  min={2}
                  max={365}
                  placeholder="Digite o número de parcelas (mínimo 2)"
                  className={(errors as any).numberOfInstallments ? 'border-destructive' : ''}
                />
                {(errors as any).numberOfInstallments && (
                  <p className="text-destructive text-sm">
                    {(errors as any).numberOfInstallments.message}
                  </p>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="downPayment">Valor de Entrada (Opcional)</Label>
                <InputNumber
                  id="downPayment"
                  value={(watch as any)('downPayment') ?? 0}
                  onChange={(value) => {
                    handleChange('downPayment', value || 0)
                    // Se tem entrada e não tem o campo, marca como pago por padrão
                    if (value && value > 0 && (watch as any)('downPaymentIsPaid') === undefined) {
                      handleChange('downPaymentIsPaid', true)
                    }
                  }}
                  float
                  min={0}
                  mask="real"
                  placeholder="R$ 0,00"
                  className={(errors as any).downPayment ? 'border-destructive' : ''}
                />
                {(errors as any).downPayment && (
                  <p className="text-destructive text-sm">{(errors as any).downPayment.message}</p>
                )}
              </div>
            </div>

            {/* Switch para entrada já paga - só aparece se houver entrada */}
            {((watch as any)('downPayment') ?? 0) > 0 && (
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
                <div className="space-y-0.5">
                  <Label htmlFor="downPaymentIsPaid" className="text-sm font-medium">
                    Entrada já foi paga?
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Marque se a entrada já foi recebida/paga
                  </p>
                </div>
                <Switch
                  id="downPaymentIsPaid"
                  checked={(watch as any)('downPaymentIsPaid') ?? true}
                  onCheckedChange={(checked) => {
                    handleChange('downPaymentIsPaid', checked)
                    if (checked) {
                      handleChange('downPaymentDate', new Date())
                    } else {
                      handleChange('downPaymentDate', undefined)
                    }
                  }}
                />
              </div>
            )}

            <div className="flex w-full gap-3">
              {/* Data da Primeira Parcela */}
              <div className="flex-1 space-y-2">
                <Label htmlFor="firstInstallmentDate">Data da Entrada ou 1ª Parcela</Label>
                <DatePicker
                  value={(watch as any)('firstInstallmentDate')}
                  onValueChange={(date) => {
                    if (date) {
                      handleChange('firstInstallmentDate', date)
                    }
                  }}
                  placeholder="Selecione a data da primeira parcela"
                  className={(errors as any).firstInstallmentDate ? 'border-destructive' : ''}
                />
                {(errors as any).firstInstallmentDate && (
                  <p className="text-destructive text-sm">
                    {(errors as any).firstInstallmentDate.message}
                  </p>
                )}
              </div>

              {/* Intervalo entre Parcelas */}
              <div className="flex-1 space-y-2">
                <Label htmlFor="installmentIntervalDays">Intervalo entre Parcelas</Label>
                <Select
                  value={String((watch as any)('installmentIntervalDays') ?? 30)}
                  onValueChange={(value) => handleChange('installmentIntervalDays', Number(value))}
                >
                  <SelectTrigger
                    className={
                      (errors as any).installmentIntervalDays
                        ? 'border-destructive w-full'
                        : 'w-full'
                    }
                  >
                    <SelectValue placeholder="Selecione o intervalo" />
                  </SelectTrigger>
                  <SelectContent className="w-full min-w-[220px]">
                    <SelectItem value="7">Semanal (7 dias)</SelectItem>
                    <SelectItem value="14">Quinzenal (14 dias)</SelectItem>
                    <SelectItem value="30">Mensal (30 dias)</SelectItem>
                    <SelectItem value="60">Bimensal (60 dias)</SelectItem>
                    <SelectItem value="90">Trimestral (90 dias)</SelectItem>
                    <SelectItem value="365">Anual (365 dias)</SelectItem>
                  </SelectContent>
                </Select>
                {(errors as any).installmentIntervalDays && (
                  <p className="text-destructive text-sm">
                    {(errors as any).installmentIntervalDays.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
)

PaymentConfigComponent.displayName = 'PaymentConfigComponent'
