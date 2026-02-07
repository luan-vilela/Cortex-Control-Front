"use client";

import { Controller, Control } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { NewPersonFormData } from "@/modules/person/schemas/new-person.schema";
import { useCpfCnpj } from "@/modules/person/hooks/useCpfCnpj";

interface BasicInfoSectionProps {
  control: Control<NewPersonFormData>;
  errors: Record<string, any>;
}

export const BasicInfoSection = ({
  control,
  errors,
}: BasicInfoSectionProps) => {
  const { formatDocument } = useCpfCnpj();

  return (
    <div className="bg-gh-card p-4 sm:p-6 rounded-md border border-gh-border">
      <h3 className="text-sm sm:text-base font-semibold text-gh-text mb-4">
        Informações Básicas
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div className="md:col-span-2">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Nome completo *"
                type="text"
                placeholder="Ex: João da Silva"
                error={errors.name?.message}
              />
            )}
          />
        </div>

        <Controller
          name="document"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label="Documento (CPF/CNPJ)"
              type="text"
              placeholder="000.000.000-00"
              onChange={(e) => {
                const formatted = formatDocument(e.target.value);
                field.onChange(formatted);
              }}
              error={errors.document?.message}
            />
          )}
        />

        <div className="md:col-span-2">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label="Email"
                type="email"
                placeholder="email@exemplo.com"
                error={errors.email?.message}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};
