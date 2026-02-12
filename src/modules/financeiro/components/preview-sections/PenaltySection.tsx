import { AlertCircle } from 'lucide-react'

import { Separator } from '@/components/ui/separator'

interface PenaltySectionProps {
  penaltyPercentage?: number
  interestPerMonth?: number
}

export function PenaltySection({ penaltyPercentage, interestPerMonth }: PenaltySectionProps) {
  if (!penaltyPercentage && !interestPerMonth) return null

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
        {interestPerMonth && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Juros ao Mês:</span>
            <span className="font-medium">{interestPerMonth} %</span>
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
