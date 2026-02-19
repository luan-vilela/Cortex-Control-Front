'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Eye, GitBranch, AlertTriangle } from 'lucide-react'

import {
  KanbanProvider,
  KanbanBoard,
  KanbanHeader,
  KanbanCards,
  KanbanCard,
} from '@/components/ui/kanban'
import { Badge } from '@/components/ui/badge'
import { cn, formatDate } from '@/lib/utils'
import { ProcessStatusBadge } from './ProcessStatusBadge'
import { ProcessTypeBadge } from './ProcessTypeBadge'
import { type Process, ProcessStatus } from '../types'
import { useUpdateProcesso } from '../hooks/useProcessos'

// Colunas do Kanban = status dos processos
const statusColumns = [
  {
    id: ProcessStatus.ABERTO,
    name: 'Aberto',
    color: 'bg-blue-500',
  },
  {
    id: ProcessStatus.EM_ANDAMENTO,
    name: 'Em Andamento',
    color: 'bg-yellow-500',
  },
  {
    id: ProcessStatus.PENDENTE,
    name: 'Pendente',
    color: 'bg-orange-500',
  },
  {
    id: ProcessStatus.BLOQUEADO,
    name: 'Bloqueado',
    color: 'bg-red-500',
  },
  {
    id: ProcessStatus.CONCLUIDO,
    name: 'Concluído',
    color: 'bg-green-500',
  },
  {
    id: ProcessStatus.CANCELADO,
    name: 'Cancelado',
    color: 'bg-gray-500',
  },
]

type KanbanItem = {
  id: string
  name: string
  column: string
  process: Process
}

interface ProcessosKanbanProps {
  data: Process[]
  workspaceId: string
  isLoading?: boolean
}

export function ProcessosKanban({ data, workspaceId, isLoading }: ProcessosKanbanProps) {
  const router = useRouter()
  const { mutate: updateProcesso } = useUpdateProcesso()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Converter processos em itens do kanban
  const kanbanItems = useMemo<KanbanItem[]>(() => {
    return (data || []).map((p) => ({
      id: p.id,
      name: p.name,
      column: p.status,
      process: p,
    }))
  }, [data])

  const [items, setItems] = useState<KanbanItem[]>(kanbanItems)

  // Sincronizar quando dados mudam
  useEffect(() => {
    setItems(kanbanItems)
  }, [kanbanItems])

  // Contagem por coluna
  const countByColumn = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const item of items) {
      counts[item.column] = (counts[item.column] || 0) + 1
    }
    return counts
  }, [items])

  const handleDataChange = (newItems: KanbanItem[]) => {
    // Encontrar o card que mudou de coluna
    const changedItem = newItems.find((item) => {
      const original = items.find((i) => i.id === item.id)
      return original && original.column !== item.column
    })

    if (changedItem) {
      // Atualizar status do processo via API
      updateProcesso({
        workspaceId,
        processId: changedItem.id,
        payload: { status: changedItem.column as ProcessStatus },
      })
    }

    setItems(newItems)
  }

  if (!mounted) {
    return <div className="h-[600px] w-full animate-pulse rounded-lg bg-muted/50" />
  }

  if (isLoading) {
    return <div className="h-[600px] w-full animate-pulse rounded-lg bg-muted/50" />
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed border-gh-border">
        <p className="text-gh-text-secondary text-sm">Nenhum processo encontrado</p>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-350px)] min-h-[500px]">
      <KanbanProvider
        columns={statusColumns}
        data={items}
        onDataChange={handleDataChange}
        className="h-full"
      >
        {(column) => (
          <KanbanBoard id={column.id} key={column.id} className="bg-gh-card border-gh-border">
            <KanbanHeader className="flex items-center gap-2 border-b border-gh-border bg-gh-canvas px-3 py-2.5">
              <span
                className={cn('h-2.5 w-2.5 rounded-full', column.color)}
              />
              <span className="text-gh-text text-sm font-semibold">{column.name}</span>
              <Badge variant="secondary" className="ml-auto text-xs">
                {countByColumn[column.id] || 0}
              </Badge>
            </KanbanHeader>
            <KanbanCards<KanbanItem> id={column.id}>
              {(item) => (
                <KanbanCard key={item.id} {...item} onDoubleClick={() => router.push(`/processos/${item.id}`)}>
                  <div className="space-y-2">
                    <p className="text-gh-text text-sm font-medium leading-tight">
                      {item.name}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5">
                      <ProcessTypeBadge type={item.process.type} />
                      {item.process.obrigatorio && (
                        <Badge variant="default" className="text-[10px] px-1.5 py-0">
                          Obrigatório
                        </Badge>
                      )}
                      {item.process.impeditivo && (
                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                          <AlertTriangle className="mr-0.5 h-2.5 w-2.5" />
                          Impeditivo
                        </Badge>
                      )}
                    </div>

                    {(item.process.children?.length > 0 || item.process.createdAt) && (
                      <div className="flex items-center gap-3 text-[11px] text-gh-text-secondary">
                        {item.process.children?.length > 0 && (
                          <span className="flex items-center gap-1">
                            <GitBranch className="h-3 w-3" />
                            {item.process.children.length} sub
                          </span>
                        )}
                        {item.process.createdAt && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(item.process.createdAt)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </KanbanCard>
              )}
            </KanbanCards>
          </KanbanBoard>
        )}
      </KanbanProvider>
    </div>
  )
}
