"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { usePersons } from "@/modules/person/hooks/usePersonQueries";
import { useDeletePerson } from "@/modules/person/hooks/usePersonMutations";
import { EntityType } from "@/modules/person/types/person.types";
import { useAlerts } from "@/contexts/AlertContext";
import { ModuleGuard } from "@/modules/workspace/components/ModuleGuard";
import { Search, Loader2, Edit2, Trash2, Plus } from "lucide-react";

export default function CustomersPage() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const alerts = useAlerts();

  const [searchTerm, setSearchTerm] = useState("");

  const filters = useMemo(() => {
    const f: any = {
      entityType: EntityType.CLIENTE,
    };
    if (searchTerm) f.search = searchTerm;
    return f;
  }, [searchTerm]);

  const { data, isLoading } = usePersons(activeWorkspace?.id || "", filters);
  const deleteMutation = useDeletePerson(activeWorkspace?.id || "");

  const handleDelete = async (personId: string, personName: string) => {
    if (!confirm(`Tem certeza que deseja remover ${personName}?`)) return;

    deleteMutation.mutate(personId, {
      onSuccess: () => {
        alerts.success("Cliente removido com sucesso!");
      },
      onError: (error: any) => {
        alerts.error(
          error.response?.data?.message || "Erro ao remover cliente",
        );
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
    <ModuleGuard moduleId="customers" workspaceId={activeWorkspace?.id}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gh-text mb-1">Clientes</h2>
            <p className="text-sm text-gh-text-secondary">
              Gerenciar todos os seus clientes
            </p>
          </div>
          <button
            onClick={() =>
              router.push(`/workspaces/${activeWorkspace.id}/customers/new`)
            }
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Novo Cliente
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
            className="w-full pl-10 pr-4 py-2 bg-gh-card border border-gh-border rounded-md text-sm text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Contador */}
        {data && (
          <div className="flex items-center justify-between border-b border-gh-border pb-3">
            <p className="text-sm text-gh-text-secondary">
              <span className="font-medium text-gh-text">{data.length}</span>{" "}
              cliente
              {data.length !== 1 ? "s" : ""} encontrado
              {data.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-gh-text-secondary" />
          </div>
        )}

        {/* Lista de Clientes */}
        {!isLoading && data && data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 border border-dashed border-gh-border rounded-md">
            <p className="text-gh-text-secondary mb-4">
              Nenhum cliente encontrado
            </p>
            <button
              onClick={() =>
                router.push(`/workspaces/${activeWorkspace.id}/customers/new`)
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Criar primeiro cliente
            </button>
          </div>
        )}

        {!isLoading && data && data.length > 0 && (
          <div className="overflow-x-auto rounded-md border border-gh-border">
            <table className="w-full">
              <thead className="bg-gh-card border-b border-gh-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gh-text-secondary uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gh-text-secondary uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gh-text-secondary uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gh-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gh-text-secondary uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gh-border">
                {data.map((customer: any) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-gh-card/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gh-text">
                        {customer.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gh-text-secondary">
                      {customer.document || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gh-text-secondary">
                      {customer.email || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Cliente
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() =>
                          router.push(
                            `/workspaces/${activeWorkspace.id}/customers/${customer.id}`,
                          )
                        }
                        className="text-gh-text-secondary hover:text-gh-text mr-4 transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id, customer.name)}
                        disabled={deleteMutation.isPending}
                        className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                        title="Deletar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ModuleGuard>
  );
}
