"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import {
  getLead,
  updateLead,
  deleteLead,
  restoreLead,
} from "@/modules/person/services/person.service";
import { PhoneInput } from "@/modules/person/components/PhoneInput";
import { CreatePhoneDto } from "@/modules/person/types/person.types";
import { useAlerts } from "@/contexts/AlertContext";
import { ChevronLeft, Loader2 } from "lucide-react";
import { ModuleGuard } from "@/modules/workspace/components/ModuleGuard";
import { useEffect } from "react";
import type { Lead } from "@/modules/person/types/person.types";

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

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const alerts = useAlerts();

  const leadId = params.id as string;
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [lead, setLead] = useState<Lead | null>(null);
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

  // Carregar lead
  useEffect(() => {
    if (!activeWorkspace?.id) return;

    const fetchLead = async () => {
      try {
        setIsLoading(true);
        const data = await getLead(activeWorkspace.id, leadId);
        setLead(data);
        setFormData({
          name: data.name,
          email: data.email || "",
          document: data.document || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          country: data.country || "Brasil",
          postalCode: data.postalCode || "",
          notes: data.notes || "",
          phones: data.phones || [],
          active: data.active,
          status: data.status || "NOVO",
          source: data.source || "",
          score: data.score || 0,
          interest: data.interest || "",
        });
      } catch (error) {
        alerts.error("Erro ao carregar lead");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLead();
  }, [activeWorkspace?.id, leadId, alerts]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alerts.warning("O nome é obrigatório");
      return;
    }

    setIsSaving(true);

    try {
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

      await updateLead(activeWorkspace?.id || "", leadId, cleanData);
      alerts.success("Lead atualizado com sucesso!");
      setIsEditing(false);

      // Recarregar dados
      const updatedLead = await getLead(activeWorkspace?.id || "", leadId);
      setLead(updatedLead);
    } catch (error: any) {
      alerts.error(error.response?.data?.message || "Erro ao atualizar lead");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!lead) return;
    if (!confirm(`Tem certeza que deseja remover ${lead.name}?`)) return;

    setIsDeleting(true);

    try {
      if (lead.active) {
        await deleteLead(activeWorkspace?.id || "", leadId);
        alerts.success("Lead removido com sucesso!");
      } else {
        // Hard delete
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/workspaces/${activeWorkspace?.id}/leads/${leadId}/hard`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (!response.ok) throw new Error("Erro ao remover permanentemente");
        alerts.success("Lead removido permanentemente!");
      }

      router.push("/leads");
    } catch (error: any) {
      alerts.error(error.message || "Erro ao remover lead");
      setIsDeleting(false);
    }
  };

  const handleRestore = async () => {
    if (!lead) return;

    setIsSaving(true);

    try {
      await restoreLead(activeWorkspace?.id || "", leadId);
      alerts.success("Lead reativado com sucesso!");

      // Recarregar dados
      const updatedLead = await getLead(activeWorkspace?.id || "", leadId);
      setLead(updatedLead);
      setFormData({
        name: updatedLead.name,
        email: updatedLead.email || "",
        document: updatedLead.document || "",
        address: updatedLead.address || "",
        city: updatedLead.city || "",
        state: updatedLead.state || "",
        country: updatedLead.country || "Brasil",
        postalCode: updatedLead.postalCode || "",
        notes: updatedLead.notes || "",
        phones: updatedLead.phones || [],
        active: updatedLead.active,
        status: updatedLead.status || "NOVO",
        source: updatedLead.source || "",
        score: updatedLead.score || 0,
        interest: updatedLead.interest || "",
      });
    } catch (error: any) {
      alerts.error(error.response?.data?.message || "Erro ao reativar lead");
    } finally {
      setIsSaving(false);
    }
  };

  if (!activeWorkspace) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gh-text-secondary">Selecione um workspace</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-gh-text-secondary" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gh-text-secondary">Lead não encontrado</p>
      </div>
    );
  }

  return (
    <ModuleGuard moduleId="contacts" workspaceId={activeWorkspace?.id}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gh-hover rounded-md transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gh-text" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gh-text">{lead.name}</h2>
            <p className="text-sm text-gh-text-secondary">
              {lead.email || "Sem email"}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {!isEditing ? (
              // Modo visualização
              <div className="bg-gh-card border border-gh-border rounded-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gh-border flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gh-text">
                    Informações do Lead
                  </h3>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-gh-hover text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
                  >
                    Editar
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Informações Básicas */}
                  <div>
                    <h4 className="text-base font-semibold text-gh-text mb-4">
                      Informações Básicas
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gh-text-secondary mb-1">
                          Nome
                        </p>
                        <p className="text-gh-text font-medium">{lead.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gh-text-secondary mb-1">
                          Email
                        </p>
                        <p className="text-gh-text font-medium">
                          {lead.email || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gh-text-secondary mb-1">
                          Documento
                        </p>
                        <p className="text-gh-text font-medium">
                          {lead.document || "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Informações do Lead */}
                  <div>
                    <h4 className="text-base font-semibold text-gh-text mb-4">
                      Informações do Lead
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gh-text-secondary mb-1">
                          Status
                        </p>
                        <p className="text-gh-text font-medium">
                          {lead.status || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gh-text-secondary mb-1">
                          Fonte
                        </p>
                        <p className="text-gh-text font-medium">
                          {lead.source || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gh-text-secondary mb-1">
                          Score
                        </p>
                        <p className="text-gh-text font-medium">
                          {lead.score || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gh-text-secondary mb-1">
                          Interesse
                        </p>
                        <p className="text-gh-text font-medium">
                          {lead.interest || "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Telefones */}
                  {lead.phones && lead.phones.length > 0 && (
                    <div>
                      <h4 className="text-base font-semibold text-gh-text mb-4">
                        Telefones
                      </h4>
                      <div className="space-y-2">
                        {lead.phones.map((phone, idx) => (
                          <div key={idx} className="text-gh-text">
                            {phone.number}
                            {phone.type && (
                              <span className="text-gh-text-secondary text-sm ml-2">
                                ({phone.type})
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Endereço */}
                  {(lead.address || lead.city || lead.state) && (
                    <div>
                      <h4 className="text-base font-semibold text-gh-text mb-4">
                        Endereço
                      </h4>
                      <div className="space-y-2 text-gh-text">
                        {lead.address && <p>{lead.address}</p>}
                        {(lead.city || lead.state) && (
                          <p>
                            {lead.city}
                            {lead.state && `, ${lead.state}`}
                          </p>
                        )}
                        {lead.country && <p>{lead.country}</p>}
                        {lead.postalCode && <p>{lead.postalCode}</p>}
                      </div>
                    </div>
                  )}

                  {/* Notas */}
                  {lead.notes && (
                    <div>
                      <h4 className="text-base font-semibold text-gh-text mb-4">
                        Notas
                      </h4>
                      <p className="text-gh-text whitespace-pre-wrap">
                        {lead.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Modo edição
              <form onSubmit={handleUpdate} className="space-y-6">
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
                        <option value="PROPOSTA_ENVIADA">
                          Proposta Enviada
                        </option>
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
                          setFormData({
                            ...formData,
                            interest: e.target.value,
                          })
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
                            setFormData({
                              ...formData,
                              postalCode: e.target.value,
                            })
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
                  <h3 className="text-base font-semibold text-gh-text mb-4">
                    Notas
                  </h3>
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
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gh-border text-gh-text rounded-md hover:bg-gh-hover transition-colors text-sm font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 bg-gh-hover text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 inline animate-spin mr-2" />
                        Salvando...
                      </>
                    ) : (
                      "Salvar Alterações"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Info Card */}
            <div className="bg-gh-card border border-gh-border rounded-lg p-4">
              <h4 className="font-semibold text-gh-text mb-3">Informações</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gh-text-secondary">Criado em</p>
                  <p className="text-gh-text font-medium">
                    {new Date(lead.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p className="text-gh-text-secondary">Atualizado em</p>
                  <p className="text-gh-text font-medium">
                    {new Date(lead.updatedAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p className="text-gh-text-secondary">Status</p>
                  <p className="text-gh-text font-medium">
                    {lead.active ? "✓ Ativo" : "✗ Inativo"}
                  </p>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="border border-red-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-red-50 border-b border-red-200">
                <h4 className="font-semibold text-red-900">Zona de Perigo</h4>
              </div>
              <div className="px-4 py-4 space-y-3">
                {!lead.active && (
                  <>
                    <p className="text-xs text-red-700 mb-3">
                      Este lead foi removido. Você pode reativá-lo ou remover
                      permanentemente.
                    </p>
                    <button
                      onClick={handleRestore}
                      disabled={isDeleting}
                      className="w-full px-3 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="w-4 h-4 inline animate-spin mr-2" />
                        </>
                      ) : (
                        "Reativar Lead"
                      )}
                    </button>
                  </>
                )}
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full px-3 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 inline animate-spin mr-2" />
                    </>
                  ) : lead.active ? (
                    "Remover Lead"
                  ) : (
                    "Remover Permanentemente"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModuleGuard>
  );
}
