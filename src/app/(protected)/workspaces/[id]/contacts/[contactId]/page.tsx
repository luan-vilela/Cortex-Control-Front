"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useContact } from "@/modules/contact/hooks";
import {
  ContactForm,
  PhoneForm,
  PhoneList,
  ClientRoleForm,
  SupplierRoleForm,
  PartnerRoleForm,
  RoleList,
} from "@/modules/contact/components";
import { ContactPhone } from "@/modules/contact/types";
import Link from "next/link";
import { useAlerts } from "@/contexts/AlertContext";
import { Info, Phone, Users, ArrowLeft } from "lucide-react";

type TabType = "info" | "phones" | "roles";

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;
  const contactId = params.contactId as string;
  const { addAlert } = useAlerts();
  const [activeTab, setActiveTab] = useState<TabType>("info");
  const [editingPhone, setEditingPhone] = useState<ContactPhone | undefined>();
  const [showPhoneForm, setShowPhoneForm] = useState(false);

  const {
    data: contact,
    isLoading,
    error,
  } = useContact(workspaceId, contactId);

  const handleSuccess = () => {
    addAlert("success", "Informações atualizadas com sucesso!");
  };

  const handleError = (error: Error) => {
    addAlert("error", `Erro ao atualizar: ${error.message}`);
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando contato...</div>;
  }

  if (error || !contact) {
    return (
      <div className="max-w-4xl">
        <Link
          href={`/workspaces/${workspaceId}/contacts`}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700 dark:bg-red-900/20 dark:text-red-300">
          Contato não encontrado
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href={`/workspaces/${workspaceId}/contacts`}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-2"
        >
          <ArrowLeft size={16} />
          Voltar
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {contact.name}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {contact.email} • {contact.document}
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab("info")}
            className={`flex items-center gap-2 px-1 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "info"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            }`}
          >
            <Info size={18} />
            Informações
          </button>
          <button
            onClick={() => setActiveTab("phones")}
            className={`flex items-center gap-2 px-1 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "phones"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            }`}
          >
            <Phone size={18} />
            Telefones
          </button>
          <button
            onClick={() => setActiveTab("roles")}
            className={`flex items-center gap-2 px-1 py-2 font-medium border-b-2 transition-colors ${
              activeTab === "roles"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            }`}
          >
            <Users size={18} />
            Papéis
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Info Tab */}
        {activeTab === "info" && (
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <ContactForm
              workspaceId={workspaceId}
              contact={contact}
              onSuccess={handleSuccess}
              onError={handleError}
            />

            {/* System Info */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                Informações do Sistema
              </h3>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>ID:</span>
                  <code className="text-gray-900 dark:text-white text-xs bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                    {contact.id}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span
                    className={
                      contact.active ? "text-green-600" : "text-red-600"
                    }
                  >
                    {contact.active ? "Ativo" : "Inativo"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Criado em:</span>
                  <span>
                    {new Date(contact.createdAt).toLocaleDateString("pt-BR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Atualizado em:</span>
                  <span>
                    {new Date(contact.updatedAt).toLocaleDateString("pt-BR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Phones Tab */}
        {activeTab === "phones" && (
          <div className="space-y-4">
            {!showPhoneForm ? (
              <button
                onClick={() => setShowPhoneForm(true)}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Phone size={16} />
                Adicionar Telefone
              </button>
            ) : (
              <div>
                <PhoneForm
                  workspaceId={workspaceId}
                  contactId={contactId}
                  phone={editingPhone}
                  onSuccess={() => {
                    setShowPhoneForm(false);
                    setEditingPhone(undefined);
                    addAlert("success", "Telefone atualizado com sucesso!");
                  }}
                  onError={(error) => {
                    addAlert("error", `Erro: ${error.message}`);
                  }}
                />
                <button
                  onClick={() => {
                    setShowPhoneForm(false);
                    setEditingPhone(undefined);
                  }}
                  className="mt-2 text-gray-600 hover:text-gray-900 text-sm"
                >
                  Cancelar
                </button>
              </div>
            )}

            <div className="mt-6">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                Telefones Registrados
              </h3>
              <PhoneList
                workspaceId={workspaceId}
                contactId={contactId}
                phones={contact.phones}
                onEdit={(phone) => {
                  setEditingPhone(phone);
                  setShowPhoneForm(true);
                }}
              />
            </div>
          </div>
        )}

        {/* Roles Tab */}
        {activeTab === "roles" && (
          <div className="space-y-6">
            {/* Cliente */}
            {!contact.clientRole && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Adicionar Papel de Cliente
                </h3>
                <ClientRoleForm
                  workspaceId={workspaceId}
                  contactId={contactId}
                  onSuccess={() =>
                    addAlert("success", "Papel de cliente adicionado!")
                  }
                  onError={(error) =>
                    addAlert("error", `Erro: ${error.message}`)
                  }
                />
              </div>
            )}

            {/* Fornecedor */}
            {!contact.supplierRole && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h3 className="font-semibold text-amber-900 mb-2">
                  Adicionar Papel de Fornecedor
                </h3>
                <SupplierRoleForm
                  workspaceId={workspaceId}
                  contactId={contactId}
                  onSuccess={() =>
                    addAlert("success", "Papel de fornecedor adicionado!")
                  }
                  onError={(error) =>
                    addAlert("error", `Erro: ${error.message}`)
                  }
                />
              </div>
            )}

            {/* Parceiro */}
            {!contact.partnerRole && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-2">
                  Adicionar Papel de Parceiro
                </h3>
                <PartnerRoleForm
                  workspaceId={workspaceId}
                  contactId={contactId}
                  onSuccess={() =>
                    addAlert("success", "Papel de parceiro adicionado!")
                  }
                  onError={(error) =>
                    addAlert("error", `Erro: ${error.message}`)
                  }
                />
              </div>
            )}

            {/* Papéis Existentes */}
            {(contact.clientRole ||
              contact.supplierRole ||
              contact.partnerRole) && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Papéis Ativos
                </h3>
                <RoleList
                  workspaceId={workspaceId}
                  contactId={contactId}
                  contact={contact}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
