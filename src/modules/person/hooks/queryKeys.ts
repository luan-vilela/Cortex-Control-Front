export const personKeys = {
  all: ["persons"] as const,
  lists: () => [...personKeys.all, "list"] as const,
  list: (workspaceId: string, filters?: any) =>
    [...personKeys.lists(), workspaceId, filters] as const,
  details: () => [...personKeys.all, "detail"] as const,
  detail: (workspaceId: string, personId: string) =>
    [...personKeys.details(), workspaceId, personId] as const,
  stats: (workspaceId: string) =>
    [...personKeys.all, "stats", workspaceId] as const,
};
