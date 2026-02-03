"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { usePerson } from "@/modules/person/hooks/usePersonQueries";
import {
  useUpdatePerson,
  useDeletePerson,
  useRestorePerson,
} from "@/modules/person/hooks/usePersonMutations";
import { PersonCard } from "@/modules/person/components/PersonCard";
import { PhoneInput } from "@/modules/person/components/PhoneInput";
import {
  UpdatePersonDto,
  PersonType,
} from "@/modules/person/types/person.types";
import { useAlerts } from "@/contexts/AlertContext";

const personTypeLabels: Record<PersonType, string> = {
  [PersonType.LEAD]: "Lead",
  [PersonType.CUSTOMER]: "Cliente",
  [PersonType.COMPANY]: "Empresa",
  [PersonType.SUPPLIER]: "Fornecedor",
};

export default function PersonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const alerts = useAlerts();

  const personId = params.id as string;
  const [isEditing, setIsEditing] = useState(false);

  const { data: person, isLoading } = usePerson(
    activeWorkspace?.id || "",
    personId,
  );

  const [formData, setFormData] = useState<UpdatePersonDto>({});

  const updateMutation = useUpdatePerson(activeWorkspace?.id || "", personId);
  const deleteMutation = useDeletePerson(activeWorkspace?.id || "");
  const restoreMutation = useRestorePerson(activeWorkspace?.id || "");

  // Atualizar formData quando person carregar
  React.useEffect(() => {
    if (person) {
      setFormData({
        name: person.name,
        email: person.email || "",
        document: person.document || "",
        type: person.type,
        address: person.address || "",
        city: person.city || "",
        state: person.state || "",
        zipCode: person.zipCode || "",
        notes: person.notes || "",
        phones: person.phones || [],
        active: person.active,
      });
    }
  }, [person]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    updateMutation.mutate(formData, {
      onSuccess: () => {
        alerts.success("Pessoa atualizada com sucesso!");
        setIsEditing(false);
      },
      onError: (error: any) => {
        alerts.error(
          error.response?.data?.message || "Erro ao atualizar pessoa",
        );
      },
    });
  };

  const handleDelete = async () => {
    if (!person) return;
    if (!confirm(`Tem certeza que deseja remover ${person.name}?`)) return;

    deleteMutation.mutate(personId, {
      onSuccess: () => {
        alerts.success("Pessoa removida com sucesso!");
        router.push("/persons");
      },
      onError: (error: any) => {
        alerts.error(error.response?.data?.message || "Erro ao remover pessoa");
      },
    });
  };

  const handleRestore = async () => {
    if (!person) return;

    restoreMutation.mutate(personId, {
      onSuccess: () => {
        alerts.success("Pessoa reativada com sucesso!");
      },
      onError: (error: any) => {
        alerts.error(
          error.response?.data?.message || "Erro ao reativar pessoa",
        );
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Pessoa não encontrada</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/persons")}
          className="text-blue-600 hover:text-blue-800 mb-2"
        >
          ← Voltar para lista
        </button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Detalhes da Pessoa
          </h1>
          <div className="flex gap-2">
            {!person.active && (
              <button
                onClick={handleRestore}
                disabled={restoreMutation.isPending}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Reativar
              </button>
            )}
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  Remover
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      {!isEditing ? (
        <PersonCard person={person} showFullDetails />
      ) : (
        <form onSubmit={handleUpdate} className="space-y-6">
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
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  Documento
                </label>
                <input
                  type="text"
                  value={formData.document || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, document: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Endereço
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço completo
                </label>
                <input
                  type="text"
                  value={formData.address || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={formData.city || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado (UF)
                  </label>
                  <input
                    type="text"
                    value={formData.state || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    maxLength={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CEP
                  </label>
                  <input
                    type="text"
                    value={formData.zipCode || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, zipCode: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Botão salvar */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
