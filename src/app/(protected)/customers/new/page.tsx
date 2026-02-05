"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { usePersons } from "@/modules/person/hooks/usePersonQueries";
import { useCreatePerson } from "@/modules/person/hooks/usePersonMutations";
import { useAlerts } from "@/contexts/AlertContext";
import { ArrowLeft } from "lucide-react";

export default function NewCustomerPage() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const alerts = useAlerts();

  const [formData, setFormData] = useState({
    name: "",
    document: "",
    email: "",
    address: "",
  });

  const createPersonMutation = useCreatePerson(activeWorkspace?.id || "");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alerts.error("Nome é obrigatório");
      return;
    }

    createPersonMutation.mutate(
      {
        name: formData.name,
        document: formData.document || null,
        email: formData.email || null,
        address: formData.address || null,
        entityType: "CLIENTE",
      } as any,
      {
        onSuccess: (data: any) => {
          alerts.success("Cliente criado com sucesso!");
          router.push(`/workspaces/${activeWorkspace?.id}/customers`);
        },
        onError: (error: any) => {
          alerts.error(
            error.response?.data?.message || "Erro ao criar cliente",
          );
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gh-card rounded-md transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gh-text" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gh-text">Novo Cliente</h2>
          <p className="text-sm text-gh-text-secondary mt-1">
            Criar um novo cliente no sistema
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gh-card border border-gh-border rounded-lg p-6 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gh-text mb-2">
            Nome *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nome completo do cliente"
            className="w-full px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
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
            placeholder="CPF ou CNPJ"
            className="w-full px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            placeholder="email@example.com"
            className="w-full px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            placeholder="Endereço completo"
            rows={3}
            className="w-full px-4 py-2 bg-gh-bg border border-gh-border rounded-md text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 px-4 py-2 bg-gh-card border border-gh-border rounded-md text-gh-text hover:bg-gh-card/80 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={createPersonMutation.isPending}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {createPersonMutation.isPending ? "Criando..." : "Criar Cliente"}
          </button>
        </div>
      </form>
    </div>
  );
}
