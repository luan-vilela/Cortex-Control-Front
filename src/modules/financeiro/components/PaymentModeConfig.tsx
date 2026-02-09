'use client'

import {
  CashPaymentConfig,
  InstallmentPaymentConfig,
  InstallmentPlanType,
  PaymentMode,
} from '../types'

import { useState } from 'react'

import { Input } from '@/components/ui/input'

interface PaymentModeConfigProps {
  config?: CashPaymentConfig | InstallmentPaymentConfig
  onChange: (config: CashPaymentConfig | InstallmentPaymentConfig) => void
}

const PAYMENT_MODE_LABELS: Record<PaymentMode, string> = {
  [PaymentMode.CASH]: 'À Vista',
  [PaymentMode.INSTALLMENT]: 'Parcelado',
}

export function PaymentModeConfig({ config, onChange }: PaymentModeConfigProps) {
  const [expanded, setExpanded] = useState(false)

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
      <h3 className="text-gh-text text-sm font-medium">Modo de Pagamento</h3>
      <div className="grid grid-cols-2 gap-3">
        {/* À Vista */}
        <label className="border-gh-border hover:bg-gh-hover flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 dark:has-[:checked]:bg-blue-950">
          <input
            type="radio"
            name="paymentMode"
            value={PaymentMode.CASH}
            checked={config?.mode === PaymentMode.CASH}
            onChange={() => handleModeChange(PaymentMode.CASH)}
            className="h-4 w-4"
          />
          <div>
            <p className="text-gh-text text-sm font-medium">À Vista</p>
            <p className="text-gh-text-secondary text-xs">Pagamento único</p>
          </div>
        </label>

        {/* Parcelado */}
        <label className="border-gh-border hover:bg-gh-hover flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 dark:has-[:checked]:bg-blue-950">
          <input
            type="radio"
            name="paymentMode"
            value={PaymentMode.INSTALLMENT}
            checked={config?.mode === PaymentMode.INSTALLMENT}
            onChange={() => handleModeChange(PaymentMode.INSTALLMENT)}
            className="h-4 w-4"
          />
          <div>
            <p className="text-gh-text text-sm font-medium">Parcelado</p>
            <p className="text-gh-text-secondary text-xs">Múltiplas parcelas</p>
          </div>
        </label>
      </div>

      {/* Campo de Parcelas */}
      {config?.mode === PaymentMode.INSTALLMENT && (
        <div className="border-gh-border mt-4 border-t pt-4">
          <label className="mb-2 block">
            <p className="text-gh-text mb-2 text-sm font-medium">Número de Parcelas</p>
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
              className="w-full"
              placeholder="Digite o número de parcelas"
            />
          </label>
        </div>
      )}
    </div>
  )
}
