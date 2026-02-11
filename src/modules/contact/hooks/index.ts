import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contactAPI } from "@/lib/api";
import {
  Contact,
  ContactListResponse,
  CreateContactDTO,
  UpdateContactDTO,
  CreateContactPhoneDTO,
  UpdateContactPhoneDTO,
  CreateClientRoleDTO,
  UpdateClientRoleDTO,
  CreateSupplierRoleDTO,
  UpdateSupplierRoleDTO,
  CreatePartnerRoleDTO,
  UpdatePartnerRoleDTO,
} from "../types";

// ============================================================================
// CONTACT CRUD HOOKS
// ============================================================================

export const useContact = (workspaceId: string, contactId: string) => {
  return useQuery({
    queryKey: ["contacts", workspaceId, contactId],
    queryFn: async () => {
      const response = await contactAPI.getContact(workspaceId, contactId);
      return response.data as Contact;
    },
    enabled: !!workspaceId && !!contactId,
  });
};

export const useContacts = (
  workspaceId: string,
  roleType?: string,
  active?: string,
) => {
  return useQuery({
    queryKey: ["contacts", workspaceId, roleType, active],
    queryFn: async () => {
      const response = await contactAPI.listContacts(
        workspaceId,
        roleType,
        active,
      );
      return response.data as ContactListResponse;
    },
    enabled: !!workspaceId,
  });
};

export const useCreateContact = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContactDTO) =>
      contactAPI.createContact(workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contacts", workspaceId],
      });
    },
  });
};

export const useUpdateContact = (workspaceId: string, contactId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateContactDTO) =>
      contactAPI.updateContact(workspaceId, contactId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contacts", workspaceId, contactId],
      });
      queryClient.invalidateQueries({
        queryKey: ["contacts", workspaceId],
      });
    },
  });
};

export const useDeleteContact = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactId: string) =>
      contactAPI.deleteContact(workspaceId, contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contacts", workspaceId],
      });
    },
  });
};

export const useRestoreContact = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactId: string) =>
      contactAPI.restoreContact(workspaceId, contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contacts", workspaceId],
      });
    },
  });
};

export const useHardDeleteContact = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactId: string) =>
      contactAPI.hardDeleteContact(workspaceId, contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contacts", workspaceId],
      });
    },
  });
};

// ============================================================================
// PHONE MANAGEMENT HOOKS
// ============================================================================

export const useContactPhones = (workspaceId: string, contactId: string) => {
  return useQuery({
    queryKey: ["contact-phones", workspaceId, contactId],
    queryFn: async () => {
      const response = await contactAPI.getContact(workspaceId, contactId);
      return response.data.phones || [];
    },
    enabled: !!workspaceId && !!contactId,
  });
};

export const useAddPhone = (workspaceId: string, contactId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContactPhoneDTO) =>
      contactAPI.addPhone(workspaceId, contactId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contacts", workspaceId, contactId],
      });
      queryClient.invalidateQueries({
        queryKey: ["contact-phones", workspaceId, contactId],
      });
    },
  });
};

export const useUpdatePhone = (
  workspaceId: string,
  contactId: string,
  phoneId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateContactPhoneDTO) =>
      contactAPI.updatePhone(workspaceId, contactId, phoneId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contacts", workspaceId, contactId],
      });
      queryClient.invalidateQueries({
        queryKey: ["contact-phones", workspaceId, contactId],
      });
    },
  });
};

export const useDeletePhone = (workspaceId: string, contactId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (phoneId: string) =>
      contactAPI.deletePhone(workspaceId, contactId, phoneId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contacts", workspaceId, contactId],
      });
      queryClient.invalidateQueries({
        queryKey: ["contact-phones", workspaceId, contactId],
      });
    },
  });
};

// ============================================================================
// CLIENT ROLE HOOKS
// ============================================================================

export const useAddClientRole = (workspaceId: string, contactId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClientRoleDTO) =>
      contactAPI.addClientRole(workspaceId, contactId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contacts", workspaceId, contactId],
      });
      queryClient.invalidateQueries({
        queryKey: ["contacts", workspaceId],
      });
    },
  });
};

export const useUpdateClientRole = (workspaceId: string, contactId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateClientRoleDTO) =>
      contactAPI.updateClientRole(workspaceId, contactId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contacts", workspaceId, contactId],
      });
      queryClient.invalidateQueries({
        queryKey: ["contacts", workspaceId],
      });
    },
  });
};

export const useRemoveClientRole = (workspaceId: string, contactId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => contactAPI.removeClientRole(workspaceId, contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contacts", workspaceId, contactId],
      });
      queryClient.invalidateQueries({
        queryKey: ["contacts", workspaceId],
      });
    },
  });
};

// ============================================================================
// SUPPLIER ROLE HOOKS
// ============================================================================

export const useAddSupplierRole = (workspaceId: string, contactId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSupplierRoleDTO) =>
      contactAPI.addSupplierRole(workspaceId, contactId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contacts", workspaceId, contactId],
      });
      queryClient.invalidateQueries({
        queryKey: ["contacts", workspaceId],
      });
    },
  });
};

export const useUpdateSupplierRole = (
  workspaceId: string,
  contactId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSupplierRoleDTO) =>
      contactAPI.updateSupplierRole(workspaceId, contactId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contacts", workspaceId, contactId],
      });
      queryClient.invalidateQueries({
        queryKey: ["contacts", workspaceId],
      });
    },
  });
};

export const useRemoveSupplierRole = (
  workspaceId: string,
  contactId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => contactAPI.removeSupplierRole(workspaceId, contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contacts", workspaceId, contactId],
      });
      queryClient.invalidateQueries({
        queryKey: ["contacts", workspaceId],
      });
    },
  });
};

// ============================================================================
// PARTNER ROLE HOOKS
// ============================================================================

export const useAddPartnerRole = (workspaceId: string, contactId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePartnerRoleDTO) =>
      contactAPI.addPartnerRole(workspaceId, contactId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contacts", workspaceId, contactId],
      });
      queryClient.invalidateQueries({
        queryKey: ["contacts", workspaceId],
      });
    },
  });
};

export const useUpdatePartnerRole = (
  workspaceId: string,
  contactId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePartnerRoleDTO) =>
      contactAPI.updatePartnerRole(workspaceId, contactId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contacts", workspaceId, contactId],
      });
      queryClient.invalidateQueries({
        queryKey: ["contacts", workspaceId],
      });
    },
  });
};

export const useRemovePartnerRole = (
  workspaceId: string,
  contactId: string,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => contactAPI.removePartnerRole(workspaceId, contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contacts", workspaceId, contactId],
      });
      queryClient.invalidateQueries({
        queryKey: ["contacts", workspaceId],
      });
    },
  });
};
