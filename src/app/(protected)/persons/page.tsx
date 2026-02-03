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
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Cortex Control</h1>
            <div className="flex items-center gap-2">
              <NotificationBell />
              <WalletDisplay />
              <UserMenu />
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-gray-600">Selecione um workspace</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Cortex Control</h1>
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Pessoas</h2>
              <p className="text-gray-600">
                Gerencie leads, clientes, empresas e fornecedores
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push("/persons/new")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Pessoa
          </button>
        </div>

        {/* Filtros */}
        <div className="mb-6 space-y-4">
          {/* Barra de Pesquisa */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por nome, email ou documento..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filtros */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Tipo:</span>
            <button
              onClick={() => setTypeFilter("")}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                typeFilter === ""
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Contador */}
          {data && (
            <p className="text-sm text-gray-600">
              {data.total}{" "}
              {data.total === 1 ? "pessoa encontrada" : "pessoas encontradas"}
            </p>
          )}
        </div>

        {/* Lista de pessoas */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : data && data.persons.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telefone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cidade/Estado
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.persons.map((person) => {
                    const primaryPhone =
                      person.phones?.find((p) => p.isPrimary) ||
                      person.phones?.[0];
                    return (
                      <tr
                        key={person.id}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => router.push(`/persons/${person.id}`)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {person.name}
                            </div>
                            {person.document && (
                              <div className="text-sm text-gray-500">
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
                          <div className="text-sm text-gray-900">
                            {person.email || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {primaryPhone?.number || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
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
                              className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(person.id, person.name);
                              }}
                              className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
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
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="mb-4">
              <Users className="w-16 h-16 text-gray-400 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma pessoa encontrada
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || typeFilter
                ? "Tente ajustar os filtros de pesquisa"
                : "Comece cadastrando sua primeira pessoa"}
            </p>
            <button
              onClick={() => router.push("/persons/new")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
