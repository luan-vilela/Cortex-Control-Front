# UI Patterns Library - Guia de Implementação

## Visão Geral

A UI Pattern Library fornece componentes compostos reutilizáveis para criar páginas de lista/CRUD seguindo os padrões do shadcn/ui. Todos os componentes usam composição e são facilmente customizáveis.

## Componentes Disponíveis

### 1. **PageHeader**

Header padrão para páginas com título, descrição, botão de ação e back button.

```tsx
import { PageHeader } from "@/components/patterns";
import { useRouter } from "next/navigation";

export function MembersPage() {
  const router = useRouter();

  return (
    <PageHeader
      title="Membros do Workspace"
      description="Gerencie os membros e permissões do workspace"
      action={{
        label: "Convidar Membro",
        onClick: () => setShowInviteModal(true),
        icon: <UserPlus className="w-4 h-4" />,
      }}
      backButton={{
        onClick: () => router.back(),
      }}
    />
  );
}
```

### 2. **DataTableToolbar**

Barra de ferramentas com pesquisa, exportação e filtros.

```tsx
import { DataTableToolbar } from "@/components/patterns";

export function MembersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  return (
    <DataTableToolbar
      searchPlaceholder="Pesquisar por nome ou email..."
      onSearch={setSearchTerm}
      exportData={members}
      exportFilename="membros"
      filters={[
        {
          id: "role",
          label: "Função",
          options: [
            { id: "owner", label: "Owner", value: "owner" },
            { id: "admin", label: "Admin", value: "admin" },
            { id: "member", label: "Membro", value: "member" },
          ],
          onChange: setStatusFilter,
          value: statusFilter,
        },
      ]}
    />
  );
}
```

### 3. **DataTable (refatorado)**

Tabela reusável com sorting, paginação e actions.

```tsx
import { DataTable, Column, RowAction } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";

export function MembersPage() {
  const columns: Column[] = [
    {
      key: "name",
      label: "Nome",
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "role",
      label: "Função",
      render: (value) => (
        <Badge variant={value === "owner" ? "default" : "secondary"}>
          {value}
        </Badge>
      ),
    },
  ];

  const rowActions: RowAction[] = [
    {
      id: "edit",
      label: "Editar",
      icon: <Pencil className="w-4 h-4" />,
      onClick: (row) => handleEditMember(row),
    },
    {
      id: "delete",
      label: "Remover",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (row) => handleDeleteMember(row),
      variant: "destructive",
      hidden: (row) => row.isOwner, // Esconder se for owner
    },
  ];

  return (
    <DataTable
      headers={columns}
      data={members}
      isLoading={isLoading}
      rowActions={rowActions}
      pagination={pagination}
      sorting={sorting}
    />
  );
}
```

### 4. **BulkActions**

Ações em massa para linhas selecionadas.

```tsx
import { BulkActions } from "@/components/patterns";

export function MembersPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const bulkActions = [
    {
      id: "delete",
      label: "Deletar selecionados",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (ids) => handleBulkDelete(ids),
      variant: "destructive" as const,
      requiresConfirm: true,
    },
  ];

  return (
    <>
      <BulkActions
        selectedCount={selectedIds.length}
        selectedIds={selectedIds}
        actions={bulkActions}
        onClearSelection={() => setSelectedIds([])}
        isLoading={isDeleting}
      />
      <DataTable
        selectable={true}
        onSelectionChange={setSelectedIds}
        {...otherProps}
      />
    </>
  );
}
```

### 5. **SearchInput**

Input de pesquisa com ícone de busca.

```tsx
import { SearchInput } from "@/components/patterns";

<SearchInput
  placeholder="Pesquisar membros..."
  onSearch={(value) => setSearchTerm(value)}
/>;
```

### 6. **ExportButton**

Botão para exportar dados em JSON ou CSV.

```tsx
import { ExportButton } from "@/components/patterns";

<ExportButton data={members} filename="membros-workspace" />;
```

## Exemplo Completo: Members Page Refatorada

