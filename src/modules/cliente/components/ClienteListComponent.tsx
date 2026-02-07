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
import { DataTable, Column, RowAction } from "@/components/DataTable";
import { PageHeader, DataTableToolbar } from "@/components/patterns";
import { FilterWithBadge } from "@/components/patterns/FilterWithBadge";
import { RolesBadge } from "@/components/RolesBadge";
import { Trash2, Edit, Plus } from "lucide-react";

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

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
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

  if (!activeWorkspace) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gh-text-secondary">Selecione um workspace</p>
      </div>
    );
  }

  const columns: Column[] = [
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
        <RolesBadge papeisList={papeisList} showIcons={true} />
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
  ];

  const rowActions: RowAction[] = [
    {
      id: "edit",
      label: "Editar",
      icon: <Edit className="w-4 h-4" />,
      onClick: (row: any) => router.push(`/contatos/${row.personId}`),
    },
    {
      id: "delete",
      label: "Deletar",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (row: any) => handleDelete(row.id, row.person?.name),
      variant: "destructive",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Gerenciar e visualizar clientes"
        action={{
          label: "Novo Contato",
          onClick: () => router.push(`/contatos/new`),
          icon: <Plus className="w-4 h-4" />,
        }}
      />

      <DataTableToolbar
        searchPlaceholder="Pesquisar por nome ou email..."
        onSearch={setSearchTerm}
        exportData={data || []}
        exportFilename="clientes"
      />

      {/* Advanced Filters - Dropdown with Badge */}
      <div className="flex items-center gap-3 flex-wrap">
        <FilterWithBadge
          label="Categoria"
          options={[
            {
              value: ClienteCategoria.VIP,
              label: "VIP",
            },
            {
              value: ClienteCategoria.PREMIUM,
              label: "Premium",
            },
            {
              value: ClienteCategoria.REGULAR,
              label: "Regular",
            },
            {
              value: ClienteCategoria.BASICO,
              label: "Básico",
            },
          ]}
          value={categoriaFilter}
          onValueChange={(value) => {
            setCategoriaFilter((value as ClienteCategoria) || "");
          }}
          width="w-56"
        />

        <FilterWithBadge
          label="Status"
          options={[
            {
              value: ClienteStatus.ATIVO,
              label: "Ativo",
            },
            {
              value: ClienteStatus.INATIVO,
              label: "Inativo",
            },
            {
              value: ClienteStatus.SUSPENSO,
              label: "Suspenso",
            },
            {
              value: ClienteStatus.INADIMPLENTE,
              label: "Inadimplente",
            },
          ]}
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter((value as ClienteStatus) || "");
          }}
          width="w-56"
        />
      </div>

      <DataTable
        headers={columns}
        data={data || []}
        isLoading={isLoading}
        onRowClick={(row: any) => router.push(`/contatos/${row.personId}`)}
        emptyMessage={
          searchTerm
            ? "Tente ajustar os termos de pesquisa."
            : "Comece criando seu primeiro cliente."
        }
        rowActions={rowActions}
      />
    </div>
  );
}
