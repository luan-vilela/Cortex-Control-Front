export enum ParceiroTipo {
  COMERCIAL = "COMERCIAL",
  TECNICO = "TECNICO",
  ESTRATEGICO = "ESTRATEGICO",
  AFILIADO = "AFILIADO",
  REVENDEDOR = "REVENDEDOR",
}

export enum ParceiroStatus {
  ATIVO = "ATIVO",
  INATIVO = "INATIVO",
  SUSPENSO = "SUSPENSO",
  EM_AVALIACAO = "EM_AVALIACAO",
}

export interface ParceiroData {
  id: string;
  personId: string;
  workspaceId: string;
  tipo: ParceiroTipo;
  status: ParceiroStatus;
  comissaoPercentual: number;
  totalNegocioGerado: number;
  totalComissaoPaga: number;
  totalComissaoPendente: number;
  taxaConversao: number; // percentage
  totalIndicacoes: number;
  totalConversoes: number;
  dataInclusao: string;
  ativo: boolean;
  papeisList?: string[];
  person?: {
    id: string;
    name: string;
    email: string;
    document: string;
    phone: string;
  };
}

export interface CreateParceiroDTO {
  personId: string;
  tipo: ParceiroTipo;
  comissaoPercentual: number;
}

export interface UpdateParceiroDTO {
  tipo?: ParceiroTipo;
  status?: ParceiroStatus;
  comissaoPercentual?: number;
}

export interface PagarComissaoDTO {
  valor: number;
}

export interface ParceiroAnalytics {
  totalParceiros: number;
  totalNegocioGerado: number;
  totalComissaoPaga: number;
  totalComissaoPendente: number;
  taxaConversaoMedia: number;
  totalIndicacoes: number;
  totalConversoes: number;
}
