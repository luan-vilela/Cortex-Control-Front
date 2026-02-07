"use client";

import { Controller, Control } from "react-hook-form";
import { FormInput } from "@/components/FormInput";
import { FormTextarea } from "@/components/FormTextarea";
import { NewPersonFormData } from "@/modules/person/schemas/new-person.schema";

interface AdditionalInfoSectionProps {
  control: Control<NewPersonFormData>;
  errors: Record<string, any>;
}

export const AdditionalInfoSection = ({
  control,
  errors,
}: AdditionalInfoSectionProps) => {
  return (
    <>
      <div className="bg-gh-card p-4 sm:p-6 rounded-md border border-gh-border">
        <h3 className="text-sm sm:text-base font-semibold text-gh-text mb-4">
          Website
        </h3>

        <Controller
          name="website"
          control={control}
          render={({ field }) => (
            <FormInput
              {...field}
              label="Website"
              type="url"
              placeholder="https://exemplo.com"
              error={errors.website?.message}
            />
          )}
        />
      </div>

      <div className="bg-gh-card p-4 sm:p-6 rounded-md border border-gh-border">
        <h3 className="text-sm sm:text-base font-semibold text-gh-text mb-4">
          Observações
        </h3>

        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <FormTextarea
              {...field}
              label="Observações"
              rows={4}
              placeholder="Notas, comentários ou informações adicionais..."
              error={errors.notes?.message}
            />
          )}
        />
      </div>
    </>
  );
};
