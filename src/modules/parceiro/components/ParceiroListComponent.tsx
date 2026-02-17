"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { usePermission } from "@/modules/workspace/hooks/usePermission";
import {
  useParceiros,
  useDeleteParceiro,
} from "@/modules/parceiro/hooks/useParceiroQueries";
import {
  ParceiroTipo,
  ParceiroStatus,
} from "@/modules/parceiro/types/parceiro.types";
import { useAlerts } from "@/contexts/AlertContext";
import { Plus, Edit, Trash2 } from "lucide-react";
import { DataTable, Column, RowAction } from "@/components/DataTable";
import { RolesBadge } from "@/components/RolesBadge";
import { PageHeader } from "@/components/patterns/PageHeader";
import { DataTableToolbar } from "@/components/patterns/DataTableToolbar";
import { FilterWithBadge } from "@/components/patterns/FilterWithBadge";

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
  const { hasPermission } = usePermission();

  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState<ParceiroTipo | "">("");
  const [statusFilter, setStatusFilter] = useState<ParceiroStatus | "">("");
  const [selectedParceiros, setSelectedParceiros] = useState<any[]>([]);

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
      render: (papeisList: string[] | undefined) => (
        <RolesBadge papeisList={papeisList} showIcons={true} />
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
  ];

  const rowActions: RowAction[] = [
    {
      id: "edit",
      label: "Editar",
      icon: <Edit className="w-4 h-4" />,
      onClick: (row: any) => router.push(`/contatos/${row.personId}`),
    },
    ...(hasPermission('contacts', 'delete')
      ? [
          {
            id: "delete",
            label: "Deletar",
            icon: <Trash2 className="w-4 h-4" />,
            onClick: (row: any) => handleDelete(row.id, row.person?.name),
            variant: "destructive" as const,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Parceiros"
        description="Gerenciar e visualizar parceiros"
        action={
          hasPermission('contacts', 'create')
            ? {
                label: "Novo Contato",
                onClick: () => router.push(`/contatos/new`),
                icon: <Plus className="w-4 h-4" />,
              }
            : undefined
        }
      />

      <DataTableToolbar
        searchPlaceholder="Pesquisar por nome ou email..."
        onSearch={setSearchTerm}
        exportData={data || []}
        exportFilename="parceiros"
      />

      {/* Advanced Filters - Dropdown with Badge */}
      <div className="flex items-center gap-3 flex-wrap">
        <FilterWithBadge
          label="Tipo"
          options={[
            {
              value: ParceiroTipo.COMERCIAL,
              label: "Comercial",
            },
            {
              value: ParceiroTipo.TECNICO,
              label: "Técnico",
            },
            {
              value: ParceiroTipo.ESTRATEGICO,
              label: "Estratégico",
            },
            {
              value: ParceiroTipo.AFILIADO,
              label: "Afiliado",
            },
            {
              value: ParceiroTipo.REVENDEDOR,
              label: "Revendedor",
            },
          ]}
          value={tipoFilter}
          onValueChange={(value) => {
            setTipoFilter((value as ParceiroTipo) || "");
          }}
          width="w-56"
        />

        <FilterWithBadge
          label="Status"
          options={[
            {
              value: ParceiroStatus.ATIVO,
              label: "Ativo",
            },
            {
              value: ParceiroStatus.INATIVO,
              label: "Inativo",
            },
            {
              value: ParceiroStatus.SUSPENSO,
              label: "Suspenso",
            },
            {
              value: ParceiroStatus.EM_AVALIACAO,
              label: "Em Avaliação",
            },
          ]}
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter((value as ParceiroStatus) || "");
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
            ? "Nenhum parceiro encontrado. Tente ajustar os termos de pesquisa."
            : "Nenhum parceiro encontrado. Comece criando seu primeiro parceiro."
        }
        rowActions={rowActions}
      />
    </div>
  );
}
