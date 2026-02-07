"use client";

import React from "react";
import Link from "next/link";
import type { Person } from "@/modules/person/types/person.types";
import { formatDocumentWithType } from "@/lib/masks";

interface PersonViewSectionProps {
  person: Person;
  onEdit: () => void;
}

export function PersonViewSection({ person, onEdit }: PersonViewSectionProps) {
  const { formatted: formattedDocument, type: documentType } =
    formatDocumentWithType(person.document || "");

  return (
    <div className="bg-gh-card border border-gh-border rounded-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gh-border flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gh-text">
          Informações da Pessoa
        </h3>
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-gh-hover text-white text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
        >
          Editar
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Informações Básicas */}
        <div>
          <h4 className="text-base font-semibold text-gh-text mb-4">
            Informações Básicas
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gh-text-secondary mb-1">Nome</p>
              <p className="text-gh-text font-medium">{person.name}</p>
            </div>
            <div>
              <p className="text-sm text-gh-text-secondary mb-1">Email</p>
              <p className="text-gh-text font-medium">{person.email || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gh-text-secondary mb-1">
                {documentType ? `${documentType.toUpperCase()}` : ""}
              </p>
              <p className="text-gh-text font-medium">{formattedDocument}</p>
            </div>
            <div>
              <p className="text-sm text-gh-text-secondary mb-1">Website</p>
              <p className="text-gh-text font-medium">
                <Link
                  className="text-blue-600 hover:underline truncate block"
                  href={person.website || "#"}
                  target="_blank"
                  title={person.website || ""}
                >
                  {person.website || "-"}
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Telefones */}
        {person.phones && person.phones.length > 0 && (
          <div>
            <h4 className="text-base font-semibold text-gh-text mb-4">
              Telefones
            </h4>
            <div className="space-y-2">
              {person.phones.map((phone, idx) => (
                <div key={idx} className="text-gh-text">
                  {phone.number}
                  {phone.type && (
                    <span className="text-gh-text-secondary text-sm ml-2">
                      ({phone.type})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Endereço */}
        {(person.address || person.city || person.state) && (
          <div>
            <h4 className="text-base font-semibold text-gh-text mb-4">
              Endereço
            </h4>
            <div className="space-y-2 text-gh-text">
              {person.address && <p>{person.address}</p>}
              {(person.city || person.state) && (
                <p>
                  {person.city}
                  {person.state && `, ${person.state}`}
                </p>
              )}
              {person.country && <p>{person.country}</p>}
              {person.postalCode && <p>{person.postalCode}</p>}
            </div>
          </div>
        )}

        {/* Notas */}
        {person.notes && (
          <div>
            <h4 className="text-base font-semibold text-gh-text mb-4">Notas</h4>
            <p className="text-gh-text whitespace-pre-wrap">{person.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
