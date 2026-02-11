import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  FornecedorData,
  CreateFornecedorDTO,
  UpdateFornecedorDTO,
  FornecedorAnalytics,
} from "../types/fornecedor.types";

export const FORNECEDORES_QUERY_KEY = "fornecedores";

export const useFornecedores = (
  workspaceId: string,
  filters?: Record<string, any>,
) => {
  return useQuery({
    queryKey: [FORNECEDORES_QUERY_KEY, workspaceId, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.tipo) params.append("tipo", filters.tipo);
      if (filters?.status) params.append("status", filters.status);
      if (filters?.search) params.append("search", filters.search);
      if (filters?.avaliacaoMin)
        params.append("avaliacaoMin", filters.avaliacaoMin);

      const { data } = await api.get(
        `/workspaces/${workspaceId}/fornecedores?${params.toString()}`,
      );
      return data as FornecedorData[];
    },
    enabled: !!workspaceId,
  });
};

export const useFornecedor = (workspaceId: string, fornecedorId: string) => {
  return useQuery({
    queryKey: [FORNECEDORES_QUERY_KEY, workspaceId, fornecedorId],
    queryFn: async () => {
      const { data } = await api.get(
        `/workspaces/${workspaceId}/fornecedores/${fornecedorId}`,
      );
      return data as FornecedorData;
    },
    enabled: !!workspaceId && !!fornecedorId,
  });
};

export const useFornecedoresAnalytics = (workspaceId: string) => {
  return useQuery({
    queryKey: [FORNECEDORES_QUERY_KEY, workspaceId, "analytics"],
    queryFn: async () => {
      const { data } = await api.get(
        `/workspaces/${workspaceId}/fornecedores/analytics`,
      );
      return data as FornecedorAnalytics;
    },
    enabled: !!workspaceId,
  });
};

export const useCreateFornecedor = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: CreateFornecedorDTO) => {
      const { data } = await api.post(
        `/workspaces/${workspaceId}/fornecedores`,
        dto,
      );
      return data as FornecedorData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [FORNECEDORES_QUERY_KEY, workspaceId],
      });
    },
  });
};

export const useUpdateFornecedor = (
  workspaceId: string,
  fornecedorId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: UpdateFornecedorDTO) => {
      const { data } = await api.patch(
        `/workspaces/${workspaceId}/fornecedores/${fornecedorId}`,
        dto,
      );
      return data as FornecedorData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [FORNECEDORES_QUERY_KEY, workspaceId],
      });
    },
  });
};

export const useDeactivateFornecedor = (
  workspaceId: string,
  fornecedorId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.patch(
        `/workspaces/${workspaceId}/fornecedores/${fornecedorId}/deactivate`,
      );
      return data as FornecedorData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [FORNECEDORES_QUERY_KEY, workspaceId],
      });
    },
  });
};

export const useActivateFornecedor = (
  workspaceId: string,
  fornecedorId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.patch(
        `/workspaces/${workspaceId}/fornecedores/${fornecedorId}/activate`,
      );
      return data as FornecedorData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [FORNECEDORES_QUERY_KEY, workspaceId],
      });
    },
  });
};

export const useDeleteFornecedor = (
  workspaceId: string,
  fornecedorId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.delete(
        `/workspaces/${workspaceId}/fornecedores/${fornecedorId}`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [FORNECEDORES_QUERY_KEY, workspaceId],
      });
    },
  });
};
