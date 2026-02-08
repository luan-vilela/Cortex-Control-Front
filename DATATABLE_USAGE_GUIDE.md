# DataTable Usage Guide

Complete guide para usar componentes de DataTable no cortex-control-front seguindo padrões do shadcn-admin.

## Componentes Disponíveis

- **DataTableColumnHeader** - Headers com sorting
- **DataTablePagination** - Paginação com ellipsis
- **DataTableToolbar** - Search e filters
- **DataTableViewOptions** - Toggle de colunas
- **DataTableBulkActions** - Ações em massa
- **DataTableFacetedFilter** - Filtros facetados

## Exemplo Completo

```typescript
'use client'

import { useState } from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DataTableColumnHeader,
  DataTablePagination,
  DataTableToolbar,
  DataTableViewOptions,
} from '@/components'

// 1. Define seu tipo de dados
interface Person {
  id: string
  name: string
  email: string
  status: 'active' | 'inactive'
  role: 'admin' | 'user'
  createdAt: Date
}

// 2. Crie as colunas com sorting e filtering
const columns: ColumnDef<Person>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'role',
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Papel" />
    ),
  },
]

// 3. Use a tabela em seu componente
export function PeopleTable({ data }: { data: Person[] }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="space-y-4">
      {/* Toolbar com search e filters */}
      <DataTableToolbar table={table} />

      {/* View options para toggle de colunas */}
      <DataTableViewOptions table={table} />

      {/* Tabela */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Nenhum resultado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação com ellipsis */}
      <DataTablePagination table={table} />
    </div>
  )
}
```

## Recurso: DataTableColumnHeader

Componente reutilizável para headers com sorting e visibilidade.

```typescript
import { DataTableColumnHeader } from '@/components'

// Em sua ColumnDef:
header: ({ column }) => (
  <DataTableColumnHeader
    column={column}
    title="Nome"
  />
)
```

**Funcionalidades:**
- ✅ Ícone de sorting (▲▼⬍)
- ✅ Dropdown menu para asc/desc
- ✅ Botão para ocultar coluna
- ✅ Desabilita se coluna não é sortável

## Recurso: DataTablePagination

Paginação com ellipsis (ex: 1 2 3 ... 10 11 12)

```typescript
import { DataTablePagination } from '@/components'

// No fim da tabela:
<DataTablePagination table={table} />
```

**Incluído:**
- Botões previous/next
- Seletor de página size
- Indicador de página atual
- Ellipsis para muitas páginas

## Recurso: DataTableToolbar

Search e filtros facetados.

```typescript
import { DataTableToolbar } from '@/components'

<DataTableToolbar table={table} />
```

**Customização:**
```typescript
// Em DataTableToolbar.tsx, adicione seus filtros:
{isVisible && (
  <>
    {table.getColumn('status') && (
      <DataTableFacetedFilter
        column={table.getColumn('status')}
        title="Status"
        options={[
          { label: 'Ativo', value: 'active' },
          { label: 'Inativo', value: 'inactive' },
        ]}
      />
    )}
  </>
)}
```

## Recurso: DataTableViewOptions

Toggle de visibilidade de colunas.

```typescript
import { DataTableViewOptions } from '@/components'

<DataTableViewOptions table={table} />
```

Mostra dropdown com checkbox para cada coluna.

## Recurso: DataTableBulkActions

Ações em massa (delete, export, etc).

```typescript
import { DataTableBulkActions } from '@/components'

{table.getFilteredSelectedRowModel().rows.length > 0 && (
  <DataTableBulkActions table={table} />
)}
```

## URL-Driven State (Avançado)

Para sincronizar state com URL query params:

```typescript
'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function UsePaginationState() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const page = parseInt(searchParams.get('page') ?? '1')
  const pageSize = parseInt(searchParams.get('pageSize') ?? '10')
  const sort = searchParams.get('sort')

  const updateUrl = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams)
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value)
        else params.delete(key)
      })
      router.push(`?${params.toString()}`)
    },
    [searchParams, router]
  )

  return { page, pageSize, sort, updateUrl }
}
```

## Dicas & Best Practices

1. **Sempre use `getCanSort()`** para verificar se coluna pode ser ordenada
2. **Filtros customizados** adicionam 2-3 linhas de código por coluna
3. **Paginação server-side** requer backend pagination na API
4. **Bulk actions** funcionam bem com `getFilteredSelectedRowModel()`
5. **URL state** permite compartilhar tabelas filtradas (copiar link)

## Componentes Relacionados

- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell` (shadcn/ui)
- `Button`, `Select`, `Checkbox` (shadcn/ui)
- `useReactTable`, `getCoreRowModel`, `getSortedRowModel` (@tanstack/react-table)

## Ver Também

- [React Table Docs](https://tanstack.com/table/latest)
- [shadcn/admin DataTable](https://github.com/satnaing/shadcn-admin/tree/main/src/components/data-table)
- [Projeto cortex-control-front](../README.md)