```tsx
"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { UserPlus, Edit, Trash2 } from "lucide-react";
import {
  PageHeader,
  DataTableToolbar,
  BulkActions,
  SearchInput,
  ExportButton,
} from "@/components/patterns";
import { DataTable, Column, RowAction } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { useWorkspaceMembers } from "@/modules/workspace/hooks";

export default function MembersPage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.id as string;

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState({
    sortBy: "name",
    sortOrder: "asc" as const,
  });

  // Queries
  const { data: members = [], isLoading } = useWorkspaceMembers(workspaceId);

  // Filtrar dados
  const filteredMembers = members.filter((m) => {
    const matchSearch =
      !searchTerm ||
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = !roleFilter || m.role === roleFilter;
    return matchSearch && matchRole;
  });

  // Ordenar dados
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    const aVal = a[sortConfig.sortBy as keyof typeof a];
    const bVal = b[sortConfig.sortBy as keyof typeof b];
    const direction = sortConfig.sortOrder === "asc" ? 1 : -1;
    return String(aVal).localeCompare(String(bVal)) * direction;
  });

  // Colunas da tabela
  const columns: Column[] = [
    {
      key: "name",
      label: "Nome",
      sortable: true,
      render: (value) => <span className="font-medium">{value}</span>,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "role",
      label: "Função",
      align: "center",
      render: (value) => (
        <Badge variant={value === "owner" ? "default" : "secondary"}>
          {value}
        </Badge>
      ),
    },
  ];

  // Ações da linha
  const rowActions: RowAction[] = [
    {
      id: "edit",
      label: "Editar",
      icon: <Edit className="w-4 h-4" />,
      onClick: (row) =>
        router.push(`/workspaces/${workspaceId}/members/${row.id}/edit`),
    },
    {
      id: "delete",
      label: "Remover",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (row) => handleDeleteMember(row.id),
      variant: "destructive",
      hidden: (row) => row.isOwner,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Membros"
        description="Gerencie os membros e permissões do workspace"
        action={{
          label: "Convidar",
          onClick: () =>
            router.push(`/workspaces/${workspaceId}/members/invite`),
          icon: <UserPlus className="w-4 h-4" />,
        }}
        backButton={{
          onClick: () => router.back(),
        }}
      />

      <DataTableToolbar
        searchPlaceholder="Pesquisar por nome ou email..."
        onSearch={setSearchTerm}
        exportData={sortedMembers}
        exportFilename="membros"
        filters={[
          {
            id: "role",
            label: "Função",
            options: [
              { id: "owner", label: "Owner", value: "owner" },
              { id: "admin", label: "Admin", value: "admin" },
              { id: "member", label: "Membro", value: "member" },
            ],
            onChange: setRoleFilter,
            value: roleFilter,
          },
        ]}
      />

      <BulkActions
        selectedCount={selectedIds.length}
        selectedIds={selectedIds}
        onClearSelection={() => setSelectedIds([])}
        actions={[
          {
            id: "delete",
            label: "Deletar",
            icon: <Trash2 className="w-4 h-4" />,
            onClick: (ids) => handleBulkDelete(ids),
            variant: "destructive",
          },
        ]}
      />

      <DataTable
        headers={columns}
        data={sortedMembers}
        isLoading={isLoading}
        emptyMessage="Nenhum membro encontrado"
        selectable={true}
        onSelectionChange={setSelectedIds}
        rowActions={rowActions}
        sorting={{
          sortBy: sortConfig.sortBy,
          sortOrder: sortConfig.sortOrder,
          onSort: (column) => {
            setSortConfig((prev) => ({
              sortBy: column,
              sortOrder:
                prev.sortBy === column && prev.sortOrder === "asc"
                  ? "desc"
                  : "asc",
            }));
          },
        }}
        pagination={{
          page: 1,
          limit: 10,
          total: sortedMembers.length,
          onPageChange: (page) => console.log(page),
        }}
      />
    </div>
  );
}
```

## Boas Práticas

1. **Sempre use Composição**: Componentes são feitos para serem compostos, não modificados
2. **Props Opcionais**: Todos têm defaults sensatos, customize apenas o necessário
3. **TypeScript**: Use tipos exported do `@/components/patterns`
4. **Icons**: Use Lucide icons para consistência
5. **Responsive**: Todos os componentes são mobile-first
6. **Acessibilidade**: Todos seguem WCAG 2.1

## Customização Avançada

Para customizações complexas, crie um wrapper:

```tsx
export function CustomMembersToolbar(props) {
  return (
    <DataTableToolbar
      {...props}
      additionalActions={
        <Button variant="outline" size="sm">
          Ação Customizada
        </Button>
      }
    />
  );
}
```

## Troubleshooting

**Componentes não aparecem?**

- Verifique imports: `import { ComponentName } from "@/components/patterns"`
- Certifique-se de que o arquivo `/src/components/patterns/index.ts` exporta o componente

**Tipos não reconhecidos?**

- Importar tipos também: `import type { ColumnType } from "@/components/DataTable"`

**Estilos não aplicados?**

- Verifique se Tailwind CSS e shadcn/ui estão configurados
- Limpe cache: `npm run build`
