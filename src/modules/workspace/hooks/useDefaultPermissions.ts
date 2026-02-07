import { useMutation, useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { queryKeys } from "./queryKeys";
import type { WorkspacePermissions } from "../types/workspace.types";

export interface DefaultPermissionsResponse {
  permissions: Array<{
    id: string;
    workspaceId: string;
    role: string;
    permissions: WorkspacePermissions;
    createdAt: string;
    updatedAt: string;
  }>;
}

export const useDefaultMemberPermissions = (workspaceId: string) => {
  return useQuery({
    queryKey: [queryKeys.DEFAULT_PERMISSIONS, workspaceId],
    queryFn: async () => {
      const response = await api.get(
        `/workspaces/${workspaceId}/default-permissions`,
      );
      return response.data.permissions;
    },
    enabled: !!workspaceId,
  });
};

export const useSetDefaultMemberPermissions = (workspaceId: string) => {
  return useMutation({
    mutationFn: async (data: {
      role: string;
      permissions: WorkspacePermissions;
    }) => {
      const response = await api.post(
        `/workspaces/${workspaceId}/default-permissions`,
        data,
      );
      return response.data;
    },
  });
};
