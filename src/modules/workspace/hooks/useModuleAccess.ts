import { useEnabledModules } from "./useWorkspaceQueries";
import { useWorkspaceStore } from "../store/workspace.store";

/**
 * Hook para verificar se um módulo está habilitado no workspace ativo
 */
export function useModuleAccess(moduleId: string) {
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);
  const { data: enabledModules = [] } = useEnabledModules(
    activeWorkspace?.id || "",
  );

  const isModuleEnabled = enabledModules.some((m: any) => m.id === moduleId);

  return {
    isModuleEnabled,
    moduleId,
    workspaceId: activeWorkspace?.id,
  };
}

/**
 * Função utilitária para verificar se pode acessar um módulo
 */
export function canAccessModule(
  enabledModules: any[],
  moduleId: string,
): boolean {
  return enabledModules.some((m: any) => m.id === moduleId);
}
