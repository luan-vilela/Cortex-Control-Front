"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { usePersons } from "@/modules/person/hooks/usePersonQueries";
import { useDeletePerson } from "@/modules/person/hooks/usePersonMutations";
import { EntityType } from "@/modules/person/types/person.types";
import { useAlerts } from "@/contexts/AlertContext";
import { ModuleGuard } from "@/modules/workspace/components/ModuleGuard";
import { Search, Loader2 } from "lucide-react";

const entityTypeLabels: Record<EntityType, string> = {
  [EntityType.PERSON]: "Contato",
  [EntityType.LEAD]: "Lead",
  [EntityType.CLIENTE]: "Cliente",
  [EntityType.FORNECEDOR]: "Fornecedor",
  [EntityType.PARCEIRO]: "Parceiro",
};

// Função helper para detectar o tipo de entidade
function getEntityTypeName(person: any): string {
  if ("status" in person && "source" in person && "score" in person) {
    return entityTypeLabels[EntityType.LEAD];
  }
  if ("categoria" in person && "clienteStatus" in person) {
    return entityTypeLabels[EntityType.CLIENTE];
  }
  if ("fornecedorStatus" in person && "prazoPagamento" in person) {
    return entityTypeLabels[EntityType.FORNECEDOR];
  }
  if ("parceiroStatus" in person && "comissaoPercentual" in person) {
    return entityTypeLabels[EntityType.PARCEIRO];
  }
  return entityTypeLabels[EntityType.PERSON];
}

export default function PersonsPage() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const alerts = useAlerts();

  const [searchTerm, setSearchTerm] = useState("");
  const [entityTypeFilter, setEntityTypeFilter] = useState<EntityType | "">("");
  const [totalPersons, setTotalPersons] = useState(0);

  const filters = useMemo(() => {
    const f: any = {};
    if (entityTypeFilter) f.entityType = entityTypeFilter;
    if (searchTerm) f.search = searchTerm;
    return f;
  }, [entityTypeFilter, searchTerm]);

  const { data, isLoading } = usePersons(activeWorkspace?.id || "", filters);

  const deleteMutation = useDeletePerson(activeWorkspace?.id || "");

  // Atualizar total quando os dados mudarem
  React.useEffect(() => {
    if (data && !searchTerm && !entityTypeFilter) {
      setTotalPersons(data.length);
    }
  }, [data, searchTerm, entityTypeFilter]);

  const handleDelete = async (personId: string, personName: string) => {
    if (!confirm(`Tem certeza que deseja remover ${personName}?`)) return;

    deleteMutation.mutate(personId, {
      onSuccess: () => {
        alerts.success("Pessoa removida com sucesso!");
      },
      onError: (error: any) => {
        alerts.error(error.response?.data?.message || "Erro ao remover pessoa");
      },
    });
  };

  if (!activeWorkspace) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gh-text-secondary">Selecione um workspace</p>
      </div>
    );
  }

  return (
    <ModuleGuard moduleId="contacts" workspaceId={activeWorkspace?.id}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gh-text mb-1">Contatos</h2>
            <p className="text-sm text-gh-text-secondary">
              Gerenciar pessoas, clientes, fornecedores e parceiros
            </p>
          </div>
          <button
            onClick={() => router.push(`/contatos/new`)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <span>+</span> Novo Contato
          </button>
        </div>

        {/* Barra de Pesquisa */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gh-text-secondary" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por nome, email ou documento..."
            className="w-full pl-10 pr-4 py-2 bg-gh-card border border-gh-border rounded-md text-sm text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:ring-2 focus:ring-gh-hover focus:border-gh-hover"
          />
        </div>

        {/* Filtros por Tipo */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-gh-text-secondary">
            Filtrar por tipo:
          </span>
          <button
            onClick={() => setEntityTypeFilter("")}
            className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
              entityTypeFilter === ""
                ? "bg-gh-hover text-white"
                : "bg-gh-card border border-gh-border text-gh-text-secondary hover:border-gh-hover hover:text-gh-text"
            }`}
          >
            Todos
          </button>
          {Object.entries(entityTypeLabels).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setEntityTypeFilter(value as EntityType)}
              className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
                entityTypeFilter === value
                  ? "bg-gh-hover text-white"
                  : "bg-gh-card border border-gh-border text-gh-text-secondary hover:border-gh-hover hover:text-gh-text"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Contador */}
        {data && (
          <div className="flex items-center justify-between border-b border-gh-border pb-3">
            <div className="flex gap-6">
              <p className="text-sm text-gh-text-secondary">
                <span className="font-medium text-gh-text">{data.length}</span>{" "}
                resultado{data.length !== 1 ? "s" : ""} encontrado
                {data.length !== 1 ? "s" : ""}
              </p>
              <p className="text-sm text-gh-text-secondary">
                Total:{" "}
                <span className="font-medium text-gh-text">{totalPersons}</span>
              </p>
            </div>
          </div>
        )}

        {/* Lista de Contatos */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-gh-text-secondary" />
          </div>
        ) : data && data.length > 0 ? (
          <div className="bg-gh-card border border-gh-border rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-gh-border bg-gh-bg">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gh-text-secondary uppercase">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gh-text-secondary uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gh-text-secondary uppercase">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gh-text-secondary uppercase">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gh-text-secondary uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gh-border">
                {data.map((person) => (
                  <tr
                    key={person.id}
                    className="hover:bg-gh-hover transition-colors"
                    onClick={() => router.push(`/contatos/${person.id}`)}
                  >
                    <td className="px-6 py-3">{person.name}</td>
                    <td className="px-6 py-3 text-sm text-gh-text-secondary">
                      {person.email || "-"}
                    </td>
                    <td className="px-6 py-3">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gh-badge-bg text-gh-text">
                        {getEntityTypeName(person)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gh-text-secondary">
                      {person.document || "-"}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/contatos/${person.id}`)}
                          className="text-gh-accent hover:text-gh-accent-dark transition-colors text-xs font-medium"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => handleDelete(person.id, person.name)}
                          className="text-red-500 hover:text-red-700 transition-colors text-xs font-medium"
                        >
                          Remover
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gh-badge-bg rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gh-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-gh-text mb-2">
              Nenhum contato encontrado
            </h3>
            <p className="text-sm text-gh-text-secondary mb-6 max-w-md">
              {searchTerm
                ? "Tente ajustar os termos de pesquisa ou limpar os filtros."
                : "Comece criando seu primeiro contato."}
            </p>
          </div>
        )}
      </div>
    </ModuleGuard>
  );
}
