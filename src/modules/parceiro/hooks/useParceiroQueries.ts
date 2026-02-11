import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  ParceiroData,
  CreateParceiroDTO,
  UpdateParceiroDTO,
  PagarComissaoDTO,
  ParceiroAnalytics,
} from "../types/parceiro.types";

export const PARCEIROS_QUERY_KEY = "parceiros";

export const useParceiros = (
  workspaceId: string,
  filters?: Record<string, any>,
) => {
  return useQuery({
    queryKey: [PARCEIROS_QUERY_KEY, workspaceId, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.tipo) params.append("tipo", filters.tipo);
      if (filters?.status) params.append("status", filters.status);
      if (filters?.search) params.append("search", filters.search);

      const { data } = await api.get(
        `/workspaces/${workspaceId}/parceiros?${params.toString()}`,
      );
      return data as ParceiroData[];
    },
    enabled: !!workspaceId,
  });
};

export const useParceiro = (workspaceId: string, parceiroId: string) => {
  return useQuery({
    queryKey: [PARCEIROS_QUERY_KEY, workspaceId, parceiroId],
    queryFn: async () => {
      const { data } = await api.get(
        `/workspaces/${workspaceId}/parceiros/${parceiroId}`,
      );
      return data as ParceiroData;
    },
    enabled: !!workspaceId && !!parceiroId,
  });
};

export const useParceiroAnalytics = (workspaceId: string) => {
  return useQuery({
    queryKey: [PARCEIROS_QUERY_KEY, workspaceId, "analytics"],
    queryFn: async () => {
      const { data } = await api.get(
        `/workspaces/${workspaceId}/parceiros/analytics`,
      );
      return data as ParceiroAnalytics;
    },
    enabled: !!workspaceId,
  });
};

export const useCreateParceiro = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: CreateParceiroDTO) => {
      const { data } = await api.post(
        `/workspaces/${workspaceId}/parceiros`,
        dto,
      );
      return data as ParceiroData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PARCEIROS_QUERY_KEY, workspaceId],
      });
    },
  });
};

export const useUpdateParceiro = (workspaceId: string, parceiroId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: UpdateParceiroDTO) => {
      const { data } = await api.patch(
        `/workspaces/${workspaceId}/parceiros/${parceiroId}`,
        dto,
      );
      return data as ParceiroData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PARCEIROS_QUERY_KEY, workspaceId],
      });
    },
  });
};

export const useDeactivateParceiro = (
  workspaceId: string,
  parceiroId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.patch(
        `/workspaces/${workspaceId}/parceiros/${parceiroId}/deactivate`,
      );
      return data as ParceiroData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PARCEIROS_QUERY_KEY, workspaceId],
      });
    },
  });
};

export const useActivateParceiro = (
  workspaceId: string,
  parceiroId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.patch(
        `/workspaces/${workspaceId}/parceiros/${parceiroId}/activate`,
      );
      return data as ParceiroData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PARCEIROS_QUERY_KEY, workspaceId],
      });
    },
  });
};

export const useDeleteParceiro = (workspaceId: string, parceiroId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.delete(`/workspaces/${workspaceId}/parceiros/${parceiroId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PARCEIROS_QUERY_KEY, workspaceId],
      });
    },
  });
};

export const usePagarComissao = (workspaceId: string, parceiroId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: PagarComissaoDTO) => {
      const { data } = await api.patch(
        `/workspaces/${workspaceId}/parceiros/${parceiroId}/pagar-comissao`,
        dto,
      );
      return data as ParceiroData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PARCEIROS_QUERY_KEY, workspaceId],
      });
    },
  });
};
