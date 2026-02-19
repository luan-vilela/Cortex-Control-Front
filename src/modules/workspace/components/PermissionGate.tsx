"use client";

import type { ReactNode } from "react";
import { usePermission } from "../hooks/usePermission";

interface PermissionGateProps {
  /** ID do módulo (ex: "contacts", "finance") */
  module: string;
  /** Ação requerida (ex: "create", "delete"). Se omitida, verifica "access" */
  action?: string;
  /** Conteúdo exibido quando o usuário tem permissão */
  children: ReactNode;
  /** Conteúdo alternativo quando não tem permissão (opcional) */
  fallback?: ReactNode;
}

/**
 * Wrapper que renderiza children somente se o usuário tem a permissão.
 *
 * @example
 * <PermissionGate module="contacts" action="create">
 *   <Button>Novo Contato</Button>
 * </PermissionGate>
 *
 * <PermissionGate module="finance" action="delete" fallback={<span>Sem permissão</span>}>
 *   <Button variant="destructive">Excluir</Button>
 * </PermissionGate>
 */
export function PermissionGate({
  module,
  action = "access",
  children,
  fallback = null,
}: PermissionGateProps) {
  const { hasPermission } = usePermission();

  if (!hasPermission(module, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
