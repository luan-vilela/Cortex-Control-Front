"use client";

import React from "react";
import { X } from "lucide-react";
import { CreatePhoneDto, PhoneType } from "../types/person.types";
import { Input } from "@/components/ui/input";

const phoneTypeLabels: Record<PhoneType, string> = {
  [PhoneType.MOBILE]: "Celular",
  [PhoneType.LANDLINE]: "Fixo",
  [PhoneType.FAX]: "Fax",
  [PhoneType.WHATSAPP]: "WhatsApp",
  [PhoneType.COMMERCIAL]: "Comercial",
};

interface PhoneInputProps {
  phones: CreatePhoneDto[];
  onChange: (phones: CreatePhoneDto[]) => void;
}

export function PhoneInput({ phones, onChange }: PhoneInputProps) {
  const addPhone = () => {
    onChange([
      ...phones,
      {
        number: "",
        type: PhoneType.MOBILE,
        isPrimary: phones.length === 0,
      },
    ]);
  };

  const removePhone = (index: number) => {
    const newPhones = phones.filter((_, i) => i !== index);
    // Se remover o telefone principal e ainda houver outros, marcar o primeiro como principal
    if (
      phones[index].isPrimary &&
      newPhones.length > 0 &&
      !newPhones.some((p) => p.isPrimary)
    ) {
      newPhones[0].isPrimary = true;
    }
    onChange(newPhones);
  };

  const updatePhone = (
    index: number,
    field: keyof CreatePhoneDto,
    value: any,
  ) => {
    const newPhones = [...phones];

    // Se marcar como principal, desmarcar os outros
    if (field === "isPrimary" && value === true) {
      newPhones.forEach((p, i) => {
        if (i !== index) p.isPrimary = false;
      });
    }

    newPhones[index] = { ...newPhones[index], [field]: value };
    onChange(newPhones);
  };

  return (
    <div className="space-y-3">
      {phones.length === 0 ? (
        <button
          type="button"
          onClick={addPhone}
          className="w-full p-4 border-2 border-dashed border-gh-border rounded-md text-gh-text-secondary hover:border-gh-hover hover:text-gh-hover transition-colors"
        >
          + Adicionar telefone
        </button>
      ) : (
        <div className="space-y-3">
          {phones.map((phone, index) => (
            <div
              key={index}
              className="flex gap-3 items-center p-4 bg-gh-bg rounded-md border border-gh-border"
            >
              <input
                type="checkbox"
                checked={phone.isPrimary}
                onChange={(e) =>
                  updatePhone(index, "isPrimary", e.target.checked)
                }
                className="rounded border-gh-border text-gh-hover focus:ring-gh-hover flex-shrink-0"
              />

              <select
                value={phone.type}
                onChange={(e) =>
                  updatePhone(index, "type", e.target.value as PhoneType)
                }
                className="px-3 py-2 border border-gh-border rounded-md bg-gh-bg text-gh-text focus:ring-2 focus:ring-gh-hover focus:border-transparent min-w-max"
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
                onChange={(e) => updatePhone(index, "number", e.target.value)}
                placeholder="(00) 00000-0000"
                className="flex-1"
              />

              <button
                type="button"
                onClick={() => removePhone(index)}
                className="flex items-center justify-center w-8 h-8 text-red-600 hover:bg-red-50 rounded-md transition-colors flex-shrink-0"
                title="Remover telefone"
              >
                <X size={18} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addPhone}
            className="w-full p-4 border-2 border-dashed border-gh-border rounded-md text-gh-text-secondary hover:border-gh-hover hover:text-gh-hover transition-colors"
          >
            + Adicionar telefone
          </button>
        </div>
      )}
    </div>
  );
}
