"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import {
  useParceiros,
  useDeleteParceiro,
} from "@/modules/parceiro/hooks/useParceiroQueries";
import {
  ParceiroTipo,
  ParceiroStatus,
} from "@/modules/parceiro/types/parceiro.types";
import { useAlerts } from "@/contexts/AlertContext";
import { Search } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { RolesBadge } from "@/components/RolesBadge";
import { ActionButtons } from "@/components/ActionButtons";

const tiposLabels: Record<ParceiroTipo, string> = {
  [ParceiroTipo.COMERCIAL]: "Comercial",
  [ParceiroTipo.TECNICO]: "Técnico",
  [ParceiroTipo.ESTRATEGICO]: "Estratégico",
  [ParceiroTipo.AFILIADO]: "Afiliado",
  [ParceiroTipo.REVENDEDOR]: "Revendedor",
};

const statusLabels: Record<ParceiroStatus, string> = {
  [ParceiroStatus.ATIVO]: "Ativo",
  [ParceiroStatus.INATIVO]: "Inativo",
  [ParceiroStatus.SUSPENSO]: "Suspenso",
  [ParceiroStatus.EM_AVALIACAO]: "Em Avaliação",
};

const statusColors: Record<ParceiroStatus, string> = {
  [ParceiroStatus.ATIVO]: "bg-green-100 text-green-800",
  [ParceiroStatus.INATIVO]: "bg-gray-100 text-gray-800",
  [ParceiroStatus.SUSPENSO]: "bg-yellow-100 text-yellow-800",
  [ParceiroStatus.EM_AVALIACAO]: "bg-blue-100 text-blue-800",
};

export function ParceiroListComponent() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const alerts = useAlerts();

  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState<ParceiroTipo | "">("");
  const [statusFilter, setStatusFilter] = useState<ParceiroStatus | "">("");

  const filters = useMemo(() => {
    const f: any = {};
    if (tipoFilter) f.tipo = tipoFilter;
    if (statusFilter) f.status = statusFilter;
    if (searchTerm) f.search = searchTerm;
    return f;
  }, [tipoFilter, statusFilter, searchTerm]);

  const { data, isLoading } = useParceiros(activeWorkspace?.id || "", filters);

  const handleDelete = (parceiroId: string, personName: string) => {
    if (!confirm(`Tem certeza que deseja remover ${personName} como parceiro?`))
      return;

    const mutation = useDeleteParceiro(activeWorkspace?.id || "", parceiroId);
    mutation.mutate(undefined, {
      onSuccess: () => {
        alerts.success("Parceiro removido com sucesso!");
      },
      onError: (error: any) => {
        alerts.error(
          error.response?.data?.message || "Erro ao remover parceiro",
        );
      },
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
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
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gh-text">Parceiros</h1>
          <p className="text-sm text-gh-text-secondary mt-1">
            Gerenciar e visualizar parceiros
          </p>
        </div>
        <button
          onClick={() => router.push(`/contatos/new`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <span>+</span> Novo Contato
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gh-text-secondary" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Pesquisar por nome ou email..."
          className="w-full pl-10 pr-4 py-2 bg-gh-card border border-gh-border rounded-md text-sm text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:ring-2 focus:ring-gh-hover focus:border-gh-hover"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div>
          <label className="text-xs font-medium text-gh-text-secondary mr-2">
            Tipo:
          </label>
          <select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value as any)}
            className="px-3 py-2 bg-gh-card border border-gh-border rounded-md text-sm text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-hover"
          >
            <option value="">Todos</option>
            {Object.entries(tiposLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gh-text-secondary mr-2">
            Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-gh-card border border-gh-border rounded-md text-sm text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-hover"
          >
            <option value="">Todos</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* DataTable Component */}
      <DataTable
        headers={[
          {
            key: "nome",
            label: "Nome",
            render: (_, row: any) => (
              <span className="font-medium text-gh-text">
                {row.person?.name || "N/A"}
              </span>
            ),
          },
          {
            key: "papeisList",
            label: "Papéis",
            render: (papeisList: string[] | undefined) => (
              <RolesBadge papeisList={papeisList} />
            ),
          },
          {
            key: "tipo",
            label: "Tipo",
            render: (tipo: ParceiroTipo) => (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gh-badge-bg text-gh-text">
                {tiposLabels[tipo]}
              </span>
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (status: ParceiroStatus) => (
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
              >
                {statusLabels[status]}
              </span>
            ),
          },
          {
            key: "totalNegocioGerado",
            label: "Total Negócio",
            render: (value: number) => (
              <span className="text-sm text-gh-text-secondary">
                {formatCurrency(value)}
              </span>
            ),
          },
          {
            key: "totalComissaoPendente",
            label: "Comissão Pendente",
            render: (value: number) => (
              <span
                className={`font-medium ${
                  value > 0 ? "text-yellow-600" : "text-green-600"
                }`}
              >
                {formatCurrency(value)}
              </span>
            ),
          },
          {
            key: "id",
            label: "Ações",
            render: (id: string, row: any) => (
              <ActionButtons
                onView={() =>
                  router.push(
                    `/workspaces/${activeWorkspace.id}/parceiros/${id}`,
                  )
                }
                onDelete={() =>
                  handleDelete(id, row.person?.name || "Parceiro")
                }
              />
            ),
          },
        ]}
        data={data || []}
        isLoading={isLoading}
        emptyMessage={
          searchTerm
            ? "Nenhum parceiro encontrado. Tente ajustar os termos de pesquisa."
            : "Nenhum parceiro encontrado. Comece criando seu primeiro parceiro."
        }
      />
    </div>
  );
}
