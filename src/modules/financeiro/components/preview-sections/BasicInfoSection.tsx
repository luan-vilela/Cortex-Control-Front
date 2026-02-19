import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, FileText } from 'lucide-react'

import { Separator } from '@/components/ui/separator'

interface BasicInfoSectionProps {
  description: string
  baseAmount: number
  dueDate: Date
  notes?: string
  formatCurrency: (value: number) => string
}

export function BasicInfoSection({
  description,
  baseAmount,
  dueDate,
  notes,
  formatCurrency,
}: BasicInfoSectionProps) {
  return (
    <div className="bg-card space-y-3 rounded-lg border p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <FileText className="h-4 w-4" />
        Informações Básicas
      </div>
      <Separator />
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Descrição:</span>
          <span className="font-medium">{description || '—'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Valor Base:</span>
          <span className="font-medium">{formatCurrency(baseAmount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Vencimento:</span>
          <span className="flex items-center gap-1 font-medium">
            <Calendar className="h-3 w-3" />
            {format(dueDate, 'dd/MM/yyyy', { locale: ptBR })}
          </span>
        </div>
        {notes && (
          <div className="border-t pt-2">
            <p className="text-muted-foreground mb-1 text-xs">Observações:</p>
            <p className="text-sm">{notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
