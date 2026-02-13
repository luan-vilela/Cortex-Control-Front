import { AlertCircle } from 'lucide-react'

import { Separator } from '@/components/ui/separator'

interface PenaltySectionProps {
  penaltyPercentage?: number
  interestPercentage?: number
  interestPeriod?: 'MONTHLY' | 'ANNUAL'
}

export function PenaltySection({
  penaltyPercentage,
  interestPercentage,
  interestPeriod = 'MONTHLY',
}: PenaltySectionProps) {
  if (!penaltyPercentage && !interestPercentage) return null

  const periodLabel = interestPeriod === 'ANNUAL' ? 'Ano' : 'Mês'

  return (
    <div className="space-y-3 rounded-lg border border-orange-200 bg-orange-50/50 p-4 dark:border-orange-900 dark:bg-orange-950/20">
      <div className="flex items-center gap-2 text-sm font-medium text-orange-700 dark:text-orange-400">
        <AlertCircle className="h-4 w-4" />
        Multa e Mora (Atraso)
      </div>
      <Separator className="bg-orange-200 dark:bg-orange-900" />
      <div className="space-y-2 text-sm">
        {penaltyPercentage && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Multa:</span>
            <span className="font-medium">{penaltyPercentage} %</span>
          </div>
        )}
        {interestPercentage && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Juros (% ao {periodLabel.toLowerCase()}):</span>
            <span className="font-medium">{interestPercentage} %</span>
          </div>
        )}
        <div className="border-t border-orange-200 pt-2 dark:border-orange-900">
          <p className="text-muted-foreground text-xs italic">
            * Valores aplicados apenas em caso de atraso no pagamento
          </p>
        </div>
      </div>
    </div>
  )
}
