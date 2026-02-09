"use client";

import { InterestConfig, InterestType } from "../types";
import { Button } from "@/components/ui/button";
import { Plus, X, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface InterestConfigComponentProps {
  interest?: InterestConfig;
  onChange: (interest: InterestConfig | undefined) => void;
}

export function InterestConfigComponent({
  interest,
  onChange,
}: InterestConfigComponentProps) {
  const [expanded, setExpanded] = useState(false);
  const [type, setType] = useState<InterestType>(
    interest?.type || InterestType.PERCENTAGE,
  );

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 border border-gh-border rounded-lg bg-gh-card hover:bg-gh-hover transition-colors"
      >
        <div className="text-left">
          <h3 className="font-medium text-gh-text">Juros/Taxas</h3>
          <p className="text-xs text-gh-text-secondary">
            {interest
              ? type === InterestType.PERCENTAGE
                ? `${interest.percentage}%`
                : `R$ ${interest.flatAmount}`
              : "Nenhuma taxa adicionada"}
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
          {/* Tipo de juros */}
          <div>
            <label className="text-xs font-medium text-gh-text-secondary">
              Tipo de Juros
            </label>
            <div className="space-y-2 mt-2">
              {[InterestType.PERCENTAGE, InterestType.FLAT].map((t) => (
                <label
                  key={t}
                  className="flex items-center gap-3 p-2 border border-gh-border rounded cursor-pointer hover:bg-gh-hover"
                >
                  <input
                    type="radio"
                    name="interestType"
                    value={t}
                    checked={type === t}
                    onChange={() => {
                      setType(t);
                      onChange(
                        interest
                          ? { ...interest, type: t }
                          : { type: t, description: "" },
                      );
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gh-text">
                    {t === InterestType.PERCENTAGE
                      ? "Percentual (%)"
                      : "Valor Fixo (R$)"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Valor */}
          <div>
            <label className="text-xs font-medium text-gh-text-secondary">
              {type === InterestType.PERCENTAGE ? "Percentual" : "Valor"}
            </label>
            <input
              type="number"
              step="0.01"
              value={
                type === InterestType.PERCENTAGE
                  ? interest?.percentage || ""
                  : interest?.flatAmount || ""
              }
              onChange={(e) => {
                const value = e.target.value
                  ? parseFloat(e.target.value)
                  : undefined;
                onChange({
                  type,
                  percentage:
                    type === InterestType.PERCENTAGE ? value : undefined,
                  flatAmount: type === InterestType.FLAT ? value : undefined,
                  description: interest?.description,
                });
              }}
              className="w-full mt-1 px-3 py-2 text-sm border border-gh-border rounded bg-white dark:bg-gh-bg text-gh-text"
              placeholder={
                type === InterestType.PERCENTAGE ? "Ex: 5.00" : "Ex: 150.00"
              }
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="text-xs font-medium text-gh-text-secondary">
              Descrição (opcional)
            </label>
            <input
              type="text"
              placeholder="ex: Taxa de juros mensal"
              value={interest?.description || ""}
              onChange={(e) =>
                onChange({
                  type,
                  percentage:
                    type === InterestType.PERCENTAGE
                      ? interest?.percentage
                      : undefined,
                  flatAmount:
                    type === InterestType.FLAT
                      ? interest?.flatAmount
                      : undefined,
                  description: e.target.value,
                })
              }
              className="w-full mt-1 px-3 py-2 text-sm border border-gh-border rounded bg-white dark:bg-gh-bg text-gh-text"
            />
          </div>

          {/* Remover */}
          {interest && (
            <Button
              type="button"
              variant="destructive"
              onClick={() => onChange(undefined)}
              className="w-full"
            >
              <X className="w-4 h-4 mr-2" />
              Remover Juros
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
