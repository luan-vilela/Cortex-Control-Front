"use client";

import { useParams } from "next/navigation";
import { useContacts } from "@/modules/contact/hooks";
import { ContactList } from "@/modules/contact/components";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

export default function ContactsPage() {
  const params = useParams();
  const workspaceId = params.id as string;
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useContacts(workspaceId);

  const handleContactDeleted = () => {
    queryClient.invalidateQueries({
      queryKey: ["contacts", workspaceId],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Contatos
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Gerencie todos os seus contatos, clientes, fornecedores e parceiros
          </p>
        </div>
        <Link
          href={`/workspaces/${workspaceId}/contacts/new`}
          className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          + Novo Contato
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-300">
          Erro ao carregar contatos. Tente novamente.
        </div>
      )}

      {/* Contact List */}
      <ContactList
        workspaceId={workspaceId}
        contacts={data?.data || []}
        isLoading={isLoading}
        onContactDeleted={handleContactDeleted}
      />
    </div>
  );
}
