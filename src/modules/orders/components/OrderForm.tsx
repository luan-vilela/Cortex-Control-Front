'use client'

import { useCreateOrder, useUpdateOrder } from '../hooks/useOrders'
import { type Order, OrderPriority, OrderStatus, OrderType } from '../types'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { DatePicker } from '@/components/patterns/DatePicker'
import { SwitchGroupCard } from '@/components/patterns/SwitchGroupCard'
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
  orderType: z.enum(OrderType),
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  approvedValue: z.number().min(0, 'Valor aprovado deve ser maior ou igual a 0').optional(),
  totalValue: z.number().min(0, 'Valor total deve ser maior ou igual a 0').optional(),
  isBillable: z.boolean().optional(),
  priority: z.enum(OrderPriority),
  status: z.enum(OrderStatus),
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
      orderType: order?.orderType || OrderType.OS,
      title: order?.title || '',
      description: order?.description || '',
      approvedValue: order?.approvedValue || undefined,
      totalValue: order?.totalValue || undefined,
      isBillable: order?.isBillable ?? true,
      priority: order?.priority || OrderPriority.MEDIUM,
      status: order?.status || OrderStatus.OPEN,
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
    <div className="flex flex-col gap-4">
      {/* Header com Botões */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <h2 className="text-gh-text mb-1 text-xl font-bold sm:text-2xl">
            {order ? 'Editar Ordem' : 'Nova Ordem de Serviço'}
          </h2>
          <p className="text-gh-text-secondary text-xs sm:text-sm">
            {order ? 'Atualize os detalhes da ordem' : 'Preencha os detalhes da nova ordem'}
          </p>
        </div>

        <div className="flex w-full gap-2 md:w-auto">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button form="order-form" type="submit" variant="default" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : order ? 'Atualizar Ordem' : 'Criar Ordem'}
          </Button>
        </div>
      </div>

      {/* Form em Grid 2 Colunas */}
      <Form {...orderForm}>
        <form
          id="order-form"
          onSubmit={orderForm.handleSubmit(onSubmitOrder)}
          className="grid grid-cols-3 gap-6"
        >
          {/* Coluna Esquerda (2/3) */}
          <div className="col-span-2 space-y-6">
            {/* Descrições Básicas */}
            <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="text-gh-text font-semibold">Descrições Básicas</h3>

              <FormField
                control={orderForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o título da ordem" className="w-full" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex w-full gap-4">
                <FormField
                  control={orderForm.control}
                  name="orderType"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Tipo de Ordem</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o tipo de ordem" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={OrderType.OS}>OS - Ordem de Serviço</SelectItem>
                          <SelectItem value={OrderType.CH}>CH - Chamado</SelectItem>
                          <SelectItem value={OrderType.OT}>OT - Ordem de Trabalho</SelectItem>
                          <SelectItem value={OrderType.PV}>PV - Proposta / Orçamento</SelectItem>
                          <SelectItem value={OrderType.CT}>CT - Contrato</SelectItem>
                          <SelectItem value={OrderType.IN}>IN - Inspeção / Vistoria</SelectItem>
                          <SelectItem value={OrderType.MA}>MA - Manutenção</SelectItem>
                          <SelectItem value={OrderType.TR}>TR - Treinamento</SelectItem>
                          <SelectItem value={OrderType.GT}>GT - Garantia</SelectItem>
                          <SelectItem value={OrderType.AG}>AG - Agendamento</SelectItem>
                          <SelectItem value={OrderType.RC}>RC - Reclamação</SelectItem>
                          <SelectItem value={OrderType.SV}>SV - Serviço Avulso</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={orderForm.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Prioridade</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
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
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem className="flex-1">
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
              </div>

              <FormField
                control={orderForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Digite a descrição da ordem"
                        rows={6}
                        className="h-28 w-full resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Financeiro */}
            <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="text-gh-text font-semibold">Financeiro</h3>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={orderForm.control}
                  name="approvedValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Aprovado (Opcional)</FormLabel>
                      <FormControl>
                        <InputNumber
                          value={field.value ?? 0}
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
                          value={field.value ?? 0}
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
              </div>

              <SwitchGroupCard
                value={orderForm.watch('isBillable') ?? true}
                onValueChange={(value) => orderForm.setValue('isBillable', value)}
                title="Faturável"
                description="Marque se esta ordem deve gerar transações financeiras"
              />
            </div>
          </div>

          {/* Coluna Direita (1/3) */}
          <div className="col-span-1 space-y-6">
            {/* Responsável */}
            <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
              <h3 className="text-gh-text font-semibold">Responsável</h3>

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
                        className="w-full"
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
                        className="w-full"
                      />
                    </FormControl>
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
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={OrderStatus.DRAFT}>Rascunho</SelectItem>
                        <SelectItem value={OrderStatus.OPEN}>Aberta</SelectItem>
                        <SelectItem value={OrderStatus.SCHEDULED}>Agendada</SelectItem>
                        <SelectItem value={OrderStatus.IN_PROGRESS}>Em Execução</SelectItem>
                        <SelectItem value={OrderStatus.WAITING_CLIENT}>
                          Aguardando Cliente
                        </SelectItem>
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
          </div>
        </form>
      </Form>
    </div>
  )
}
