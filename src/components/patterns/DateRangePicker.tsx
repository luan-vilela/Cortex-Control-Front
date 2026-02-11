'use client'

import * as React from 'react'

import { Calendar as CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DateRangePickerProps {
  value?: DateRange
  onValueChange?: (range: DateRange | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

/**
 * Normaliza uma data UTC para o timezone local
 * Útil quando datas vêm do servidor em formato ISO string
 */
function normalizeDateFromUTC(date: Date): Date {
  if (!date) return date

  // Se a data tem componente Z (UTC), converter para local
  // Pega os valores UTC e reconstrói em local
  const utcYear = date.getUTCFullYear()
  const utcMonth = date.getUTCMonth()
  const utcDate = date.getUTCDate()

  return new Date(utcYear, utcMonth, utcDate)
}

export function DateRangePicker({
  value,
  onValueChange,
  placeholder = 'Selecionar período',
  disabled = false,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [tempRange, setTempRange] = React.useState<DateRange | undefined>(value)

  // Sincroniza tempRange quando o value muda (ex: via props)
  React.useEffect(() => {
    if (open && value) {
      // Se há mudança no value enquanto popover está aberto, normaliza
      setTempRange({
        from: value.from ? normalizeDateFromUTC(value.from) : undefined,
        to: value.to ? normalizeDateFromUTC(value.to) : undefined,
      })
    } else if (!open) {
      setTempRange(value)
    }
  }, [value])

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return placeholder

    const from = range.from.toLocaleDateString('pt-BR')
    const to = range.to
      ? range.to.toLocaleDateString('pt-BR')
      : range.from.toLocaleDateString('pt-BR')

    if (from === to) {
      return from
    }

    return `${from} - ${to}`
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && tempRange) {
      // Popover está fechando, aplica a mudança
      onValueChange?.(tempRange)
    }
    setOpen(newOpen)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn('w-full justify-start text-left font-normal', className)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateRange(value)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={tempRange}
          onSelect={(range) => {
            setTempRange(range)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
