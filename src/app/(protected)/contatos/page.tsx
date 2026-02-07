"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { usePersons } from "@/modules/person/hooks/usePersonQueries";
import { useDeletePerson } from "@/modules/person/hooks/usePersonMutations";
import { EntityType } from "@/modules/person/types/person.types";
import { useAlerts } from "@/contexts/AlertContext";
import { ModuleGuard } from "@/modules/workspace/components/ModuleGuard";
import { DataTable, Column, RowAction } from "@/components/DataTable";
import { PageHeader, DataTableToolbar } from "@/components/patterns";
import { Trash2, Edit, Plus } from "lucide-react";
import { formatDocument } from "@/lib/masks";
import { useBreadcrumb } from "@/modules/workspace/hooks";

const entityTypeLabels: Record<EntityType, string> = {
  [EntityType.PERSON]: "Contato",
  [EntityType.LEAD]: "Lead",
  [EntityType.CLIENTE]: "Cliente",
  [EntityType.FORNECEDOR]: "Fornecedor",
  [EntityType.PARCEIRO]: "Parceiro",
};

export default function PersonsPage() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const alerts = useAlerts();

  useBreadcrumb([
    {
      label: "Contatos",
      href: "/contatos",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [entityTypeFilter, setEntityTypeFilter] = useState<EntityType | "">("");
  const [selectedPersons, setSelectedPersons] = useState<any[]>([]);

  const filters = useMemo(() => {
    const f: any = {};
    if (entityTypeFilter) f.entityType = entityTypeFilter;
    if (searchTerm) f.search = searchTerm;
    return f;
  }, [entityTypeFilter, searchTerm]);

  const { data, isLoading } = usePersons(activeWorkspace?.id || "", filters);
  const deleteMutation = useDeletePerson(activeWorkspace?.id || "");

  const handleDelete = async (personId: string, personName: string) => {
    if (!confirm(`Tem certeza que deseja remover ${personName}?`)) return;

    deleteMutation.mutate(personId, {
      onSuccess: () => {
        alerts.success("Pessoa removida com sucesso!");
      },
      onError: (error: any) => {
        alerts.error(error.response?.data?.message || "Erro ao remover pessoa");
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

  // Definir colunas
  const columns: Column[] = [
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
        <span className="text-sm text-gh-text-secondary">{email || "-"}</span>
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
          return <span className="text-sm text-gh-text-secondary">-</span>;
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
  ];

  // Definir row actions
  const rowActions: RowAction[] = [
    {
      id: "edit",
      label: "Editar",
      icon: <Edit className="w-4 h-4" />,
      onClick: (row) => router.push(`/contatos/${row.id}`),
    },
    {
      id: "delete",
      label: "Deletar",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (row) => handleDelete(row.id, row.name),
      variant: "destructive",
    },
  ];

  return (
    <ModuleGuard moduleId="contacts" workspaceId={activeWorkspace?.id}>
      <div className="space-y-6">
        <PageHeader
          title="Contatos"
          description="Gerenciar pessoas, clientes, fornecedores e parceiros"
          action={{
            label: "Novo Contato",
            onClick: () => router.push(`/contatos/new`),
            icon: <Plus className="w-4 h-4" />,
          }}
        />

        <DataTableToolbar
          searchPlaceholder="Pesquisar por nome, email ou documento..."
          onSearch={setSearchTerm}
          exportData={data || []}
          exportFilename="contatos"
          filters={[
            {
              id: "entityType",
              label: "Tipo",
              options: Object.entries(entityTypeLabels).map(
                ([value, label]) => ({
                  id: value,
                  value,
                  label,
                }),
              ),
              onChange: (value) =>
                setEntityTypeFilter(value as EntityType | ""),
              value: entityTypeFilter,
            },
          ]}
        />

        <DataTable
          headers={columns}
          data={data || []}
          isLoading={isLoading}
          selectable={false}
          onSelectionChange={setSelectedPersons}
          onRowClick={(row) => router.push(`/contatos/${row.id}`)}
          emptyMessage={
            searchTerm
              ? "Tente ajustar os termos de pesquisa ou limpar os filtros."
              : "Comece criando seu primeiro contato."
          }
          rowActions={rowActions}
        />
      </div>
    </ModuleGuard>
  );
}
