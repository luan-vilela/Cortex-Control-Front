// Query keys para workspaces
export const workspaceKeys = {
  all: ["workspaces"] as const,
  lists: () => [...workspaceKeys.all, "list"] as const,
  list: (filters?: any) => [...workspaceKeys.lists(), filters] as const,
  details: () => [...workspaceKeys.all, "detail"] as const,
  detail: (id: string) => [...workspaceKeys.details(), id] as const,
  members: (id: string) => [...workspaceKeys.detail(id), "members"] as const,
  invites: () => [...workspaceKeys.all, "invites"] as const,
};
