'use client'

import { type Control, Controller } from 'react-hook-form'

import { PhoneInput } from '@/modules/person/components/PhoneInput'
import { type NewPersonFormData } from '@/modules/person/schemas/new-person.schema'
import { PhoneType } from '@/modules/person/types/person.types'
import type { CreatePhoneDto } from '@/modules/person/types/person.types'

interface PhonesSectionProps {
  control: Control<NewPersonFormData>
}

export const PhonesSection = ({ control }: PhonesSectionProps) => {
  const mapFormToCreate = (phones: any[] | undefined): CreatePhoneDto[] => {
    if (!phones) return []
    return phones.map((p, i) => ({
      number: p.number || '',
      type: p?.type || PhoneType.MOBILE,
      isPrimary: !!p.isPrimary || i === 0,
      owner: p.owner || undefined,
    }))
  }

  const mapCreateToForm = (phones: CreatePhoneDto[] | undefined) => {
    if (!phones) return []
    return phones.map((p) => ({
      number: p.number || '',
      type: p?.type || PhoneType.MOBILE,
      isPrimary: !!p.isPrimary,
      owner: p.owner || undefined,
    }))
  }
  return (
    <div className="bg-gh-card border-gh-border rounded-md border p-6">
      <h3 className="text-gh-text mb-4 text-base font-semibold">Telefones</h3>

      <Controller
        name="phones"
        control={control}
        render={({ field }) => (
          <PhoneInput
            phones={mapFormToCreate(field.value)}
            onChange={(next) => field.onChange(mapCreateToForm(next))}
          />
        )}
      />
    </div>
  )
}
