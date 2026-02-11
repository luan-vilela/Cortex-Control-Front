"use client";

import { Contact, ClientRole, SupplierRole, PartnerRole } from "../types";
import {
  useRemoveClientRole,
  useRemoveSupplierRole,
  useRemovePartnerRole,
} from "../hooks";
import { Users, Truck, Handshake, Trash2, Badge } from "lucide-react";

interface RoleListProps {
  workspaceId: string;
  contactId: string;
  contact: Contact | undefined;
}

export function RoleList({ workspaceId, contactId, contact }: RoleListProps) {
  const removeClientMutation = useRemoveClientRole(workspaceId, contactId);
  const removeSupplierMutation = useRemoveSupplierRole(workspaceId, contactId);
  const removePartnerMutation = useRemovePartnerRole(workspaceId, contactId);

  const handleRemoveClientRole = async () => {
    if (confirm("Tem certeza que deseja remover o papel de cliente?")) {
      try {
        await removeClientMutation.mutateAsync();
      } catch (error) {
        console.error("Erro ao remover papel:", error);
      }
    }
  };

  const handleRemoveSupplierRole = async () => {
    if (confirm("Tem certeza que deseja remover o papel de fornecedor?")) {
      try {
        await removeSupplierMutation.mutateAsync();
      } catch (error) {
        console.error("Erro ao remover papel:", error);
      }
    }
  };

  const handleRemovePartnerRole = async () => {
    if (confirm("Tem certeza que deseja remover o papel de parceiro?")) {
      try {
        await removePartnerMutation.mutateAsync();
      } catch (error) {
        console.error("Erro ao remover papel:", error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "PROSPECT":
        return "bg-yellow-100 text-yellow-800";
      case "BLOCKED":
      case "INACTIVE":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleStatusLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "Ativo";
      case "PROSPECT":
        return "Prospecto";
      case "BLOCKED":
        return "Bloqueado";
      case "INACTIVE":
        return "Inativo";
      default:
        return status;
    }
  };

  if (!contact?.clientRole && !contact?.supplierRole && !contact?.partnerRole) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum papel atribuído a este contato
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {contact?.clientRole && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Users size={20} className="text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-blue-900 flex items-center gap-2">
                  Cliente
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(contact.clientRole.status)}`}
                  >
                    {getRoleStatusLabel(contact.clientRole.status)}
                  </span>
                </h4>
                {contact.clientRole.creditLimit && (
                  <p className="text-sm text-blue-700 mt-1">
                    Limite de Crédito: R${" "}
                    {contact.clientRole.creditLimit.toFixed(2)}
                  </p>
                )}
                {contact.clientRole.description && (
                  <p className="text-sm text-blue-700 mt-1">
                    {contact.clientRole.description}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleRemoveClientRole}
              disabled={removeClientMutation.isPending}
              className="text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      )}

      {contact?.supplierRole && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Truck size={20} className="text-amber-600 mt-1" />
              <div>
                <h4 className="font-semibold text-amber-900 flex items-center gap-2">
                  Fornecedor
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(contact.supplierRole.status)}`}
                  >
                    {getRoleStatusLabel(contact.supplierRole.status)}
                  </span>
                </h4>
                {contact.supplierRole.paymentTerms && (
                  <p className="text-sm text-amber-700 mt-1">
                    Prazo: {contact.supplierRole.paymentTerms}
                  </p>
                )}
                {contact.supplierRole.description && (
                  <p className="text-sm text-amber-700 mt-1\">
                    {contact.supplierRole.description}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleRemoveSupplierRole}
              disabled={removeSupplierMutation.isPending}
              className="text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      )}

      {contact?.partnerRole && (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Handshake size={20} className="text-purple-600 mt-1" />
              <div>
                <h4 className="font-semibold text-purple-900 flex items-center gap-2">
                  Parceiro
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(contact.partnerRole.status)}`}
                  >
                    {getRoleStatusLabel(contact.partnerRole.status)}
                  </span>
                </h4>
                {contact.partnerRole.commissionPercentage && (
                  <p className="text-sm text-purple-700 mt-1">
                    Comissão: {contact.partnerRole.commissionPercentage}%
                  </p>
                )}
                {contact.partnerRole.description && (
                  <p className="text-sm text-purple-700 mt-1\">
                    {contact.partnerRole.description}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleRemovePartnerRole}
              disabled={removePartnerMutation.isPending}
              className="text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
