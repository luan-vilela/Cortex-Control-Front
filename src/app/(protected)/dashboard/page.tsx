"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import {
  useWorkspaces,
  useEnabledModules,
  useAvailableModules,
  useModuleConfig,
} from "@/modules/workspace/hooks";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import * as LucideIcons from "lucide-react";
import React from "react";
import {
  Users,
  MessageSquare,
  Zap,
  TrendingUp,
  Settings,
  Users2,
  DollarSign,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { activeWorkspace } = useWorkspaceStore();
  const { data: enabledModules = [] } = useEnabledModules(
    activeWorkspace?.id || "",
  );
  const { data: availableModules = [] } = useAvailableModules();
  const { moduleRoutes } = useModuleConfig();

  // Pré-carregar workspaces
  useWorkspaces();

  const enabledModulesData = availableModules.filter((m: any) =>
    enabledModules.includes(m.id),
  );

  const moduleIcons: Record<string, typeof Users> = {
    contacts: Users,
    conversations: MessageSquare,
    automations: Zap,
    sales: TrendingUp,
    finance: DollarSign,
    settings: Settings,
    members: Users2,
  };

  const moduleColors: Record<string, string> = {
    contacts: "from-blue-500 to-blue-600",
    conversations: "from-purple-500 to-purple-600",
    automations: "from-yellow-500 to-yellow-600",
    sales: "from-green-500 to-green-600",
    finance: "from-emerald-500 to-emerald-600",
    settings: "from-gray-500 to-gray-600",
    members: "from-pink-500 to-pink-600",
  };

  const handleModuleClick = (moduleId: string) => {
    const route = moduleRoutes[moduleId] || "/";
    router.push(route);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Bar */}
      <div className="h-16 bg-gh-bg border-b border-gh-border/20 flex items-center justify-between px-8">
        <h1 className="text-2xl font-light text-gh-text tracking-tight">
          Bem-vindo,{" "}
          <span className="font-medium">{user?.name || "Usuário"}</span>
        </h1>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto px-12 py-10">
        <div className="max-w-5xl">
          {/* Modules Grid */}
          <div className="mb-16">
            <h2 className="text-lg font-light text-gh-text mb-8 tracking-tight">
              Módulos Disponíveis
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {enabledModulesData.map((module: any) => {
                const Icon = moduleIcons[module.id] || LucideIcons.Package;
                return (
                  <button
                    key={module.id}
                    onClick={() => handleModuleClick(module.id)}
                    className="group flex flex-col items-center text-center hover:opacity-75 transition-opacity duration-300"
                  >
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-4 transition-all group-hover:scale-110 ${
                        moduleColors[module.id] || "from-gray-600 to-gray-700"
                      }`}
                    >
                      {React.createElement(Icon as React.ElementType, {
                        className: "w-8 h-8 text-white",
                      })}
                    </div>
                    <h3 className="text-gh-text font-semibold text-sm">
                      {module.name}
                    </h3>
                    <p className="text-gh-text-secondary text-xs mt-2 line-clamp-2 leading-relaxed">
                      {module.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mb-16">
            <h2 className="text-lg font-light text-gh-text mb-10 tracking-tight">
              Estatísticas Rápidas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-gh-text-secondary text-xs uppercase tracking-widest mb-3">
                  Workspace Ativo
                </div>
                <div className="text-3xl font-light text-gh-text leading-tight">
                  {activeWorkspace?.name || "—"}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gh-text-secondary text-xs uppercase tracking-widest mb-3">
                  Módulos Ativos
                </div>
                <div className="text-3xl font-light text-gh-text">
                  {enabledModules.length}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gh-text-secondary text-xs uppercase tracking-widest mb-3">
                  Seu Papel
                </div>
                <div className="text-3xl font-light text-gh-text capitalize">
                  {activeWorkspace?.role || "—"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
