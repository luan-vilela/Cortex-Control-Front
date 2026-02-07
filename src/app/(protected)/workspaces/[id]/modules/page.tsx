"use client";

import { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  useWorkspace,
  useEnabledModules,
  useAvailableModules,
  useBreadcrumb,
} from "@/modules/workspace/hooks";
import { workspaceService } from "@/modules/workspace/services/workspace.service";
import { useAlerts } from "@/contexts/AlertContext";
import { NotificationBell } from "@/components/NotificationBell";
import { WalletDisplay } from "@/components/WalletDisplay";
import { UserMenu } from "@/components/UserMenu";
import * as LucideIcons from "lucide-react";
import React from "react";
import {
  ArrowLeft,
  Search,
  Filter,
  Zap,
  MessageSquare,
  Wrench,
  Info,
  ArrowUpRight,
} from "lucide-react";

type CategoryType =
  | "all"
  | "core"
  | "communication"
  | "automation"
  | "integration";

export default function ModulesMarketplacePage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.id as string;
  const alerts = useAlerts();

  useBreadcrumb([
    {
      label: "Workspaces",
      href: `/workspaces/`,
    },
    {
      label: "Gerenciar Módulos",
      href: `/workspaces/${workspaceId}/modules`,
    },
  ]);

  const { data: workspace } = useWorkspace(workspaceId);
  const { data: enabledModules = [], refetch } = useEnabledModules(workspaceId);
  const {
    data: availableModules = [],
    isLoading: modulesLoading,
    refetch: refetchAvailableModules,
  } = useAvailableModules();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all");
  const [installing, setInstalling] = useState<string | null>(null);

  const canManage = workspace?.isOwner || workspace?.role === "admin";

  // Filtrar módulos por busca e categoria
  const filteredModules = useMemo(() => {
    let result = availableModules;

    // Filtro por categoria
    if (selectedCategory !== "all") {
      result = result.filter((m: any) => m.category === selectedCategory);
    }

    // Filtro por busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (m: any) =>
          m.name.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query) ||
          m.id.toLowerCase().includes(query),
      );
    }

    return result;
  }, [searchQuery, selectedCategory, availableModules]);

  const handleToggleModule = async (moduleId: string, isEnabled: boolean) => {
    if (!canManage) {
      alerts.error("Você não tem permissão para gerenciar módulos");
      return;
    }

    const selectedModule = availableModules.find((m: any) => m.id === moduleId);
    const required = selectedModule?.required;
    if (required && isEnabled) {
      alerts.error(`${moduleId} é um módulo obrigatório`);
      return;
    }

    setInstalling(moduleId);
    try {
      const newModules = isEnabled
        ? enabledModules.filter((m) => m !== moduleId)
        : [...enabledModules, moduleId];

      await workspaceService.updateEnabledModules(workspaceId, newModules);
      await refetch();
      await refetchAvailableModules();
      alerts.success(
        `Módulo ${isEnabled ? "desinstalado" : "instalado"} com sucesso`,
      );
    } catch (error: any) {
      console.error("Erro ao atualizar módulos:", error);
      alerts.error(error.response?.data?.message || "Erro ao atualizar módulo");
    } finally {
      setInstalling(null);
    }
  };

  const ModuleCard = ({ module }: { module: any }) => {
    const isEnabled = enabledModules.includes(module.id);
    const required = module.required;
    const IconComponent =
      LucideIcons[module.icon as keyof typeof LucideIcons] ||
      LucideIcons.Package;
    const isLoading = installing === module.id;

    return (
      <div className="bg-white border border-gh-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full">
        {/* Cabeçalho com ícone e categoria */}
        <div
          className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 flex items-start justify-between group cursor-pointer hover:from-blue-100 hover:to-blue-200 transition-colors"
          onClick={() =>
            router.push(`/workspaces/${workspaceId}/modules/${module.id}`)
          }
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white rounded-lg text-blue-600">
              {React.createElement(IconComponent as React.ElementType, {
                className: "w-6 h-6",
              })}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{module.name}</h3>
              <span className="inline-block text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded mt-1 capitalize">
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

          <div className="flex items-center gap-2">
            {isEnabled && (
              <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                <div className="w-2 h-2 bg-green-600 rounded-full" />
                Instalado
              </div>
            )}
            <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col p-4 justify-between h-full">
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            {module.description}
          </p>

          {/* Dependências */}
          {module.dependencies && module.dependencies.length > 0 && (
            <div className="mb-4 pb-4 border-b border-gray-200">
              <p className="text-xs font-medium text-gray-600 mb-2">
                Dependências:
              </p>
              <div className="flex flex-wrap gap-2">
                {module.dependencies.map((depId: string) => {
                  const depModule = availableModules.find(
                    (m: any) => m.id === depId,
                  );
                  const DepIconComponent =
                    LucideIcons[depModule?.icon as keyof typeof LucideIcons] ||
                    LucideIcons.Package;
                  return (
                    <div
                      key={depId}
                      className="relative group cursor-help"
                      title={depModule?.name}
                    >
                      <div className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors">
                        {React.createElement(
                          DepIconComponent as React.ElementType,
                          {
                            className: "w-4 h-4",
                          },
                        )}
                      </div>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {depModule?.name || depId}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sem dependências */}
          {module.dependencies && module.dependencies.length === 0 && (
            <div className="mb-4 pb-4 border-b border-gray-200">
              <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded">
                Sem dependências
              </span>
            </div>
          )}

          {/* Badges de features */}
          <div className="mb-4 flex flex-wrap gap-2">
            {required && (
              <span className="text-xs font-medium px-2 py-1 bg-red-50 text-red-600 rounded">
                Obrigatório
              </span>
            )}
            {isEnabled && (
              <span className="text-xs font-medium px-2 py-1 bg-green-50 text-green-600 rounded">
                Ativo
              </span>
            )}
          </div>

          {/* Botão de ação */}
          <button
            onClick={() => handleToggleModule(module.id, isEnabled)}
            disabled={!canManage || isLoading || required}
            className={`w-full py-2 px-3 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 ${
              required
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : isEnabled
                  ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                  : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {required ? "Obrigatório" : isEnabled ? "Desinstalar" : "Instalar"}
          </button>
        </div>
      </div>
    );
  };

  const categoryOptions: {
    value: CategoryType;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { value: "all", label: "Todos", icon: null },
    {
      value: "core",
      label: "Principais",
      icon: <Wrench className="w-4 h-4" />,
    },
    {
      value: "communication",
      label: "Comunicação",
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      value: "automation",
      label: "Automação",
      icon: <Zap className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gh-bg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Marketplace de Módulos
            </h2>
            <p className="text-gray-600 mt-1">
              Gerencie os módulos disponíveis para o seu workspace
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto py-8">
          {!canManage && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                Você não tem permissão para instalar/desinstalar módulos. Apenas
                owner ou admin podem gerenciar módulos.
              </p>
            </div>
          )}

          {/* Barra de Pesquisa */}
          <div className="mb-8">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Pesquise módulos pelo nome ou descrição..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gh-border rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            {/* Filtros por Categoria */}
            <div className="flex gap-2 flex-wrap">
              {categoryOptions.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
                    selectedCategory === cat.value
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gh-border text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Informações de Resultado */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              {filteredModules.length === 0
                ? "Nenhum módulo encontrado com esses filtros"
                : `${filteredModules.length} módulo${filteredModules.length !== 1 ? "s" : ""} disponível${filteredModules.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {/* Grid de Módulos */}
          {modulesLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gh-hover"></div>
            </div>
          ) : filteredModules.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredModules.map((module: any) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum módulo encontrado
              </h3>
              <p className="text-gray-600 mb-6">
                Tente ajustar seus filtros ou termos de busca
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          )}

          {/* Info Footer */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              💡 Dica: Módulos Obrigatórios
            </h3>
            <p className="text-sm text-gray-600">
              Alguns módulos são obrigatórios e não podem ser desinstalados.
              Eles fazem parte da funcionalidade essencial do seu workspace.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
