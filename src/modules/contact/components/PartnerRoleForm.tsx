"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PartnerStatus, PartnerRole } from "../types";
import { CreatePartnerRoleDTO } from "../types/dtos";
import { useAddPartnerRole, useUpdatePartnerRole } from "../hooks";
import { Handshake, Save } from "lucide-react";

const partnerRoleSchema = z.object({
  status: z.nativeEnum(PartnerStatus),
  commissionPercentage: z.number().min(0).max(100).optional(),
  description: z.string().optional(),
});

type PartnerRoleFormData = z.infer<typeof partnerRoleSchema>;

interface PartnerRoleFormProps {
  workspaceId: string;
  contactId: string;
  role?: PartnerRole;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function PartnerRoleForm({
  workspaceId,
  contactId,
  role,
  onSuccess,
  onError,
}: PartnerRoleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PartnerRoleFormData>({
    resolver: zodResolver(partnerRoleSchema),
    defaultValues: role
      ? {
          status: role.status,
          commissionPercentage: role.commissionPercentage,
          description: role.description,
        }
      : { status: PartnerStatus.PROSPECT },
  });

  const addMutation = useAddPartnerRole(workspaceId, contactId);
  const updateMutation = useUpdatePartnerRole(workspaceId, contactId);

  const onSubmit = async (data: PartnerRoleFormData) => {
    try {
      const dtoData: any = {
        status: data.status,
        commissionPercentage: data.commissionPercentage,
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
      className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200"
    >
      <h3 className="font-semibold text-purple-900 flex items-center gap-2">
        <Handshake size={16} />
        Papel de Parceiro
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          {...register("status")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
        >
          {Object.values(PartnerStatus).map((status) => (
            <option key={status} value={status}>
              {status === PartnerStatus.PROSPECT
                ? "Prospecto"
                : status === PartnerStatus.ACTIVE
                  ? "Ativo"
                  : "Inativo"}
            </option>
          ))}
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Comissão (%)
        </label>
        <input
          type="number"
          {...register("commissionPercentage", { valueAsNumber: true })}
          placeholder="10"
          step="0.01"
          min="0"
          max="100"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
        />
        {errors.commissionPercentage && (
          <p className="mt-1 text-sm text-red-600">
            {errors.commissionPercentage.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          {...register("description")}
          placeholder="Notas sobre este parceiro"
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
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
        className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
      >
        <Save size={16} />
        {role ? "Atualizar" : "Adicionar"} Papel
      </button>
    </form>
  );
}
