import React from "react";
import {
  type AllContacts,
  EntityType,
  PhoneType,

} from "../types/person.types";
import { Mail, Phone, MapPin, FileText } from "lucide-react";

const entityTypeLabels: Record<EntityType, string> = {
  [EntityType.PERSON]: "Contato",
  [EntityType.LEAD]: "Lead",
  [EntityType.CLIENTE]: "Cliente",
  [EntityType.FORNECEDOR]: "Fornecedor",
  [EntityType.PARCEIRO]: "Parceiro",
};

const phoneTypeLabels: Record<PhoneType, string> = {
  [PhoneType.MOBILE]: "Celular",
  [PhoneType.LANDLINE]: "Fixo",
  [PhoneType.FAX]: "Fax",
  [PhoneType.WHATSAPP]: "WhatsApp",
  [PhoneType.COMMERCIAL]: "Comercial",
};

// Função helper para detectar o tipo de entidade
function getEntityTypeName(person: AllContacts): string {
  if ("status" in person && "source" in person && "score" in person) {
    return entityTypeLabels[EntityType.LEAD];
  }
  if ("categoria" in person && "clienteStatus" in person) {
    return entityTypeLabels[EntityType.CLIENTE];
  }
  if ("fornecedorStatus" in person && "prazoPagamento" in person) {
    return entityTypeLabels[EntityType.FORNECEDOR];
  }
  if ("parceiroStatus" in person && "comissaoPercentual" in person) {
    return entityTypeLabels[EntityType.PARCEIRO];
  }
  return entityTypeLabels[EntityType.PERSON];
}

interface PersonCardProps {
  person: AllContacts;
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
      className={`bg-gh-card rounded-lg shadow p-6 transition-shadow border-l-4 border-gray-300 ${
        onClick ? "cursor-pointer hover:shadow-lg" : ""
      } ${!person.active ? "opacity-60" : ""}`}
    >
      {/* Header com nome e badge */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gh-text mb-1">
            {person.name}
          </h3>
          <div className="flex gap-2 text-sm text-gh-text-secondary">
            <span>{person.document && `${person.document}`}</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 items-end">
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gh-badge-bg text-gh-text">
            {getEntityTypeName(person)}
          </span>
        </div>
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
          {(person.address || person.city || person.state) && (
            <div>
              <p className="text-sm font-medium text-gh-text mb-1">Endereço:</p>
              {person.address && (
                <p className="text-sm text-gh-text-secondary">
                  {person.address}
                </p>
              )}
              {(person.city || person.state) && (
                <p className="text-sm text-gh-text-secondary">
                  {person.city && `${person.city}`}
                  {person.city && person.state && ", "}
                  {person.state && `${person.state}`}
                </p>
              )}
              {person.postalCode && (
                <p className="text-sm text-gh-text-secondary mt-1">
                  CEP: {person.postalCode}
                </p>
              )}
              {person.country && (
                <p className="text-sm text-gh-text-secondary">
                  {person.country}
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
                <p className="text-sm font-medium text-gh-text">Observações:</p>
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
