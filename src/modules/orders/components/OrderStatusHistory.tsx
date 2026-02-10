import { getStatusLabel } from '../services/order-status.service'
import { OrderStatusTransition } from '../types'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface OrderStatusHistoryProps {
  statusHistory: OrderStatusTransition[]
}

export function OrderStatusHistory({ statusHistory }: OrderStatusHistoryProps) {
  if (!statusHistory || statusHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">Nenhum histórico de status disponível</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {statusHistory.map((transition, index) => (
            <div
              key={transition.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center space-x-3">
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{getStatusLabel(transition.fromStatus)}</Badge>
                    <span className="text-muted-foreground text-sm">→</span>
                    <Badge variant="default">{getStatusLabel(transition.toStatus)}</Badge>
                  </div>
                  <div className="text-muted-foreground mt-1 text-xs">
                    {new Date(transition.transitionedAt).toLocaleString('pt-BR')}
                  </div>
                  {transition.reason && (
                    <div className="text-muted-foreground mt-1 text-xs">
                      Motivo: {transition.reason}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-muted-foreground text-xs">
                  Por: {transition.transitionedBy}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
