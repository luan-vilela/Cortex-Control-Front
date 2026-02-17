/**
 * ─── CONFIGURAÇÃO CENTRALIZADA DE PERMISSÕES (FRONTEND) ────
 *
 * Espelho do backend: cortex-control/src/modules/workspace/config/permissions.config.ts
 * Define TODAS as ações possíveis por módulo com labels em PT-BR para UI.
 */

// ─── TIPOS ──────────────────────────────────────────────────

export interface PermissionAction {
  key: string;
  label: string;
  description: string;
  category: "access" | "crud" | "feature";
}

export interface ModulePermissionConfig {
  moduleId: string;
  label: string;
  actions: PermissionAction[];
}

/** Permissões de um módulo = mapa de ação → boolean */
export type ModulePermissions = Record<string, boolean>;

/** Permissões completas = mapa de módulo → mapa de ações */
export type WorkspacePermissions = Record<string, ModulePermissions>;

// ─── DEFINIÇÃO DAS AÇÕES POR MÓDULO ─────────────────────────

export const MODULE_PERMISSIONS: ModulePermissionConfig[] = [
  {
    moduleId: "processos",
    label: "Processos",
    actions: [
      { key: "access", label: "Acesso ao Módulo", description: "Permite ver o módulo no menu", category: "access" },
      { key: "view", label: "Visualizar", description: "Ver lista e detalhes de processos", category: "crud" },
      { key: "create", label: "Criar", description: "Criar novos processos", category: "crud" },
      { key: "update", label: "Editar", description: "Editar processos existentes", category: "crud" },
      { key: "delete", label: "Excluir", description: "Excluir processos", category: "crud" },
      { key: "print", label: "Imprimir", description: "Imprimir / exportar processos", category: "feature" },
      { key: "reports", label: "Relatórios", description: "Visualizar relatórios e métricas de processos", category: "feature" },
      { key: "manage_actors", label: "Gerenciar Envolvidos", description: "Adicionar/remover atores nos processos", category: "feature" },
      { key: "manage_finance", label: "Gerenciar Financeiro", description: "Criar lançamentos financeiros e faturar", category: "feature" },
    ],
  },
  {
    moduleId: "finance",
    label: "Financeiro",
    actions: [
      { key: "access", label: "Acesso ao Módulo", description: "Permite ver o módulo no menu", category: "access" },
      { key: "view", label: "Visualizar", description: "Ver transações e detalhes", category: "crud" },
      { key: "create", label: "Criar", description: "Criar novas transações", category: "crud" },
      { key: "update", label: "Editar", description: "Editar transações existentes", category: "crud" },
      { key: "delete", label: "Excluir", description: "Excluir transações", category: "crud" },
      { key: "reports", label: "Relatórios", description: "Visualizar relatórios e resumos financeiros", category: "feature" },
      { key: "approve", label: "Aprovar", description: "Aprovar/rejeitar transações pendentes", category: "feature" },
    ],
  },
  {
    moduleId: "contacts",
    label: "Contatos",
    actions: [
      { key: "access", label: "Acesso ao Módulo", description: "Permite ver o módulo no menu", category: "access" },
      { key: "view", label: "Visualizar", description: "Ver lista e detalhes de contatos", category: "crud" },
      { key: "create", label: "Criar", description: "Criar novos contatos", category: "crud" },
      { key: "update", label: "Editar", description: "Editar contatos existentes", category: "crud" },
      { key: "delete", label: "Excluir", description: "Excluir contatos", category: "crud" },
      { key: "manage_roles", label: "Gerenciar Papéis", description: "Adicionar/remover papéis (Cliente, Fornecedor, Parceiro, Lead)", category: "feature" },
      { key: "view_stats", label: "Estatísticas", description: "Visualizar estatísticas e métricas de contatos", category: "feature" },
    ],
  },
  {
    moduleId: "conversations",
    label: "Conversas",
    actions: [
      { key: "access", label: "Acesso ao Módulo", description: "Permite ver o módulo no menu", category: "access" },
      { key: "view", label: "Visualizar", description: "Ver conversas", category: "crud" },
      { key: "create", label: "Criar", description: "Iniciar novas conversas", category: "crud" },
      { key: "update", label: "Editar", description: "Editar mensagens", category: "crud" },
      { key: "delete", label: "Excluir", description: "Excluir conversas", category: "crud" },
    ],
  },
  {
    moduleId: "automations",
    label: "Automações",
    actions: [
      { key: "access", label: "Acesso ao Módulo", description: "Permite ver o módulo no menu", category: "access" },
      { key: "view", label: "Visualizar", description: "Ver automações configuradas", category: "crud" },
      { key: "create", label: "Criar", description: "Criar novas automações", category: "crud" },
      { key: "update", label: "Editar", description: "Editar automações", category: "crud" },
      { key: "delete", label: "Excluir", description: "Excluir automações", category: "crud" },
    ],
  },
  {
    moduleId: "sales",
    label: "Vendas",
    actions: [
      { key: "access", label: "Acesso ao Módulo", description: "Permite ver o módulo no menu", category: "access" },
      { key: "view", label: "Visualizar", description: "Ver pipeline e oportunidades", category: "crud" },
      { key: "create", label: "Criar", description: "Criar oportunidades de venda", category: "crud" },
      { key: "update", label: "Editar", description: "Editar oportunidades", category: "crud" },
      { key: "delete", label: "Excluir", description: "Excluir oportunidades", category: "crud" },
      { key: "reports", label: "Relatórios", description: "Visualizar relatórios de vendas", category: "feature" },
    ],
  },
  {
    moduleId: "members",
    label: "Membros",
    actions: [
      { key: "access", label: "Acesso ao Módulo", description: "Permite ver o módulo no menu", category: "access" },
      { key: "view", label: "Visualizar", description: "Ver lista de membros e convites", category: "crud" },
      { key: "invite", label: "Convidar", description: "Enviar convites para novos membros", category: "feature" },
      { key: "update_permissions", label: "Gerenciar Permissões", description: "Alterar permissões e papéis de membros", category: "feature" },
      { key: "remove", label: "Remover", description: "Remover membros do workspace", category: "feature" },
    ],
  },
  {
    moduleId: "auditoria",
    label: "Auditoria",
    actions: [
      { key: "access", label: "Acesso ao Módulo", description: "Permite ver o módulo no menu", category: "access" },
      { key: "view_logs", label: "Ver Logs", description: "Consultar logs de auditoria e histórico", category: "feature" },
      { key: "view_stats", label: "Estatísticas", description: "Ver estatísticas de auditoria", category: "feature" },
    ],
  },
  {
    moduleId: "settings",
    label: "Configurações",
    actions: [
      { key: "access", label: "Acesso ao Módulo", description: "Permite ver o módulo no menu", category: "access" },
      { key: "view", label: "Visualizar", description: "Ver configurações do workspace", category: "crud" },
      { key: "update", label: "Editar", description: "Alterar configurações do workspace", category: "crud" },
      { key: "manage_modules", label: "Gerenciar Módulos", description: "Habilitar/desabilitar módulos do workspace", category: "feature" },
    ],
  },
];

