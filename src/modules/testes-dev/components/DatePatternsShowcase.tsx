'use client'

import { useState } from 'react'

import { type DateRange } from 'react-day-picker'

import { DatePicker } from '@/components/patterns/DatePicker'
import { DateRangePicker } from '@/components/patterns/DateRangePicker'
import { Label } from '@/components/ui/label'

import { ComponentShowcase } from './ComponentShowcase'

export function DatePatternsShowcase() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
  })

  return (
    <ComponentShowcase title="Padrões de Data" description="Componentes para seleção de datas">
      <div className="space-y-4">
        {/* DatePicker */}
        <div className="space-y-2">
          <Label>DatePicker</Label>
          <DatePicker value={date} onValueChange={setDate} placeholder="Selecionar data" />
          {date && (
            <p className="text-sm text-gray-600">
              Data selecionada: {date.toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>

        {/* DateRangePicker */}
        <div className="space-y-2">
          <Label>DateRangePicker</Label>
          <DateRangePicker
            value={dateRange}
            onValueChange={setDateRange}
            placeholder="Selecionar período"
          />
          {dateRange?.from && (
            <p className="text-sm text-gray-600">
              Período: {dateRange.from.toLocaleDateString('pt-BR')}
              {dateRange.to && ` até ${dateRange.to.toLocaleDateString('pt-BR')}`}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 border-t pt-4">
        <h4 className="mb-2 text-sm font-semibold">Código:</h4>
        <pre className="overflow-auto rounded bg-gray-100 p-2 text-xs dark:bg-gray-800">
          {`<DatePicker
  value={date}
  onValueChange={setDate}
  placeholder="Selecionar data"
/>

<DateRangePicker
  value={dateRange}
  onValueChange={setDateRange}
  placeholder="Selecionar período"
/>`}
        </pre>
      </div>
    </ComponentShowcase>
  )
}
