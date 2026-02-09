'use client'

import { RecurrenceConfig, RecurrenceType } from '../types'

import { useState } from 'react'

import { ChevronDown, ChevronUp } from 'lucide-react'

interface RecurrenceConfigProps {
  config?: RecurrenceConfig
  onChange: (config: RecurrenceConfig | undefined) => void
}

const RECURRENCE_LABELS: Record<RecurrenceType, string> = {
  [RecurrenceType.DAILY]: 'Diária',
  [RecurrenceType.WEEKLY]: 'Semanal',
  [RecurrenceType.BIWEEKLY]: 'Quinzenal',
  [RecurrenceType.MONTHLY]: 'Mensal',
  [RecurrenceType.QUARTERLY]: 'Trimestral',
  [RecurrenceType.SEMIANNUAL]: 'Semestral',
  [RecurrenceType.ANNUAL]: 'Anual',
}

export function RecurrenceConfigComponent({ config, onChange }: RecurrenceConfigProps) {
  const [expanded, setExpanded] = useState(false)

  const handleTypeChange = (type: RecurrenceType | undefined) => {
    if (type === undefined) {
      onChange(undefined)
    } else {
      const newConfig: RecurrenceConfig = { type }
      newConfig.occurrences = config?.occurrences || 12
      onChange(newConfig)
    }
  }

  return (
    <div className="space-y-3">
      {/* Sem Recorrência */}
      <label className="border-gh-border hover:bg-gh-hover flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 dark:has-[:checked]:bg-blue-950">
        <input
          type="radio"
          name="recurrence"
          value="none"
          checked={config === undefined}
          onChange={() => handleTypeChange(undefined)}
          className="mt-1 h-4 w-4"
        />
        <div className="flex-1">
          <p className="text-gh-text font-medium">Sem Recorrência</p>
          <p className="text-gh-text-secondary text-xs">Transação única</p>
        </div>
      </label>

      {/* Tipos com Recorrência */}
      {Object.entries(RECURRENCE_LABELS).map(([type, label]) => (
        <label
          key={type}
          className="border-gh-border hover:bg-gh-hover flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 dark:has-[:checked]:bg-blue-950"
        >
          <input
            type="radio"
            name="recurrence"
            value={type}
            checked={config?.type === type}
            onChange={() => handleTypeChange(type as RecurrenceType)}
            className="mt-1 h-4 w-4"
          />
          <div className="flex-1">
            <p className="text-gh-text font-medium">{label}</p>
            {config?.type === type && (
              <div className="mt-3 space-y-2">
                <label className="text-gh-text-secondary text-xs font-medium">
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
                  className="border-gh-border dark:bg-gh-bg text-gh-text w-full rounded border bg-white px-2 py-2 text-sm"
                />
              </div>
            )}
          </div>
        </label>
      ))}
    </div>
  )
}
