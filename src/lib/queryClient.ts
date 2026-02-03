import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minuto - dados considerados "frescos"
      gcTime: 5 * 60 * 1000, // 5 minutos - tempo antes de garbage collection
      retry: 1, // Tenta 1 vez em caso de erro
      refetchOnWindowFocus: false, // Não refetch ao focar na janela
    },
    mutations: {
      retry: 0, // Não retry em mutations
    },
  },
});
