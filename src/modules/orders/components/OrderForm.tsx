'use client'

import { useCreateOrder, useUpdateOrder } from '../hooks/useOrders'
import { Order, OrderPriority, OrderStatus } from '../types'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
import { useCreatePerson } from '@/modules/person/hooks/usePersonMutations'
import { CreateClienteDto, PhoneType } from '@/modules/person/types/person.types'

import { ClientSelect } from './ClientSelect'

const orderSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  value: z.number().min(0, 'Valor deve ser maior que zero'),
  priority: z.nativeEnum(OrderPriority),
  clientId: z.string().min(1, 'Cliente é obrigatório'),
  assignedToId: z.string().optional(),
  dueDate: z.string().optional(),
})

const contactSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  document: z.string().min(11, 'CPF/CNPJ inválido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
})

type OrderFormData = z.infer<typeof orderSchema>
type ContactFormData = z.infer<typeof contactSchema>

interface OrderFormProps {
  workspaceId: string
  order?: Order
  onSuccess?: () => void
  onCancel?: () => void
}

export function OrderForm({ workspaceId, order, onSuccess, onCancel }: OrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCreateContact, setShowCreateContact] = useState(false)

  const createOrder = useCreateOrder()
  const updateOrder = useUpdateOrder()
  const createPerson = useCreatePerson(workspaceId)

  const orderForm = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      title: order?.title || '',
      description: order?.description || '',
      value: order?.value || 0,
      priority: order?.priority || OrderPriority.MEDIUM,
      clientId: order?.clientId?.toString() || '',
      assignedToId: order?.assignedToId,
      dueDate: order?.dueDate ? new Date(order.dueDate).toISOString().split('T')[0] : '',
    },
  })

  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      document: '',
      email: '',
      phone: '',
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
          payload: {
            ...data,
            status: order.status, // Keep current status when updating
          },
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

  const onSubmitContact = async (data: ContactFormData) => {
    try {
      // Criar pessoa como cliente
      const newPerson = await createPerson.mutateAsync({
        name: data.name,
        document: data.document,
        email: data.email || undefined,
        phones: data.phone
          ? [
              {
                number: data.phone,
                type: PhoneType.MOBILE,
                isPrimary: true,
              },
            ]
          : undefined,
        // Campos específicos do cliente
        categoria: 'REGULAR',
        clienteStatus: 'ATIVO',
      } as CreateClienteDto)

      // Definir o ID do novo cliente no formulário de order
      orderForm.setValue('clientId', newPerson.id)

      setShowCreateContact(false)
      contactForm.reset()
    } catch (error) {
      console.error('Error creating contact:', error)
    }
  }

  return (
    <>
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
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={orderForm.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <FormControl>
                    <ClientSelect
                      workspaceId={workspaceId}
                      value={field.value}
                      onChange={field.onChange}
                      onCreateNew={() => setShowCreateContact(true)}
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
                    <Input placeholder="ID do responsável" {...field} />
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
                  <Input type="date" {...field} />
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

      {/* Modal para criar novo contato */}
      <Dialog open={showCreateContact} onOpenChange={setShowCreateContact}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Criar Novo Cliente</DialogTitle>
            <DialogDescription>
              Preencha os dados do novo cliente. Ele será criado automaticamente como cliente.
            </DialogDescription>
          </DialogHeader>

          <Form {...contactForm}>
            <form onSubmit={contactForm.handleSubmit(onSubmitContact)} className="space-y-4">
              <FormField
                control={contactForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={contactForm.control}
                name="document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF/CNPJ</FormLabel>
                    <FormControl>
                      <Input placeholder="000.000.000-00 ou 00.000.000/0000-00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={contactForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (opcional)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="email@exemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={contactForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowCreateContact(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Criar Cliente</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
