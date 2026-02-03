"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { usePersons } from "@/modules/person/hooks/usePersonQueries";
import { useDeletePerson } from "@/modules/person/hooks/usePersonMutations";
import { PersonCard } from "@/modules/person/components/PersonCard";
import { PersonType } from "@/modules/person/types/person.types";
import { useAlerts } from "@/contexts/AlertContext";
import { WorkspaceSwitcher } from "@/modules/workspace/components/WorkspaceSwitcher";
import { NotificationBell } from "@/components/NotificationBell";
import { WalletDisplay } from "@/components/WalletDisplay";
import { UserMenu } from "@/components/UserMenu";
import { Plus, Search, Filter, Users, Trash2, Edit } from "lucide-react";

const personTypeLabels: Record<PersonType, string> = {
  [PersonType.LEAD]: "Leads",
  [PersonType.CUSTOMER]: "Clientes",
  [PersonType.COMPANY]: "Empresas",
  [PersonType.SUPPLIER]: "Fornecedores",
};

export default function PersonsPage() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const alerts = useAlerts();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<PersonType | "">("");

  const filters = useMemo(() => {
    const f: any = {};
    if (typeFilter) f.type = typeFilter;
    if (searchTerm) f.search = searchTerm;
    return f;
  }, [typeFilter, searchTerm]);

  const { data, isLoading } = usePersons(activeWorkspace?.id || "", filters);

  const deleteMutation = useDeletePerson(activeWorkspace?.id || "");

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
      <div className="min-h-screen bg-gh-bg">
        <header className="bg-gh-card border-b border-gh-border">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gh-text">Cortex Control</h1>
            <div className="flex items-center gap-2">
              <NotificationBell />
              <WalletDisplay />
              <UserMenu />
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-gh-text-secondary">Selecione um workspace</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gh-bg">
      {/* Header */}
      <header className="bg-gh-card border-b border-gh-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gh-text">Cortex Control</h1>
            <WorkspaceSwitcher />
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <WalletDisplay />
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gh-badge-bg rounded-lg">
              <Users className="w-6 h-6 text-gh-hover" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gh-text">Pessoas</h2>
              <p className="text-gh-text-secondary">
                Gerencie leads, clientes, empresas e fornecedores
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push("/persons/new")}
            className="flex items-center gap-2 px-4 py-2 bg-gh-hover text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            Nova Pessoa
          </button>
        </div>

        {/* Filtros */}
        <div className="mb-6 space-y-4">
          {/* Barra de Pesquisa */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gh-text-secondary" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por nome, email ou documento..."
              className="w-full pl-10 pr-4 py-2.5 bg-gh-card border border-gh-border rounded-lg text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:ring-2 focus:ring-gh-hover focus:border-gh-hover"
            />
          </div>

          {/* Filtros */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gh-text-secondary" />
            <span className="text-sm font-medium text-gh-text">Tipo:</span>
            <button
              onClick={() => setTypeFilter("")}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                typeFilter === ""
                  ? "bg-gh-hover text-white"
                  : "bg-gh-card border border-gh-border text-gh-text hover:border-gh-hover"
              }`}
            >
              Todos
            </button>
            {Object.entries(personTypeLabels).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setTypeFilter(value as PersonType)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  typeFilter === value
                    ? "bg-gh-hover text-white"
                    : "bg-gh-card border border-gh-border text-gh-text hover:border-gh-hover"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Contador */}
          {data && (
            <p className="text-sm text-gh-text-secondary">
              {data.total}{" "}
              {data.total === 1 ? "pessoa encontrada" : "pessoas encontradas"}
            </p>
          )}
        </div>

        {/* Lista de pessoas */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gh-hover"></div>
          </div>
        ) : data && data.persons.length > 0 ? (
          <div className="bg-gh-card rounded-lg border border-gh-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gh-border">
                <thead className="bg-gh-bg">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gh-text-secondary uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gh-text-secondary uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gh-text-secondary uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gh-text-secondary uppercase tracking-wider">
                      Telefone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gh-text-secondary uppercase tracking-wider">
                      Cidade/Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gh-text-secondary uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-gh-card divide-y divide-gh-border">
                  {data.persons.map((person) => {
                    const primaryPhone =
                      person.phones?.find((p) => p.isPrimary) ||
                      person.phones?.[0];
                    return (
                      <tr
                        key={person.id}
                        className="hover:bg-gh-bg cursor-pointer transition-colors"
                        onClick={() => router.push(`/persons/${person.id}`)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gh-text">
                              {person.name}
                            </div>
                            {person.document && (
                              <div className="text-sm text-gh-text-secondary">
                                {person.document}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              person.type === PersonType.LEAD
                                ? "bg-yellow-100 text-yellow-800"
                                : person.type === PersonType.CUSTOMER
                                  ? "bg-green-100 text-green-800"
                                  : person.type === PersonType.COMPANY
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {personTypeLabels[person.type]}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gh-text">
                            {person.email || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gh-text">
                            {primaryPhone?.number || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gh-text">
                            {person.city && person.state
                              ? `${person.city}, ${person.state}`
                              : person.city || person.state || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/persons/${person.id}`);
                              }}
                              className="text-gh-hover hover:text-gh-hover/80 p-1 hover:bg-gh-bg rounded transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(person.id, person.name);
                              }}
                              className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                              title="Remover"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-gh-card border border-gh-border rounded-lg p-12 text-center">
            <div className="mb-4">
              <Users className="w-16 h-16 text-gh-text-secondary mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gh-text mb-2">
              Nenhuma pessoa encontrada
            </h3>
            <p className="text-gh-text-secondary mb-4">
              {searchTerm || typeFilter
                ? "Tente ajustar os filtros de pesquisa"
                : "Comece cadastrando sua primeira pessoa"}
            </p>
            <button
              onClick={() => router.push("/persons/new")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gh-hover text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Cadastrar primeira pessoa
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
