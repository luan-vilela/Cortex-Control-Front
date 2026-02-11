'use client'

import NewContactModal from '../NewContactModal'

import { forwardRef, useImperativeHandle, useMemo, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'

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
import { useAlerts } from '@/contexts/AlertContext'
import { personService } from '@/modules/person/services/person.service'
import { useWorkspaceStore } from '@/modules/workspace/store/workspace.store'

import { type Responsible, type Responsibles, responsiblesFormSchema } from './responsibles.schema'

type Ref = {
  validate: () => Promise<boolean>
  getValues: () => Responsibles
  clearDirty: () => void
  setFieldError: (message: string) => void
}

type Props = {
  initialValues?: { responsibles?: Responsibles }
  onChange?: (values?: Responsibles) => void
  onResponsibleAdded?: (responsible: Responsible) => void
}

export const ResponsiblesBlock = forwardRef<Ref, Props>(
  ({ initialValues, onChange, onResponsibleAdded }, ref) => {
    const { activeWorkspace } = useWorkspaceStore()
    const alerts = useAlerts()

    const {
      control,
      getValues,
      reset,
      setError,
      formState: { errors },
      trigger,
    } = useForm<{ responsibles: Responsibles }>({
      resolver: zodResolver(responsiblesFormSchema),
      defaultValues: initialValues || { responsibles: [] },
    })

    const { fields, append, remove } = useFieldArray({ control, name: 'responsibles' })

    const [query, setQuery] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [searching, setSearching] = useState(false)
    const [searched, setSearched] = useState(false)
    const [open, setOpen] = useState(false)
    const [newContactOpen, setNewContactOpen] = useState(false)

    useImperativeHandle(ref, () => ({
      validate: async () => {
        const isValid = await trigger()
        return isValid
      },
      getValues: () => getValues().responsibles,
      clearDirty: () => reset(getValues()),
      setFieldError: (message: string) => setError('responsibles', { type: 'manual', message }),
    }))

    const availableResults = useMemo(() => {
      return (results || []).slice(0, 8)
    }, [results])

    const handleSearch = async () => {
      if (!activeWorkspace || !query.trim()) return
      try {
        setSearched(true)
        setSearching(true)
        const persons = await personService.getPersons(activeWorkspace.id, { search: query })
        setResults(persons || [])
      } catch (err: any) {
        setResults([])
        console.warn('Error searching persons:', err)
        alerts.error(err?.message || 'Erro ao buscar contatos. Tente novamente mais tarde.')
      } finally {
        setSearching(false)
      }
    }

    const mapCreateToFormPhones = (phones: any[] | undefined) => {
      if (!phones) return []
      return phones.map((p: any) => ({
        number: p.number || '',
        type: p.type || 'MOBILE',
        isPrimary: !!p.isPrimary,
        owner: p.owner || undefined,
      }))
    }

    const handleAttachExisting = (match: any) => {
      const responsible = {
        id: match.id,
        name: match.name,
        email: match.email || '',
        phones: mapCreateToFormPhones(match.phones),
      }
      append(responsible)
      setOpen(false)
      onChange?.(getValues().responsibles)
      onResponsibleAdded?.(responsible)
    }

    const handleCreated = (created: any) => {
      const responsible = {
        id: created.id,
        name: created.name,
        email: created.email || '',
        phones: mapCreateToFormPhones(created.phones),
      }
      append(responsible)
      setOpen(false)
      onChange?.(getValues().responsibles)
      onResponsibleAdded?.(responsible)
    }

    return (
      <div className="bg-gh-card border-gh-border rounded-md border p-4 sm:p-6">
        <h3 className="text-gh-text mb-4 text-sm font-semibold sm:text-base">Responsáveis</h3>

        <div className="space-y-2">
          {fields.map((f: any, idx) => (
            <div key={f.id} className="bg-gh-bg border-gh-border rounded-md border p-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-gh-text-secondary text-xs">Nome</div>
                  <div className="text-sm font-medium">{f.name || '-'}</div>

                  <div className="text-gh-text-secondary mt-2 text-xs">Email</div>
                  <div className="truncate text-sm">{f.email || '-'}</div>

                  <div className="text-gh-text-secondary mt-2 text-xs">Telefone</div>
                  <div className="text-sm">
                    {f.phones && f.phones.length > 0 ? f.phones[0].number : '-'}
                  </div>
                </div>

                <div className="ml-4 flex flex-col gap-2">
                  <Button variant="destructive" size="sm" onClick={() => remove(idx)}>
                    Remover
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <div>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="border-gh-border text-gh-text-secondary hover:border-gh-hover hover:text-gh-hover w-full rounded-md border-2 border-dashed p-4 transition-colors"
                  >
                    + Adicionar responsável
                  </button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Buscar responsável</DialogTitle>
                    <DialogDescription>
                      Pesquise um contato e selecione para preencher dados.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="mt-2">
                    <div className="flex gap-2">
                      <Input
                        value={query}
                        onChange={(e) => {
                          setQuery((e.target as HTMLInputElement).value)
                          // Limpar erro quando usuário começa a digitar
                          if (errors.responsibles) {
                            setError('responsibles', { type: 'manual', message: '' })
                          }
                        }}
                        placeholder="Buscar contato existente..."
                        aria-label="Buscar contato existente"
                        className={errors.responsibles ? 'border-red-500 focus:border-red-500' : ''}
                      />
                      <Button
                        size="sm"
                        onClick={handleSearch}
                        disabled={!query.trim() || !activeWorkspace}
                      >
                        {searching ? 'Buscando...' : 'Buscar'}
                      </Button>
                    </div>
                    {errors.responsibles && (
                      <div className="mt-1 text-sm font-medium text-red-600">
                        ⚠️ {errors.responsibles.message}
                      </div>
                    )}

                    {searched && (
                      <div className="mt-3 max-h-64 overflow-auto border bg-white">
                        {results.length === 0 && (
                          <div className="p-2 text-sm">Nenhum resultado</div>
                        )}
                        {availableResults.map((p: any) => (
                          <div
                            key={p.id}
                            className="hover:bg-gh-bg-muted flex items-center justify-between gap-2 p-2"
                          >
                            <div>
                              <div className="text-sm font-medium">{p.name}</div>
                              <div className="text-gh-text-secondary text-xs">
                                {p.email || p.document || p.id}
                              </div>
                            </div>
                            <div>
                              <Button
                                size="sm"
                                onClick={() => {
                                  append({
                                    id: p.id,
                                    name: p.name,
                                    email: p.email || '',
                                    phones: mapCreateToFormPhones(p.phones),
                                  })
                                  setQuery('')
                                  setResults([])
                                  setSearched(false)
                                  setOpen(false)
                                  onChange?.(getValues().responsibles)
                                }}
                              >
                                Selecionar
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <DialogFooter>
                    <div className="flex w-full items-center justify-between">
                      <div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setNewContactOpen(true)}
                        >
                          Novo contato
                        </Button>
                      </div>
                      <div>
                        <Button size="sm" onClick={() => setOpen(false)}>
                          Fechar
                        </Button>
                      </div>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </div>
            </Dialog>
            <NewContactModal
              open={newContactOpen}
              onOpenChange={(v) => setNewContactOpen(v)}
              onAttachedExisting={handleAttachExisting}
              onCreated={handleCreated}
            />
          </div>
        </div>
      </div>
    )
  }
)

ResponsiblesBlock.displayName = 'ResponsiblesBlock'
