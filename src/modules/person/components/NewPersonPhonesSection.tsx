"use client";

import { Controller, Control } from "react-hook-form";
import { PhoneInput } from "@/modules/person/components/PhoneInput";
import { NewPersonFormData } from "@/modules/person/schemas/new-person.schema";

interface PhonesSectionProps {
  control: Control<NewPersonFormData>;
}

export const PhonesSection = ({ control }: PhonesSectionProps) => {
  return (
    <div className="bg-gh-card p-6 rounded-md border border-gh-border">
      <h3 className="text-base font-semibold text-gh-text mb-4">Telefones</h3>

      <Controller
        name="phones"
        control={control}
        render={({ field }) => (
          <PhoneInput phones={field.value || []} onChange={field.onChange} />
        )}
      />
    </div>
  );
};
