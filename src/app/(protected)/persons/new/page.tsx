"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { useCreatePerson } from "@/modules/person/hooks/usePersonMutations";
import { PhoneInput } from "@/modules/person/components/PhoneInput";
import { CreatePersonDto } from "@/modules/person/types/person.types";
import { useAlerts } from "@/contexts/AlertContext";

export default function NewPersonPage() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const alerts = useAlerts();

  const [formData, setFormData] = useState<CreatePersonDto>({
    name: "",
    email: "",
    document: "",
    address: "",
    city: "",
    state: "",
    country: "Brasil",
    postalCode: "",
    notes: "",
    phones: [],
    active: true,
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
      active: formData.active !== false,
    };

    if (formData.email?.trim()) cleanData.email = formData.email;
    if (formData.document?.trim()) cleanData.document = formData.document;
    if (formData.website?.trim()) cleanData.website = formData.website;
    if (formData.address?.trim()) cleanData.address = formData.address;
    if (formData.city?.trim()) cleanData.city = formData.city;
    if (formData.state?.trim()) cleanData.state = formData.state;
    if (formData.country?.trim()) cleanData.country = formData.country;
    if (formData.postalCode?.trim()) cleanData.postalCode = formData.postalCode;
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
      <div className="flex items-center justify-center py-12">
        <p className="text-gh-text-secondary">Selecione um workspace</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gh-text mb-1">Nova Pessoa</h2>
        <p className="text-sm text-gh-text-secondary">
          Cadastre uma nova pessoa. Após o cadastro, você poderá adicionar
          papéis como Lead, Cliente, Fornecedor ou Parceiro.
        </p>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <div className="bg-gh-card p-6 rounded-md border border-gh-border">
          <h3 className="text-base font-semibold text-gh-text mb-4">
            Informações Básicas
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gh-text mb-1">
                Nome completo *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-gh-border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover"
                placeholder="Ex: João da Silva"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gh-text mb-1">
                Documento (CPF/CNPJ)
              </label>
              <input
                type="text"
                value={formData.document || ""}
                onChange={(e) =>
                  setFormData({ ...formData, document: e.target.value })
                }
                className="w-full px-3 py-2 border border-gh-border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover"
                placeholder="000.000.000-00"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gh-text mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gh-border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover"
                placeholder="email@exemplo.com"
              />
            </div>
          </div>
        </div>

        {/* Telefones */}
        <div className="bg-gh-card p-6 rounded-md border border-gh-border">
          <h3 className="text-base font-semibold text-gh-text mb-4">
            Telefones
          </h3>
          <PhoneInput
            phones={formData.phones || []}
            onChange={(phones) => setFormData({ ...formData, phones })}
          />
        </div>

        {/* Endereço */}
        <div className="bg-gh-card p-6 rounded-md border border-gh-border">
          <h3 className="text-base font-semibold text-gh-text mb-4">
            Endereço
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gh-text mb-1">
                Endereço
              </label>
              <input
                type="text"
                value={formData.address || ""}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full px-3 py-2 border border-gh-border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover"
                placeholder="Rua, Avenida, Travessa..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gh-text mb-1">
                  Cidade
                </label>
                <input
                  type="text"
                  value={formData.city || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gh-border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover"
                  placeholder="São Paulo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gh-text mb-1">
                  Estado (UF)
                </label>
                <input
                  type="text"
                  value={formData.state || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  maxLength={2}
                  className="w-full px-3 py-2 border border-gh-border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover"
                  placeholder="SP"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gh-text mb-1">
                  CEP
                </label>
                <input
                  type="text"
                  value={formData.postalCode || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, postalCode: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gh-border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover"
                  placeholder="00000-000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gh-text mb-1">
                País
              </label>
              <input
                type="text"
                value={formData.country || "Brasil"}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                className="w-full px-3 py-2 border border-gh-border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover"
                placeholder="Brasil"
              />
            </div>
          </div>
        </div>

        {/* Website */}
        <div className="bg-gh-card p-6 rounded-md border border-gh-border">
          <h3 className="text-base font-semibold text-gh-text mb-4">Website</h3>
          <input
            type="url"
            value={formData.website || ""}
            onChange={(e) =>
              setFormData({ ...formData, website: e.target.value })
            }
            className="w-full px-3 py-2 border border-gh-border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover"
            placeholder="https://exemplo.com"
          />
        </div>

        {/* Observações */}
        <div className="bg-gh-card p-6 rounded-md border border-gh-border">
          <h3 className="text-base font-semibold text-gh-text mb-4">
            Observações
          </h3>
          <textarea
            value={formData.notes || ""}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            rows={4}
            className="w-full px-3 py-2 border border-gh-border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover"
            placeholder="Notas, comentários ou informações adicionais..."
          />
        </div>

        {/* Botões */}
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => router.push("/persons")}
            className="px-4 py-2 border border-gh-border text-gh-text rounded-md hover:bg-gh-hover transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-4 py-2 bg-gh-hover text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            {createMutation.isPending ? "Salvando..." : "Criar Pessoa"}
          </button>
        </div>
      </form>
    </div>
  );
}
