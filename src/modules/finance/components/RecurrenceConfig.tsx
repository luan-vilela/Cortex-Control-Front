"use client";

import { RecurrenceType, RecurrenceConfig } from "../types";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface RecurrenceConfigProps {
  config?: RecurrenceConfig;
  onChange: (config: RecurrenceConfig) => void;
}

const RECURRENCE_LABELS: Record<RecurrenceType, string> = {
  [RecurrenceType.ONCE]: "Uma única vez",
  [RecurrenceType.DAILY]: "Diária",
  [RecurrenceType.WEEKLY]: "Semanal",
  [RecurrenceType.BIWEEKLY]: "Quinzenal",
  [RecurrenceType.MONTHLY]: "Mensal",
  [RecurrenceType.QUARTERLY]: "Trimestral",
  [RecurrenceType.SEMIANNUAL]: "Semestral",
  [RecurrenceType.ANNUAL]: "Anual",
};

export function RecurrenceConfigComponent({
  config,
  onChange,
}: RecurrenceConfigProps) {
  const [expanded, setExpanded] = useState(false);

  const handleTypeChange = (type: RecurrenceType) => {
    const newConfig: RecurrenceConfig = { type };
    if (type !== RecurrenceType.ONCE) {
      newConfig.occurrences = config?.occurrences || 12;
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
          <h3 className="font-medium text-gh-text">Recorrência</h3>
          <p className="text-xs text-gh-text-secondary">
            {config
              ? RECURRENCE_LABELS[config.type] || "Selecione uma recorrência"
              : "Selecione uma recorrência"}
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gh-text-secondary" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gh-text-secondary" />
        )}
      </button>

      {expanded && (
        <div className="pl-4 pr-4 space-y-2">
          {Object.entries(RECURRENCE_LABELS).map(([type, label]) => (
            <label
              key={type}
              className="flex items-start gap-3 p-3 border border-gh-border rounded-lg cursor-pointer hover:bg-gh-hover"
            >
              <input
                type="radio"
                name="recurrence"
                value={type}
                checked={config?.type === type}
                onChange={() => handleTypeChange(type as RecurrenceType)}
                className="w-4 h-4 mt-1"
              />
              <div className="flex-1">
                <p className="font-medium text-gh-text">{label}</p>
                {type !== RecurrenceType.ONCE && config?.type === type && (
                  <div className="mt-2">
                    <label className="text-xs text-gh-text-secondary">
                      Número de ocorrências:
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={config.occurrences || 12}
                      onChange={(e) =>
                        onChange({
                          ...config,
                          occurrences: parseInt(e.target.value),
                        })
                      }
                      className="w-20 px-2 py-1 text-sm border border-gh-border rounded bg-white dark:bg-gh-bg text-gh-text mt-1"
                    />
                  </div>
                )}
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
