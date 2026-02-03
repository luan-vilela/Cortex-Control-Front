import { useQuery } from "@tanstack/react-query";
import { personService } from "../services/person.service";
import { personKeys } from "./queryKeys";
import { PersonFilters } from "../types/person.types";

/**
 * Hook para listar pessoas do workspace
 */
export function usePersons(workspaceId: string, filters?: PersonFilters) {
  return useQuery({
    queryKey: personKeys.list(workspaceId, filters),
    queryFn: () => personService.getPersons(workspaceId, filters),
    enabled: !!workspaceId,
  });
}

/**
 * Hook para buscar pessoa por ID
 */
export function usePerson(workspaceId: string, personId: string) {
  return useQuery({
    queryKey: personKeys.detail(workspaceId, personId),
    queryFn: () => personService.getPerson(workspaceId, personId),
    enabled: !!workspaceId && !!personId,
  });
}

/**
 * Hook para obter estatísticas de pessoas
 */
export function usePersonStats(workspaceId: string) {
  return useQuery({
    queryKey: personKeys.stats(workspaceId),
    queryFn: () => personService.getStats(workspaceId),
    enabled: !!workspaceId,
  });
}
