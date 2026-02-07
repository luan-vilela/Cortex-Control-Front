"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { PhoneType } from "@/modules/person/types/person.types";
import { PhoneInput } from "./PhoneInput";
import type { Person } from "@/modules/person/types/person.types";

export const personFormSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z
    .string()
    .email("Email inválido")
    .or(z.literal(""))
    .optional()
    .default(""),
  document: z.string().optional().default(""),
  website: z
    .string()
    .url("URL inválida")
    .or(z.literal(""))
    .optional()
    .default(""),
  address: z.string().optional().default(""),
  city: z.string().optional().default(""),
  state: z.string().optional().default(""),
  country: z.string().default("Brasil"),
  postalCode: z.string().optional().default(""),
  notes: z.string().optional().default(""),
  phones: z
    .array(
      z.object({
        number: z.string(),
        type: z.nativeEnum(PhoneType).optional(),
      }),
    )
    .optional()
    .default([]),
  active: z.boolean().default(true),
});

export type PersonFormData = z.infer<typeof personFormSchema>;

interface PersonEditFormProps {
  person: Person;
  onSubmit: (data: PersonFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PersonEditForm({
  person,
  onSubmit,
  onCancel,
  isLoading = false,
}: PersonEditFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<PersonFormData>({
    resolver: zodResolver(personFormSchema) as any,
    defaultValues: {
      name: person.name,
      email: person.email || "",
      document: person.document || "",
      website: person.website || "",
      address: person.address || "",
      city: person.city || "",
      state: person.state || "",
      country: person.country || "Brasil",
      postalCode: person.postalCode || "",
      notes: person.notes || "",
      phones: person.phones || [],
      active: person.active,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Informações Básicas */}
      <div className="bg-gh-card p-6 rounded-md border border-gh-border">
        <h3 className="text-base font-semibold text-gh-text mb-4">
          Informações Básicas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gh-text mb-1">
              Nome completo *
            </label>
            <input
              type="text"
              {...register("name")}
              className={`w-full px-3 py-2 border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover ${
                errors.name ? "border-red-200" : "border-gh-border"
              }`}
              placeholder="Ex: João da Silva"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gh-text mb-1">
              Documento (CPF/CNPJ)
            </label>
            <input
              type="text"
              {...register("document")}
              className={`w-full px-3 py-2 border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover ${
                errors.document ? "border-red-200" : "border-gh-border"
              }`}
              placeholder="000.000.000-00"
            />
            {errors.document && (
              <p className="text-red-500 text-sm mt-1">
                {errors.document.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gh-text mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className={`w-full px-3 py-2 border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover ${
                errors.email ? "border-red-200" : "border-gh-border"
              }`}
              placeholder="email@exemplo.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gh-text mb-1">
              Website
            </label>
            <input
              type="url"
              {...register("website")}
              className={`w-full px-3 py-2 border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover ${
                errors.website ? "border-red-200" : "border-gh-border"
              }`}
              placeholder="https://exemplo.com"
            />
            {errors.website && (
              <p className="text-red-500 text-sm mt-1">
                {errors.website.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Telefones */}
      <div className="bg-gh-card p-6 rounded-md border border-gh-border">
        <h3 className="text-base font-semibold text-gh-text mb-4">Telefones</h3>
        <PhoneInput
          phones={watch("phones") || []}
          onChange={(phones) => setValue("phones", phones)}
        />
      </div>

      {/* Endereço */}
      <div className="bg-gh-card p-6 rounded-md border border-gh-border">
        <h3 className="text-base font-semibold text-gh-text mb-4">Endereço</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gh-text mb-1">
              Endereço
            </label>
            <input
              type="text"
              placeholder="Rua, número, complemento"
              {...register("address")}
              className={`w-full px-3 py-2 border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover ${
                errors.address ? "border-red-200" : "border-gh-border"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gh-text mb-1">
              Cidade
            </label>
            <input
              type="text"
              placeholder="Cidade"
              {...register("city")}
              className={`w-full px-3 py-2 border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover ${
                errors.city ? "border-red-200" : "border-gh-border"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gh-text mb-1">
              Estado
            </label>
            <input
              type="text"
              placeholder="Estado"
              {...register("state")}
              className={`w-full px-3 py-2 border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover ${
                errors.state ? "border-red-200" : "border-gh-border"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gh-text mb-1">
              CEP
            </label>
            <input
              type="text"
              placeholder="CEP"
              {...register("postalCode")}
              className={`w-full px-3 py-2 border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover ${
                errors.postalCode ? "border-red-200" : "border-gh-border"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gh-text mb-1">
              País
            </label>
            <input
              type="text"
              placeholder="País"
              {...register("country")}
              className={`w-full px-3 py-2 border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover ${
                errors.country ? "border-red-200" : "border-gh-border"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Notas */}
      <div className="bg-gh-card p-6 rounded-md border border-gh-border">
        <h3 className="text-base font-semibold text-gh-text mb-4">Notas</h3>
        <textarea
          placeholder="Adicione notas sobre esta pessoa..."
          {...register("notes")}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-gh-hover ${
            errors.notes ? "border-red-200" : "border-gh-border"
          }`}
        />
        {errors.notes && (
          <p className="text-red-500 text-sm mt-1">{errors.notes.message}</p>
        )}
      </div>

      {/* Botões de ação */}
      <div className="bg-gh-card p-6 rounded-md border border-gh-border flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="px-4 py-2 bg-gh-hover text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSubmitting || isLoading ? (
            <>
              <Loader2 className="w-4 h-4 inline animate-spin mr-2" />
            </>
          ) : null}
          Salvar Alterações
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gh-text border border-gh-border text-sm font-medium rounded-md hover:bg-gh-bg transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
