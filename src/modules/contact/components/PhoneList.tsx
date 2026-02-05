"use client";

import { ContactPhone, PhoneType } from "../types";
import { useDeletePhone } from "../hooks";
import { Phone, Trash2 } from "lucide-react";

interface PhoneListProps {
  workspaceId: string;
  contactId: string;
  phones: ContactPhone[] | undefined;
  isLoading?: boolean;
  onEdit?: (phone: ContactPhone) => void;
}

export function PhoneList({
  workspaceId,
  contactId,
  phones,
  isLoading,
  onEdit,
}: PhoneListProps) {
  const deleteMutation = useDeletePhone(workspaceId, contactId);

  const handleDelete = async (phoneId: string) => {
    if (confirm("Tem certeza que deseja deletar este telefone?")) {
      try {
        await deleteMutation.mutateAsync(phoneId);
      } catch (error) {
        console.error("Erro ao deletar telefone:", error);
      }
    }
  };

  const getPhoneTypeLabel = (type: PhoneType) => {
    switch (type) {
      case PhoneType.WHATSAPP:
        return "WhatsApp";
      case PhoneType.COMMERCIAL:
        return "Comercial";
      case PhoneType.PERSONAL:
        return "Pessoal";
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-4 text-gray-500">
        Carregando telefones...
      </div>
    );
  }

  if (!phones || phones.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        Nenhum telefone registrado
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {phones.map((phone) => (
        <div
          key={phone.id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <Phone size={16} className="text-blue-600" />
            <div>
              <p className="font-medium text-gray-900">{phone.number}</p>
              <p className="text-sm text-gray-500">
                {getPhoneTypeLabel(phone.type)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit?.(phone)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Editar
            </button>
            <button
              onClick={() => handleDelete(phone.id)}
              disabled={deleteMutation.isPending}
              className="text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
