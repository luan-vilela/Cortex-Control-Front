"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import {
  useWorkspaces,
  useEnabledModules,
  useAvailableModules,
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
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { activeWorkspace } = useWorkspaceStore();
  const { data: enabledModules = [] } = useEnabledModules(
    activeWorkspace?.id || "",
  );
  const { data: availableModules = [] } = useAvailableModules();

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
    settings: Settings,
    members: Users2,
  };

  const moduleColors: Record<string, string> = {
    contacts: "hover:bg-blue-600",
    conversations: "hover:bg-purple-600",
    automations: "hover:bg-yellow-600",
    sales: "hover:bg-green-600",
    settings: "hover:bg-gray-600",
    members: "hover:bg-pink-600",
  };

  const handleModuleClick = (moduleId: string) => {
    const routes: Record<string, string> = {
      contacts: "/persons",
      conversations: "/conversations",
      automations: "/automations",
      sales: "/sales",
      settings: `/workspaces/${activeWorkspace?.id}/settings`,
      members: `/workspaces/${activeWorkspace?.id}/members`,
    };
    router.push(routes[moduleId] || "/");
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
                        moduleColors[module.id]?.replace("hover:", "") ||
                        "from-gray-600 to-gray-700"
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
