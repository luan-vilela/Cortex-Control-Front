import { useMutation, useQueryClient } from "@tanstack/react-query";
import { personService } from "../services/person.service";
import { personKeys } from "./queryKeys";
import { CreatePersonDto, UpdatePersonDto } from "../types/person.types";

/**
 * Hook para criar pessoa
 */
export function useCreatePerson(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePersonDto) =>
      personService.createPerson(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: personKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: personKeys.stats(workspaceId),
      });
    },
  });
}

/**
 * Hook para atualizar pessoa
 */
export function useUpdatePerson(workspaceId: string, personId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePersonDto) =>
      personService.updatePerson(workspaceId, personId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: personKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: personKeys.detail(workspaceId, personId),
      });
      queryClient.invalidateQueries({
        queryKey: personKeys.stats(workspaceId),
      });
    },
  });
}

/**
 * Hook para remover pessoa (soft delete)
 */
export function useDeletePerson(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (personId: string) =>
      personService.deletePerson(workspaceId, personId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: personKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: personKeys.stats(workspaceId),
      });
    },
  });
}

/**
 * Hook para remover pessoa permanentemente (hard delete)
 */
export function useHardDeletePerson(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (personId: string) =>
      personService.hardDeletePerson(workspaceId, personId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: personKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: personKeys.stats(workspaceId),
      });
    },
  });
}

/**
 * Hook para reativar pessoa
 */
export function useRestorePerson(workspaceId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (personId: string) =>
      personService.restorePerson(workspaceId, personId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: personKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: personKeys.stats(workspaceId),
      });
    },
  });
}
