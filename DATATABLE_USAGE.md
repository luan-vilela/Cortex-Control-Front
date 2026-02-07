# DataTable Consolidado - Guia de Uso

## Imports

```typescript
import {
  DataTable,
  Column,
  PaginationConfig,
  SortingConfig,
  RowAction,
} from "@/components/DataTable";
import { Edit, Trash2, Eye } from "lucide-react";
```

## Exemplo Básico (Sem Paginação)

```typescript
const columns: Column[] = [
  { key: "id", label: "ID", width: "100px" },
  { key: "name", label: "Nome", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "role", label: "Função" },
];

<DataTable
  headers={columns}
  data={persons}
  selectable
  onSelectionChange={(selected) => setSelected(selected)}
/>
```

## Exemplo Com Sorting

```typescript
const [sortBy, setSortBy] = useState<string>();
const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

const handleSort = (column: string) => {
  if (sortBy === column) {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  } else {
    setSortBy(column);
    setSortOrder("asc");
  }
};

<DataTable
  headers={columns}
  data={persons}
  sorting={{
    sortBy,
    sortOrder,
    onSort: handleSort,
  }}
/>
```

## Exemplo Com Paginação

```typescript
const [page, setPage] = useState(1);
const limit = 10;

const { data: { data: persons, total } } = usePersons(workspaceId, { 
  page, 
  limit,
  sortBy,
  sortOrder,
});

<DataTable
  headers={columns}
  data={persons}
  pagination={{
    page,
    limit,
    total,
    onPageChange: setPage,
  }}
/>
```

## Exemplo Com Row Actions

```typescript
const deletePersonMutation = useDeletePerson(workspaceId);
const editPersonMutation = useUpdatePerson(workspaceId);

const rowActions: RowAction[] = [
  {
    id: "view",
    label: "Visualizar",
    icon: <Eye className="w-4 h-4" />,
    onClick: (row) => router.push(`/persons/${row.id}`),
  },
  {
    id: "edit",
    label: "Editar",
    icon: <Edit className="w-4 h-4" />,
    onClick: (row) => setEditingPerson(row),
  },
  {
    id: "delete",
    label: "Deletar",
    icon: <Trash2 className="w-4 h-4" />,
    variant: "danger",
    onClick: (row) => {
      if (confirm(`Deletar ${row.name}?`)) {
        deletePersonMutation.mutate(row.id);
      }
    },
  },
];

<DataTable
  headers={columns}
  data={persons}
  rowActions={rowActions}
  onRowClick={(row) => router.push(`/persons/${row.id}`)}
/>
```

## Exemplo Completo (Recomendado)

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DataTable,
  Column,
  RowAction,
} from "@/components/DataTable";
import {
  usePersons,
  useDeletePerson,
} from "@/modules/person/hooks";
import { useWorkspaceStore } from "@/modules/workspace/store";
import { Edit, Trash2, Eye } from "lucide-react";

export default function PersonsPage() {
  const router = useRouter();
  const { activeWorkspace } = useWorkspaceStore();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const { data: { data: persons = [], total = 0 } = {} } = usePersons(
    activeWorkspace?.id || "",
    { page, limit: 10, sortBy, sortOrder }
  );
  
  const deletePersonMutation = useDeletePerson(activeWorkspace?.id || "");

  const columns: Column[] = [
    { key: "id", label: "ID", width: "100px" },
    { key: "name", label: "Nome", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Telefone" },
    { key: "entityType", label: "Tipo", 
      render: (value) => <span className="capitalize">{value}</span>
    },
  ];

  const rowActions: RowAction[] = [
    {
      id: "view",
      label: "Visualizar",
      icon: <Eye className="w-4 h-4" />,
      onClick: (row) => router.push(`/persons/${row.id}`),
    },
    {
      id: "edit",
      label: "Editar",
      icon: <Edit className="w-4 h-4" />,
      onClick: (row) => router.push(`/persons/${row.id}/edit`),
    },
    {
      id: "delete",
      label: "Deletar",
      icon: <Trash2 className="w-4 h-4" />,
      variant: "danger",
      onClick: (row) => {
        if (confirm(`Tem certeza que deseja deletar ${row.name}?`)) {
          deletePersonMutation.mutate(row.id);
        }
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pessoas</h1>
        <p className="text-gh-text-secondary">Gerenciar pessoas, clientes, fornecedores</p>
      </div>

      <DataTable
        headers={columns}
        data={persons}
        isLoading={false}
        selectable
        rowActions={rowActions}
        striped
        pagination={{
          page,
          limit: 10,
          total,
          onPageChange: setPage,
        }}
        sorting={{
          sortBy,
          sortOrder,
          onSort: (column) => {
            if (sortBy === column) {
              setSortOrder(sortOrder === "asc" ? "desc" : "asc");
            } else {
              setSortBy(column);
              setSortOrder("asc");
            }
          },
        }}
        onRowClick={(row) => router.push(`/persons/${row.id}`)}
      />
    </div>
  );
}
```

## Props Reference

### DataTable

| Prop | Type | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `headers` | `Column[]` | ✅ | Definição das colunas |
| `data` | `any[]` | ✅ | Dados a exibir |
| `isLoading` | `boolean` | ❌ | Mostrar spinner de carregamento |
| `emptyMessage` | `string` | ❌ | Mensagem quando sem dados |
| `selectable` | `boolean` | ❌ | Habilitar seleção de linhas |
| `onSelectionChange` | `(rows) => void` | ❌ | Callback ao selecionar |
| `onRowClick` | `(row) => void` | ❌ | Callback ao clicar na linha |
| `pagination` | `PaginationConfig` | ❌ | Configuração de paginação |
| `sorting` | `SortingConfig` | ❌ | Configuração de ordenação |
| `rowActions` | `RowAction[]` | ❌ | Ações por linha |
| `striped` | `boolean` | ❌ | Alternância de cores nas linhas |

### Column

| Prop | Type | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `key` | `string` | ✅ | Chave do objeto de dados |
| `label` | `string` | ✅ | Rótulo do header |
| `align` | `"left" \| "right"` | ❌ | Alinhamento |
| `render` | `(value, row) => ReactNode` | ❌ | Função para renderizar custom |
| `sortable` | `boolean` | ❌ | Habilitar sort nessa coluna |
| `width` | `string` | ❌ | Largura da coluna (CSS) |

### RowAction

| Prop | Type | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `id` | `string` | ✅ | ID único da ação |
| `label` | `string` | ✅ | Tooltip da ação |
| `icon` | `React.ReactNode` | ✅ | Ícone Lucide |
| `onClick` | `(row) => void` | ✅ | Callback ao clicar |
| `variant` | `"default" \| "danger" \| "warning"` | ❌ | Estilo da ação |
| `hidden` | `(row) => boolean` | ❌ | Função para esconder ação |
