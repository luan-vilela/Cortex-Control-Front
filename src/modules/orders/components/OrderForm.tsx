'use client'

import { useCreateOrder, useUpdateOrder } from '../hooks/useOrders'
import { type Order, OrderPriority, OrderStatus } from '../types'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { DatePicker } from '@/components/patterns/DatePicker'
import { InputNumber } from '@/components/ui/InputNumber'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ContactSearchModal } from '@/modules/contact/components/ContactSearchModal'
import { MemberSearchModal } from '@/modules/workspace/components/MemberSearchModal'

const orderSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  approvedValue: z.number().min(0, 'Valor aprovado deve ser maior ou igual a 0'),
  totalValue: z.number().min(0, 'Valor total deve ser maior ou igual a 0').optional(),
  priority: z.nativeEnum(OrderPriority),
  status: z.nativeEnum(OrderStatus),
  clientId: z.string().min(1, 'Cliente é obrigatório'),
  assignedToId: z.string().optional(),
  dueDate: z.string().optional(),
})

type OrderFormData = z.infer<typeof orderSchema>

interface OrderFormProps {
  workspaceId: string
  order?: Order
  onSuccess?: () => void
  onCancel?: () => void
}

export function OrderForm({ workspaceId, order, onSuccess, onCancel }: OrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const createOrder = useCreateOrder()
  const updateOrder = useUpdateOrder()

  const orderForm = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      title: order?.title || '',
      description: order?.description || '',
      approvedValue: order?.approvedValue || 0,
      totalValue: order?.totalValue || undefined,
      priority: order?.priority || OrderPriority.MEDIUM,
      status: order?.status || OrderStatus.DRAFT,
      clientId: order?.clientId?.toString() || '',
      assignedToId: order?.assignedToId,
      dueDate: order?.dueDate ? new Date(order.dueDate).toISOString().split('T')[0] : '',
    },
  })

  const onSubmitOrder = async (data: OrderFormData) => {
    setIsSubmitting(true)
    try {
      if (order) {
        // Update existing order
        await updateOrder.mutateAsync({
          workspaceId,
          orderId: order.id,
          payload: data,
        })
      } else {
        // Create new order
        await createOrder.mutateAsync({
          workspaceId,
          payload: data,
        })
      }
      onSuccess?.()
    } catch (error) {
      console.error('Error saving order:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...orderForm}>
      <form onSubmit={orderForm.handleSubmit(onSubmitOrder)} className="space-y-6">
        <FormField
          control={orderForm.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Digite o título da ordem" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={orderForm.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea placeholder="Digite a descrição da ordem" rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={orderForm.control}
            name="approvedValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Aprovado</FormLabel>
                <FormControl>
                  <InputNumber
                    value={field.value || 0}
                    onChange={field.onChange}
                    float={true}
                    min={0}
                    placeholder="R$ 0,00"
                    mask="real"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={orderForm.control}
            name="totalValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Total (Opcional)</FormLabel>
                <FormControl>
                  <InputNumber
                    value={field.value || 0}
                    onChange={(val) => field.onChange(val === 0 ? undefined : val)}
                    float={true}
                    min={0}
                    placeholder="R$ 0,00"
                    mask="real"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={orderForm.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioridade</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={OrderPriority.LOW}>Baixa</SelectItem>
                    <SelectItem value={OrderPriority.MEDIUM}>Média</SelectItem>
                    <SelectItem value={OrderPriority.HIGH}>Alta</SelectItem>
                    <SelectItem value={OrderPriority.URGENT}>Urgente</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={orderForm.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={OrderStatus.DRAFT}>Rascunho</SelectItem>
                    <SelectItem value={OrderStatus.OPEN}>Aberta</SelectItem>
                    <SelectItem value={OrderStatus.SCHEDULED}>Agendada</SelectItem>
                    <SelectItem value={OrderStatus.IN_PROGRESS}>Em Execução</SelectItem>
                    <SelectItem value={OrderStatus.WAITING_CLIENT}>Aguardando Cliente</SelectItem>
                    <SelectItem value={OrderStatus.WAITING_RESOURCES}>
                      Aguardando Recursos
                    </SelectItem>
                    <SelectItem value={OrderStatus.COMPLETED}>Concluída</SelectItem>
                    <SelectItem value={OrderStatus.INVOICED}>Faturada</SelectItem>
                    <SelectItem value={OrderStatus.CLOSED}>Encerrada</SelectItem>
                    <SelectItem value={OrderStatus.CANCELED}>Cancelada</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={orderForm.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <FormControl>
                  <ContactSearchModal
                    workspaceId={workspaceId}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Selecione um cliente..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={orderForm.control}
            name="assignedToId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsável (opcional)</FormLabel>
                <FormControl>
                  <MemberSearchModal
                    workspaceId={workspaceId}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Selecione um responsável..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={orderForm.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prazo (opcional)</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value ? new Date(field.value) : undefined}
                  onValueChange={(date) => {
                    field.onChange(date ? date.toISOString().split('T')[0] : '')
                  }}
                  placeholder="Selecionar prazo"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : order ? 'Atualizar' : 'Criar'} Ordem
          </Button>
        </div>
      </form>
    </Form>
  )
}
