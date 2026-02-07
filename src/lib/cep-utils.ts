import axios from "axios";

export interface CepData {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

/**
 * Formata um CEP para o padrão: 00000-000
 */
export const formatCep = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length <= 5) {
    return cleaned;
  }
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
};

/**
 * Remove formatação do CEP
 */
export const unformatCep = (value: string): string => {
  return value.replace(/\D/g, "");
};

/**
 * Busca informações de endereço usando a API ViaCEP
 * @param cep - CEP sem formatação ou formatado
 * @returns Dados do CEP ou null se não encontrado
 */
export const searchCep = async (cep: string): Promise<CepData | null> => {
  try {
    const cleanedCep = unformatCep(cep);

    if (cleanedCep.length !== 8) {
      return null;
    }

    const response = await axios.get<CepData & { erro?: boolean }>(
      `https://viacep.com.br/ws/${cleanedCep}/json/`,
    );

    if (response.data.erro) {
      return null;
    }

    return response.data as CepData;
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    return null;
  }
};
