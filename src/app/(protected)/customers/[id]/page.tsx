"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { usePerson } from "@/modules/person/hooks/usePersonQueries";
import {
  useUpdatePerson,
  useDeletePerson,
} from "@/modules/person/hooks/usePersonMutations";
import { useAlerts } from "@/contexts/AlertContext";
import { ArrowLeft, Trash2, Edit2, Check, X } from "lucide-react";
import { useState } from "react";

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const alerts = useAlerts();
  const customerId = params.id as string;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    document: "",
    email: "",
    address: "",
  });

  const { data: customer, isLoading } = usePerson(
    activeWorkspace?.id || "",
    customerId,
  );
  const updateMutation = useUpdatePerson(activeWorkspace?.id || "", customerId);
  const deleteMutation = useDeletePerson(activeWorkspace?.id || "");

  React.useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        document: customer.document || "",
        email: customer.email || "",
        address: customer.address || "",
      });
    }
  }, [customer]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    updateMutation.mutate(
      {
        name: formData.name,
        document: formData.document || undefined,
        email: formData.email || undefined,
        address: formData.address || undefined,
      } as any,
      {
        onSuccess: () => {
          alerts.success("Cliente atualizado com sucesso!");
          setIsEditing(false);
        },
        onError: (error: any) => {
          alerts.error(
            error.response?.data?.message || "Erro ao atualizar cliente",
          );
        },
      },
    );
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja remover este cliente?")) return;

    deleteMutation.mutate(customerId, {
      onSuccess: () => {
        alerts.success("Cliente removido com sucesso!");
        router.push(`/workspaces/${activeWorkspace?.id}/customers`);
      },
      onError: (error: any) => {
        alerts.error(
          error.response?.data?.message || "Erro ao remover cliente",
        );
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gh-text-secondary">Carregando...</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <p className="text-gh-text-secondary">Cliente não encontrado</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gh-card border border-gh-border rounded-md text-gh-text hover:bg-gh-card/80 transition-colors"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gh-card rounded-md transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gh-text" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gh-text">{customer.name}</h2>
            <p className="text-sm text-gh-text-secondary mt-1">
              Cliente • ID: {customer.id}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: customer.name || "",
                    document: customer.document || "",
                    email: customer.email || "",
                    address: customer.address || "",
                  });
                }}
                className="p-2 hover:bg-gh-card rounded-md transition-colors text-gh-text-secondary"
                title="Cancelar"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="p-2 hover:bg-gh-card rounded-md transition-colors text-green-500 disabled:opacity-50"
                title="Salvar"
              >
                <Check className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-gh-card rounded-md transition-colors text-gh-text-secondary"
                title="Editar"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="p-2 hover:bg-gh-card rounded-md transition-colors text-red-500 disabled:opacity-50"
                title="Deletar"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="bg-gh-card border border-gh-border rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gh-text mb-2">
            Nome
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gh-text mb-2">
            Documento
          </label>
          <input
            type="text"
            name="document"
            value={formData.document}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gh-text mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="w-full px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gh-text mb-2">
            Endereço
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            disabled={!isEditing}
            rows={3}
            className="w-full px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Metadata */}
        <div className="pt-4 border-t border-gh-border grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gh-text-secondary">Criado em</p>
            <p className="text-sm text-gh-text">
              {new Date(customer.createdAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <div>
            <p className="text-xs text-gh-text-secondary">Atualizado em</p>
            <p className="text-sm text-gh-text">
              {new Date(customer.updatedAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
