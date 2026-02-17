"use client";

import { useWorkspaceStore } from "../store/workspace.store";

/**
 * Hook centralizado para verificar permissões do usuário logado
 * no workspace ativo.
 *
 * @example
 * const { hasPermission, canAccess } = usePermission();
 *
 * // Checar uma ação específica
 * if (hasPermission("contacts", "create")) { ... }
 *
 * // Checar se tem acesso ao módulo (flag "access")
 * if (canAccess("finance")) { ... }
 */
export function usePermission() {
  const workspace = useWorkspaceStore((s) => s.activeWorkspace);
  const permissions = workspace?.permissions;
  const isOwner = workspace?.isOwner ?? false;

  /**
   * Verifica se o usuário tem uma permissão específica.
   * Owner sempre retorna true.
   */
  function hasPermission(moduleId: string, action: string): boolean {
    if (isOwner) return true;
    if (!permissions) return false;

    const modulePerms = permissions[moduleId];
    if (!modulePerms) return false;

    // Se não tem acesso ao módulo, nega tudo
    if (action !== "access" && !modulePerms.access) return false;

    return modulePerms[action] === true;
  }

  /**
   * Atalho: verifica se tem acesso ao módulo (flag "access").
   * Owner sempre retorna true.
   */
  function canAccess(moduleId: string): boolean {
    return hasPermission(moduleId, "access");
  }

  return { hasPermission, canAccess, isOwner, permissions };
}
