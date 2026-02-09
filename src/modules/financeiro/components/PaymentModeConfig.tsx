"use client";

import {
  PaymentMode,
  CashPaymentConfig,
  InstallmentPaymentConfig,
  InstallmentPlanType,
} from "../types";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface PaymentModeConfigProps {
  config?: CashPaymentConfig | InstallmentPaymentConfig;
  onChange: (config: CashPaymentConfig | InstallmentPaymentConfig) => void;
}

const PAYMENT_MODE_LABELS: Record<PaymentMode, string> = {
  [PaymentMode.CASH]: "À Vista",
  [PaymentMode.INSTALLMENT]: "Parcelado",
};

export function PaymentModeConfig({
  config,
  onChange,
}: PaymentModeConfigProps) {
  const [expanded, setExpanded] = useState(false);

  const handleModeChange = (mode: PaymentMode) => {
    if (mode === PaymentMode.CASH) {
      const newConfig: CashPaymentConfig = { mode: PaymentMode.CASH };
      onChange(newConfig);
    } else if (mode === PaymentMode.INSTALLMENT) {
      const newConfig: InstallmentPaymentConfig = {
        mode: PaymentMode.INSTALLMENT,
        planType: InstallmentPlanType.PRICE_TABLE,
        numberOfInstallments: 12,
        firstInstallmentDate: new Date(),
        installmentIntervalDays: 30,
      };
      onChange(newConfig);
    }
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 border border-gh-border rounded-lg bg-gh-card hover:bg-gh-hover transition-colors"
      >
        <div className="text-left">
          <h3 className="font-medium text-gh-text">Modo de Pagamento</h3>
          <p className="text-xs text-gh-text-secondary">
            {config
              ? PAYMENT_MODE_LABELS[config.mode] || "Selecione um modo"
              : "Selecione um modo"}
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gh-text-secondary" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gh-text-secondary" />
        )}
      </button>

      {expanded && (
        <div className="pl-4 pr-4 space-y-3">
          {/* Modo: À Vista */}
          <label className="flex items-center gap-3 p-3 border border-gh-border rounded-lg cursor-pointer hover:bg-gh-hover">
            <input
              type="radio"
              name="paymentMode"
              value={PaymentMode.CASH}
              checked={config?.mode === PaymentMode.CASH}
              onChange={() => handleModeChange(PaymentMode.CASH)}
              className="w-4 h-4"
            />
            <div>
              <p className="font-medium text-gh-text">À Vista</p>
              <p className="text-xs text-gh-text-secondary">
                Pagamento único com recorrência opcional
              </p>
            </div>
          </label>

          {/* Modo: Parcelado */}
          <label className="flex items-center gap-3 p-3 border border-gh-border rounded-lg cursor-pointer hover:bg-gh-hover">
            <input
              type="radio"
              name="paymentMode"
              value={PaymentMode.INSTALLMENT}
              checked={config?.mode === PaymentMode.INSTALLMENT}
              onChange={() => handleModeChange(PaymentMode.INSTALLMENT)}
              className="w-4 h-4"
            />
            <div>
              <p className="font-medium text-gh-text">Parcelado</p>
              <p className="text-xs text-gh-text-secondary">
                Dividir em múltiplas parcelas
              </p>
            </div>
          </label>
        </div>
      )}
    </div>
  );
}
