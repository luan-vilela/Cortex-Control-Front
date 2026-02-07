# DataTable com Shadcn/UI - Guia de Uso

## Visão Geral

O novo `DataTable` foi refatorado para usar componentes do shadcn/ui, oferecendo uma UI moderna, consistente e acessível em todo o projeto.

## Componentes Instalados

- ✅ Table
- ✅ Button
- ✅ Dropdown Menu
- ✅ Checkbox
- ✅ Pagination
- ✅ Card
- ✅ Form
- ✅ Input
- ✅ Select
- ✅ Tabs
- ✅ Alert Dialog
- ✅ Label

## Estrutura Atual

```
src/components/DataTable/
├── DataTable.tsx          # Componente principal com toda lógica
├── DataTablePagination.tsx # Componente de paginação
└── index.ts               # Exports
```

## Exemplo de Uso Básico

```tsx
import {
  DataTable,
  Column,
  SortingConfig,
  PaginationConfig,
} from "@/components/DataTable";
import { useState } from "react";

export function MembersPage() {
  const [sorting, setSorting] = useState<SortingConfig>({
    sortBy: "name",
    sortOrder: "asc",
    onSort: (column) =>
      setSorting((prev) => ({
        ...prev,
        sortBy: column,
        sortOrder:
          prev.sortBy === column && prev.sortOrder === "asc" ? "desc" : "asc",
      })),
  });

  const [pagination, setPagination] = useState<PaginationConfig>({
    page: 1,
    limit: 10,
    total: 50,
    onPageChange: (page) => setPagination((prev) => ({ ...prev, page })),
  });

  const columns: Column[] = [
    { key: "name", label: "Nome", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "role", label: "Função", render: (value) => <Badge>{value}</Badge> },
  ];

  return (
    <DataTable
      headers={columns}
      data={members}
      pagination={pagination}
      sorting={sorting}
    />
  );
}
```

## Props Principais

### `headers: Column[]`

Define as colunas da tabela.

```typescript
interface Column {
  key: string; // ID único da coluna
  label: string; // Label exibido no header
  align?: "left" | "center" | "right"; // Alinhamento
  render?: (value, row) => ReactNode; // Renderização customizada
  sortable?: boolean; // Habilita sorting
  width?: string; // Largura customizada (ex: "200px")
}
```

### `data: any[]`

Array de dados a exibir. Cada item deve ter um `id` único.

### `isLoading?: boolean`

Exibe spinner de loading.

### `emptyMessage?: string`

Mensagem customizada quando sem dados.

### `selectable?: boolean`

Habilita checkboxes para seleção de múltiplas linhas.

```tsx
<DataTable
  selectable={true}
  onSelectionChange={(selected) => console.log(selected)}
/>
```

### `onRowClick?: (row) => void`

Callback ao clicar em uma linha (cursor muda para pointer).

### `sorting?: SortingConfig`

Configuração de ordenação.

```typescript
interface SortingConfig {
  sortBy?: string; // Coluna atual
  sortOrder: "asc" | "desc";
  onSort: (column: string) => void;
}
```

### `pagination?: PaginationConfig`

Configuração de paginação. Se omitido, não exibe paginação.

```typescript
interface PaginationConfig {
  page: number; // Página atual (1-based)
  limit: number; // Itens por página
  total: number; // Total de itens
  totalPages?: number; // Opcional: total de páginas
  onPageChange: (page) => void;
}
```

### `rowActions?: RowAction[]`

Ações disponíveis por linha.

```typescript
interface RowAction {
  id: string;
  label: string;
  icon?: ReactNode; // Ícone (Lucide recomendado)
  onClick: (row) => void;
  variant?: "default" | "destructive" | "ghost";
  hidden?: (row) => boolean; // Condicional para exibir
}
```

**Exemplo com ações:**

```tsx
const rowActions: RowAction[] = [
  {
    id: "edit",
    label: "Editar",
    icon: <Pencil className="w-4 h-4" />,
    onClick: (row) => handleEdit(row),
  },
  {
    id: "delete",
    label: "Deletar",
    icon: <Trash2 className="w-4 h-4" />,
    onClick: (row) => handleDelete(row),
    variant: "destructive",
  },
];

<DataTable rowActions={rowActions} {...props} />;
```

### `striped?: boolean`

Alterna cores das linhas (zebra pattern).

### `highlightRow?: (row) => boolean`

Função que retorna `true` para linhas destacadas.

```tsx
<DataTable highlightRow={(row) => row.status === "pending"} />
```

## Padrões de Design

### 1. Status Badge

```tsx
const columns: Column[] = [
  {
    key: "status",
    label: "Status",
    render: (value) => (
      <Badge variant={value === "active" ? "default" : "secondary"}>
        {value}
      </Badge>
    ),
  },
];
```

### 2. Actions com Dropdown

```tsx
const rowActions: RowAction[] = [
  { id: "edit", label: "Editar", onClick: handleEdit },
  {
    id: "delete",
    label: "Deletar",
    onClick: handleDelete,
    variant: "destructive",
  },
];
// Com múltiplas ações, automaticamente exibe dropdown com MoreHorizontal icon
```

### 3. Integração com React Query

```tsx
export function MembersTable() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["members"],
    queryFn: fetchMembers,
  });

  const { mutate: deleteMember } = useMutation({
    mutationFn: async (id) => await api.delete(`/members/${id}`),
    onSuccess: () => refetch(),
  });

  const rowActions: RowAction[] = [
    {
      id: "delete",
      label: "Deletar",
      onClick: (row) => deleteMember(row.id),
      variant: "destructive",
    },
  ];

  return (
    <DataTable
      headers={columns}
      data={data || []}
      isLoading={isLoading}
      rowActions={rowActions}
    />
  );
}
```

## Customização de Estilo

### Cores Tailwind Modernas

O shadcn/ui usa as seguintes variáveis CSS (em `src/app/globals.css`):

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.6%;
  --muted: 0 0% 96.1%;
  --muted-foreground: 0 0% 45.1%;
  --border: 0 0% 89.8%;
  /* ... mais variáveis */
}
```

Usar `cn()` para combinar classes:

```tsx
<TableCell className={cn("font-bold", status === "critical" && "text-red-600")}>
  {value}
</TableCell>
```

## Próximos Passos

1. **Refatorar páginas** para usar o novo DataTable:
   - `/workspaces/[id]/members/page.tsx`
   - `/workspaces/[id]/contacts/page.tsx`
   - Outras páginas com listas

2. **Criar compostos UI** em `src/styles/ui-patterns.tsx`:
   - FilterBar com inputs e buttons
   - BulkActions para linhas selecionadas
   - ExportButton para exportar dados

3. **Padronizar formulários** com `form.tsx` do shadcn

## Troubleshooting

**Erro: "Checkbox not found"**

```bash
npx shadcn@latest add checkbox -y
```

**Erro: "Pagination not found"**

```bash
npx shadcn@latest add pagination -y
```

**DataTable não exibe paginação:**

- Certifique-se de passar a prop `pagination` com `onPageChange`

**Ações não aparecem:**

- Certifique-se de que `rowActions` está definido e não vazio
- Verifique se `hidden` está retornando `true` para todas as ações

## Recursos Adicionais

- [Shadcn/UI Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Classes](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)
