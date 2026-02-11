'use client'

import * as React from 'react'

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

interface SwitchGroupCardProps {
  value: boolean
  onValueChange: (value: boolean) => void
  title: React.ReactNode
  description?: string
  disabled?: boolean
  className?: string
}

export function SwitchGroupCard({
  value,
  onValueChange,
  title,
  description,
  disabled = false,
  className,
}: SwitchGroupCardProps) {
  return (
    <FieldLabel className={cn('cursor-pointer', className)}>
      <Field orientation="horizontal">
        <div className="flex w-full items-start justify-between gap-4">
          <FieldContent>
            <FieldTitle>{title}</FieldTitle>
            {description && <FieldDescription>{description}</FieldDescription>}
          </FieldContent>
          <Switch
            checked={value}
            onCheckedChange={onValueChange}
            disabled={disabled}
            className="mt-1"
          />
        </div>
      </Field>
    </FieldLabel>
  )
}

interface SwitchGroupCardsProps {
  value: boolean
  onValueChange: (value: boolean) => void
  trueOption: {
    title: React.ReactNode
    description?: string
  }
  falseOption: {
    title: React.ReactNode
    description?: string
  }
  disabled?: boolean
  className?: string
}

export function SwitchGroupCards({
  value,
  onValueChange,
  trueOption,
  falseOption,
  disabled = false,
  className,
}: SwitchGroupCardsProps) {
  return (
    <div className={cn('space-y-3', className)}>
      <SwitchGroupCard
        value={value}
        onValueChange={onValueChange}
        title={trueOption.title}
        description={trueOption.description}
        disabled={disabled}
      />
      <SwitchGroupCard
        value={!value}
        onValueChange={(newValue) => onValueChange(!newValue)}
        title={falseOption.title}
        description={falseOption.description}
        disabled={disabled}
      />
    </div>
  )
}
