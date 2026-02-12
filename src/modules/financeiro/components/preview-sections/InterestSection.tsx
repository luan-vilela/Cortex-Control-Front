import { InterestType } from '../interest/interestBlock.types'

import { Percent } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface InterestSectionProps {
  interestType: InterestType
  adjustmentLabel: string
  adjustmentAmount: number
  description?: string
  formatCurrency: (value: number) => string
}

export function InterestSection({
  interestType,
  adjustmentLabel,
  adjustmentAmount,
  description,
  formatCurrency,
}: InterestSectionProps) {
  return (
    <div className="bg-card space-y-3 rounded-lg border p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Percent className="h-4 w-4" />
        Taxas e Ajustes
      </div>
      <Separator />
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tipo:</span>
          <Badge variant="secondary">
            {interestType === InterestType.PERCENTAGE ? 'Percentual' : 'Valor Fixo'}
          </Badge>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Valor do Ajuste:</span>
          <span className="font-medium text-blue-600">
            {adjustmentLabel} = {formatCurrency(adjustmentAmount)}
          </span>
        </div>
        {description && (
          <div className="border-t pt-2">
            <p className="text-muted-foreground mb-1 text-xs">Descrição:</p>
            <p className="text-sm">{description}</p>
          </div>
        )}
      </div>
    </div>
  )
}
