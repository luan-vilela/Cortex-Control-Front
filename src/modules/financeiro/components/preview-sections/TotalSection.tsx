interface TotalSectionProps {
  totalAmount: number
  baseAmount: number
  adjustmentAmount: number
  formatCurrency: (value: number) => string
}

export function TotalSection({
  totalAmount,
  baseAmount,
  adjustmentAmount,
  formatCurrency,
}: TotalSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Valor Total</span>
      </div>
      <div className="pl-2 text-left">
        <p className="text-primary text-3xl font-bold">{formatCurrency(totalAmount)}</p>
        {adjustmentAmount !== 0 && (
          <p className="text-muted-foreground text-xs">
            Base: {formatCurrency(baseAmount)} {adjustmentAmount > 0 ? '+' : ''}{' '}
            {formatCurrency(adjustmentAmount)}
          </p>
        )}
      </div>
    </div>
  )
}
