"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { useCreatePerson } from "@/modules/person/hooks/usePersonMutations";
import { PhoneInput } from "@/modules/person/components/PhoneInput";
import {
  CreatePersonDto,
  PersonType,
} from "@/modules/person/types/person.types";
import { useAlerts } from "@/contexts/AlertContext";

const personTypeLabels: Record<PersonType, string> = {
  [PersonType.LEAD]: "Lead",
  [PersonType.CUSTOMER]: "Cliente",
  [PersonType.COMPANY]: "Empresa",
  [PersonType.SUPPLIER]: "Fornecedor",
};

export default function NewPersonPage() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const alerts = useAlerts();

  const [formData, setFormData] = useState<CreatePersonDto>({
    name: "",
    email: "",
    document: "",
    type: PersonType.LEAD,
    address: "",
    city: "",
    state: "",
    zipCode: "",
    notes: "",
    phones: [],
  });

  const createMutation = useCreatePerson(activeWorkspace?.id || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alerts.warning("O nome é obrigatório");
      return;
    }

    // Remover campos vazios
    const cleanData: CreatePersonDto = {
      name: formData.name,
      type: formData.type,
    };

    if (formData.email?.trim()) cleanData.email = formData.email;
    if (formData.document?.trim()) cleanData.document = formData.document;
    if (formData.address?.trim()) cleanData.address = formData.address;
    if (formData.city?.trim()) cleanData.city = formData.city;
    if (formData.state?.trim()) cleanData.state = formData.state;
    if (formData.zipCode?.trim()) cleanData.zipCode = formData.zipCode;
    if (formData.notes?.trim()) cleanData.notes = formData.notes;
    if (formData.phones && formData.phones.length > 0) {
      cleanData.phones = formData.phones.filter((p) => p.number.trim());
    }

    createMutation.mutate(cleanData, {
      onSuccess: () => {
        alerts.success("Pessoa criada com sucesso!");
        router.push("/persons");
      },
      onError: (error: any) => {
        alerts.error(error.response?.data?.message || "Erro ao criar pessoa");
      },
    });
  };

  if (!activeWorkspace) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Selecione um workspace</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:text-blue-800 mb-2"
        >
          ← Voltar
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Nova Pessoa</h1>
        <p className="text-gray-600">Cadastre uma nova pessoa no sistema</p>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Informações Básicas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: João da Silva"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as PersonType,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(personTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Documento (CPF/CNPJ)
              </label>
              <input
                type="text"
                value={formData.document}
                onChange={(e) =>
                  setFormData({ ...formData, document: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="000.000.000-00"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="email@exemplo.com"
              />
            </div>
          </div>
        </div>

        {/* Telefones */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Telefones
          </h2>
          <PhoneInput
            phones={formData.phones || []}
            onChange={(phones) => setFormData({ ...formData, phones })}
          />
        </div>

        {/* Endereço */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Endereço completo
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Rua, número, complemento"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="São Paulo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado (UF)
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  maxLength={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="SP"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CEP
                </label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) =>
                    setFormData({ ...formData, zipCode: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="00000-000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Observações */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Observações
          </h2>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Notas, comentários ou informações adicionais..."
          />
        </div>

        {/* Botões */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </div>
  );
}
