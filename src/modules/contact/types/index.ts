// Contact Types
export enum ContactType {
  PF = "PF",
  PJ = "PJ",
}

export enum ClientStatus {
  PROSPECT = "PROSPECT",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum SupplierStatus {
  PROSPECT = "PROSPECT",
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

export enum PartnerStatus {
  PROSPECT = "PROSPECT",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum PhoneType {
  WHATSAPP = "WHATSAPP",
  PERSONAL = "PERSONAL",
  COMMERCIAL = "COMMERCIAL",
}

// Contact Entity
export interface Contact {
  id: string;
  workspaceId: string;
  name: string;
  type: ContactType;
  document: string;
  email: string;
  website?: string;
  address?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  phones?: ContactPhone[];
  clientRole?: ClientRole;
  supplierRole?: SupplierRole;
  partnerRole?: PartnerRole;
}

// Contact Phone
export interface ContactPhone {
  id: string;
  contactId: string;
  number: string;
  type: PhoneType;
  primary: boolean;
  createdAt: string;
  updatedAt: string;
}

// Client Role
export interface ClientRole {
  id: string;
  contactId: string;
  status: ClientStatus;
  creditLimit: number;
  paymentTerms: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Supplier Role
export interface SupplierRole {
  id: string;
  contactId: string;
  status: SupplierStatus;
  paymentTerms: string;
  bankAccount?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Partner Role
export interface PartnerRole {
  id: string;
  contactId: string;
  status: PartnerStatus;
  commissionPercentage?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// DTOs
export interface CreateContactDTO {
  name: string;
  type: ContactType;
  document: string;
  email: string;
  website?: string;
  address?: string;
}

export interface UpdateContactDTO {
  name?: string;
  email?: string;
  website?: string;
  address?: string;
}

export interface CreateContactPhoneDTO {
  number: string;
  type: PhoneType;
  primary: boolean;
}

export interface UpdateContactPhoneDTO {
  number?: string;
  type?: PhoneType;
  primary?: boolean;
}

export interface CreateClientRoleDTO {
  status: ClientStatus;
  creditLimit: number;
  paymentTerms: string;
  description?: string;
}

export interface UpdateClientRoleDTO {
  status?: ClientStatus;
  creditLimit?: number;
  paymentTerms?: string;
  description?: string;
}

export interface CreateSupplierRoleDTO {
  status: SupplierStatus;
  paymentTerms: string;
  bankAccount?: string;
  description?: string;
}

export interface UpdateSupplierRoleDTO {
  status?: SupplierStatus;
  paymentTerms?: string;
  bankAccount?: string;
  description?: string;
}

export interface CreatePartnerRoleDTO {
  status: PartnerStatus;
  commissionPercentage?: number;
  description?: string;
}

export interface UpdatePartnerRoleDTO {
  status?: PartnerStatus;
  commissionPercentage?: number;
  description?: string;
}

// Query Responses
export interface ContactListResponse {
  data: Contact[];
  total: number;
  page: number;
  limit: number;
}
