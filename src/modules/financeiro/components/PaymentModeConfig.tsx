'use client'

import type { CashPaymentConfig, InstallmentPaymentConfig } from '../types'
import { InstallmentPlanType, PaymentMode } from '../types'

import { InputNumber } from '@/components/ui/InputNumber'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface PaymentModeConfigProps {
  config?: CashPaymentConfig | InstallmentPaymentConfig
  onChange: (config: CashPaymentConfig | InstallmentPaymentConfig) => void
  error?: string
}

export function PaymentModeConfig({ config, onChange, error }: PaymentModeConfigProps) {
  const handleModeChange = (mode: PaymentMode) => {
    if (mode === PaymentMode.CASH) {
      const newConfig: CashPaymentConfig = { mode: PaymentMode.CASH }
      onChange(newConfig)
    } else if (mode === PaymentMode.INSTALLMENT) {
      const newConfig: InstallmentPaymentConfig = {
        mode: PaymentMode.INSTALLMENT,
        planType: InstallmentPlanType.PRICE_TABLE,
        numberOfInstallments: 1,
        firstInstallmentDate: new Date(),
        installmentIntervalDays: 30,
        downPaymentIsPaid: false
      }
      onChange(newConfig)
    }
  }
  return (
    <div className="space-y-3">
      <RadioGroup
        value={config?.mode || PaymentMode.CASH}
        onValueChange={(value) => handleModeChange(value as PaymentMode)}
      >
        <div className="grid grid-cols-2 gap-3">
          {/* À Vista */}
          <label className="border-input hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10 dark:has-[[data-state=checked]]:bg-primary/20 flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors">
            <RadioGroupItem value={PaymentMode.CASH} id="payment-cash" className="mt-1" />
            <div className="flex-1">
              <p className="text-foreground font-medium">À Vista</p>
              <p className="text-muted-foreground text-xs">Pagamento único</p>
            </div>
          </label>

          {/* Parcelado */}
          <label className="border-input hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10 dark:has-[[data-state=checked]]:bg-primary/20 flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors">
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

      {/* Campo de Parcelas - Ocupa coluna cheia */}
      {config?.mode === PaymentMode.INSTALLMENT && (
        <div className="border-border space-y-2 border-t pt-3">
          <label className="text-foreground text-sm font-medium">Número de Parcelas</label>
          <InputNumber
            value={(config as InstallmentPaymentConfig).numberOfInstallments}
            onChange={(value) => {
              const installments = Math.max(0, Math.min(365, value || 0))
              const newConfig: InstallmentPaymentConfig = {
                ...config,
                mode: PaymentMode.INSTALLMENT,
                numberOfInstallments: installments,
              }
              onChange(newConfig)
            }}
            min={0}
            max={365}
            placeholder="Digite o número de parcelas"
            className={error ? 'border-destructive' : ''}
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
      )}
    </div>
  )
}
