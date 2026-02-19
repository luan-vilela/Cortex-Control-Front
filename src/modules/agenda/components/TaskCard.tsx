'use client'

import { useMemo } from 'react'

import {
  CheckCircle2,
  Circle,
  ExternalLink,
  GripVertical,
  MoreHorizontal,
  Trash2,
  Pencil,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import type { AgendaTaskItem } from '../types/tasks'

interface TaskCardProps {
  task: AgendaTaskItem
  onEdit?: (task: AgendaTaskItem) => void
  onDelete?: (taskId: string) => void
  onClick?: (task: AgendaTaskItem) => void
}

export function TaskCard({ task, onEdit, onDelete, onClick }: TaskCardProps) {
  const checklistProgress = useMemo(() => {
    if (!task.checklist?.length) return null
    const total = task.checklist.length
    const checked = task.checklist.filter((c) => c.checked).length
    const percent = Math.round((checked / total) * 100)
    return { total, checked, percent }
  }, [task.checklist])

  return (
    <div
      className="group relative rounded-xl border border-border/60 bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-border cursor-pointer"
      onClick={() => onClick?.(task)}
    >
      {/* Drag handle + Menu */}
      <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(task)
                }}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                className="text-destructive"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(task.id)
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Title */}
      <h4 className="font-medium text-sm leading-tight pr-16 line-clamp-2">
        {task.title}
      </h4>

      {/* Observation preview */}
      {task.observation && (
        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
          {task.observation}
        </p>
      )}

      {/* Footer row */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        {/* Links count */}
        {task.links?.length > 0 && (
          <Badge variant="outline" className="text-[10px] gap-1 px-1.5 py-0.5">
            <ExternalLink className="h-3 w-3" />
            {task.links.length}
          </Badge>
        )}

        {/* Checklist progress */}
        {checklistProgress && (
          <div className="flex items-center gap-1.5 ml-auto">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              {checklistProgress.percent === 100 ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Circle className="h-3.5 w-3.5" />
              )}
              <span>
                {checklistProgress.checked}/{checklistProgress.total}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${checklistProgress.percent}%`,
                  backgroundColor:
                    checklistProgress.percent === 100
                      ? '#10b981'
                      : checklistProgress.percent > 50
                        ? '#3b82f6'
                        : '#f59e0b',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
