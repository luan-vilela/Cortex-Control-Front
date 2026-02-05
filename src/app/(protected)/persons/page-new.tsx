"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { useContacts } from "@/modules/contact/hooks";
import { Contact } from "@/modules/contact/types";
import { useDeleteContact } from "@/modules/contact/hooks";
import { useAlerts } from "@/contexts/AlertContext";
import { Search } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

/**
 * Wrapper para manter compatibilidade com a rota /persons
 * Mas usando a nova API Contact internamente
 */
export default function PersonsPageWrapper() {
  const router = useRouter();
  const { addAlert } = useAlerts();
  const { activeWorkspace } = useWorkspaceStore();
  const workspaceId = activeWorkspace?.id || "";

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("");

  const { data, isLoading, error } = useContacts(
    workspaceId,
    filterRole || undefined,
  );
  const deleteMutation = useDeleteContact(workspaceId);

  const filteredContacts = useMemo(() => {
    if (!data?.data) return [];
    if (!searchTerm) return data.data;

    return data.data.filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.document.includes(searchTerm),
    );
  }, [data?.data, searchTerm]);

  const handleDelete = async (contactId: string) => {
    if (
      confirm(
        "Tem certeza que deseja deletar este contato? Esta ação pode ser desfeita.",
      )
    ) {
      try {
        await deleteMutation.mutateAsync(contactId);
        addAlert("success", "Contato deletado com sucesso");
      } catch (error: any) {
        addAlert("error", `Erro ao deletar contato: ${error.message}`);
      }
    }
  };

  const getRoleLabel = (contact: Contact) => {
    const roles = [];
    if (contact.clientRole) roles.push("Cliente");
    if (contact.supplierRole) roles.push("Fornecedor");
    if (contact.partnerRole) roles.push("Parceiro");
    return roles.length > 0 ? roles.join(", ") : "Contato";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Contatos (Pessoas)
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Gerencie todos os seus contatos, clientes e fornecedores
          </p>
        </div>
        {workspaceId && (
          <Link
            href={`/workspaces/${workspaceId}/contacts/new`}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            + Novo
          </Link>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-300">
          Erro ao carregar contatos. Tente novamente.
        </div>
      )}

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="flex gap-2">
          {["", "client", "supplier", "partner"].map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                filterRole === role
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {role === ""
                ? "Todos"
                : role === "client"
                  ? "Clientes"
                  : role === "supplier"
                    ? "Fornecedores"
                    : "Parceiros"}
            </button>
          ))}
        </div>
      </div>

      {/* Contact List */}
      {isLoading ? (
        <div className="text-center py-8">Carregando contatos...</div>
      ) : filteredContacts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhum contato encontrado
        </div>
      ) : (
        <div className="space-y-2">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${
                !contact.active ? "bg-gray-100 dark:bg-gray-900" : ""
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {contact.name}
                  </h3>
                  {!contact.active && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                      Inativo
                    </span>
                  )}
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {getRoleLabel(contact)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {contact.email} • {contact.document}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {workspaceId && (
                  <>
                    <Link
                      href={`/workspaces/${workspaceId}/contacts/${contact.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Ver
                    </Link>
                    <button
                      onClick={() => handleDelete(contact.id)}
                      disabled={deleteMutation.isPending}
                      className="text-red-600 hover:text-red-700 font-medium text-sm disabled:text-gray-400"
                    >
                      {deleteMutation.isPending ? "Deletando..." : "Deletar"}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
