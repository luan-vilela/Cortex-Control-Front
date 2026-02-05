"use client";

import { useParams, useRouter } from "next/navigation";
import { useAvailableModules, useWorkspace } from "@/modules/workspace/hooks";
import * as LucideIcons from "lucide-react";
import React from "react";
import { ArrowLeft } from "lucide-react";

export default function ModuleDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.id as string;
  const moduleId = params.moduleId as string;

  const { data: workspace } = useWorkspace(workspaceId);
  const { data: availableModules = [], isLoading: modulesLoading } =
    useAvailableModules();

  const module = availableModules.find((m: any) => m.id === moduleId);
  const IconComponent =
    LucideIcons[module?.icon as keyof typeof LucideIcons] ||
    LucideIcons.Package;

  if (modulesLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gh-hover"></div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Módulo não encontrado
        </h3>
        <p className="text-gray-600 mb-6">
          O módulo que você está procurando não existe.
        </p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gh-bg">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-6 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-8 rounded-lg flex items-start gap-6">
            <div className="p-4 bg-white rounded-lg text-blue-600">
              {React.createElement(IconComponent as React.ElementType, {
                className: "w-10 h-10",
              })}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {module.name}
              </h1>
              <p className="text-gray-600 mb-4">{module.description}</p>
              <span className="inline-block text-xs font-medium text-blue-600 bg-blue-200 px-3 py-1 rounded capitalize">
                {module.category === "communication"
                  ? "Comunicação"
                  : module.category === "automation"
                    ? "Automação"
                    : module.category === "core"
                      ? "Principal"
                      : "Integração"}
              </span>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2">
            {/* Sobre */}
            <div className="bg-white p-6 rounded-lg border border-gh-border mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Sobre o módulo
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {module.description}
              </p>
              <p className="text-gray-600 leading-relaxed">
                Este módulo faz parte da categoria{" "}
                <span className="font-medium text-gray-900">
                  {module.category === "communication"
                    ? "Comunicação"
                    : module.category === "automation"
                      ? "Automação"
                      : module.category === "core"
                        ? "Principal"
                        : "Integração"}
                </span>{" "}
                e é essencial para gerenciar{" "}
                <span className="font-medium text-gray-900">
                  {module.name.toLowerCase()}
                </span>{" "}
                no seu workspace.
              </p>
            </div>

            {/* Funcionalidades */}
            <div className="bg-white p-6 rounded-lg border border-gh-border mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Funcionalidades
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Gestão completa</p>
                    <p className="text-sm text-gray-600">
                      Acesso total às funcionalidades do módulo
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Controle de permissões
                    </p>
                    <p className="text-sm text-gray-600">
                      Defina quem tem acesso a cada funcionalidade
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Integração perfeita
                    </p>
                    <p className="text-sm text-gray-600">
                      Funciona perfeitamente com outros módulos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Lateral */}
          <div>
            {/* Informações */}
            <div className="bg-white p-6 rounded-lg border border-gh-border sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Informações
              </h3>

              {/* Status */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-xs font-medium text-gray-500 mb-2">TIPO</p>
                <span
                  className={`inline-block text-xs font-medium px-3 py-1 rounded ${
                    module.required
                      ? "bg-red-50 text-red-600"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {module.required ? "Obrigatório" : "Opcional"}
                </span>
              </div>

              {/* Dependências */}
              {module.dependencies && module.dependencies.length > 0 && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-xs font-medium text-gray-500 mb-3">
                    DEPENDÊNCIAS
                  </p>
                  <div className="space-y-2">
                    {module.dependencies.map((depId: string) => {
                      const depModule = availableModules.find(
                        (m: any) => m.id === depId,
                      );
                      const DepIconComponent =
                        LucideIcons[
                          depModule?.icon as keyof typeof LucideIcons
                        ] || LucideIcons.Package;
                      return (
                        <div
                          key={depId}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                        >
                          <div className="text-gray-600">
                            {React.createElement(
                              DepIconComponent as React.ElementType,
                              {
                                className: "w-4 h-4",
                              },
                            )}
                          </div>
                          <span className="text-sm text-gray-900 font-medium">
                            {depModule?.name || depId}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sem dependências */}
              {module.dependencies && module.dependencies.length === 0 && (
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    DEPENDÊNCIAS
                  </p>
                  <p className="text-sm text-gray-600">
                    Este módulo não tem dependências de outros módulos
                  </p>
                </div>
              )}

              {/* Preço */}
              <div className="mb-6">
                <p className="text-xs font-medium text-gray-500 mb-2">
                  CUSTO MENSAL
                </p>
                <p className="text-2xl font-bold text-gray-900">Sob demanda</p>
                <p className="text-xs text-gray-600 mt-1">
                  O valor depende da sua assinatura
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
