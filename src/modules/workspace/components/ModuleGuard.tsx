"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useEnabledModules } from "../hooks";
import { AlertCircle } from "lucide-react";

interface ModuleGuardProps {
  children: ReactNode;
  moduleId: string;
  fallback?: ReactNode;
  workspaceId?: string;
}

/**
 * Componente que protege conteúdo baseado na habilitação do módulo
 * Se o módulo não estiver habilitado, mostra um aviso e opcionalmente redireciona
 */
export function ModuleGuard({
  children,
  moduleId,
  fallback,
  workspaceId,
}: ModuleGuardProps) {
  const router = useRouter();
  const { data: enabledModules = [], isLoading } = useEnabledModules(
    workspaceId || "",
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gh-hover"></div>
      </div>
    );
  }

  const isEnabled = enabledModules.some((m: any) => m.id === moduleId);

  if (!isEnabled) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="min-h-screen bg-gh-bg flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-yellow-100 p-3">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Módulo Desativado
          </h1>
          <p className="text-gray-600 mb-6">
            O módulo solicitado está desativado neste workspace. Entre em
            contato com o administrador para ativá-lo.
          </p>
          <button
            onClick={() => router.push("/workspaces")}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voltar aos Workspaces
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
