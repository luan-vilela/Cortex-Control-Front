import { PaymentMode } from '../../types'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, CreditCard } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface Installment {
  number: number
  value: number
  interest: number
  amortization: number
  saldoDevedor: number
}

interface PaymentSectionProps {
  mode: PaymentMode
  formatCurrency: (value: number) => string
  // Props para pagamento parcelado
  downPaymentAmount?: number
  numberOfInstallments?: number
  installmentAmount?: number
  firstInstallmentDate?: Date
  installmentIntervalDays?: number
  financed?: number
  installments?: Installment[]
}

export function PaymentSection({
  mode,
  formatCurrency,
  downPaymentAmount = 0,
  numberOfInstallments,
  installmentAmount = 0,
  firstInstallmentDate,
  installmentIntervalDays,
  financed = 0,
  installments = [],
}: PaymentSectionProps) {
  return (
    <div className="bg-card space-y-3 rounded-lg border p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <CreditCard className="h-4 w-4" />
        Forma de Pagamento
      </div>
      <Separator />

      {mode === PaymentMode.CASH ? (
        <div className="text-sm">
          <Badge variant="outline">À Vista</Badge>
          <p className="text-muted-foreground mt-2">Pagamento integral na data de vencimento</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Forma:</span>
            <Badge variant="outline">Parcelado</Badge>
          </div>

          {downPaymentAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Entrada:</span>
              <span className="font-medium">{formatCurrency(downPaymentAmount)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Parcelas:</span>
            <span className="font-medium">
              {numberOfInstallments}x de {formatCurrency(installmentAmount)}
            </span>
          </div>

          {firstInstallmentDate && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">1ª Parcela:</span>
              <span className="flex items-center gap-1 font-medium">
                <Calendar className="h-3 w-3" />
                {format(firstInstallmentDate, 'dd/MM/yyyy', { locale: ptBR })}
              </span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Intervalo:</span>
            <span className="font-medium">{installmentIntervalDays} dias</span>
          </div>

          {/* Detalhamento das parcelas */}
          {installments.length > 0 && (
            <div className="mt-4">
              <p className="text-muted-foreground mb-1 text-xs">Detalhamento das Parcelas:</p>
              <div className="overflow-x-auto">
                <table className="min-w-full rounded border text-xs">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border px-2 py-1">N°</th>
                      <th className="border px-2 py-1">Prestação</th>
                      <th className="border px-2 py-1">Juros</th>
                      <th className="border px-2 py-1">Amortização</th>
                      <th className="border px-2 py-1">Saldo devedor</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-2 py-1 text-center">0</td>
                      <td className="border px-2 py-1 text-right">{formatCurrency(0)}</td>
                      <td className="border px-2 py-1 text-right">{formatCurrency(0)}</td>
                      <td className="border px-2 py-1 text-right">{formatCurrency(0)}</td>
                      <td className="border px-2 py-1 text-right">{formatCurrency(financed)}</td>
                    </tr>
                    {installments.map((item) => (
                      <tr key={item.number}>
                        <td className="border px-2 py-1 text-center">{item.number}</td>
                        <td className="border px-2 py-1 text-right">
                          {formatCurrency(item.value)}
                        </td>
                        <td className="border px-2 py-1 text-right">
                          {formatCurrency(item.interest)}
                        </td>
                        <td className="border px-2 py-1 text-right">
                          {formatCurrency(item.amortization)}
                        </td>
                        <td className="border px-2 py-1 text-right">
                          {formatCurrency(item.saldoDevedor)}
                        </td>
                      </tr>
                    ))}
                    {/* Totais */}
                    <tr className="bg-muted font-bold">
                      <td className="border px-2 py-1 text-center">Totais</td>
                      <td className="border px-2 py-1 text-right">
                        {formatCurrency(installments.reduce((acc, cur) => acc + cur.value, 0))}
                      </td>
                      <td className="border px-2 py-1 text-right">
                        {formatCurrency(installments.reduce((acc, cur) => acc + cur.interest, 0))}
                      </td>
                      <td className="border px-2 py-1 text-right">
                        {formatCurrency(
                          installments.reduce((acc, cur) => acc + cur.amortization, 0)
                        )}
                      </td>
                      <td className="border px-2 py-1 text-right">{formatCurrency(0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
