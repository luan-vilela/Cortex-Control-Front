"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const FormTextarea = React.forwardRef<
  HTMLTextAreaElement,
  FormTextareaProps
>(({ label, error, className, ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Textarea ref={ref} {...props} />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
});

FormTextarea.displayName = "FormTextarea";
