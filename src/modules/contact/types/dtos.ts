// Request DTOs for creating roles
export interface CreateClientRoleDTO {
  status: string;
  creditLimit?: number;
  description?: string;
}

export interface CreateSupplierRoleDTO {
  status: string;
  paymentTerms?: string;
  description?: string;
}

export interface CreatePartnerRoleDTO {
  status: string;
  commissionPercentage?: number;
  description?: string;
}

// Update DTOs
export interface UpdateClientRoleDTO extends CreateClientRoleDTO {}

export interface UpdateSupplierRoleDTO extends CreateSupplierRoleDTO {}

export interface UpdatePartnerRoleDTO extends CreatePartnerRoleDTO {}
