'use client'

import * as React from 'react'

import { Calendar as CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  value?: Date
  onValueChange?: (date: Date | undefined) => void
  placeholder?: string
  disabled?: boolean
  disabledDates?: (date: Date) => boolean
  className?: string
}

export function DatePicker({
  value,
  onValueChange,
  placeholder = 'Selecionar data',
  disabled = false,
  disabledDates,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [tempDate, setTempDate] = React.useState<Date | undefined>(value)

  // Sincroniza tempDate quando o value muda (ex: via props)
  React.useEffect(() => {
    if (open) {
      setTempDate(value)
    } else {
      setTempDate(value)
    }
  }, [value, open])

  const formatDate = (date: Date | undefined) => {
    if (!date) return placeholder
    const formatted = date.toLocaleDateString('pt-BR')
    return formatted
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && tempDate) {
      // Popover está fechando, aplica a mudança
      onValueChange?.(tempDate)
    }
    setOpen(newOpen)
  }

  const handleSelect = (date: Date | undefined) => {
    setTempDate(date)
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn('w-full justify-start px-3 py-5 text-left font-normal', className)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDate(value)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex flex-col items-stretch">
          <Calendar
            mode="single"
            selected={tempDate}
            onSelect={handleSelect}
            disabled={disabledDates}
            initialFocus
          />
          <div className="flex justify-between border-t p-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const today = new Date()
                setTempDate(today)
                onValueChange?.(today)
                setOpen(false)
              }}
            >
              Hoje
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => {
                if (tempDate) {
                  onValueChange?.(tempDate)
                  setOpen(false)
                }
              }}
              disabled={!tempDate}
            >
              Confirmar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
