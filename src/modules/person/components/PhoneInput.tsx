'use client'

import { type CreatePhoneDto, PhoneType } from '../types/person.types'

import React from 'react'

import { X } from 'lucide-react'

import { Input } from '@/components/ui/input'

const phoneTypeLabels: Record<PhoneType, string> = {
  [PhoneType.MOBILE]: 'Celular',
  [PhoneType.LANDLINE]: 'Fixo',
  [PhoneType.FAX]: 'Fax',
  [PhoneType.WHATSAPP]: 'WhatsApp',
  [PhoneType.COMMERCIAL]: 'Comercial',
}

interface PhoneInputProps {
  phones: CreatePhoneDto[]
  onChange: (phones: CreatePhoneDto[]) => void
  //Show nome do proprietário do telefone
  showOwnerField?: boolean
}

export function PhoneInput({ phones, onChange, showOwnerField = false }: PhoneInputProps) {
  const addPhone = () => {
    onChange([
      ...phones,
      {
        number: '',
        type: PhoneType.MOBILE,
        isPrimary: phones.length === 0,
      },
    ])
  }

  const removePhone = (index: number) => {
    const newPhones = phones.filter((_, i) => i !== index)
    // Se remover o telefone principal e ainda houver outros, marcar o primeiro como principal
    if (phones[index].isPrimary && newPhones.length > 0 && !newPhones.some((p) => p.isPrimary)) {
      newPhones[0].isPrimary = true
    }
    onChange(newPhones)
  }

  const updatePhone = (index: number, field: keyof CreatePhoneDto, value: any) => {
    const newPhones = [...phones]

    // Se marcar como principal, desmarcar os outros
    if (field === 'isPrimary' && value === true) {
      newPhones.forEach((p, i) => {
        if (i !== index) p.isPrimary = false
      })
    }

    newPhones[index] = { ...newPhones[index], [field]: value }
    onChange(newPhones)
  }

  return (
    <div className="space-y-3">
      {phones.length === 0 ? (
        <button
          type="button"
          onClick={addPhone}
          className="border-gh-border text-gh-text-secondary hover:border-gh-hover hover:text-gh-hover w-full rounded-md border-2 border-dashed p-4 transition-colors"
        >
          + Adicionar telefone
        </button>
      ) : (
        <div className="space-y-3">
          {phones.map((phone, index) => (
            <div
              key={index}
              className="bg-gh-bg border-gh-border flex items-center gap-3 rounded-md border p-4"
            >
              <input
                type="checkbox"
                checked={phone.isPrimary}
                onChange={(e) => updatePhone(index, 'isPrimary', e.target.checked)}
                className="border-gh-border text-gh-hover focus:ring-gh-hover flex-shrink-0 rounded"
              />

              <select
                value={phone.type}
                onChange={(e) => updatePhone(index, 'type', e.target.value as PhoneType)}
                className="border-gh-border bg-gh-bg text-gh-text focus:ring-gh-hover min-w-max rounded-md border px-3 py-2 focus:border-transparent focus:ring-2"
              >
                {Object.entries(phoneTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>

              <Input
                type="text"
                value={phone.number}
                onChange={(e) => updatePhone(index, 'number', e.target.value)}
                placeholder="(00) 00000-0000"
                className="flex-1"
              />
              {showOwnerField && (
                <Input
                  type="text"
                  value={phone.owner || ''}
                  onChange={(e) => updatePhone(index, 'owner', e.target.value)}
                  placeholder="Quem atende / proprietário"
                  className="ml-2 w-56"
                />
              )}

              <button
                type="button"
                onClick={() => removePhone(index)}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-red-600 transition-colors hover:bg-red-50"
                title="Remover telefone"
              >
                <X size={18} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addPhone}
            className="border-gh-border text-gh-text-secondary hover:border-gh-hover hover:text-gh-hover w-full rounded-md border-2 border-dashed p-4 transition-colors"
          >
            + Adicionar telefone
          </button>
        </div>
      )}
    </div>
  )
}
