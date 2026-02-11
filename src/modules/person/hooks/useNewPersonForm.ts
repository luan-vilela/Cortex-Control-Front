"use client";

import { useCallback } from "react";
import { UseFormSetValue } from "react-hook-form";
import { useAlerts } from "@/contexts/AlertContext";
import { searchCep } from "@/lib/cep-utils";
import { NewPersonFormData } from "@/modules/person/schemas/new-person.schema";

export interface UseNewPersonFormResult {
  handleCepBlur: (
    cepValue: string,
    setValue: UseFormSetValue<NewPersonFormData>,
  ) => Promise<void>;
  formatCepInput: (value: string) => string;
}

/**
 * Hook para gerenciar lógica do formulário de nova pessoa
 */
export const useNewPersonForm = (): UseNewPersonFormResult => {
  const alerts = useAlerts();

  /**
   * Formata CEP automaticamente
   */
  const formatCepInput = useCallback((value: string): string => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 5) {
      return cleaned;
    }
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
  }, []);

  /**
   * Busca CEP e preenche endereço automaticamente
   */
  const handleCepBlur = useCallback(
    async (cepValue: string, setValue: UseFormSetValue<NewPersonFormData>) => {
      if (!cepValue || cepValue.length < 9) {
        return;
      }

      try {
        const data = await searchCep(cepValue);
        if (data) {
          setValue("address", data.logradouro);
          setValue("city", data.localidade);
          setValue("state", data.uf);
          alerts.success("Endereço preenchido com sucesso!");
        } else {
          alerts.error("CEP não encontrado");
        }
      } catch (error) {
        alerts.error("Erro ao buscar CEP");
        console.error(error);
      }
    },
    [alerts],
  );

  return {
    handleCepBlur,
    formatCepInput,
  };
};
