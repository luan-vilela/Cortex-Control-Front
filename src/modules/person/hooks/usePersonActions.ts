"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { useAlerts } from "@/contexts/AlertContext";
import { personService } from "@/modules/person/services/person.service";
import type { Person } from "@/modules/person/types/person.types";
import type { PersonFormData } from "../components/PersonEditForm";

export function usePersonActions() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const alerts = useAlerts();

  const reloadPerson = useCallback(
    async (personId: string) => {
      const updatedPerson = await personService.getPerson(
        activeWorkspace?.id || "",
        personId,
      );
      return updatedPerson as Person;
    },
    [activeWorkspace?.id],
  );

  const updatePerson = useCallback(
    async (personId: string, data: PersonFormData) => {
      const cleanData: any = {
        name: data.name,
        active: data.active !== false,
      };

      if (data.email?.trim()) cleanData.email = data.email;
      if (data.document?.trim()) cleanData.document = data.document;
      if (data.website?.trim()) cleanData.website = data.website;
      if (data.address?.trim()) cleanData.address = data.address;
      if (data.city?.trim()) cleanData.city = data.city;
      if (data.state?.trim()) cleanData.state = data.state;
      if (data.country?.trim()) cleanData.country = data.country;
      if (data.postalCode?.trim()) cleanData.postalCode = data.postalCode;
      if (data.notes?.trim()) cleanData.notes = data.notes;
      if (data.phones && data.phones.length > 0) {
        cleanData.phones = data.phones.filter((p) => p.number.trim());
      }

      await personService.updatePerson(
        activeWorkspace?.id || "",
        personId,
        cleanData,
      );
    },
    [activeWorkspace?.id],
  );

  const deletePerson = useCallback(
    async (person: Person) => {
      if (!person) return;
      if (!confirm(`Tem certeza que deseja remover ${person.name}?`))
        return false;

      try {
        if (person.active) {
          await personService.deletePerson(
            activeWorkspace?.id || "",
            person.id,
          );
          alerts.success("Pessoa removida com sucesso!");
        } else {
          // Hard delete
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/workspaces/${activeWorkspace?.id}/contatos/${person.id}/hard`,
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
        return true;
      } catch (error: any) {
        alerts.error(error.message || "Erro ao remover pessoa");
        return false;
      }
    },
    [activeWorkspace?.id, alerts, router],
  );

  const restorePerson = useCallback(
    async (personId: string) => {
      try {
        await personService.restorePerson(activeWorkspace?.id || "", personId);
        alerts.success("Pessoa reativada com sucesso!");
        return true;
      } catch (error: any) {
        alerts.error(
          error.response?.data?.message || "Erro ao reativar pessoa",
        );
        return false;
      }
    },
    [activeWorkspace?.id, alerts],
  );

  return {
    updatePerson,
    deletePerson,
    restorePerson,
    reloadPerson,
  };
}
