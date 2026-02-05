export enum FornecedorTipo {
  MATERIA_PRIMA = "MATERIA_PRIMA",
  SERVICO = "SERVICO",
  REVENDA = "REVENDA",
  TERCEIRIZADO = "TERCEIRIZADO",
  LOGISTICA = "LOGISTICA",
}

export enum FornecedorStatus {
  ATIVO = "ATIVO",
  INATIVO = "INATIVO",
  SUSPENSO = "SUSPENSO",
  BLOQUEADO = "BLOQUEADO",
}

export interface FornecedorData {
  id: string;
  personId: string;
  workspaceId: string;
  tipo: FornecedorTipo;
  status: FornecedorStatus;
  totalCompras: number;
  quantidadePedidos: number;
  avaliacao: number; // 1-5 stars
  prazoPagamento: number;
  descontoNegociado: number; // percentage
  dataUltimaCompra: string | null;
  dataInclusao: string;
  ativo: boolean;
  person?: {
    id: string;
    name: string;
    email: string;
    document: string;
    phone: string;
  };
}

export interface CreateFornecedorDTO {
  personId: string;
  tipo: FornecedorTipo;
  avaliacao?: number;
  prazoPagamento?: number;
  descontoNegociado?: number;
}

export interface UpdateFornecedorDTO {
  tipo?: FornecedorTipo;
  status?: FornecedorStatus;
  avaliacao?: number;
  prazoPagamento?: number;
  descontoNegociado?: number;
}

export interface FornecedorAnalytics {
  totalFornecedores: number;
  totalCompras: number;
  avaliacaoMedia: number;
  prazoPagamentoMedio: number;
  descontoMedio: number;
}
