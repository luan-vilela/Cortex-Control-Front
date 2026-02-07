"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import {
  useFornecedores,
  useDeleteFornecedor,
} from "@/modules/fornecedor/hooks/useFornecedorQueries";
import {
  FornecedorTipo,
  FornecedorStatus,
} from "@/modules/fornecedor/types/fornecedor.types";
import { useAlerts } from "@/contexts/AlertContext";
import { DataTable, Column, RowAction } from "@/components/DataTable";
import { PageHeader } from "@/components/patterns/PageHeader";
import { DataTableToolbar } from "@/components/patterns/DataTableToolbar";
import { FilterWithBadge } from "@/components/patterns/FilterWithBadge";
import { RolesBadge } from "@/components/RolesBadge";
import { Trash2, Edit, Plus, Star } from "lucide-react";

const tiposLabels: Record<FornecedorTipo, string> = {
  [FornecedorTipo.MATERIA_PRIMA]: "Matéria Prima",
  [FornecedorTipo.SERVICO]: "Serviço",
  [FornecedorTipo.REVENDA]: "Revenda",
  [FornecedorTipo.TERCEIRIZADO]: "Terceirizado",
  [FornecedorTipo.LOGISTICA]: "Logística",
};

const statusLabels: Record<FornecedorStatus, string> = {
  [FornecedorStatus.ATIVO]: "Ativo",
  [FornecedorStatus.INATIVO]: "Inativo",
  [FornecedorStatus.SUSPENSO]: "Suspenso",
  [FornecedorStatus.BLOQUEADO]: "Bloqueado",
};

const statusColors: Record<FornecedorStatus, string> = {
  [FornecedorStatus.ATIVO]: "bg-green-100 text-green-800",
  [FornecedorStatus.INATIVO]: "bg-gray-100 text-gray-800",
  [FornecedorStatus.SUSPENSO]: "bg-yellow-100 text-yellow-800",
  [FornecedorStatus.BLOQUEADO]: "bg-red-100 text-red-800",
};

export function FornecedorListComponent() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const alerts = useAlerts();

  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState<FornecedorTipo | "">("");
  const [statusFilter, setStatusFilter] = useState<FornecedorStatus | "">("");
  const [avaliacaoMin, setAvaliacaoMin] = useState<number | "">("");
  const [selectedFornecedores, setSelectedFornecedores] = useState<any[]>([]);

  const filters = useMemo(() => {
    const f: any = {};
    if (tipoFilter) f.tipo = tipoFilter;
    if (statusFilter) f.status = statusFilter;
    if (searchTerm) f.search = searchTerm;
    if (avaliacaoMin !== "") f.avaliacaoMin = avaliacaoMin;
    return f;
  }, [tipoFilter, statusFilter, searchTerm, avaliacaoMin]);

  const { data, isLoading } = useFornecedores(
    activeWorkspace?.id || "",
    filters,
  );

  const handleDelete = (fornecedorId: string, personName: string) => {
    if (
      !confirm(`Tem certeza que deseja remover ${personName} como fornecedor?`)
    )
      return;

    const mutation = useDeleteFornecedor(
      activeWorkspace?.id || "",
      fornecedorId,
    );
    mutation.mutate(undefined, {
      onSuccess: () => {
        alerts.success("Fornecedor removido com sucesso!");
      },
      onError: (error: any) => {
        alerts.error(
          error.response?.data?.message || "Erro ao remover fornecedor",
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

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.round(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gh-border"
            }`}
          />
        ))}
        <span className="text-xs text-gh-text-secondary ml-1">
          ({rating.toFixed(1)})
        </span>
      </div>
    );
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
      key: "tipo",
      label: "Tipo",
      render: (tipo: FornecedorTipo) => (
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gh-badge-bg text-gh-text">
          {tiposLabels[tipo]}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (status: FornecedorStatus) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
        >
          {statusLabels[status]}
        </span>
      ),
    },
    {
      key: "avaliacao",
      label: "Avaliação",
      render: (avaliacao: number) => renderStars(avaliacao || 0),
    },
    {
      key: "totalPedidos",
      label: "Total de Pedidos",
      render: (value: number) => (
        <span className="text-sm text-gh-text-secondary">{value || 0}</span>
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
        title="Fornecedores"
        description="Gerenciar e visualizar fornecedores"
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
        exportFilename="fornecedores"
      />

      {/* Advanced Filters - Dropdown with Badge */}
      <div className="flex items-center gap-3 flex-wrap">
        <FilterWithBadge
          label="Tipo"
          options={[
            {
              value: FornecedorTipo.MATERIA_PRIMA,
              label: "Matéria Prima",
            },
            {
              value: FornecedorTipo.SERVICO,
              label: "Serviço",
            },
            {
              value: FornecedorTipo.REVENDA,
              label: "Revenda",
            },
            {
              value: FornecedorTipo.TERCEIRIZADO,
              label: "Terceirizado",
            },
            {
              value: FornecedorTipo.LOGISTICA,
              label: "Logística",
            },
          ]}
          value={tipoFilter}
          onValueChange={(value) => {
            setTipoFilter((value as FornecedorTipo) || "");
          }}
          width="w-56"
        />

        <FilterWithBadge
          label="Status"
          options={[
            {
              value: FornecedorStatus.ATIVO,
              label: "Ativo",
            },
            {
              value: FornecedorStatus.INATIVO,
              label: "Inativo",
            },
            {
              value: FornecedorStatus.SUSPENSO,
              label: "Suspenso",
            },
            {
              value: FornecedorStatus.BLOQUEADO,
              label: "Bloqueado",
            },
          ]}
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter((value as FornecedorStatus) || "");
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
            : "Comece criando seu primeiro fornecedor."
        }
        rowActions={rowActions}
      />
    </div>
  );
}
