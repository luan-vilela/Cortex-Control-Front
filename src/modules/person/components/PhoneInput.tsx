"use client";

import React from "react";
import { CreatePhoneDto, PhoneType } from "../types/person.types";

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
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Telefones
        </label>
        <button
          type="button"
          onClick={addPhone}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          + Adicionar telefone
        </button>
      </div>

      {phones.length === 0 ? (
        <p className="text-sm text-gray-500 italic">
          Nenhum telefone adicionado
        </p>
      ) : (
        <div className="space-y-2">
          {phones.map((phone, index) => (
            <div
              key={index}
              className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={phone.number}
                  onChange={(e) => updatePhone(index, "number", e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <div className="flex gap-2 items-center">
                  <select
                    value={phone.type}
                    onChange={(e) =>
                      updatePhone(index, "type", e.target.value as PhoneType)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.entries(phoneTypeLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={phone.isPrimary}
                      onChange={(e) =>
                        updatePhone(index, "isPrimary", e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    Principal
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removePhone(index)}
                className="mt-1 text-red-600 hover:text-red-800"
                title="Remover telefone"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
