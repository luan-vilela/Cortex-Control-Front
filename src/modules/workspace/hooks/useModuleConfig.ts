import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Zap,
  TrendingUp,
  DollarSign,
  BarChart3,
} from "lucide-react";
import React from "react";

export interface ModuleConfig {
  moduleRoutes: Record<string, string>;
  moduleIcons: Record<string, React.ComponentType<{ className?: string }>>;
}

export function useModuleConfig(workspaceId?: string): ModuleConfig {
  const baseId = workspaceId || ":workspaceId";

  const moduleRoutes: Record<string, string> = {
    contacts: "/contatos",
    finance: "/finance",
    sales: "/sales",
    conversations: "/conversations",
    automations: "/automations",
    reports: "/reports",
    settings: `/workspaces/${baseId}/settings`,
    members: `/workspaces/${baseId}/members`,
  };

  const moduleIcons: Record<
    string,
    React.ComponentType<{ className?: string }>
  > = {
    contacts: Users,
    conversations: MessageSquare,
    automations: Zap,
    sales: TrendingUp,
    finance: DollarSign,
    reports: BarChart3,
  };

  return {
    moduleRoutes,
    moduleIcons,
  };
}
