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
import { Search, Star } from "lucide-react";
import { DataTable } from "@/components/DataTable";
import { RolesBadge } from "@/components/RolesBadge";
import { ActionButtons } from "@/components/ActionButtons";

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gh-text">Fornecedores</h1>
          <p className="text-sm text-gh-text-secondary mt-1">
            Gerenciar e visualizar fornecedores
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center flex-wrap">
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
        <div>
          <label className="text-xs font-medium text-gh-text-secondary mr-2">
            Avaliação Mín:
          </label>
          <select
            value={avaliacaoMin}
            onChange={(e) =>
              setAvaliacaoMin(
                e.target.value === "" ? "" : parseFloat(e.target.value),
              )
            }
            className="px-3 py-2 bg-gh-card border border-gh-border rounded-md text-sm text-gh-text focus:outline-none focus:ring-2 focus:ring-gh-hover"
          >
            <option value="">Todas</option>
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating}+ ⭐
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {data && (
        <div className="flex items-center justify-between border-b border-gh-border pb-3">
          <p className="text-sm text-gh-text-secondary">
            <span className="font-medium text-gh-text">{data.length}</span>{" "}
            fornecedor
            {data.length !== 1 ? "es" : ""} encontrado
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
            render: (value: number) => renderStars(value),
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
            key: "id",
            label: "Ações",
            render: (id: string, row: any) => (
              <ActionButtons
                onView={() => router.push(`/contatos/${row.personId}`)}
                showDelete={false}
              />
            ),
          },
        ]}
        data={data || []}
        isLoading={isLoading}
        selectable={true}
        onSelectionChange={(selected) => setSelectedFornecedores(selected)}
        onRowClick={(row) => router.push(`/contatos/${row.personId}`)}
        emptyMessage={
          searchTerm
            ? "Tente ajustar os termos de pesquisa."
            : "Comece criando seu primeiro fornecedor."
        }
      />

      {/* Debug: Mostrar fornecedores selecionados */}
      {selectedFornecedores.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm font-medium text-blue-900 mb-2">
            {selectedFornecedores.length} fornecedor(es) selecionado(s)
          </p>
          <pre className="text-xs text-blue-800 overflow-auto max-h-64">
            {JSON.stringify(selectedFornecedores, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
