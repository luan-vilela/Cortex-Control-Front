import React from "react";
import { Person, PersonType, PhoneType } from "../types/person.types";
import { Mail, Phone, MapPin, FileText } from "lucide-react";

const personTypeLabels: Record<PersonType, string> = {
  [PersonType.LEAD]: "Lead",
  [PersonType.CUSTOMER]: "Cliente",
  [PersonType.COMPANY]: "Empresa",
  [PersonType.SUPPLIER]: "Fornecedor",
};

const personTypeColors: Record<PersonType, string> = {
  [PersonType.LEAD]: "border-yellow-500",
  [PersonType.CUSTOMER]: "border-green-500",
  [PersonType.COMPANY]: "border-blue-500",
  [PersonType.SUPPLIER]: "border-purple-500",
};

const personTypeBadges: Record<PersonType, string> = {
  [PersonType.LEAD]: "bg-yellow-100 text-yellow-800",
  [PersonType.CUSTOMER]: "bg-green-100 text-green-800",
  [PersonType.COMPANY]: "bg-blue-100 text-blue-800",
  [PersonType.SUPPLIER]: "bg-purple-100 text-purple-800",
};

const phoneTypeLabels: Record<PhoneType, string> = {
  [PhoneType.MOBILE]: "Celular",
  [PhoneType.LANDLINE]: "Fixo",
  [PhoneType.FAX]: "Fax",
  [PhoneType.WHATSAPP]: "WhatsApp",
  [PhoneType.COMMERCIAL]: "Comercial",
};

interface PersonCardProps {
  person: Person;
  onClick?: () => void;
  showFullDetails?: boolean;
}

export function PersonCard({
  person,
  onClick,
  showFullDetails = false,
}: PersonCardProps) {
  const primaryPhone = person.phones?.find((p) => p.isPrimary);

  return (
    <div
      onClick={onClick}
      className={`bg-gh-card rounded-lg shadow p-6 transition-shadow border-l-4 ${
        personTypeColors[person.type]
      } ${onClick ? "cursor-pointer hover:shadow-lg" : ""} ${
        !person.active ? "opacity-60" : ""
      }`}
    >
      {/* Header com nome e badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gh-text mb-1">
            {person.name}
          </h3>
          {person.document && (
            <p className="text-sm text-gh-text-secondary">{person.document}</p>
          )}
        </div>
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${personTypeBadges[person.type]}`}
        >
          {personTypeLabels[person.type]}
        </span>
      </div>

      {/* Informações de contato */}
      <div className="space-y-2">
        {person.email && (
          <div className="flex items-center gap-2 text-sm text-gh-text">
            <Mail className="w-4 h-4 text-gh-text-secondary" />
            <span className="truncate">{person.email}</span>
          </div>
        )}
        {primaryPhone && (
          <div className="flex items-center gap-2 text-sm text-gh-text">
            <Phone className="w-4 h-4 text-gh-text-secondary" />
            <span>{primaryPhone.number}</span>
          </div>
        )}
        {(person.city || person.state) && (
          <div className="flex items-center gap-2 text-sm text-gh-text-secondary">
            <MapPin className="w-4 h-4 text-gh-text-secondary" />
            <span>
              {person.city}
              {person.city && person.state && ", "}
              {person.state}
            </span>
          </div>
        )}
      </div>

      {/* Status inativo */}
      {!person.active && (
        <div className="mt-3 pt-3 border-t border-gh-border">
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
            Inativo
          </span>
        </div>
      )}

      {/* Detalhes completos */}
      {showFullDetails && (
        <div className="mt-4 pt-4 border-t border-gh-border space-y-3">
          {person.address && (
            <div>
              <p className="text-sm font-medium text-gh-text mb-1">
                Endereço completo:
              </p>
              <p className="text-sm text-gh-text-secondary">{person.address}</p>
              {person.zipCode && (
                <p className="text-sm text-gh-text-secondary mt-1">
                  CEP: {person.zipCode}
                </p>
              )}
            </div>
          )}

          {person.phones && person.phones.length > 1 && (
            <div>
              <p className="text-sm font-medium text-gh-text mb-2">
                Todos os telefones:
              </p>
              <div className="space-y-1">
                {person.phones.map((phone) => (
                  <div
                    key={phone.id}
                    className="flex items-center gap-2 text-sm text-gh-text-secondary"
                  >
                    <Phone className="w-3 h-3 text-gh-text-secondary" />
                    <span>
                      {phoneTypeLabels[phone.type]}: {phone.number}
                    </span>
                    {phone.isPrimary && (
                      <span className="text-xs text-blue-600 font-medium">
                        (Principal)
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {person.notes && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-gh-text-secondary" />
                <p className="text-sm font-medium text-gh-text">
                  Observações:
                </p>
              </div>
              <p className="text-sm text-gh-text-secondary whitespace-pre-wrap pl-6">
                {person.notes}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
