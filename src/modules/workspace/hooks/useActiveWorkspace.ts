import { useWorkspaceStore } from "../store/workspace.store";

/**
 * Hook para obter workspace ativo
 */
export function useActiveWorkspace() {
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);
  return { activeWorkspace };
}
