"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { usePersons } from "@/modules/person/hooks/usePersonQueries";
import { useAlerts } from "@/contexts/AlertContext";
import { ModuleGuard } from "@/modules/workspace/components/ModuleGuard";
import { DataTable } from "@/components/DataTable";
import { Search } from "lucide-react";
import { formatDocument } from "@/lib/masks";
import api from "@/lib/api";

export default function SemPapelsPage() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const alerts = useAlerts();

  const [searchTerm, setSearchTerm] = useState("");

  const { data: allPersons = [], isLoading } = usePersons(
    activeWorkspace?.id || "",
  );

  // Filtra apenas contatos sem papéis
  const personsWithoutRoles = useMemo(() => {
    return allPersons.filter((person: any) => {
      // Se tem papeisList vindo da API, filtra
      if (person.papeisList && person.papeisList.length > 0) {
        return false;
      }
      // Se tem informações específicas de cliente/fornecedor/parceiro, não inclui
      if (
        person.categoria ||
        person.clienteStatus ||
        person.fornecedorStatus ||
        person.parceiroStatus
      ) {
        return false;
      }
      return true;
    });
  }, [allPersons]);

  // Filtra por termo de busca
  const filteredPersons = useMemo(() => {
    if (!searchTerm) return personsWithoutRoles;
    const term = searchTerm.toLowerCase();
    return personsWithoutRoles.filter(
      (person: any) =>
        person.name.toLowerCase().includes(term) ||
        person.email?.toLowerCase().includes(term) ||
        person.document?.includes(term),
    );
  }, [personsWithoutRoles, searchTerm]);

  if (!activeWorkspace) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gh-text-secondary">Selecione um workspace</p>
      </div>
    );
  }

  return (
    <ModuleGuard moduleId="contacts" workspaceId={activeWorkspace?.id}>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h2 className="text-2xl font-bold text-gh-text mb-1">
            Contatos sem Papéis
          </h2>
          <p className="text-sm text-gh-text-secondary">
            Pessoas que ainda não têm papéis definidos (Cliente, Fornecedor ou
            Parceiro)
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gh-text-secondary" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou documento..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gh-card border border-gh-border rounded-md text-gh-text placeholder-gh-text-secondary focus:outline-none focus:ring-2 focus:ring-gh-hover"
          />
        </div>

        {/* Results */}
        {filteredPersons.length > 0 && (
          <div className="flex items-center justify-between border-b border-gh-border pb-3">
            <p className="text-sm text-gh-text-secondary">
              <span className="font-medium text-gh-text">
                {filteredPersons.length}
              </span>{" "}
              pessoa
              {filteredPersons.length !== 1 ? "s" : ""} encontrada
              {filteredPersons.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}

        {/* DataTable */}
        <DataTable
          headers={[
            {
              key: "name",
              label: "Nome",
              render: (_, row) => (
                <span className="font-medium text-gh-text">{row.name}</span>
              ),
            },
            {
              key: "email",
              label: "Email",
              render: (email) => (
                <span className="text-sm text-gh-text-secondary">
                  {email || "-"}
                </span>
              ),
            },
            {
              key: "phones",
              label: "Telefone",
              render: (phones) => {
                const primaryPhone = phones?.find((p: any) => p.isPrimary);
                const phone = primaryPhone || phones?.[0];
                return (
                  <span className="text-sm text-gh-text-secondary">
                    {phone?.number || "-"}
                  </span>
                );
              },
            },
            {
              key: "document",
              label: "Documento",
              render: (document) => {
                if (!document)
                  return (
                    <span className="text-sm text-gh-text-secondary">-</span>
                  );
                const formatted = formatDocument(document);
                const isCpf = document.length === 11;
                const type = isCpf ? "CPF" : "CNPJ";
                return (
                  <div className="text-sm">
                    <span className="text-xs font-medium text-gh-text-secondary">
                      {type}
                    </span>
                    <p className="text-gh-text font-mono">{formatted}</p>
                  </div>
                );
              },
            },
          ]}
          data={filteredPersons}
          isLoading={isLoading}
          emptyMessage={
            searchTerm
              ? "Nenhum contato encontrado com esse termo de busca."
              : "Todos os contatos já têm papéis definidos!"
          }
        />
      </div>
    </ModuleGuard>
  );
}
