export enum PersonType {
  LEAD = "lead",
  CUSTOMER = "customer",
  COMPANY = "company",
  SUPPLIER = "supplier",
}

export enum PhoneType {
  MOBILE = "mobile",
  LANDLINE = "landline",
  FAX = "fax",
  WHATSAPP = "whatsapp",
  COMMERCIAL = "commercial",
}

export interface Phone {
  id: string;
  number: string;
  type: PhoneType;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Person {
  id: string;
  name: string;
  email: string | null;
  document: string | null;
  type: PersonType;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  notes: string | null;
  workspaceId: string;
  phones: Phone[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePhoneDto {
  number: string;
  type?: PhoneType;
  isPrimary?: boolean;
}

export interface CreatePersonDto {
  name: string;
  email?: string;
  document?: string;
  type?: PersonType;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
  phones?: CreatePhoneDto[];
}

export interface UpdatePersonDto {
  name?: string;
  email?: string;
  document?: string;
  type?: PersonType;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
  phones?: CreatePhoneDto[];
  active?: boolean;
}

export interface PersonStats {
  total: number;
  active: number;
  inactive: number;
  byType: {
    [key in PersonType]?: number;
  };
}

export interface PersonFilters {
  type?: PersonType;
  active?: boolean;
  search?: string;
}
