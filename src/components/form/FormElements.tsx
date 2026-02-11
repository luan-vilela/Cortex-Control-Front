"use client";

import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  error,
  required,
  hint,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

interface FormInputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export const FormInputField = React.forwardRef<
  HTMLInputElement,
  FormInputFieldProps
>(({ label, error, hint, required, ...props }, ref) => (
  <FormField label={label} error={error} hint={hint} required={required}>
    <Input
      ref={ref}
      className={cn(
        error && "border-destructive focus-visible:ring-destructive",
      )}
      {...props}
    />
  </FormField>
));

FormInputField.displayName = "FormInputField";

interface FormSelectFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  options: { value: string; label: string }[];
  value?: string;
  onValueChange?: (value: string) => void;
}

export function FormSelectField({
  label,
  error,
  hint,
  required,
  options,
  value,
  onValueChange,
}: FormSelectFieldProps) {
  return (
    <FormField label={label} error={error} hint={hint} required={required}>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          className={cn(
            error && "border-destructive focus-visible:ring-destructive",
          )}
        >
          <SelectValue placeholder="Selecione..." />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}

interface FormContainerProps {
  title?: string;
  description?: string;
  onSubmit: SubmitHandler<any>;
  children: React.ReactNode;
  isLoading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
}

export function FormContainer({
  title,
  description,
  onSubmit,
  children,
  isLoading = false,
  submitLabel = "Salvar",
  cancelLabel = "Cancelar",
  onCancel,
}: FormContainerProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      {title && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {children}

        <div className="flex gap-3 pt-6 border-t border-border">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} disabled={isLoading}>
              {cancelLabel}
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Processando..." : submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}

interface InlineFormProps {
  onSubmit: SubmitHandler<any>;
  children: React.ReactNode;
  isLoading?: boolean;
}

export function InlineForm({
  onSubmit,
  children,
  isLoading = false,
}: InlineFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {children}
      <Button type="submit" disabled={isLoading} size="sm">
        {isLoading ? "Processando..." : "Salvar"}
      </Button>
    </form>
  );
}
