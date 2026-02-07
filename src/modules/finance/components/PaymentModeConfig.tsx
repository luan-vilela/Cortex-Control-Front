"use client";

import { PaymentMode, PaymentConfig } from "../types";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface PaymentModeConfigProps {
  config?: PaymentConfig;
  onChange: (config: PaymentConfig) => void;
}

const PAYMENT_MODE_LABELS: Record<PaymentMode, string> = {
  [PaymentMode.CASH]: "À Vista",
  [PaymentMode.INSTALLMENT]: "Parcelado",
  [PaymentMode.DEFERRED]: "Diferido",
};

export function PaymentModeConfig({
  config,
  onChange,
}: PaymentModeConfigProps) {
  const [expanded, setExpanded] = useState(false);

  const handleModeChange = (mode: PaymentMode) => {
    const newConfig: PaymentConfig = { mode };

    if (mode === PaymentMode.INSTALLMENT) {
      newConfig.installments = config?.installments || 2;
      newConfig.installmentAmount = undefined;
    } else if (mode === PaymentMode.DEFERRED) {
      newConfig.deferralDays = config?.deferralDays || 15;
    }

    onChange(newConfig);
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
                Pagamento integral na data de vencimento
              </p>
            </div>
          </label>

          {/* Modo: Parcelado */}
          <label className="flex items-start gap-3 p-3 border border-gh-border rounded-lg cursor-pointer hover:bg-gh-hover">
            <input
              type="radio"
              name="paymentMode"
              value={PaymentMode.INSTALLMENT}
              checked={config?.mode === PaymentMode.INSTALLMENT}
              onChange={() => handleModeChange(PaymentMode.INSTALLMENT)}
              className="w-4 h-4 mt-1"
            />
            <div className="flex-1">
              <p className="font-medium text-gh-text">Parcelado</p>
              <p className="text-xs text-gh-text-secondary mb-2">
                Dividir em parcelas iguais
              </p>
              {config?.mode === PaymentMode.INSTALLMENT && (
                <input
                  type="number"
                  min="2"
                  max="60"
                  value={config.installments || 2}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      installments: parseInt(e.target.value),
                    })
                  }
                  className="w-20 px-2 py-1 text-sm border border-gh-border rounded bg-white dark:bg-gh-bg text-gh-text"
                  placeholder="Parcelas"
                />
              )}
            </div>
          </label>

          {/* Modo: Diferido */}
          <label className="flex items-start gap-3 p-3 border border-gh-border rounded-lg cursor-pointer hover:bg-gh-hover">
            <input
              type="radio"
              name="paymentMode"
              value={PaymentMode.DEFERRED}
              checked={config?.mode === PaymentMode.DEFERRED}
              onChange={() => handleModeChange(PaymentMode.DEFERRED)}
              className="w-4 h-4 mt-1"
            />
            <div className="flex-1">
              <p className="font-medium text-gh-text">Diferido</p>
              <p className="text-xs text-gh-text-secondary mb-2">
                Adiar o pagamento por um período
              </p>
              {config?.mode === PaymentMode.DEFERRED && (
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={config.deferralDays || 15}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      deferralDays: parseInt(e.target.value),
                    })
                  }
                  className="w-24 px-2 py-1 text-sm border border-gh-border rounded bg-white dark:bg-gh-bg text-gh-text"
                  placeholder="Dias"
                />
              )}
            </div>
          </label>
        </div>
      )}
    </div>
  );
}
