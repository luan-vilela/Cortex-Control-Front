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
import { Search, Loader2, Trash2, Star } from "lucide-react";

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

      {/* Results counter */}
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

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gh-text-secondary" />
        </div>
      ) : data && data.length > 0 ? (
        <div className="bg-gh-card border border-gh-border rounded-md overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-gh-border bg-gh-bg">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gh-text-secondary uppercase">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gh-text-secondary uppercase">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gh-text-secondary uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gh-text-secondary uppercase">
                  Avaliação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gh-text-secondary uppercase">
                  Total Compras
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gh-text-secondary uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gh-border">
              {data.map((fornecedor) => (
                <tr
                  key={fornecedor.id}
                  className="hover:bg-gh-hover transition-colors"
                >
                  <td className="px-6 py-3 font-medium text-gh-text">
                    {fornecedor.person?.name || "N/A"}
                  </td>
                  <td className="px-6 py-3">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gh-badge-bg text-gh-text">
                      {tiposLabels[fornecedor.tipo]}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[fornecedor.status]}`}
                    >
                      {statusLabels[fornecedor.status]}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm">
                    {renderStars(fornecedor.avaliacao)}
                  </td>
                  <td className="px-6 py-3 text-sm text-gh-text-secondary">
                    {formatCurrency(fornecedor.totalCompras)}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          router.push(
                            `/workspaces/${activeWorkspace.id}/fornecedores/${fornecedor.id}`,
                          )
                        }
                        className="text-gh-accent hover:text-gh-accent-dark transition-colors text-xs font-medium"
                      >
                        Ver
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(
                            fornecedor.id,
                            fornecedor.person?.name || "Fornecedor",
                          )
                        }
                        className="text-red-500 hover:text-red-700 transition-colors text-xs font-medium"
                      >
                        <Trash2 className="w-4 h-4" />
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
            Nenhum fornecedor encontrado
          </h3>
          <p className="text-sm text-gh-text-secondary">
            {searchTerm
              ? "Tente ajustar os termos de pesquisa."
              : "Comece criando seu primeiro fornecedor."}
          </p>
        </div>
      )}
    </div>
  );
}
