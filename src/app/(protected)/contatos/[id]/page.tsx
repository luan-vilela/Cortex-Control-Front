"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { ModuleGuard } from "@/modules/workspace/components/ModuleGuard";
import { useAlerts } from "@/contexts/AlertContext";
import { Loader2 } from "lucide-react";
import type { Person } from "@/modules/person/types/person.types";
import { personService } from "@/modules/person/services/person.service";
import { usePersonRoles } from "@/modules/person/hooks/usePersonRoles";
import { useBreadcrumb } from "@/modules/workspace/hooks";
import { usePersonActions } from "@/modules/person/hooks/usePersonActions";
import { PersonDetailHeader } from "@/modules/person/components/PersonDetailHeader";
import { PersonViewSection } from "@/modules/person/components/PersonViewSection";
import {
  PersonEditForm,
  type PersonFormData,
} from "@/modules/person/components/PersonEditForm";
import { PersonSidebar } from "@/modules/person/components/PersonSidebar";

export default function PersonDetailPage() {
  const params = useParams();
  const { activeWorkspace } = useWorkspaceStore();
  const alerts = useAlerts();
  const personId = params.id as string;

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [person, setPerson] = useState<Person | null>(null);

  const { data: papeisList = [] } = usePersonRoles(
    activeWorkspace?.id || "",
    personId,
  );

  const { updatePerson, deletePerson, restorePerson, reloadPerson } =
    usePersonActions();

  useBreadcrumb([
    {
      label: "Contatos",
      href: "/contatos",
    },
    {
      label: "Detalhes do Contato",
      href: `/contatos/${personId}`,
    },
  ]);

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
      } catch (error) {
        alerts.error("Erro ao carregar pessoa");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPerson();
  }, [activeWorkspace?.id, personId, alerts]);

  const handleUpdateSubmit = async (data: PersonFormData) => {
    try {
      await updatePerson(personId, data);
      alerts.success("Pessoa atualizada com sucesso!");
      setIsEditing(false);

      // Recarregar dados
      const updatedPerson = await reloadPerson(personId);
      setPerson(updatedPerson);
    } catch (error: any) {
      alerts.error(error.response?.data?.message || "Erro ao atualizar pessoa");
    }
  };

  const handleDeleteClick = async () => {
    if (!person) return;

    setIsDeleting(true);
    try {
      const success = await deletePerson(person);
      if (success) {
        // Redirecionamento já acontece dentro da função
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestoreClick = async () => {
    if (!person) return;

    setIsSaving(true);
    try {
      const success = await restorePerson(personId);
      if (success) {
        // Recarregar dados
        const updatedPerson = await reloadPerson(personId);
        setPerson(updatedPerson);
      }
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
        <PersonDetailHeader person={person} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {!isEditing ? (
              <PersonViewSection
                person={person}
                onEdit={() => setIsEditing(true)}
              />
            ) : (
              <PersonEditForm
                person={person}
                onSubmit={handleUpdateSubmit}
                onCancel={() => setIsEditing(false)}
              />
            )}
          </div>

          {/* Sidebar */}
          <PersonSidebar
            person={person}
            papeisList={papeisList}
            onRestore={handleRestoreClick}
            onDelete={handleDeleteClick}
            isRestoring={isSaving}
            isDeleting={isDeleting}
          />
        </div>
      </div>
    </ModuleGuard>
  );
}
