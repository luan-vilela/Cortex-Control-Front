import { useOrderStatusTransition } from '../hooks/useOrderStatusTransition'
import {
  getNextPossibleStatuses,
  getStatusDescription,
  getStatusLabel,
  isFinalStatus,
} from '../services/order-status.service'
import { OrderStatus } from '../types'

import { useState } from 'react'

import { AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface OrderStatusTransitionManagerProps {
  orderId: string
  workspaceId: string
  currentStatus: OrderStatus
  onStatusChanged?: (newStatus: OrderStatus) => void
}

export function OrderStatusTransitionManager({
  orderId,
  workspaceId,
  currentStatus,
  onStatusChanged,
}: OrderStatusTransitionManagerProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | ''>('')
  const [reason, setReason] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { transition, isTransitioning, canTransitionTo, error } = useOrderStatusTransition({
    orderId,
    workspaceId,
    currentStatus,
    onSuccess: (newStatus) => {
      setIsDialogOpen(false)
      setSelectedStatus('')
      setReason('')
      onStatusChanged?.(newStatus)
    },
  })

  const possibleStatuses = getNextPossibleStatuses(currentStatus)
  const isFinal = isFinalStatus(currentStatus)

  const handleTransition = () => {
    if (!selectedStatus) return

    transition({
      newStatus: selectedStatus,
      reason: reason.trim() || undefined,
    })
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.DRAFT:
        return <Clock className="h-4 w-4" />
      case OrderStatus.OPEN:
      case OrderStatus.SCHEDULED:
      case OrderStatus.IN_PROGRESS:
        return <CheckCircle className="h-4 w-4" />
      case OrderStatus.WAITING_CLIENT:
      case OrderStatus.WAITING_RESOURCES:
        return <AlertCircle className="h-4 w-4" />
      case OrderStatus.COMPLETED:
      case OrderStatus.INVOICED:
      case OrderStatus.CLOSED:
        return <CheckCircle className="h-4 w-4" />
      case OrderStatus.CANCELED:
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (isFinal) {
    return (
      <div className="bg-muted/50 rounded-lg border p-4">
        <div className="flex items-center space-x-2">
          {getStatusIcon(currentStatus)}
          <span className="font-medium">Status Final</span>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          Esta ordem está em um status final e não pode ser alterada.
        </p>
      </div>
    )
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Alterar Status
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alterar Status da Ordem</DialogTitle>
          <DialogDescription>
            Status atual: <strong>{getStatusLabel(currentStatus)}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="status">Novo Status</Label>
            <Select
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value as OrderStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o novo status" />
              </SelectTrigger>
              <SelectContent>
                {possibleStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(status)}
                      <span>{getStatusLabel(status)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStatus && (
            <div className="bg-muted rounded-md p-3">
              <p className="text-sm">{getStatusDescription(selectedStatus)}</p>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="reason">Motivo (opcional)</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Digite o motivo da mudança..."
            />
          </div>

          {error && (
            <div className="border-destructive bg-destructive/10 rounded-md border p-3">
              <p className="text-destructive text-sm">{error.message}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsDialogOpen(false)}
            disabled={isTransitioning}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleTransition}
            disabled={!selectedStatus || isTransitioning}
          >
            {isTransitioning ? 'Alterando...' : 'Confirmar Alteração'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
