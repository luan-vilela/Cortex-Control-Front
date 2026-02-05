export enum EntityType {
  PERSON = "PERSON",
  LEAD = "LEAD",
  CLIENTE = "CLIENTE",
  FORNECEDOR = "FORNECEDOR",
  PARCEIRO = "PARCEIRO",
}

export enum PhoneType {
  MOBILE = "MOBILE",
  LANDLINE = "LANDLINE",
  FAX = "FAX",
  WHATSAPP = "WHATSAPP",
  COMMERCIAL = "COMMERCIAL",
}

export enum LeadStatus {
  NOVO = "NOVO",
  CONTATO_INICIAL = "CONTATO_INICIAL",
  QUALIFICADO = "QUALIFICADO",
  PROPOSTA_ENVIADA = "PROPOSTA_ENVIADA",
  NEGOCIACAO = "NEGOCIACAO",
  CONVERTIDO = "CONVERTIDO",
  PERDIDO = "PERDIDO",
}

export enum LeadSource {
  WEBSITE = "WEBSITE",
  INDICACAO = "INDICACAO",
  REDES_SOCIAIS = "REDES_SOCIAIS",
  EVENTO = "EVENTO",
  COLD_CALL = "COLD_CALL",
  PARCEIRO = "PARCEIRO",
  OUTRO = "OUTRO",
}

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
  HOMOLOGACAO = "HOMOLOGACAO",
  BLOQUEADO = "BLOQUEADO",
}

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
  EM_NEGOCIACAO = "EM_NEGOCIACAO",
  SUSPENSO = "SUSPENSO",
}

export interface Phone {
  id: string;
  personId: string;
  number: string;
  type: PhoneType;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

// Base interface com campos comuns
interface BaseEntity {
  id: string;
  workspaceId: string;
  name: string;
  document: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  notes: string | null;
  phones: Phone[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Tipos específicos para cada entidade
export interface Person extends BaseEntity {}

export interface Lead extends BaseEntity {
  status?: string;
  source?: string;
  score?: number;
  interest?: string;
}

export interface Cliente extends BaseEntity {
  categoria?: string;
  clienteStatus?: string;
  limiteCredito?: number;
}

export interface Fornecedor extends BaseEntity {
  tipo?: string;
  fornecedorStatus?: string;
  prazoPagamento?: number;
}

export interface Parceiro extends BaseEntity {
  tipo?: string;
  parceiroStatus?: string;
  comissaoPercentual?: number;
}

// Tipo unificado para "Todos os Contatos"
export type AllContacts = Person | Lead | Cliente | Fornecedor | Parceiro;

export interface CreatePhoneDto {
  number: string;
  type?: PhoneType;
  isPrimary?: boolean;
}

export interface CreatePersonDto {
  name: string;
  document?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  notes?: string;
  phones?: CreatePhoneDto[];
  active?: boolean;
}

export interface CreateLeadDto extends CreatePersonDto {
  status?: string;
  source?: LeadSource;
  score?: number;
  interest?: string;
}

export interface CreateClienteDto extends CreatePersonDto {
  categoria?: ClienteCategoria;
  clienteStatus?: ClienteStatus;
  limiteCredito?: number;
}

export interface CreateFornecedorDto extends CreatePersonDto {
  tipo?: FornecedorTipo;
  fornecedorStatus?: FornecedorStatus;
  prazoPagamento?: number;
}

export interface CreateParceiroDto extends CreatePersonDto {
  tipo?: ParceiroTipo;
  parceiroStatus?: ParceiroStatus;
  comissaoPercentual?: number;
}

export interface UpdatePersonDto extends CreatePersonDto {}
export interface UpdateLeadDto extends CreateLeadDto {}
export interface UpdateClienteDto extends CreateClienteDto {}
export interface UpdateFornecedorDto extends CreateFornecedorDto {}
export interface UpdateParceiroDto extends CreateParceiroDto {}

export interface PersonStats {
  total: number;
  byType: {
    PERSON: number;
    LEAD: number;
    CLIENTE: number;
    FORNECEDOR: number;
    PARCEIRO: number;
  };
}

export interface PersonFilters {
  entityType?: EntityType;
  active?: boolean;
  search?: string;
}

// Backward compatibility
export type PersonType = EntityType;
