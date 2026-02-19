import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { agendaTaskService } from '../services/agendaTaskService'
import type {
  CreateTaskPayload,
  UpdateTaskPayload,
  MoveTaskPayload,
  TaskFilters,
} from '../types/tasks'

const taskQueryKeys = {
  all: ['agenda-tasks'] as const,
  lists: () => [...taskQueryKeys.all, 'list'] as const,
  list: (workspaceId: string, filters?: TaskFilters) =>
    [...taskQueryKeys.lists(), workspaceId, filters] as const,
  details: () => [...taskQueryKeys.all, 'detail'] as const,
  detail: (workspaceId: string, taskId: string) =>
    [...taskQueryKeys.details(), workspaceId, taskId] as const,
}

export function useAgendaTasks(
  workspaceId: string,
  filters?: TaskFilters,
  enabled = true,
) {
  return useQuery({
    queryKey: taskQueryKeys.list(workspaceId, filters),
    queryFn: () => agendaTaskService.getTasks(workspaceId, filters),
    enabled: enabled && !!workspaceId,
  })
}

export function useAgendaTask(
  workspaceId: string,
  taskId: string,
  enabled = true,
) {
  return useQuery({
    queryKey: taskQueryKeys.detail(workspaceId, taskId),
    queryFn: () => agendaTaskService.getTask(workspaceId, taskId),
    enabled: enabled && !!workspaceId && !!taskId,
  })
}

export function useCreateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      workspaceId,
      payload,
    }: {
      workspaceId: string
      payload: CreateTaskPayload
    }) => agendaTaskService.createTask(workspaceId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.all })
    },
  })
}

export function useUpdateTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      workspaceId,
      taskId,
      payload,
    }: {
      workspaceId: string
      taskId: string
      payload: UpdateTaskPayload
    }) => agendaTaskService.updateTask(workspaceId, taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.all })
    },
  })
}

export function useDeleteTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      workspaceId,
      taskId,
    }: {
      workspaceId: string
      taskId: string
    }) => agendaTaskService.deleteTask(workspaceId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.all })
    },
  })
}

export function useMoveTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      workspaceId,
      taskId,
      payload,
    }: {
      workspaceId: string
      taskId: string
      payload: MoveTaskPayload
    }) => agendaTaskService.moveTask(workspaceId, taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.all })
    },
  })
}

export function useToggleChecklistItem() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      workspaceId,
      taskId,
      checklistItemId,
    }: {
      workspaceId: string
      taskId: string
      checklistItemId: string
    }) =>
      agendaTaskService.toggleChecklistItem(
        workspaceId,
        taskId,
        checklistItemId,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.all })
    },
  })
}
