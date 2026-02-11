'use client'

import type { RecurrenceConfig } from '../types'
import { RecurrenceType } from '../types'

import { useState } from 'react'

import { DatePicker } from '@/components/patterns/DatePicker'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

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
  const [endDateType, setEndDateType] = useState<'occurrences' | 'date'>('occurrences')

  const handleEnableRecurrence = () => {
    const newConfig: RecurrenceConfig = {
      type: RecurrenceType.MONTHLY,
      occurrences: 1,
    }
    onChange(newConfig)
    setEndDateType('occurrences')
  }

  const handleDisableRecurrence = () => {
    onChange(undefined)
  }

  const handleTypeChange = (type: RecurrenceType) => {
    if (config) {
      onChange({
        ...config,
        type,
      })
    }
  }

  const handleOccurrencesChange = (occurrences: number) => {
    if (config) {
      onChange({
        ...config,
        occurrences: Math.max(1, Math.min(365, occurrences)),
        endDate: undefined,
      })
    }
  }

  return (
    <div className="space-y-3">
      <RadioGroup
        value={config ? 'with' : 'without'}
        onValueChange={(value) => {
          if (value === 'without') {
            handleDisableRecurrence()
          } else {
            handleEnableRecurrence()
          }
        }}
      >
        {/* Opção 1: Sem Recorrência */}
        <label className="border-input hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10 dark:has-[[data-state=checked]]:bg-primary/20 flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors">
          <RadioGroupItem value="without" id="recurrence-without" className="mt-1" />
          <div className="flex-1">
            <p className="text-foreground font-medium">Sem Recorrência</p>
            <p className="text-muted-foreground text-xs">Transação única</p>
          </div>
        </label>

        {/* Opção 2: Com Recorrência */}
        <label className="border-input hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10 dark:has-[[data-state=checked]]:bg-primary/20 flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors">
          <RadioGroupItem value="with" id="recurrence-with" className="mt-1" />
          <div className="flex-1">
            <p className="text-foreground font-medium">Com Recorrência</p>
            <p className="text-muted-foreground text-xs">Repetir transação periodicamente</p>
          </div>
        </label>
      </RadioGroup>

      {/* Opções de Recorrência - Aparecem quando "Com Recorrência" selecionado */}
      {config && (
        <div className="border-border space-y-3 border-t pt-4">
          {/* Tipo de Frequência */}
          <div className="space-y-2">
            <label className="text-foreground text-sm font-medium">Frequência</label>
            <select
              value={config.type}
              onChange={(e) => handleTypeChange(e.target.value as RecurrenceType)}
              className="border-input bg-background text-foreground w-full rounded border px-3 py-2 text-sm"
            >
              {Object.entries(RECURRENCE_LABELS).map(([type, label]) => (
                <option key={type} value={type}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Opção: Quantidade vs Data */}
          <div className="flex gap-3">
            <label className="border-input hover:bg-accent flex flex-1 cursor-pointer items-center gap-2 rounded border p-2 transition-colors">
              <input
                type="radio"
                name="endDateType"
                value="occurrences"
                checked={endDateType === 'occurrences'}
                onChange={() => setEndDateType('occurrences')}
                className="h-3 w-3"
              />
              <span className="text-foreground text-xs font-medium">Quantidade</span>
            </label>

            <label className="border-input hover:bg-accent flex flex-1 cursor-pointer items-center gap-2 rounded border p-2 transition-colors">
              <input
                type="radio"
                name="endDateType"
                value="date"
                checked={endDateType === 'date'}
                onChange={() => setEndDateType('date')}
                className="h-3 w-3"
              />
              <span className="text-foreground text-xs font-medium">Data Final</span>
            </label>
          </div>

          {/* Campo de Quantidade ou Data */}
          {endDateType === 'occurrences' ? (
            <div className="space-y-2">
              <label className="text-muted-foreground text-xs font-medium">
                Número de Repetições (1-365)
              </label>
              <Input
                type="number"
                min="1"
                max="365"
                value={config.occurrences || 12}
                onChange={(e) => handleOccurrencesChange(parseInt(e.target.value, 10))}
                placeholder="12"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-muted-foreground text-xs font-medium">Data Final</label>
              <DatePicker
                value={config.endDate}
                onValueChange={(date) => {
                  if (config) {
                    onChange({
                      ...config,
                      endDate: date,
                      occurrences: undefined,
                    })
                  }
                }}
                placeholder="Selecionar data final"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