// ─── HELPERS ────────────────────────────────────────────────

export function getModulePermissionConfig(moduleId: string): ModulePermissionConfig | undefined {
  return MODULE_PERMISSIONS.find((m) => m.moduleId === moduleId);
}

export function getValidActions(moduleId: string): string[] {
  const config = getModulePermissionConfig(moduleId);
  return config ? config.actions.map((a) => a.key) : [];
}

export function getAllModuleIds(): string[] {
  return MODULE_PERMISSIONS.map((m) => m.moduleId);
}

// ─── PRESETS ────────────────────────────────────────────────

export function generateOwnerPermissions(): WorkspacePermissions {
  const permissions: WorkspacePermissions = {};
  for (const mod of MODULE_PERMISSIONS) {
    permissions[mod.moduleId] = {};
    for (const action of mod.actions) {
      permissions[mod.moduleId][action.key] = true;
    }
  }
  return permissions;
}

export function generateMemberPermissions(): WorkspacePermissions {
  const permissions: WorkspacePermissions = {};
  for (const mod of MODULE_PERMISSIONS) {
    permissions[mod.moduleId] = {};
    for (const action of mod.actions) {
      switch (mod.moduleId) {
        case "processos":
          permissions[mod.moduleId][action.key] = ["access", "view", "create", "update"].includes(action.key);
          break;
        case "finance":
          permissions[mod.moduleId][action.key] = ["access", "view"].includes(action.key);
          break;
        case "contacts":
          permissions[mod.moduleId][action.key] = ["access", "view", "create", "update"].includes(action.key);
          break;
        case "conversations":
          permissions[mod.moduleId][action.key] = ["access", "view", "create", "update"].includes(action.key);
          break;
        case "automations":
          permissions[mod.moduleId][action.key] = ["access", "view"].includes(action.key);
          break;
        case "sales":
          permissions[mod.moduleId][action.key] = ["access", "view", "create", "update"].includes(action.key);
          break;
        case "members":
          permissions[mod.moduleId][action.key] = ["access", "view"].includes(action.key);
          break;
        case "auditoria":
          permissions[mod.moduleId][action.key] = false;
          break;
        case "settings":
          permissions[mod.moduleId][action.key] = ["access", "view"].includes(action.key);
          break;
        default:
          permissions[mod.moduleId][action.key] = false;
      }
    }
  }
  return permissions;
}

export function getPermissionPreset(role: string): WorkspacePermissions {
  switch (role) {
    case "owner":
    case "admin":
      return generateOwnerPermissions();
    case "member":
    default:
      return generateMemberPermissions();
  }
}
