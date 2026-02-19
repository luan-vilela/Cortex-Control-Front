import type { ModulePermissions, WorkspacePermissions } from "../config/permissions.config";

export type { ModulePermissions, WorkspacePermissions };

export interface EnabledModule {
  id: string;
  name: string;
  category: "core" | "communication" | "automation" | "integration";
  domain: string; // Rota do módulo (ex: /contacts, /conversations)
  favorite: boolean;
}

export interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "core" | "communication" | "automation" | "integration";
  required?: boolean;
  dependencies?: string[];
}

export enum WorkspaceStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
  ARCHIVED = "ARCHIVED",
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  status: WorkspaceStatus;
  role: string;
  isOwner: boolean;
  permissions: WorkspacePermissions;
  joinedAt: string;
  memberCount?: number;
}

export interface WorkspaceMember {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  role: string;
  isOwner: boolean;
  permissions: WorkspacePermissions;
  joinedAt: string;
}

export interface WorkspaceInvite {
  id: string;
  token: string;
  workspace: {
    id: string;
    name: string;
  };
  role: string;
  permissions: WorkspacePermissions;
  invitedBy: {
    id: string;
    name: string;
    email: string;
  };
  expiresAt: string;
}

export interface CreateWorkspaceDto {
  name: string;
  description?: string;
}

export interface InviteMemberDto {
  email: string;
  role: string;
  permissions: WorkspacePermissions;
}

export interface UpdatePermissionsDto {
  role?: string;
  permissions: WorkspacePermissions;
}

export interface UpdateWorkspaceDto {
  name?: string;
  description?: string;
  settings?: any;
}
