"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ClientStatus, ClientRole } from "../types";
import { CreateClientRoleDTO } from "../types/dtos";
import { useAddClientRole, useUpdateClientRole } from "../hooks";
import { Users, Save } from "lucide-react";

const clientRoleSchema = z.object({
  status: z.nativeEnum(ClientStatus),
  creditLimit: z.number().min(0).optional(),
  description: z.string().optional(),
});

type ClientRoleFormData = z.infer<typeof clientRoleSchema>;

interface ClientRoleFormProps {
  workspaceId: string;
  contactId: string;
  role?: ClientRole;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function ClientRoleForm({
  workspaceId,
  contactId,
  role,
  onSuccess,
  onError,
}: ClientRoleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientRoleFormData>({
    resolver: zodResolver(clientRoleSchema),
    defaultValues: role
      ? {
          status: role.status,
          creditLimit: role.creditLimit,
          description: role.description,
        }
      : { status: ClientStatus.PROSPECT },
  });

  const addMutation = useAddClientRole(workspaceId, contactId);
  const updateMutation = useUpdateClientRole(workspaceId, contactId);

  const onSubmit = async (data: ClientRoleFormData) => {
    try {
      const dtoData: any = {
        status: data.status,
        creditLimit: data.creditLimit,
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
      className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
    >
      <h3 className="font-semibold text-blue-900 flex items-center gap-2">
        <Users size={16} />
        Papel de Cliente
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          {...register("status")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          {Object.values(ClientStatus).map((status) => (
            <option key={status} value={status}>
              {status === ClientStatus.PROSPECT
                ? "Prospecto"
                : status === ClientStatus.ACTIVE
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
          Limite de Crédito
        </label>
        <input
          type="number"
          {...register("creditLimit", { valueAsNumber: true })}
          placeholder="0.00"
          step="0.01"
          min="0"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.creditLimit && (
          <p className="mt-1 text-sm text-red-600">
            {errors.creditLimit.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          {...register("description")}
          placeholder="Notas sobre este cliente"
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        <Save size={16} />
        {role ? "Atualizar" : "Adicionar"} Papel
      </button>
    </form>
  );
}
