"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && <Label>{label}</Label>}
        <Input ref={ref} {...props} />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  },
);

FormInput.displayName = "FormInput";
