"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SupplierStatus, SupplierRole } from "../types";
import { CreateSupplierRoleDTO } from "../types/dtos";
import { useAddSupplierRole, useUpdateSupplierRole } from "../hooks";
import { Truck, Save } from "lucide-react";

const supplierRoleSchema = z.object({
  status: z.nativeEnum(SupplierStatus),
  paymentTerms: z.string().optional(),
  description: z.string().optional(),
});

type SupplierRoleFormData = z.infer<typeof supplierRoleSchema>;

interface SupplierRoleFormProps {
  workspaceId: string;
  contactId: string;
  role?: SupplierRole;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function SupplierRoleForm({
  workspaceId,
  contactId,
  role,
  onSuccess,
  onError,
}: SupplierRoleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierRoleFormData>({
    resolver: zodResolver(supplierRoleSchema),
    defaultValues: role
      ? {
          status: role.status,
          paymentTerms: role.paymentTerms,
          description: role.description,
        }
      : { status: SupplierStatus.PROSPECT },
  });

  const addMutation = useAddSupplierRole(workspaceId, contactId);
  const updateMutation = useUpdateSupplierRole(workspaceId, contactId);

  const onSubmit = async (data: SupplierRoleFormData) => {
    try {
      const dtoData: any = {
        status: data.status,
        paymentTerms: data.paymentTerms,
        description: data.description,
      };
      if (role) {
        await updateMutation.mutateAsync(dtoData);
      } else {
        await addMutation.mutateAsync(dtoData);
      }
      onSuccess?.();
    } catch (error) {
      onError?.(error as Error);
    }
  };

  const isLoading = addMutation.isPending || updateMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4 bg-amber-50 rounded-lg border border-amber-200"
    >
      <h3 className="font-semibold text-amber-900 flex items-center gap-2">
        <Truck size={16} />
        Papel de Fornecedor
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          {...register("status")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
        >
          {Object.values(SupplierStatus).map((status) => (
            <option key={status} value={status}>
              {status === SupplierStatus.PROSPECT
                ? "Prospecto"
                : status === SupplierStatus.ACTIVE
                  ? "Ativo"
                  : "Bloqueado"}
            </option>
          ))}
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Prazo de Pagamento
        </label>
        <input
          type="text"
          {...register("paymentTerms")}
          placeholder="30 dias"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
        />
        {errors.paymentTerms && (
          <p className="mt-1 text-sm text-red-600">
            {errors.paymentTerms.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          {...register("description")}
          placeholder="Notas sobre este fornecedor"
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 disabled:opacity-50"
      >
        <Save size={16} />
        {role ? "Atualizar" : "Adicionar"} Papel
      </button>
    </form>
  );
}
