"use client";

import React from "react";
import { RolesBadge } from "@/components/RolesBadge";
import type { Person } from "@/modules/person/types/person.types";

interface PersonSidebarProps {
  person: Person;
  papeisList: string[];
  onRestore: () => Promise<void>;
  onDelete: () => Promise<void>;
  isRestoring?: boolean;
  isDeleting?: boolean;
}

export function PersonSidebar({
  person,
  papeisList,
  onRestore,
  onDelete,
  isRestoring = false,
  isDeleting = false,
}: PersonSidebarProps) {
  return (
    <div className="lg:col-span-1 space-y-4">
      {/* Info Card */}
      <div className="bg-gh-card border border-gh-border rounded-md p-4">
        <h4 className="font-semibold text-gh-text mb-3">Informações</h4>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-gh-text-secondary">Papéis</p>
            <div className="mt-1">
              {papeisList && papeisList.length > 0 ? (
                <RolesBadge
                  papeisList={papeisList}
                  showIcons={true}
                  showLabel
                />
              ) : (
                <p className="text-xs text-gh-text-secondary">
                  Nenhum papel atribuído
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="text-gh-text-secondary">Status</p>
            <p className="text-gh-text font-medium">
              {person.active ? "✓ Ativo" : "✗ Inativo"}
            </p>
          </div>

          <div>
            <p className="text-gh-text-secondary">Criado em</p>
            <p className="text-gh-text font-medium">
              {new Date(person.createdAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
          <div>
            <p className="text-gh-text-secondary">Atualizado em</p>
            <p className="text-gh-text font-medium">
              {new Date(person.updatedAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border border-red-200 rounded-md overflow-hidden">
        <div className="px-4 py-3 bg-red-50 border-b border-red-200">
          <h4 className="font-semibold text-red-900">Zona de Perigo</h4>
        </div>
        <div className="px-4 py-4 space-y-3">
          {!person.active && (
            <button
              onClick={onRestore}
              disabled={isRestoring}
              className="w-full px-3 py-2 text-sm font-medium text-green-600 border border-green-300 rounded-md hover:bg-green-50 transition-colors disabled:opacity-50"
            >
              Reativar Pessoa
            </button>
          )}
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="w-full px-3 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {person.active ? "Remover Pessoa" : "Remover Permanentemente"}
          </button>
        </div>
      </div>
    </div>
  );
}
