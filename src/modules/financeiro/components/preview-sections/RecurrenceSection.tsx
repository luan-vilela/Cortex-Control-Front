import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, Repeat } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface RecurrenceSectionProps {
  type: string
  startDate: Date
  endDateType?: 'occurrences' | 'date'
  occurrences?: number
  endDate?: Date
  transactionAmount: number
  formatCurrency: (value: number) => string
}

const RECURRENCE_LABELS: Record<string, string> = {
  DAILY: 'Diária',
  WEEKLY: 'Semanal',
  BIWEEKLY: 'Quinzenal',
  MONTHLY: 'Mensal',
  QUARTERLY: 'Trimestral',
  SEMIANNUAL: 'Semestral',
  ANNUAL: 'Anual',
}

function calculateOccurrencesByDate(startDate: Date, endDate: Date, type: string): number {
  let count = 0
  const current = new Date(startDate)
  const end = new Date(endDate)

  while (current <= end) {
    count++

    if (type === 'DAILY') {
      current.setDate(current.getDate() + 1)
    } else if (type === 'WEEKLY') {
      current.setDate(current.getDate() + 7)
    } else if (type === 'BIWEEKLY') {
      current.setDate(current.getDate() + 14)
    } else if (type === 'MONTHLY') {
      current.setMonth(current.getMonth() + 1)
    } else if (type === 'QUARTERLY') {
      current.setMonth(current.getMonth() + 3)
    } else if (type === 'SEMIANNUAL') {
      current.setMonth(current.getMonth() + 6)
    } else if (type === 'ANNUAL') {
      current.setFullYear(current.getFullYear() + 1)
    }
  }

  return count
}

function getDateByIndex(startDate: Date, type: string, index: number): Date {
  const date = new Date(startDate)

  if (type === 'DAILY') {
    date.setDate(date.getDate() + index)
  } else if (type === 'WEEKLY') {
    date.setDate(date.getDate() + index * 7)
  } else if (type === 'BIWEEKLY') {
    date.setDate(date.getDate() + index * 14)
  } else if (type === 'MONTHLY') {
    date.setMonth(date.getMonth() + index)
  } else if (type === 'QUARTERLY') {
    date.setMonth(date.getMonth() + index * 3)
  } else if (type === 'SEMIANNUAL') {
    date.setMonth(date.getMonth() + index * 6)
  } else if (type === 'ANNUAL') {
    date.setFullYear(date.getFullYear() + index)
  }

  return date
}

export function RecurrenceSection({
  type,
  startDate,
  endDateType,
  occurrences,
  endDate,
  transactionAmount,
  formatCurrency,
}: RecurrenceSectionProps) {
  const totalOccurrences =
    endDateType === 'date' && endDate
      ? calculateOccurrencesByDate(startDate, endDate, type)
      : occurrences || 0

  return (
    <div className="bg-card space-y-3 rounded-lg border p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Repeat className="h-4 w-4" />
        Recorrência
      </div>
      <Separator />
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tipo:</span>
          <Badge variant="secondary">{RECURRENCE_LABELS[type] || type}</Badge>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Quantidade:</span>
          <span className="font-medium">{totalOccurrences} transações</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Geral:</span>
          <span className="text-primary font-bold">
            {formatCurrency(totalOccurrences * transactionAmount)}
          </span>
        </div>

        {endDateType === 'date' && endDate && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Até:</span>
            <span className="flex items-center gap-1 font-medium">
              <Calendar className="h-3 w-3" />
              {format(endDate, 'dd/MM/yyyy', { locale: ptBR })}
            </span>
          </div>
        )}

        <div className="border-t pt-2">
          <p className="text-muted-foreground mb-2 text-xs">Datas das transações:</p>
          <div className="space-y-1">
            {Array.from({ length: Math.min(5, totalOccurrences) }).map((_, index) => {
              const date = getDateByIndex(startDate, type, index)

              return (
                <div
                  key={index}
                  className="text-muted-foreground flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {index + 1}ª - {format(date, 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </div>
                  <span className="text-foreground font-medium">
                    {formatCurrency(transactionAmount)}
                  </span>
                </div>
              )
            })}
            {totalOccurrences > 5 && (
              <div className="text-muted-foreground pt-2 text-xs italic">
                + {totalOccurrences - 5} transações adicionais
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
