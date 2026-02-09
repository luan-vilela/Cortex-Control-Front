'use client'

import type { RecurrenceConfig } from '../types'
import { RecurrenceType } from '../types'

import { useState } from 'react'

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
      occurrences: 12,
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

  const handleEndDateChange = (dateStr: string) => {
    if (config) {
      const [year, month, day] = dateStr.split('-').map(Number)
      const date = new Date(year, month - 1, day)
      onChange({
        ...config,
        endDate: date,
        occurrences: undefined,
      })
    }
  }

  const formatDateToLocalISO = (date?: Date): string => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return (
    <div className="space-y-3">
      <RadioGroup value={config ? 'with' : 'without'} onValueChange={(value) => {
        if (value === 'without') {
          handleDisableRecurrence()
        } else {
          handleEnableRecurrence()
        }
      }}>
        {/* Opção 1: Sem Recorrência */}
        <label className="flex cursor-pointer gap-3 rounded-lg border border-input p-3 transition-colors hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10 dark:has-[[data-state=checked]]:bg-primary/20">
          <RadioGroupItem value="without" id="recurrence-without" className="mt-1" />
          <div className="flex-1">
            <p className="font-medium text-foreground">Sem Recorrência</p>
            <p className="text-xs text-muted-foreground">Transação única</p>
          </div>
        </label>

        {/* Opção 2: Com Recorrência */}
        <label className="flex cursor-pointer gap-3 rounded-lg border border-input p-3 transition-colors hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10 dark:has-[[data-state=checked]]:bg-primary/20">
          <RadioGroupItem value="with" id="recurrence-with" className="mt-1" />
          <div className="flex-1">
            <p className="font-medium text-foreground">Com Recorrência</p>
            <p className="text-xs text-muted-foreground">Repetir transação periodicamente</p>
          </div>
        </label>
      </RadioGroup>

      {/* Opções de Recorrência - Aparecem quando "Com Recorrência" selecionado */}
      {config && (
        <div className="space-y-3 border-t border-border pt-4">
          {/* Tipo de Frequência */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Frequência
            </label>
            <select
              value={config.type}
              onChange={(e) => handleTypeChange(e.target.value as RecurrenceType)}
              className="w-full rounded border border-input bg-background px-3 py-2 text-sm text-foreground"
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
            <label className="flex flex-1 cursor-pointer items-center gap-2 rounded border border-input p-2 transition-colors hover:bg-accent">
              <input
                type="radio"
                name="endDateType"
                value="occurrences"
                checked={endDateType === 'occurrences'}
                onChange={() => setEndDateType('occurrences')}
                className="h-3 w-3"
              />
              <span className="text-xs font-medium text-foreground">
                Quantidade
              </span>
            </label>

            <label className="flex flex-1 cursor-pointer items-center gap-2 rounded border border-input p-2 transition-colors hover:bg-accent">
              <input
                type="radio"
                name="endDateType"
                value="date"
                checked={endDateType === 'date'}
                onChange={() => setEndDateType('date')}
                className="h-3 w-3"
              />
              <span className="text-xs font-medium text-foreground">
                Data Final
              </span>
            </label>
          </div>

          {/* Campo de Quantidade ou Data */}
          {endDateType === 'occurrences' ? (
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
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
              <label className="text-xs font-medium text-muted-foreground">
                Data Final
              </label>
              <Input
                type="date"
                value={formatDateToLocalISO(config.endDate)}
                onChange={(e) => handleEndDateChange(e.target.value)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
