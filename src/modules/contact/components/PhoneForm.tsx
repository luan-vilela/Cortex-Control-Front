"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PhoneType } from "../types";
import { useAddPhone, useUpdatePhone } from "../hooks";
import { Phone as PhoneIcon, X } from "lucide-react";

const phoneSchema = z.object({
  number: z
    .string()
    .min(10, "Telefone deve ter pelo menos 10 dígitos")
    .regex(/^\d+$/, "Telefone deve conter apenas números"),
  type: z.nativeEnum(PhoneType),
  primary: z.boolean().optional(),
});

type PhoneFormData = z.infer<typeof phoneSchema>;

interface PhoneFormProps {
  workspaceId: string;
  contactId: string;
  phone?: {
    id: string;
    number: string;
    type: PhoneType;
  };
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function PhoneForm({
  workspaceId,
  contactId,
  phone,
  onSuccess,
  onError,
}: PhoneFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: phone
      ? {
          number: phone.number,
          type: phone.type,
        }
      : undefined,
  });

  const addMutation = useAddPhone(workspaceId, contactId);
  const updateMutation = useUpdatePhone(
    workspaceId,
    contactId,
    phone?.id || "",
  );

  const onSubmit = async (data: PhoneFormData) => {
    try {
      const submitData: any = {
        number: data.number,
        type: data.type,
        primary: data.primary ?? false,
      };
      if (phone) {
        await updateMutation.mutateAsync(submitData);
      } else {
        await addMutation.mutateAsync(submitData);
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
      className="space-y-4 p-4 bg-gray-50 rounded-lg"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Número
        </label>
        <input
          type="text"
          {...register("number")}
          placeholder="11999999999"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.number && (
          <p className="mt-1 text-sm text-red-600">{errors.number.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Tipo</label>
        <select
          {...register("type")}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Selecione um tipo</option>
          {Object.values(PhoneType).map((type) => (
            <option key={type} value={type}>
              {type === PhoneType.WHATSAPP
                ? "WhatsApp"
                : type === PhoneType.COMMERCIAL
                  ? "Comercial"
                  : "Pessoal"}
            </option>
          ))}
        </select>
        {errors.type && (
          <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="primary"
          {...register("primary")}
          className="w-4 h-4 border border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="primary" className="text-sm font-medium text-gray-700">
          Telefone principal
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        <PhoneIcon size={16} />
        {phone ? "Atualizar" : "Adicionar"} Telefone
      </button>
    </form>
  );
}
