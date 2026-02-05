"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { getLeads, deleteLead } from "@/modules/person/services/person.service";
import { useAlerts } from "@/contexts/AlertContext";
import { Search, Loader2 } from "lucide-react";
import { useEffect } from "react";
import type { Lead } from "@/modules/person/types/person.types";

const statusLabels: Record<string, string> = {
  NOVO: "Novo",
  CONTATO_INICIAL: "Contato Inicial",
  QUALIFICADO: "Qualificado",
  PROPOSTA_ENVIADA: "Proposta Enviada",
  NEGOCIACAO: "Negociação",
  CONVERTIDO: "Convertido",
  PERDIDO: "Perdido",
};

const statusColors: Record<string, string> = {
  NOVO: "bg-blue-100 text-blue-800",
  CONTATO_INICIAL: "bg-yellow-100 text-yellow-800",
  QUALIFICADO: "bg-purple-100 text-purple-800",
  PROPOSTA_ENVIADA: "bg-orange-100 text-orange-800",
  NEGOCIACAO: "bg-indigo-100 text-indigo-800",
  CONVERTIDO: "bg-green-100 text-green-800",
  PERDIDO: "bg-red-100 text-red-800",
};

export default function LeadsPage() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const alerts = useAlerts();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    if (!activeWorkspace?.id) return;

    const fetchLeads = async () => {
      try {
        setIsLoading(true);
        const data = await getLeads(activeWorkspace.id, {
          search: searchTerm || undefined,
          status: statusFilter || undefined,
        });
        setLeads(data);

        // Buscar total sem filtros
        if (!searchTerm && !statusFilter) {
          setTotalLeads(data.length);
        } else {
          const totalData = await getLeads(activeWorkspace.id, {});
          setTotalLeads(totalData.length);
        }
      } catch (error) {
        alerts.error("Erro ao carregar leads");
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchLeads, 300);
    return () => clearTimeout(debounceTimer);
  }, [activeWorkspace?.id, searchTerm, statusFilter, alerts]);

  const handleDelete = async (leadId: string, leadName: string) => {
    if (!confirm(`Tem certeza que deseja remover ${leadName}?`)) return;

    try {
      await deleteLead(activeWorkspace?.id || "", leadId);
      alerts.success("Lead removido com sucesso!");
      setLeads(leads.filter((l) => l.id !== leadId));
    } catch (error: any) {
      alerts.error(error.response?.data?.message || "Erro ao remover lead");
    }
  };

  if (!activeWorkspace) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gh-text-secondary">Selecione um workspace</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gh-text mb-1">Leads</h2>
          <p className="text-sm text-gh-text-secondary">
            Gerencie todos os seus leads e acompanhe seu progresso
          </p>
        </div>
      </div>

      {/* Barra de Pesquisa */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gh-text-secondary" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Pesquisar por nome, email ou documento..."
          className="w-full pl-10 pr-4 py-2 bg-gh-card border border-gh-border rounded-md text-sm text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:ring-2 focus:ring-gh-hover focus:border-gh-hover"
        />
      </div>

      {/* Filtros por Status */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium text-gh-text-secondary">
          Filtrar por status:
        </span>
        <button
          onClick={() => setStatusFilter("")}
          className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
            statusFilter === ""
              ? "bg-gh-hover text-white"
              : "bg-gh-card border border-gh-border text-gh-text-secondary hover:border-gh-hover hover:text-gh-text"
          }`}
        >
          Todos
        </button>
        {[
          "NOVO",
          "CONTATO_INICIAL",
          "QUALIFICADO",
          "PROPOSTA_ENVIADA",
          "CONVERTIDO",
        ].map((value) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={`px-2.5 py-1 text-xs rounded-full transition-colors ${
              statusFilter === value
                ? "bg-gh-hover text-white"
                : "bg-gh-card border border-gh-border text-gh-text-secondary hover:border-gh-hover hover:text-gh-text"
            }`}
          >
            {statusLabels[value]}
          </button>
        ))}
      </div>

      {/* Contador */}
      {leads && (
        <div className="flex items-center justify-between border-b border-gh-border pb-3">
          <div className="flex gap-6">
            <p className="text-sm text-gh-text-secondary">
              <span className="font-medium text-gh-text">{leads.length}</span>{" "}
              resultado{leads.length !== 1 ? "s" : ""} encontrado
              {leads.length !== 1 ? "s" : ""}
            </p>
            <p className="text-sm text-gh-text-secondary">
              Total:{" "}
              <span className="font-medium text-gh-text">{totalLeads}</span>
            </p>
          </div>
        </div>
      )}

      {/* Lista de Leads */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gh-text-secondary" />
        </div>
      ) : leads && leads.length > 0 ? (
        <div className="bg-gh-card border border-gh-border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-gh-border bg-gh-bg">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gh-text-secondary uppercase">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gh-text-secondary uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gh-text-secondary uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gh-text-secondary uppercase">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gh-text-secondary uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gh-border">
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-gh-hover transition-colors"
                  onClick={() => router.push(`/leads/${lead.id}`)}
                >
                  <td className="px-6 py-3">{lead.name}</td>
                  <td className="px-6 py-3 text-sm text-gh-text-secondary">
                    {lead.email || "-"}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[lead.status || "NOVO"] ||
                        "bg-gh-badge-bg text-gh-text"
                      }`}
                    >
                      {statusLabels[lead.status || "NOVO"] || lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gh-text">
                    {lead.score || 0}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/leads/${lead.id}`)}
                        className="text-gh-accent hover:text-gh-accent-dark transition-colors text-xs font-medium"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() => handleDelete(lead.id, lead.name)}
                        className="text-red-500 hover:text-red-700 transition-colors text-xs font-medium"
                      >
                        Remover
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gh-badge-bg rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-gh-text-secondary" />
          </div>
          <h3 className="text-lg font-semibold text-gh-text mb-2">
            Nenhum lead encontrado
          </h3>
          <p className="text-sm text-gh-text-secondary mb-6 max-w-md">
            {searchTerm
              ? "Tente ajustar os termos de pesquisa ou limpar os filtros."
              : "Comece criando seu primeiro lead."}
          </p>
        </div>
      )}
    </div>
  );
}
