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
import { UpdatePersonDto } from "@/modules/person/types/person.types";
import { useAlerts } from "@/contexts/AlertContext";
import { ChevronLeft, AlertCircle, Loader2 } from "lucide-react";

export default function PersonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const alerts = useAlerts();

  const personId = params.id as string;
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: person,
    isLoading,
    refetch,
  } = usePerson(activeWorkspace?.id || "", personId);

  const [formData, setFormData] = useState<UpdatePersonDto>({
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
        website: person.website || "",
        address: person.address || "",
        city: person.city || "",
        state: person.state || "",
        country: person.country || "Brasil",
        postalCode: person.postalCode || "",
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

    setIsDeleting(true);
    deleteMutation.mutate(personId, {
      onSuccess: () => {
        alerts.success("Pessoa removida com sucesso!");
        router.push("/persons");
      },
      onError: (error: any) => {
        alerts.error(error.response?.data?.message || "Erro ao remover pessoa");
        setIsDeleting(false);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/persons")}
          className="flex items-center gap-2 text-gh-text-secondary hover:text-gh-text transition-colors text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para Pessoas
        </button>

        <div className="flex items-center gap-2">
          {!person.active && (
            <button
              onClick={handleRestore}
              disabled={restoreMutation.isPending}
              className="px-3 py-2 text-sm font-medium text-gh-text border border-gh-border rounded-md hover:bg-gh-bg transition-colors disabled:opacity-50"
            >
              Reativar
            </button>
          )}
          {!isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-2 text-sm font-medium text-gh-text border border-gh-border rounded-md hover:bg-gh-bg transition-colors"
              >
                Editar
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-3 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                Remover
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  name: person.name,
                  email: person.email || "",
                  document: person.document || "",
                  website: person.website || "",
                  address: person.address || "",
                  city: person.city || "",
                  state: person.state || "",
                  country: person.country || "Brasil",
                  postalCode: person.postalCode || "",
                  notes: person.notes || "",
                  phones: person.phones || [],
                  active: person.active,
                });
              }}
              className="px-3 py-2 text-sm font-medium text-gh-text border border-gh-border rounded-md hover:bg-gh-bg transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Status Alert */}
      {!person.active && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-red-900">Pessoa Inativa</h4>
            <p className="text-sm text-red-700 mt-1">
              Esta pessoa foi removida e não está ativa no workspace. Você pode
              reativá-la clicando no botão acima.
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          {!isEditing ? (
            <div className="bg-gh-card border border-gh-border rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gh-border">
                <h2 className="text-2xl font-bold text-gh-text">
                  {person.name}
                </h2>
                <div className="flex gap-4 mt-2 text-sm text-gh-text-secondary">
                  {person.document && <span>{person.document}</span>}
                </div>
              </div>
              <div className="px-6 py-4">
                <PersonCard person={person} showFullDetails />
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="bg-gh-card border border-gh-border rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gh-border">
                  <h3 className="font-semibold text-gh-text">
                    Editar Informações
                  </h3>
                </div>

                <div className="px-6 py-4 space-y-4">
                  {/* Nome */}
                  <div>
                    <label className="block text-sm font-medium text-gh-text mb-1">
                      Nome *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gh-card border border-gh-border rounded-md text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:ring-2 focus:ring-gh-hover"
                    />
                  </div>

                  {/* Documento */}
                  <div>
                    <label className="block text-sm font-medium text-gh-text mb-1">
                      Documento
                    </label>
                    <input
                      type="text"
                      value={formData.document || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, document: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gh-card border border-gh-border rounded-md text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:ring-2 focus:ring-gh-hover"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gh-text mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-gh-card border border-gh-border rounded-md text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:ring-2 focus:ring-gh-hover"
                    />
                  </div>

                  {/* Telefones */}
                  <div>
                    <label className="block text-sm font-medium text-gh-text mb-1">
                      Telefones
                    </label>
                    <PhoneInput
                      phones={formData.phones || []}
                      onChange={(phones) =>
                        setFormData({ ...formData, phones })
                      }
                    />
                  </div>

                  {/* Endereço */}
                  <div className="grid grid-cols-1 gap-4 pt-2 border-t border-gh-border">
                    <h4 className="col-span-1 font-medium text-gh-text">
                      Endereço
                    </h4>
                    <input
                      type="text"
                      placeholder="Endereço"
                      value={formData.address || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="px-3 py-2 bg-gh-card border border-gh-border rounded-md text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:ring-2 focus:ring-gh-hover"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Cidade"
                        value={formData.city || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, city: e.target.value })
                        }
                        className="px-3 py-2 bg-gh-card border border-gh-border rounded-md text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:ring-2 focus:ring-gh-hover"
                      />
                      <input
                        type="text"
                        placeholder="Estado"
                        value={formData.state || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        className="px-3 py-2 bg-gh-card border border-gh-border rounded-md text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:ring-2 focus:ring-gh-hover"
                      />
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
                        className="px-3 py-2 bg-gh-card border border-gh-border rounded-md text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:ring-2 focus:ring-gh-hover"
                      />
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
                        className="px-3 py-2 bg-gh-card border border-gh-border rounded-md text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:ring-2 focus:ring-gh-hover"
                      />
                    </div>
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium text-gh-text mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      className="px-3 py-2 bg-gh-card border border-gh-border rounded-md text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:ring-2 focus:ring-gh-hover"
                    />
                  </div>

                  {/* Notas */}
                  <div className="pt-2 border-t border-gh-border">
                    <label className="block text-sm font-medium text-gh-text mb-1">
                      Notas
                    </label>
                    <textarea
                      value={formData.notes || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      rows={4}
                      className="w-full px-3 py-2 bg-gh-card border border-gh-border rounded-md text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:ring-2 focus:ring-gh-hover"
                    />
                  </div>
                </div>

                <div className="px-6 py-4 bg-gh-bg border-t border-gh-border flex gap-2">
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="px-4 py-2 bg-gh-hover text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {updateMutation.isPending ? (
                      <Loader2 className="w-4 h-4 inline animate-spin mr-2" />
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
          <div className="border border-red-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-red-50 border-b border-red-200">
              <h4 className="font-semibold text-red-900">Zona de Perigo</h4>
            </div>
            <div className="px-4 py-4 space-y-3">
              {!person.active && (
                <p className="text-xs text-red-700 mb-3">
                  Esta pessoa foi removida. Você pode reativá-la ou remover
                  permanentemente.
                </p>
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
  );
}
