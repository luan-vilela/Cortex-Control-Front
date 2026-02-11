"use client";

import Link from "next/link";
import { Contact } from "../types";
import { useDeleteContact, useRestoreContact } from "../hooks";
import { useState } from "react";

interface ContactListProps {
  workspaceId: string;
  contacts: Contact[];
  isLoading?: boolean;
  onContactDeleted?: () => void;
}

export function ContactList({
  workspaceId,
  contacts,
  isLoading,
  onContactDeleted,
}: ContactListProps) {
  const deleteMutation = useDeleteContact(workspaceId);
  const restoreMutation = useRestoreContact(workspaceId);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDelete = async (contactId: string) => {
    if (confirm("Tem certeza que deseja deletar este contato?")) {
      try {
        await deleteMutation.mutateAsync(contactId);
        onContactDeleted?.();
      } catch (error) {
        console.error("Erro ao deletar contato:", error);
      }
    }
  };

  const handleRestore = async (contactId: string) => {
    try {
      await restoreMutation.mutateAsync(contactId);
      onContactDeleted?.();
    } catch (error) {
      console.error("Erro ao restaurar contato:", error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando contatos...</div>;
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum contato encontrado
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {contacts.map((contact) => (
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
              {contact.clientRole && (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  Cliente
                </span>
              )}
              {contact.supplierRole && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  Fornecedor
                </span>
              )}
              {contact.partnerRole && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                  Parceiro
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {contact.email} • {contact.document}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/workspaces/${workspaceId}/contacts/${contact.id}`}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Ver
            </Link>

            {!contact.active ? (
              <button
                onClick={() => handleRestore(contact.id)}
                disabled={restoreMutation.isPending}
                className="text-green-600 hover:text-green-700 font-medium text-sm disabled:text-gray-400"
              >
                {restoreMutation.isPending ? "Restaurando..." : "Restaurar"}
              </button>
            ) : (
              <button
                onClick={() => handleDelete(contact.id)}
                disabled={deleteMutation.isPending}
                className="text-red-600 hover:text-red-700 font-medium text-sm disabled:text-gray-400"
              >
                {deleteMutation.isPending ? "Deletando..." : "Deletar"}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
