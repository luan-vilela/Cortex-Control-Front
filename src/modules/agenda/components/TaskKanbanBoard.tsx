'use client'

import { useMemo } from 'react'

import {
  Circle,
  Clock,
  CheckCircle2,
  Plus,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

import { TaskCard } from './TaskCard'
import {
  AgendaTaskStatus,
  TASK_STATUS_LABELS,
  TASK_STATUS_COLORS,
  type AgendaTaskItem,
} from '../types/tasks'

const COLUMNS: {
  status: AgendaTaskStatus
  icon: React.ReactNode
}[] = [
  {
    status: AgendaTaskStatus.PENDENTE,
    icon: <Circle className="h-4 w-4" />,
  },
  {
    status: AgendaTaskStatus.EM_ANDAMENTO,
    icon: <Clock className="h-4 w-4" />,
  },
  {
    status: AgendaTaskStatus.CONCLUIDO,
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
]

interface TaskKanbanBoardProps {
  tasks: AgendaTaskItem[]
  onEdit?: (task: AgendaTaskItem) => void
  onDelete?: (taskId: string) => void
  onClick?: (task: AgendaTaskItem) => void
  onMoveTask?: (taskId: string, newStatus: AgendaTaskStatus, order: number) => void
  onAddTask?: (status?: AgendaTaskStatus) => void
}

export function TaskKanbanBoard({
  tasks,
  onEdit,
  onDelete,
  onClick,
  onMoveTask,
  onAddTask,
}: TaskKanbanBoardProps) {
  const columns = useMemo(() => {
    return COLUMNS.map((col) => ({
      ...col,
      label: TASK_STATUS_LABELS[col.status],
      color: TASK_STATUS_COLORS[col.status],
      tasks: tasks
        .filter((t) => t.status === col.status)
        .sort((a, b) => a.order - b.order),
    }))
  }, [tasks])

  const handleDrop = (e: React.DragEvent, targetStatus: AgendaTaskStatus) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('text/plain')
    if (!taskId) return

    const columnTasks = tasks.filter((t) => t.status === targetStatus)
    const newOrder = columnTasks.length

    onMoveTask?.(taskId, targetStatus, newOrder)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((column) => (
        <div
          key={column.status}
          className="flex flex-col rounded-xl bg-muted/30 border border-border/40"
          onDrop={(e) => handleDrop(e, column.status)}
          onDragOver={handleDragOver}
        >
          {/* Column header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
            <div className="flex items-center gap-2">
              <span style={{ color: column.color }}>{column.icon}</span>
              <h3 className="font-semibold text-sm">{column.label}</h3>
              <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                {column.tasks.length}
              </span>
            </div>
            {column.status === AgendaTaskStatus.PENDENTE && onAddTask && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onAddTask(column.status)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Tasks list */}
          <ScrollArea className="flex-1 max-h-[calc(100vh-320px)]">
            <div className="p-3 space-y-3">
              {column.tasks.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  Nenhuma tarefa
                </div>
              ) : (
                column.tasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                  >
                    <TaskCard
                      task={task}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onClick={onClick}
                    />
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      ))}
    </div>
  )
}
