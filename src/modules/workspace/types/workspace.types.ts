export interface ModulePermissions {
  read: boolean;
  write: boolean;
  delete: boolean;
}

export interface WorkspacePermissions {
  contacts: ModulePermissions;
  conversations: ModulePermissions;
  automations: ModulePermissions;
  settings: ModulePermissions;
  members: ModulePermissions;
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
  name: string;
  email: string;
  avatar?: string;
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
  settings?: any;
}
