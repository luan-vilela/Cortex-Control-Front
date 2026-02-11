'use client'

import { useState } from 'react'

import { Check, ChevronsUpDown, Plus, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { usePersons } from '@/modules/person/hooks/usePersonQueries'
import { type AllContacts, EntityType } from '@/modules/person/types/person.types'

interface ClientSelectProps {
  workspaceId: string
  value?: string
  onChange: (clientId: string) => void
  onCreateNew?: () => void
  placeholder?: string
  className?: string
}

export function ClientSelect({
  workspaceId,
  value,
  onChange,
  onCreateNew,
  placeholder = 'Selecione um cliente...',
  className,
}: ClientSelectProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  // Buscar apenas clientes (pessoas com papel CLIENTE)
  const { data: personsResponse, isLoading } = usePersons(workspaceId, {
    entityType: EntityType.CLIENTE,
    search: searchTerm || undefined,
  })

  const clients = personsResponse || []

  // Encontrar cliente selecionado
  const selectedClient = clients.find((client: AllContacts) => client.id === value)

  const handleSelect = (clientId: string) => {
    onChange(clientId)
    setOpen(false)
    setSearchTerm('')
  }

  const handleCreateNew = () => {
    setOpen(false)
    setSearchTerm('')
    onCreateNew?.()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', className)}
        >
          {selectedClient ? (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="truncate">
                {selectedClient.name}
                {selectedClient.document && (
                  <span className="text-muted-foreground ml-2">({selectedClient.document})</span>
                )}
              </span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Buscar cliente..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>
              {isLoading ? (
                <div className="py-6 text-center text-sm">Carregando clientes...</div>
              ) : searchTerm ? (
                <div className="py-6 text-center text-sm">
                  Nenhum cliente encontrado.
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-auto p-1"
                    onClick={handleCreateNew}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Criar novo cliente
                  </Button>
                </div>
              ) : (
                <div className="py-6 text-center text-sm">
                  Nenhum cliente encontrado.
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-auto p-1"
                    onClick={handleCreateNew}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Criar primeiro cliente
                  </Button>
                </div>
              )}
            </CommandEmpty>

            {clients.length > 0 && (
              <CommandGroup>
                {clients.map((client: AllContacts) => (
                  <CommandItem
                    key={client.id}
                    value={`${client.name} ${client.document || ''} ${client.email || ''}`}
                    onSelect={() => handleSelect(client.id)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === client.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <div className="flex flex-col">
                        <span className="font-medium">{client.name}</span>
                        {client.document && (
                          <span className="text-muted-foreground text-xs">{client.document}</span>
                        )}
                        {client.email && (
                          <span className="text-muted-foreground text-xs">{client.email}</span>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Opção para criar novo cliente */}
            <CommandGroup>
              <CommandItem onSelect={handleCreateNew}>
                <Plus className="mr-2 h-4 w-4" />
                <span>Criar novo cliente</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
