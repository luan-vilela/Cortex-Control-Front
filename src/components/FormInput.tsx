'use client'

import React from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className={`space-y-2`}>
        {label && <Label>{label}</Label>}
        <Input
          ref={ref}
          className={`${error ? 'border-destructive' : ''} ${className || ''}`}
          {...props}
        />
        {error && <p className="text-destructive text-sm">{error}</p>}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'
