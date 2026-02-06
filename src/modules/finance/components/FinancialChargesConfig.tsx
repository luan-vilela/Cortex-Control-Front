"use client";

import { FinancialCharge, FinancialChargeType } from "../types";
import { Button } from "@/components/ui/Button";
import { Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface FinancialChargesConfigProps {
  charges?: FinancialCharge[];
  onChange: (charges: FinancialCharge[]) => void;
}

const CHARGE_TYPE_LABELS: Record<FinancialChargeType, string> = {
  [FinancialChargeType.INTEREST]: "Juros",
  [FinancialChargeType.FINE]: "Multa",
  [FinancialChargeType.DISCOUNT]: "Desconto",
  [FinancialChargeType.SURCHARGE]: "Acréscimo",
};

export function FinancialChargesConfig({
  charges = [],
  onChange,
}: FinancialChargesConfigProps) {
  const [expanded, setExpanded] = useState(false);
  const [newCharge, setNewCharge] = useState<Partial<FinancialCharge>>({
    type: FinancialChargeType.INTEREST,
    percentage: 0,
  });

  const addCharge = () => {
    if (
      !newCharge.description ||
      (newCharge.percentage === 0 && !newCharge.flatAmount)
    ) {
      alert("Preencha descrição e um valor (percentual ou fixo)");
      return;
    }

    onChange([
      ...charges,
      {
        type: newCharge.type as FinancialChargeType,
        description: newCharge.description || "",
        percentage: newCharge.percentage || 0,
        flatAmount: newCharge.flatAmount,
      },
    ]);

    setNewCharge({
      type: FinancialChargeType.INTEREST,
      percentage: 0,
    });
  };

  const removeCharge = (index: number) => {
    onChange(charges.filter((_, i) => i !== index));
  };

  const totalPercentage = charges.reduce(
    (sum, c) => sum + (c.percentage || 0),
    0,
  );

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 border border-gh-border rounded-lg bg-gh-card hover:bg-gh-hover transition-colors"
      >
        <div className="text-left">
          <h3 className="font-medium text-gh-text">Taxas Financeiras</h3>
          <p className="text-xs text-gh-text-secondary">
            {charges.length === 0
              ? "Nenhuma taxa adicionada"
              : `${charges.length} taxa${charges.length > 1 ? "s" : ""} ${totalPercentage > 0 ? `(${totalPercentage}%)` : ""}`}
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gh-text-secondary" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gh-text-secondary" />
        )}
      </button>

      {expanded && (
        <div className="pl-4 pr-4 space-y-4">
          {/* Lista de taxas existentes */}
          {charges.length > 0 && (
            <div className="space-y-2">
              {charges.map((charge, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gh-border rounded-lg bg-gh-card"
                >
                  <div>
                    <p className="font-medium text-gh-text">
                      {charge.description}
                    </p>
                    <p className="text-xs text-gh-text-secondary">
                      {CHARGE_TYPE_LABELS[charge.type]} •{" "}
                      {charge.percentage > 0
                        ? `${charge.percentage}%`
                        : `R$ ${charge.flatAmount}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCharge(index)}
                    className="p-1 text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Formulário para adicionar nova taxa */}
          <div className="border-t border-gh-border pt-4 space-y-3">
            <h4 className="font-medium text-gh-text text-sm">
              Adicionar Nova Taxa
            </h4>

            {/* Tipo de taxa */}
            <div>
              <label className="text-xs font-medium text-gh-text-secondary">
                Tipo
              </label>
              <select
                value={newCharge.type}
                onChange={(e) =>
                  setNewCharge({
                    ...newCharge,
                    type: e.target.value as FinancialChargeType,
                  })
                }
                className="w-full mt-1 px-3 py-2 text-sm border border-gh-border rounded bg-white dark:bg-gh-bg text-gh-text"
              >
                {Object.entries(CHARGE_TYPE_LABELS).map(([type, label]) => (
                  <option key={type} value={type}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Descrição */}
            <div>
              <label className="text-xs font-medium text-gh-text-secondary">
                Descrição
              </label>
              <input
                type="text"
                placeholder="ex: Juros de mora"
                value={newCharge.description || ""}
                onChange={(e) =>
                  setNewCharge({ ...newCharge, description: e.target.value })
                }
                className="w-full mt-1 px-3 py-2 text-sm border border-gh-border rounded bg-white dark:bg-gh-bg text-gh-text"
              />
            </div>

            {/* Valor percentual */}
            <div>
              <label className="text-xs font-medium text-gh-text-secondary">
                Percentual (%)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={newCharge.percentage || 0}
                onChange={(e) =>
                  setNewCharge({
                    ...newCharge,
                    percentage: parseFloat(e.target.value),
                  })
                }
                className="w-full mt-1 px-3 py-2 text-sm border border-gh-border rounded bg-white dark:bg-gh-bg text-gh-text"
              />
            </div>

            {/* Valor fixo (alternativa) */}
            <div>
              <label className="text-xs font-medium text-gh-text-secondary">
                Ou Valor Fixo (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={newCharge.flatAmount || ""}
                onChange={(e) =>
                  setNewCharge({
                    ...newCharge,
                    flatAmount: e.target.value
                      ? parseFloat(e.target.value)
                      : undefined,
                  })
                }
                className="w-full mt-1 px-3 py-2 text-sm border border-gh-border rounded bg-white dark:bg-gh-bg text-gh-text"
              />
            </div>

            {/* Botão adicionar */}
            <Button
              type="button"
              onClick={addCharge}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Adicionar Taxa
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
