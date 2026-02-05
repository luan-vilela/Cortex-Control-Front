"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { ModuleGuard } from "@/modules/workspace/components/ModuleGuard";
import { PhoneInput } from "@/modules/person/components/PhoneInput";
import { CreatePhoneDto } from "@/modules/person/types/person.types";
import { useAlerts } from "@/contexts/AlertContext";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useEffect } from "react";
import type { Person } from "@/modules/person/types/person.types";
import { personService } from "@/modules/person/services/person.service";

interface PersonFormData {
  name: string;
  email?: string;
  document?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  notes?: string;
  phones?: CreatePhoneDto[];
  active: boolean;
}

export default function PersonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const alerts = useAlerts();

  const personId = params.id as string;
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [person, setPerson] = useState<Person | null>(null);
  const [formData, setFormData] = useState<PersonFormData>({
    name: "",
    email: "",
    document: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "Brasil",
    postalCode: "",
    notes: "",
    phones: [],
    active: true,
  });

  // Carregar pessoa
  useEffect(() => {
    if (!activeWorkspace?.id) return;

    const fetchPerson = async () => {
      try {
        setIsLoading(true);
        const data = await personService.getPerson(
          activeWorkspace.id,
          personId,
        );
        setPerson(data as Person);
        setFormData({
          name: data.name,
          email: data.email || "",
          document: data.document || "",
          website: data.website || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          country: data.country || "Brasil",
          postalCode: data.postalCode || "",
          notes: data.notes || "",
          phones: data.phones || [],
          active: data.active,
        });
      } catch (error) {
        alerts.error("Erro ao carregar pessoa");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerson();
  }, [activeWorkspace?.id, personId, alerts]);

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
      if (formData.website?.trim()) cleanData.website = formData.website;
      if (formData.address?.trim()) cleanData.address = formData.address;
      if (formData.city?.trim()) cleanData.city = formData.city;
      if (formData.state?.trim()) cleanData.state = formData.state;
      if (formData.country?.trim()) cleanData.country = formData.country;
      if (formData.postalCode?.trim())
        cleanData.postalCode = formData.postalCode;
      if (formData.notes?.trim()) cleanData.notes = formData.notes;
      if (formData.phones && formData.phones.length > 0) {
        cleanData.phones = formData.phones.filter((p) => p.number.trim());
      }

      await personService.updatePerson(
        activeWorkspace?.id || "",
        personId,
        cleanData,
      );
      alerts.success("Pessoa atualizada com sucesso!");
      setIsEditing(false);

      // Recarregar dados
      const updatedPerson = await personService.getPerson(
        activeWorkspace?.id || "",
        personId,
      );
      setPerson(updatedPerson as Person);
    } catch (error: any) {
      alerts.error(error.response?.data?.message || "Erro ao atualizar pessoa");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!person) return;
    if (!confirm(`Tem certeza que deseja remover ${person.name}?`)) return;

    setIsDeleting(true);

    try {
      if (person.active) {
        await personService.deletePerson(activeWorkspace?.id || "", personId);
        alerts.success("Pessoa removida com sucesso!");
      } else {
        // Hard delete
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/workspaces/${activeWorkspace?.id}/contatos/${personId}/hard`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        if (!response.ok) throw new Error("Erro ao remover permanentemente");
        alerts.success("Pessoa removida permanentemente!");
      }

      router.push("/contatos");
    } catch (error: any) {
      alerts.error(error.message || "Erro ao remover pessoa");
      setIsDeleting(false);
    }
  };

  const handleRestore = async () => {
    if (!person) return;

    setIsSaving(true);

    try {
      await personService.restorePerson(activeWorkspace?.id || "", personId);
      alerts.success("Pessoa reativada com sucesso!");

      // Recarregar dados
      const updatedPerson = await personService.getPerson(
        activeWorkspace?.id || "",
        personId,
      );
      setPerson(updatedPerson as Person);
      setFormData({
        name: updatedPerson.name,
        email: updatedPerson.email || "",
        document: updatedPerson.document || "",
        website: updatedPerson.website || "",
        address: updatedPerson.address || "",
        city: updatedPerson.city || "",
        state: updatedPerson.state || "",
        country: updatedPerson.country || "Brasil",
        postalCode: updatedPerson.postalCode || "",
        notes: updatedPerson.notes || "",
        phones: updatedPerson.phones || [],
        active: updatedPerson.active,
      });
    } catch (error: any) {
      alerts.error(error.response?.data?.message || "Erro ao reativar pessoa");
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

  if (!person) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gh-text-secondary">Pessoa não encontrada</p>
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
            <h2 className="text-2xl font-bold text-gh-text">{person.name}</h2>
            <p className="text-sm text-gh-text-secondary">
              {person.email || "Sem email"}
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
                    Informações da Pessoa
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
                        <p className="text-gh-text font-medium">
                          {person.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gh-text-secondary mb-1">
                          Email
                        </p>
                        <p className="text-gh-text font-medium">
                          {person.email || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gh-text-secondary mb-1">
                          Documento
                        </p>
                        <p className="text-gh-text font-medium">
                          {person.document || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gh-text-secondary mb-1">
                          Website
                        </p>
                        <p className="text-gh-text font-medium">
                          {person.website || "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Telefones */}
                  {person.phones && person.phones.length > 0 && (
                    <div>
                      <h4 className="text-base font-semibold text-gh-text mb-4">
                        Telefones
                      </h4>
                      <div className="space-y-2">
                        {person.phones.map((phone, idx) => (
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
                  {(person.address || person.city || person.state) && (
                    <div>
                      <h4 className="text-base font-semibold text-gh-text mb-4">
                        Endereço
                      </h4>
                      <div className="space-y-2 text-gh-text">
                        {person.address && <p>{person.address}</p>}
                        {(person.city || person.state) && (
                          <p>
                            {person.city}
                            {person.state && `, ${person.state}`}
                          </p>
                        )}
                        {person.country && <p>{person.country}</p>}
                        {person.postalCode && <p>{person.postalCode}</p>}
                      </div>
                    </div>
                  )}

                  {/* Notas */}
                  {person.notes && (
                    <div>
                      <h4 className="text-base font-semibold text-gh-text mb-4">
                        Notas
                      </h4>
                      <p className="text-gh-text whitespace-pre-wrap">
                        {person.notes}
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

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gh-text mb-1">
                        Website
                      </label>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gh-text mb-1">
                        Endereço
                      </label>
                      <input
                        type="text"
                        placeholder="Rua, número, complemento"
                        value={formData.address || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gh-border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gh-text mb-1">
                        Cidade
                      </label>
                      <input
                        type="text"
                        placeholder="Cidade"
                        value={formData.city || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gh-border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gh-text mb-1">
                        Estado
                      </label>
                      <input
                        type="text"
                        placeholder="Estado"
                        value={formData.state || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gh-border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gh-text mb-1">
                        CEP
                      </label>
                      <input
                        type="text"
                        placeholder="CEP"
                        value={formData.postalCode || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            postalCode: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gh-border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gh-text mb-1">
                        País
                      </label>
                      <input
                        type="text"
                        placeholder="País"
                        value={formData.country || "Brasil"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            country: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gh-border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover"
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
                    placeholder="Adicione notas sobre esta pessoa..."
                    value={formData.notes || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={4}
                    className="w-full px-3 py-2 border border-gh-border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover"
                  />
                </div>

                {/* Botões de ação */}
                <div className="bg-gh-card p-6 rounded-md border border-gh-border flex gap-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 bg-gh-hover text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 inline animate-spin mr-2" />
                      </>
                    ) : null}
                    Salvar Alterações
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-gh-text border border-gh-border text-sm font-medium rounded-md hover:bg-gh-bg transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Info Card */}
            <div className="bg-gh-card border border-gh-border rounded-md p-4">
              <h4 className="font-semibold text-gh-text mb-3">Informações</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gh-text-secondary">Criado em</p>
                  <p className="text-gh-text font-medium">
                    {new Date(person.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p className="text-gh-text-secondary">Atualizado em</p>
                  <p className="text-gh-text font-medium">
                    {new Date(person.updatedAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p className="text-gh-text-secondary">Status</p>
                  <p className="text-gh-text font-medium">
                    {person.active ? "✓ Ativo" : "✗ Inativo"}
                  </p>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="border border-red-200 rounded-md overflow-hidden">
              <div className="px-4 py-3 bg-red-50 border-b border-red-200">
                <h4 className="font-semibold text-red-900">Zona de Perigo</h4>
              </div>
              <div className="px-4 py-4 space-y-3">
                {!person.active && (
                  <button
                    onClick={handleRestore}
                    disabled={isSaving}
                    className="w-full px-3 py-2 text-sm font-medium text-green-600 border border-green-300 rounded-md hover:bg-green-50 transition-colors disabled:opacity-50"
                  >
                    Reativar Pessoa
                  </button>
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
                  ) : person.active ? (
                    "Remover Pessoa"
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
