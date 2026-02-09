'use client'

import type { CashPaymentConfig, InstallmentPaymentConfig } from '../types'
import { InstallmentPlanType, PaymentMode } from '../types'

import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface PaymentModeConfigProps {
  config?: CashPaymentConfig | InstallmentPaymentConfig
  onChange: (config: CashPaymentConfig | InstallmentPaymentConfig) => void
}

export function PaymentModeConfig({ config, onChange }: PaymentModeConfigProps) {
  const handleModeChange = (mode: PaymentMode) => {
    if (mode === PaymentMode.CASH) {
      const newConfig: CashPaymentConfig = { mode: PaymentMode.CASH }
      onChange(newConfig)
    } else if (mode === PaymentMode.INSTALLMENT) {
      const newConfig: InstallmentPaymentConfig = {
        mode: PaymentMode.INSTALLMENT,
        planType: InstallmentPlanType.PRICE_TABLE,
        numberOfInstallments: 12,
        firstInstallmentDate: new Date(),
        installmentIntervalDays: 30,
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
        {/* À Vista */}
        <label className="flex cursor-pointer gap-3 rounded-lg border border-input p-3 transition-colors hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10 dark:has-[[data-state=checked]]:bg-primary/20">
          <RadioGroupItem value={PaymentMode.CASH} id="payment-cash" className="mt-1" />
          <div className="flex-1">
            <p className="font-medium text-foreground">À Vista</p>
            <p className="text-xs text-muted-foreground">Pagamento único</p>
          </div>
        </label>

        {/* Parcelado */}
        <label className="flex cursor-pointer gap-3 rounded-lg border border-input p-3 transition-colors hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10 dark:has-[[data-state=checked]]:bg-primary/20">
          <RadioGroupItem value={PaymentMode.INSTALLMENT} id="payment-installment" className="mt-1" />
          <div className="flex-1">
            <p className="font-medium text-foreground">Parcelado</p>
            <p className="text-xs text-muted-foreground">Múltiplas parcelas</p>
          </div>
        </label>
      </RadioGroup>

      {/* Campo de Parcelas */}
      {config?.mode === PaymentMode.INSTALLMENT && (
        <div className="border-t border-border pt-4">
          <label className="mb-2 block">
            <p className="mb-2 text-sm font-medium text-foreground">Número de Parcelas</p>
            <Input
              type="number"
              min="1"
              max="365"
              value={(config as InstallmentPaymentConfig).numberOfInstallments || 12}
              onChange={(e) => {
                const installments = Math.max(1, Math.min(365, parseInt(e.target.value) || 12))
                const newConfig: InstallmentPaymentConfig = {
                  ...config,
                  mode: PaymentMode.INSTALLMENT,
                  numberOfInstallments: installments,
                }
                onChange(newConfig)
              }}
              placeholder="Digite o número de parcelas"
            />
          </label>
        </div>
      )}
    </div>
  )
}
