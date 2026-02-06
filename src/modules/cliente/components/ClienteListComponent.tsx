"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import {
  useClientes,
  useDeleteCliente,
} from "@/modules/cliente/hooks/useClienteQueries";
import {
  ClienteCategoria,
  ClienteStatus,
} from "@/modules/cliente/types/cliente.types";
import { useAlerts } from "@/contexts/AlertContext";
import { Search } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { RolesBadge } from "@/components/RolesBadge";
import { ActionButtons } from "@/components/ActionButtons";

const categoriasLabels: Record<ClienteCategoria, string> = {
  [ClienteCategoria.VIP]: "VIP",
  [ClienteCategoria.PREMIUM]: "Premium",
  [ClienteCategoria.REGULAR]: "Regular",
  [ClienteCategoria.BASICO]: "Básico",
};

const statusLabels: Record<ClienteStatus, string> = {
  [ClienteStatus.ATIVO]: "Ativo",
  [ClienteStatus.INATIVO]: "Inativo",
  [ClienteStatus.SUSPENSO]: "Suspenso",
  [ClienteStatus.INADIMPLENTE]: "Inadimplente",
};

const statusColors: Record<ClienteStatus, string> = {
  [ClienteStatus.ATIVO]: "bg-green-100 text-green-800",
  [ClienteStatus.INATIVO]: "bg-gray-100 text-gray-800",
  [ClienteStatus.SUSPENSO]: "bg-yellow-100 text-yellow-800",
  [ClienteStatus.INADIMPLENTE]: "bg-red-100 text-red-800",
};

export function ClienteListComponent() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const alerts = useAlerts();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState<ClienteCategoria | "">(
    "",
  );
  const [statusFilter, setStatusFilter] = useState<ClienteStatus | "">("");

  const filters = useMemo(() => {
    const f: any = {};
    if (categoriaFilter) f.categoria = categoriaFilter;
    if (statusFilter) f.status = statusFilter;
    if (searchTerm) f.search = searchTerm;
    return f;
  }, [categoriaFilter, statusFilter, searchTerm]);

  const { data, isLoading } = useClientes(activeWorkspace?.id || "", filters);
  const deleteClienteMutation = useDeleteCliente(activeWorkspace?.id || "", "");

  const handleDelete = (clienteId: string, personName: string) => {
    if (!confirm(`Tem certeza que deseja remover ${personName} como cliente?`))
      return;

    const mutation = useDeleteCliente(activeWorkspace?.id || "", clienteId);
    mutation.mutate(undefined, {
      onSuccess: () => {
        alerts.success("Cliente removido com sucesso!");
      },
      onError: (error: any) => {
        alerts.error(
          error.response?.data?.message || "Erro ao remover cliente",
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
          <h1 className="text-2xl font-bold text-gh-text">Clientes</h1>
          <p className="text-sm text-gh-text-secondary mt-1">
            Gerenciar e visualizar clientes
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
            Categoria:
          </label>
          <select
            value={categoriaFilter}
            onChange={(e) => setCategoriaFilter(e.target.value as any)}
            className="px-3 py-2 bg-gh-card border border-gh-border rounded-md text-sm text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-hover"
          >
            <option value="">Todas</option>
            {Object.entries(categoriasLabels).map(([value, label]) => (
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

      {/* Results counter */}
      {data && (
        <div className="flex items-center justify-between border-b border-gh-border pb-3">
          <p className="text-sm text-gh-text-secondary">
            <span className="font-medium text-gh-text">{data.length}</span>{" "}
            cliente
            {data.length !== 1 ? "s" : ""} encontrado
            {data.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
      {/* Table */}
      {data && (
        <div className="flex items-center justify-between border-b border-gh-border pb-3">
          <p className="text-sm text-gh-text-secondary">
            <span className="font-medium text-gh-text">{data.length}</span>{" "}
            cliente
            {data.length !== 1 ? "s" : ""} encontrado
            {data.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

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
            render: (papeisList: string[]) => (
              <RolesBadge papeisList={papeisList} />
            ),
          },
          {
            key: "categoria",
            label: "Categoria",
            render: (categoria: ClienteCategoria) => (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gh-badge-bg text-gh-text">
                {categoriasLabels[categoria]}
              </span>
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (status: ClienteStatus) => (
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
              >
                {statusLabels[status]}
              </span>
            ),
          },
          {
            key: "totalCompras",
            label: "Total Compras",
            render: (value: number) => (
              <span className="text-sm text-gh-text-secondary">
                {formatCurrency(value)}
              </span>
            ),
          },
          {
            key: "ticketMedio",
            label: "Ticket Médio",
            render: (value: number) => (
              <span className="text-sm text-gh-text-secondary">
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
                    `/workspaces/${activeWorkspace.id}/clientes/${id}`,
                  )
                }
                onDelete={() => handleDelete(id, row.person?.name || "Cliente")}
              />
            ),
          },
        ]}
        data={data || []}
        isLoading={isLoading}
        emptyMessage={
          searchTerm
            ? "Tente ajustar os termos de pesquisa."
            : "Comece criando seu primeiro cliente."
        }
      />
    </div>
  );
}
