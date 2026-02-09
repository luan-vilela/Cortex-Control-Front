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

  console.log('[DatePicker] value prop:', value)
  console.log('[DatePicker] value?.toString():', value?.toString())
  console.log('[DatePicker] value?.toISOString():', value?.toISOString())

  // Sincroniza tempDate quando o value muda (ex: via props)
  React.useEffect(() => {
    console.log('[DatePicker] useEffect - value changed:', value)
    if (open) {
      console.log('[DatePicker] Popover open, setting tempDate to:', value)
      setTempDate(value)
    } else {
      console.log('[DatePicker] Popover closed, syncing tempDate')
      setTempDate(value)
    }
  }, [value, open])

  const formatDate = (date: Date | undefined) => {
    if (!date) return placeholder
    const formatted = date.toLocaleDateString('pt-BR')
    console.log('[DatePicker] formatDate - input:', date, 'output:', formatted)
    return formatted
  }

  const handleOpenChange = (newOpen: boolean) => {
    console.log('[DatePicker] handleOpenChange - newOpen:', newOpen, 'tempDate:', tempDate)
    if (!newOpen && tempDate) {
      // Popover está fechando, aplica a mudança
      console.log('[DatePicker] Calling onValueChange with:', tempDate)
      console.log('[DatePicker] tempDate.toISOString():', tempDate.toISOString())
      onValueChange?.(tempDate)
    }
    setOpen(newOpen)
  }

  const handleSelect = (date: Date | undefined) => {
    console.log('[DatePicker] onSelect from Calendar - date:', date)
    console.log('[DatePicker] onSelect - date?.toString():', date?.toString())
    console.log('[DatePicker] onSelect - date?.toISOString():', date?.toISOString())
    setTempDate(date)
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
          {formatDate(value)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={tempDate}
          onSelect={handleSelect}
          disabled={disabledDates}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
