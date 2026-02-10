'use client'

import { useState } from 'react'

import { Search, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { detectDocumentType, formatDocument } from '@/lib/utils'
import { NewContactModal } from '@/modules/person/components/NewContactModal'
import { usePersons } from '@/modules/person/hooks/usePersonQueries'
import { type AllContacts, EntityType } from '@/modules/person/types/person.types'

interface ContactSearchModalProps {
  workspaceId: string
  value?: string
  onChange: (contactId: string) => void
  placeholder?: string
  className?: string
}

export function ContactSearchModal({
  workspaceId,
  value,
  onChange,
  placeholder = 'Buscar ou criar contato...',
  className,
}: ContactSearchModalProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Buscar apenas clientes (pessoas com papel CLIENTE)
  const { data: personsResponse, isLoading } = usePersons(workspaceId, {
    entityType: EntityType.CLIENTE,
    search: searchQuery || undefined,
  })

  const contacts = personsResponse || []

  // Encontrar contato selecionado
  const selectedContact = contacts.find((contact: AllContacts) => contact.id === value)

  const handleSearch = () => {
    setSearchQuery(searchTerm)
  }

  const handleSelect = (contactId: string) => {
    onChange(contactId)
    setOpen(false)
    setSearchTerm('')
    setSearchQuery('')
  }

  const handleCreateNew = () => {
    setShowCreateModal(true)
  }

  const handleContactCreated = (createdContact: any) => {
    setShowCreateModal(false)
    // O contato criado automaticamente será selecionado
    onChange(createdContact.id)
    setOpen(false)
    setSearchTerm('')
    setSearchQuery('')
  }

  const handleContactAttached = (existingContact: any) => {
    setShowCreateModal(false)
    onChange(existingContact.id)
    setOpen(false)
    setSearchTerm('')
    setSearchQuery('')
  }

  return (
    <>
      <div className={className}>
        <Input
          value={selectedContact?.name || ''}
          onClick={() => setOpen(true)}
          placeholder={placeholder}
          readOnly
          className="cursor-pointer"
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl p-2 sm:p-6">
          <DialogHeader>
            <DialogTitle>Buscar Contato</DialogTitle>
            <DialogDescription>
              Digite o nome ou documento do contato para buscar, ou crie um novo contato.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Barra de busca moderna */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 max-w-4 -translate-y-1/2" />
                <Input
                  placeholder="Digite nome, CPF ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch()
                    }
                  }}
                  className="pr-4 pl-10"
                />
              </div>
              <Button variant="outline" onClick={handleCreateNew} className="h-10 shrink-0">
                <User className="mr-2 h-4 w-4" />
                Cadastrar Cliente
              </Button>
            </div>

            {/* Resultados da busca */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="text-muted-foreground py-8 text-center text-sm">
                  Buscando contatos...
                </div>
              ) : searchQuery && contacts.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center text-sm">
                  Nenhum contato encontrado para &quot;{searchQuery}&quot;.
                  <br />
                  <Button variant="link" className="mt-2 h-auto p-0" onClick={handleCreateNew}>
                    Criar novo contato
                  </Button>
                </div>
              ) : contacts.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm">
                    {contacts.length} contato(s) encontrado(s)
                  </p>
                  {contacts.map((contact: AllContacts) => (
                    <div
                      key={contact.id}
                      className="hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg border p-3"
                      onClick={() => handleSelect(contact.id)}
                    >
                      <div className="flex items-center gap-3">
                        <User className="text-muted-foreground h-5 w-5" />
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <div className="text-muted-foreground text-sm">
                            {contact.document && (
                              <span>
                                {detectDocumentType(contact.document) === 'cpf' ? 'CPF' : 'CNPJ'}:{' '}
                                {formatDocument(contact.document)}
                              </span>
                            )}
                            {contact.email && (
                              <>
                                {contact.document && ' • '}
                                {contact.email}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Selecionar
                      </Button>
                    </div>
                  ))}
                </div>
              ) : searchQuery === '' ? (
                <div className="text-muted-foreground py-8 text-center text-sm">
                  Digite algo para buscar ou clique em &quot;Cadastrar Cliente&quot; para criar um
                  novo.
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de criação de contato */}
      <NewContactModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreated={handleContactCreated}
        onAttachedExisting={handleContactAttached}
      />
    </>
  )
}
