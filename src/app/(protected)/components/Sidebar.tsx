"use client";

import { useRouter } from "next/navigation";
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

interface SidebarProps {
  activeWorkspaceName?: string;
  enabledModules: string[];
  availableModules: any[];
}

export default function Sidebar({
  activeWorkspaceName,
  enabledModules,
  availableModules,
}: SidebarProps) {
  const router = useRouter();

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
      settings: `/workspaces/settings`,
      members: `/workspaces/members`,
    };
    router.push(routes[moduleId] || "/");
  };

  return (
    <div className="w-24 bg-gh-card flex flex-col items-center py-6 gap-8 border-r border-gh-border/50">
      {/* Workspace Indicator */}
      <button
        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200 group relative shadow-sm hover:shadow-md"
        onClick={() => router.push("/workspaces")}
        title={activeWorkspaceName || "Workspaces"}
      >
        <span className="text-white text-xs font-bold">
          {activeWorkspaceName?.charAt(0).toUpperCase() || "W"}
        </span>
        <div className="absolute left-28 bg-gh-card text-gh-text text-xs px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gh-border/30 shadow-sm pointer-events-none">
          {activeWorkspaceName || "Workspaces"}
        </div>
      </button>

      <div className="w-10 h-px bg-gh-border/10" />

      {/* Module Icons */}
      <div className="flex flex-col gap-4">
        {enabledModulesData.map((module: any) => {
          const Icon = moduleIcons[module.id] || LucideIcons.Package;
          return (
            <button
              key={module.id}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-200 group relative hover:scale-105 ${
                moduleColors[module.id] || "bg-gray-600"
              } shadow-sm hover:shadow-md`}
              onClick={() => handleModuleClick(module.id)}
              title={module.name}
            >
              {React.createElement(Icon as React.ElementType, {
                className: "w-8 h-8 text-white",
              })}
              <div className="absolute left-28 bg-gh-card text-gh-text text-xs px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gh-border/30 shadow-sm pointer-events-none">
                {module.name}
              </div>
            </button>
          );
        })}
      </div>

      <div className="w-10 h-px bg-gh-border/10 mt-auto" />

      {/* Quick Actions */}
      <button
        className="w-14 h-14 rounded-2xl bg-gh-card flex items-center justify-center cursor-pointer hover:scale-105 hover:bg-red-600 transition-all duration-200 group relative border border-gh-border/20 shadow-sm hover:shadow-md"
        onClick={() => router.push("/profile")}
        title="Perfil"
      >
        <LucideIcons.User className="w-8 h-8 text-gh-text group-hover:text-white transition-colors duration-200" />
        <div className="absolute left-28 bg-gh-card text-gh-text text-xs px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gh-border/30 shadow-sm pointer-events-none">
          Perfil
        </div>
      </button>
    </div>
  );
}
