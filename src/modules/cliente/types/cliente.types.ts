export enum ClienteCategoria {
  VIP = "VIP",
  PREMIUM = "PREMIUM",
  REGULAR = "REGULAR",
  BASICO = "BASICO",
}

export enum ClienteStatus {
  ATIVO = "ATIVO",
  INATIVO = "INATIVO",
  SUSPENSO = "SUSPENSO",
  INADIMPLENTE = "INADIMPLENTE",
}

export interface ClienteData {
  id: string;
  personId: string;
  workspaceId: string;
  categoria: ClienteCategoria;
  status: ClienteStatus;
  totalCompras: number;
  quantidadePedidos: number;
  ticketMedio: number;
  saldoDevedor: number;
  limiteCredito: number;
  ultimoContato: string | null;
  dataUltimaPedido: string | null;
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

export interface CreateClienteDTO {
  personId: string;
  categoria: ClienteCategoria;
  saldoDevedor?: number;
  limiteCredito?: number;
}

export interface UpdateClienteDTO {
  categoria?: ClienteCategoria;
  status?: ClienteStatus;
  saldoDevedor?: number;
  limiteCredito?: number;
}

export interface ClienteAnalytics {
  totalClientes: number;
  totalCompras: number;
  ticketMedioGeral: number;
  vtm: {
    vip: {
      count: number;
      percentage: number;
      totalCompras: number;
    };
    total: {
      count: number;
      percentage: number;
      totalCompras: number;
    };
    medium: {
      count: number;
      percentage: number;
      totalCompras: number;
    };
  };
}
