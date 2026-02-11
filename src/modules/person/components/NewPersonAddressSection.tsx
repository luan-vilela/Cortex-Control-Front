"use client";

import {
  Controller,
  Control,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { FormInput } from "@/components/FormInput";
import { NewPersonFormData } from "@/modules/person/schemas/new-person.schema";
import { useState } from "react";

interface AddressSectionProps {
  control: Control<NewPersonFormData>;
  errors: Record<string, any>;
  setValue: UseFormSetValue<NewPersonFormData>;
  formatCepInput: (value: string) => string;
  onCepBlur: (
    cepValue: string,
    setValue: UseFormSetValue<NewPersonFormData>,
  ) => Promise<void>;
}

export const AddressSection = ({
  control,
  errors,
  setValue,
  formatCepInput,
  onCepBlur,
}: AddressSectionProps) => {
  const [isCepLoading, setIsCepLoading] = useState(false);
  const postalCode = useWatch({ control, name: "postalCode" });

  const handleCepBlurInternal = async () => {
    setIsCepLoading(true);
    try {
      await onCepBlur(postalCode || "", setValue);
    } finally {
      setIsCepLoading(false);
    }
  };

  return (
    <div className="bg-gh-card p-4 sm:p-6 rounded-md border border-gh-border">
      <h3 className="text-sm sm:text-base font-semibold text-gh-text mb-4">
        Endereço
      </h3>

      <div className="space-y-3 sm:space-y-4">
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              label="Endereço"
              type="text"
              placeholder="Rua, Avenida, Travessa..."
              error={errors.address?.message}
            />
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <FormInput
                {...field}
                label="Cidade"
                type="text"
                placeholder="São Paulo"
                error={errors.city?.message}
              />
            )}
          />

          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <FormInput
                {...field}
                label="Estado (UF)"
                type="text"
                maxLength={2}
                placeholder="SP"
                error={errors.state?.message}
              />
            )}
          />

          <Controller
            name="postalCode"
            control={control}
            render={({ field }) => (
              <FormInput
                {...field}
                label="CEP"
                type="text"
                placeholder="00000-000"
                disabled={isCepLoading}
                error={errors.postalCode?.message}
                onChange={(e) => {
                  const formatted = formatCepInput(e.target.value);
                  field.onChange(formatted);
                }}
                onBlur={handleCepBlurInternal}
              />
            )}
          />
        </div>

        <Controller
          name="country"
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              label="País"
              type="text"
              placeholder="Brasil"
              error={errors.country?.message}
            />
          )}
        />
      </div>
    </div>
  );
};
