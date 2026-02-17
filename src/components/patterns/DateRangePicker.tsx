'use client'

import * as React from 'react'

import { addDays, differenceInDays } from 'date-fns'
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
  /** Limite máximo de dias selecionáveis no range. Ex: 31 */
  maxDays?: number
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
  maxDays,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [tempRange, setTempRange] = React.useState<DateRange | undefined>(value)

  // Calcula os limites de data quando maxDays está definido e o from já foi selecionado
  const disabledDays = React.useMemo(() => {
    if (!maxDays || !tempRange?.from) return undefined
    const from = tempRange.from
    return [
      { before: from },
      { after: addDays(from, maxDays - 1) },
    ] as any
  }, [maxDays, tempRange?.from])

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
            // Se o usuário está selecionando um novo "from" (clicou em data sem ter range completo, ou reset)
            if (range?.from && !range.to && maxDays && tempRange?.from && tempRange?.to) {
              // Reset: novo from, sem to — permite nova seleção
              setTempRange({ from: range.from, to: undefined })
              return
            }
            // Validação de maxDays quando ambas datas estão selecionadas
            if (maxDays && range?.from && range?.to) {
              const diff = differenceInDays(range.to, range.from)
              if (diff >= maxDays) {
                // Forçar o to para o máximo permitido
                setTempRange({ from: range.from, to: addDays(range.from, maxDays - 1) })
                return
              }
            }
            setTempRange(range)
          }}
          disabled={disabledDays}
          initialFocus
        />
        <div className="flex items-center justify-between border-t px-3 py-2">
          {maxDays && (
            <p className="text-muted-foreground text-xs">
              Máximo de {maxDays} dias
            </p>
          )}
          {(tempRange?.from || value?.from) && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground ml-auto h-7 text-xs hover:text-foreground"
              onClick={() => {
                setTempRange(undefined)
                onValueChange?.(undefined)
                setOpen(false)
              }}
            >
              Limpar
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
