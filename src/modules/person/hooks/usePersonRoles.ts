import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

/**
 * Hook para verificar quais papéis (roles) uma pessoa tem
 * Retorna array com os papéis: ['Cliente', 'Fornecedor', 'Parceiro']
 */
export function usePersonRoles(workspaceId: string, personId: string) {
  return useQuery({
    queryKey: ["person-roles", workspaceId, personId],
    queryFn: async () => {
      try {
        const papeisList: string[] = [];

        // Fazer 3 chamadas paralelas para verificar os papéis
        const [clientesRes, fornecedoresRes, parceirosRes] = await Promise.all([
          api
            .get(`/workspaces/${workspaceId}/clientes?personId=${personId}`)
            .catch(() => ({ data: [] })),
          api
            .get(`/workspaces/${workspaceId}/fornecedores?personId=${personId}`)
            .catch(() => ({ data: [] })),
          api
            .get(`/workspaces/${workspaceId}/parceiros?personId=${personId}`)
            .catch(() => ({ data: [] })),
        ]);

        // Verificar se pessoa é cliente
        if (Array.isArray(clientesRes.data) && clientesRes.data.length > 0) {
          papeisList.push("Cliente");
        } else if (clientesRes.data && typeof clientesRes.data === "object") {
          // Se for um objeto único (não array), significa que foi encontrado
          papeisList.push("Cliente");
        }

        // Verificar se pessoa é fornecedor
        if (
          Array.isArray(fornecedoresRes.data) &&
          fornecedoresRes.data.length > 0
        ) {
          papeisList.push("Fornecedor");
        } else if (
          fornecedoresRes.data &&
          typeof fornecedoresRes.data === "object" &&
          !Array.isArray(fornecedoresRes.data)
        ) {
          papeisList.push("Fornecedor");
        }

        // Verificar se pessoa é parceiro
        if (Array.isArray(parceirosRes.data) && parceirosRes.data.length > 0) {
          papeisList.push("Parceiro");
        } else if (
          parceirosRes.data &&
          typeof parceirosRes.data === "object" &&
          !Array.isArray(parceirosRes.data)
        ) {
          papeisList.push("Parceiro");
        }

        return papeisList;
      } catch (error) {
        console.error("Erro ao buscar papéis da pessoa:", error);
        return [];
      }
    },
    enabled: !!workspaceId && !!personId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
