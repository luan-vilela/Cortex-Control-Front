import { useMemo, useCallback } from "react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  HelpCircle,
  FileText,
  BarChart3,
  Briefcase,
  Bell,
  Package,
  FileCheck,
  GitBranch,
  ClipboardList,
  PieChart,
  Cog,
} from "lucide-react";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useEnabledModules, useModuleConfig } from "@/modules/workspace/hooks";
import { useNotificationModal } from "@/modules/workspace/store/notification-modal.store";
import { type SidebarData } from "../types";

/**
 * Hook que gera dados dinâmicos do sidebar baseado no workspace ativo e módulos instalados
 * Reflete os dados do workspace selecionado assim como a Navbar e SecondaryHeader fazem
 */
export function useSidebarData(): SidebarData {
  const { activeWorkspace, _hasHydrated, invites, fetchInvites } =
    useWorkspaceStore();
  const { user } = useAuthStore();
  const { setIsOpen } = useNotificationModal();

  // Carregar módulos instalados (mesmo que Navbar)
  // Só faz requisição se houver workspace ativo
  const { data: enabledModules = [] } = useEnabledModules(
    activeWorkspace?.id || "",
  );
  const { moduleIcons } = useModuleConfig(activeWorkspace?.id || "");

  // Carregar notificações ao iniciar o hook
  useMemo(() => {
    fetchInvites();
  }, [fetchInvites]);

  const handleOpenInvites = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  return useMemo(() => {
    if (!_hasHydrated || !activeWorkspace) {
      return getDefaultSidebarData();
    }

    return buildDynamicSidebarData(
      activeWorkspace,
      user,
      enabledModules,
      moduleIcons,
      invites,
      handleOpenInvites,
    );
  }, [
    activeWorkspace,
    _hasHydrated,
    user,
    enabledModules,
    moduleIcons,
    invites,
    handleOpenInvites,
  ]);
}

/**
 * Retorna dados padrão enquanto carrega o workspace
 */
function getDefaultSidebarData(): SidebarData {
  return {
    user: {
      name: "Carregando...",
      email: "",
      avatar: "/avatars/default.jpg",
    },
    teams: [],
    navGroups: [],
  };
}

/**
 * Constrói os dados do sidebar dinamicamente baseado no workspace ativo
 * Filtra módulos instalados e exibe apenas os que estão habilitados E permitidos
 */
function buildDynamicSidebarData(
  activeWorkspace: any,
  user: any,
  enabledModules: any[],
  moduleIcons: Record<string, any>,
  invites: any[] = [],
  onOpenInvites: () => void = () => {},
): SidebarData {
  const permissions = activeWorkspace.permissions || {};
  const isOwner = activeWorkspace.isOwner === true;

  /** Checa se um módulo tem acesso permitido */
  const canAccessModule = (moduleId: string): boolean => {
    if (isOwner) return true;
    return permissions[moduleId]?.access === true;
  };

  // Base items que sempre aparecem
  const baseItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
  ];

  // Converter módulos habilitados em itens de menu (filtrando por permissão)
  // enabledModules agora já vem com {id, name, category, domain, favorite}
  const moduleItems = enabledModules
    .filter((module: any) => canAccessModule(module.id))
    .map((module: any) => {
    const icon = moduleIcons[module.id] || Package;

    // Processos tem sub-menu com Gerenciar, Relatórios e Configurações
    if (module.id === "processos") {
      return {
        title: module.name,
        icon: GitBranch,
        items: [
          {
            title: "Processos",
            url: "/processos",
            icon: ClipboardList,
          },
          {
            title: "Relatórios",
            url: "/processos/relatorios",
            icon: PieChart,
          },
          {
            title: "Configurações",
            url: "/processos/configuracoes",
            icon: Cog,
          },
        ],
      };
    }

    return {
      title: module.name,
      url: module.domain,
      icon: icon,
    };
  });

  return {
    user: {
      name: user?.name || "Usuário",
      email: user?.email || "user@cortex.local",
      avatar: user?.avatar || "/avatars/default.jpg",
    },
    teams: [
      {
        name: activeWorkspace.name || "Cortex Control",
        logo: Briefcase,
        plan: "Cortex Control",
      },
    ],
    navGroups: [
      {
        title: "Principal",
        items: baseItems,
      },
      ...(moduleItems.length > 0
        ? [
            {
              title: "Apps",
              items: moduleItems,
            },
          ]
        : []),
      {
        title: "Ferramentas",
        items: [
          {
            title: "Notificações",
            url: "/notifications",
            icon: Bell,
            badge:
              invites.length > 0
                ? invites.length > 9
                  ? "9+"
                  : String(invites.length)
                : undefined,
          },
          ...(invites.length > 0
            ? [
                {
                  title: "Convites Pendentes",
                  url: "#",
                  icon: FileCheck,
                  onClick: onOpenInvites,
                  badge: String(invites.length),
                },
              ]
            : []),
        ],
      },
      {
        title: "Administração",
        items: [
          ...(canAccessModule("settings")
            ? [
                {
                  title: "Configurações",
                  url: "/settings",
                  icon: Settings,
                },
              ]
            : []),
          {
            title: "Ajuda",
            url: "/help",
            icon: HelpCircle,
          },
        ],
      },
    ],
  };
}
