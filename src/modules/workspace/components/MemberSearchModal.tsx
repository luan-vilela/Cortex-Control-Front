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
import { useWorkspaceMembers } from '@/modules/workspace/hooks/useWorkspaceQueries'
import { type WorkspaceMember } from '@/modules/workspace/types/workspace.types'

interface MemberSearchModalProps {
  workspaceId: string
  value?: string
  onChange: (memberId: string) => void
  placeholder?: string
  className?: string
}

export function MemberSearchModal({
  workspaceId,
  value,
  onChange,
  placeholder = 'Buscar responsável...',
  className,
}: MemberSearchModalProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Buscar membros do workspace
  const { data: membersResponse, isLoading } = useWorkspaceMembers(workspaceId)

  const members = membersResponse || []

  // Filtrar membros baseado na busca
  const filteredMembers = searchQuery
    ? members.filter(
        (member: WorkspaceMember) =>
          member.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          member.user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : members

  // Encontrar membro selecionado
  const selectedMember = members.find((member: WorkspaceMember) => member.id === value)

  const handleSearch = () => {
    setSearchQuery(searchTerm)
  }

  const handleSelect = (memberId: string) => {
    onChange(memberId)
    setOpen(false)
    setSearchTerm('')
    setSearchQuery('')
  }

  return (
    <>
      <div className={className}>
        <Input
          value={selectedMember?.user.name || ''}
          onClick={() => setOpen(true)}
          placeholder={placeholder}
          readOnly
          className="cursor-pointer"
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Buscar Responsável</DialogTitle>
            <DialogDescription>
              Selecione um membro da equipe para ser o responsável.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Barra de busca moderna */}
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Digite nome ou email do membro..."
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

            {/* Resultados da busca */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="text-muted-foreground py-8 text-center text-sm">
                  Carregando membros...
                </div>
              ) : filteredMembers.length === 0 ? (
                <div className="text-muted-foreground py-8 text-center text-sm">
                  {searchQuery
                    ? `Nenhum membro encontrado para "${searchQuery}".`
                    : 'Nenhum membro encontrado neste workspace.'}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-muted-foreground text-sm">
                    {filteredMembers.length} membro(s) encontrado(s)
                  </p>
                  {filteredMembers.map((member: WorkspaceMember) => (
                    <div
                      key={member.id}
                      className="hover:bg-muted/50 flex cursor-pointer items-center justify-between rounded-lg border p-3"
                      onClick={() => handleSelect(member.id)}
                    >
                      <div className="flex items-center gap-3">
                        <User className="text-muted-foreground h-5 w-5" />
                        <div>
                          <p className="font-medium">{member.user.name}</p>
                          <div className="text-muted-foreground text-sm">
                            {member.user.email}
                            {member.isOwner && (
                              <>
                                {' • '}
                                <span className="text-primary font-medium">Proprietário</span>
                              </>
                            )}
                            {!member.isOwner && member.role && (
                              <>
                                {' • '}
                                <span className="capitalize">{member.role}</span>
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
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
