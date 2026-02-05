"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { createLead } from "@/modules/person/services/person.service";
import { PhoneInput } from "@/modules/person/components/PhoneInput";
import { CreatePhoneDto } from "@/modules/person/types/person.types";
import { useAlerts } from "@/contexts/AlertContext";
import { ModuleGuard } from "@/modules/workspace/components/ModuleGuard";

interface LeadFormData {
  name: string;
  email?: string;
  document?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  notes?: string;
  phones?: CreatePhoneDto[];
  active: boolean;
  status?: string;
  source?: string;
  score?: number;
  interest?: string;
}

export default function NewLeadPage() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const alerts = useAlerts();

  const [formData, setFormData] = useState<LeadFormData>({
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
    status: "NOVO",
    source: "",
    score: 0,
    interest: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alerts.warning("O nome é obrigatório");
      return;
    }

    setIsLoading(true);

    try {
      // Remover campos vazios
      const cleanData: any = {
        name: formData.name,
        active: formData.active !== false,
      };

      if (formData.email?.trim()) cleanData.email = formData.email;
      if (formData.document?.trim()) cleanData.document = formData.document;
      if (formData.address?.trim()) cleanData.address = formData.address;
      if (formData.city?.trim()) cleanData.city = formData.city;
      if (formData.state?.trim()) cleanData.state = formData.state;
      if (formData.country?.trim()) cleanData.country = formData.country;
      if (formData.postalCode?.trim())
        cleanData.postalCode = formData.postalCode;
      if (formData.notes?.trim()) cleanData.notes = formData.notes;
      if (formData.status?.trim()) cleanData.status = formData.status;
      if (formData.source?.trim()) cleanData.source = formData.source;
      if (formData.score) cleanData.score = formData.score;
      if (formData.interest?.trim()) cleanData.interest = formData.interest;
      if (formData.phones && formData.phones.length > 0) {
        cleanData.phones = formData.phones.filter((p) => p.number.trim());
      }

      await createLead(activeWorkspace?.id || "", cleanData);
      alerts.success("Lead criado com sucesso!");
      router.push("/leads");
    } catch (error: any) {
      alerts.error(error.response?.data?.message || "Erro ao criar lead");
    } finally {
      setIsLoading(false);
    }
  };

  if (!activeWorkspace) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gh-text-secondary">Selecione um workspace</p>
      </div>
    );
  }

  return (
    <ModuleGuard moduleId="contacts" workspaceId={activeWorkspace?.id}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gh-text mb-1">Novo Lead</h2>
          <p className="text-sm text-gh-text-secondary">
            Cadastre um novo lead e acompanhe seu progresso através do funil de
            vendas.
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

          {/* Informações do Lead */}
          <div className="bg-gh-card p-6 rounded-md border border-gh-border">
            <h3 className="text-base font-semibold text-gh-text mb-4">
              Informações do Lead
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gh-text mb-1">
                  Status
                </label>
                <select
                  value={formData.status || "NOVO"}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gh-border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover"
                >
                  <option value="NOVO">Novo</option>
                  <option value="CONTATO_INICIAL">Contato Inicial</option>
                  <option value="QUALIFICADO">Qualificado</option>
                  <option value="PROPOSTA_ENVIADA">Proposta Enviada</option>
                  <option value="NEGOCIACAO">Negociação</option>
                  <option value="CONVERTIDO">Convertido</option>
                  <option value="PERDIDO">Perdido</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gh-text mb-1">
                  Fonte
                </label>
                <input
                  type="text"
                  value={formData.source || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, source: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gh-border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover"
                  placeholder="Ex: Google, Facebook, Indicação"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gh-text mb-1">
                  Score
                </label>
                <input
                  type="number"
                  value={formData.score || 0}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      score: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gh-border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover"
                  placeholder="0-100"
                  min="0"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gh-text mb-1">
                  Interesse
                </label>
                <input
                  type="text"
                  value={formData.interest || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, interest: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gh-border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover"
                  placeholder="Produto/serviço de interesse"
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

          {/* Notas */}
          <div className="bg-gh-card p-6 rounded-md border border-gh-border">
            <h3 className="text-base font-semibold text-gh-text mb-4">Notas</h3>
            <textarea
              value={formData.notes || ""}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full px-3 py-2 border border-gh-border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover resize-none"
              placeholder="Adicione observações sobre este lead..."
              rows={4}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => router.push("/leads")}
              className="px-4 py-2 border border-gh-border text-gh-text rounded-md hover:bg-gh-hover transition-colors text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-gh-hover text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              {isLoading ? "Salvando..." : "Criar Lead"}
            </button>
          </div>
        </form>
      </div>
    </ModuleGuard>
  );
}
