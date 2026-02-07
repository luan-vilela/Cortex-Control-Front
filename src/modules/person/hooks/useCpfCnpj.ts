"use client";

import { useCallback } from "react";
import { formatCpfCnpj } from "@/lib/document-utils";

export interface UseCpfCnpjResult {
  formatDocument: (value: string) => string;
}

/**
 * Hook para gerenciar máscara de CPF/CNPJ
 */
export const useCpfCnpj = (): UseCpfCnpjResult => {
  const formatDocument = useCallback((value: string): string => {
    return formatCpfCnpj(value);
  }, []);

  return { formatDocument };
};
