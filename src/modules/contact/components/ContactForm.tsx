"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Contact,
  ContactType,
  CreateContactDTO,
  UpdateContactDTO,
} from "../types";
import { useUpdateContact, useCreateContact } from "../hooks";

const contactSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  type: z.enum(["PF", "PJ"]),
  document: z.string().min(11, "Documento inválido"),
  email: z.string().email("Email inválido"),
  website: z.string().optional(),
  address: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  workspaceId: string;
  contact?: Contact;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function ContactForm({
  workspaceId,
  contact,
  onSuccess,
  onError,
}: ContactFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: contact
      ? {
          name: contact.name,
          type: contact.type,
          document: contact.document,
          email: contact.email,
          website: contact.website,
          address: contact.address,
        }
      : undefined,
  });

  const createMutation = useCreateContact(workspaceId);
  const updateMutation = useUpdateContact(workspaceId, contact?.id || "");

  const onSubmit = async (data: ContactFormData) => {
    try {
      if (contact) {
        const updateData: UpdateContactDTO = {
          name: data.name,
          email: data.email,
          website: data.website,
          address: data.address,
        };
        await updateMutation.mutateAsync(updateData);
      } else {
        const createData: CreateContactDTO = {
          name: data.name,
          type: data.type as ContactType,
          document: data.document,
          email: data.email,
          website: data.website,
          address: data.address,
        };
        await createMutation.mutateAsync(createData);
      }
      onSuccess?.();
    } catch (error) {
      onError?.(error as Error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white">
          Nome
        </label>
        <input
          {...register("name")}
          type="text"
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          placeholder="Nome do contato"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Type and Document */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white">
            Tipo
          </label>
          <select
            {...register("type")}
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            disabled={!!contact}
          >
            <option value="PF">Pessoa Física</option>
            <option value="PJ">Pessoa Jurídica</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 dark:text-white">
            Documento
          </label>
          <input
            {...register("document")}
            type="text"
            className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            placeholder="CPF ou CNPJ"
            disabled={!!contact}
          />
          {errors.document && (
            <p className="mt-1 text-sm text-red-600">
              {errors.document.message}
            </p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white">
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          placeholder="email@example.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Website */}
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white">
          Website
        </label>
        <input
          {...register("website")}
          type="url"
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          placeholder="https://example.com"
        />
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white">
          Endereço
        </label>
        <textarea
          {...register("address")}
          className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          placeholder="Endereço completo"
          rows={3}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isLoading ? "Salvando..." : contact ? "Atualizar" : "Criar"}
      </button>
    </form>
  );
}
