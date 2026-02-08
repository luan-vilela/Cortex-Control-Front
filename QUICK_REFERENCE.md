# Quick Reference - Uso Rápido

## 📋 Checklist: Criar uma Nova Tabela em 5 Minutos

### 1️⃣ Criar arquivo `columns.tsx`

```typescript
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components'

export interface MyRowData {
  id: string
  name: string
  status: 'active' | 'inactive'
}

export const columns: ColumnDef<MyRowData>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
  },
]
```

### 2️⃣ Criar página

```typescript
'use client'

import { DataTable } from '@/components'
import { columns } from './columns'

export default function Page() {
  const data = [] // Buscar da API

  return (
    <div className="space-y-4">
      <h1>Minha Tabela</h1>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
```

### 3️⃣ Pronto! ✅

Sua tabela agora tem:
- ✅ Sorting
- ✅ Paginação
- ✅ Search
- ✅ Column toggle
- ✅ Row selection

---

## 🎣 Snippets Comuns

### Adicionar Coluna com Ícone Ação

```typescript
{
  id: 'actions',
  cell: ({ row }) => (
    <Button
      variant="ghost"
      onClick={() => console.log('Edit:', row.original.id)}
    >
      <Edit className="h-4 w-4" />
    </Button>
  ),
}
```

### Badge Status

```typescript
{
  id: 'status',
  accessorKey: 'status',
  cell: ({ row }) => {
    const status = row.getValue('status')
    return (
      <Badge variant={status === 'active' ? 'default' : 'secondary'}>
        {status}
      </Badge>
    )
  },
}
```

### Formatador Data

```typescript
{
  id: 'createdAt',
  accessorKey: 'createdAt',
  cell: ({ row }) => {
    return new Date(row.getValue('createdAt')).toLocaleDateString('pt-BR')
  },
}
```

### Checkbox Seleção

```typescript
{
  id: 'select',
  header: ({ table }) => (
    <Checkbox
      checked={table.getIsAllPageRowsSelected()}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
    />
  ),
}
```

---

## 🔗 Usar com URL State

```typescript
'use client'

import { useURLTableState } from '@/hooks'

export default function Page() {
  const { page, pageSize, sort, updateUrl } = useURLTableState()

  const handleSort = (columnId: string) => {
    const newSort = sort.includes('asc') ? 'desc' : 'asc'
    updateUrl({ sort: `${columnId}:${newSort}` })
  }

  return (
    <>
      <button onClick={() => handleSort('name')}>
        Ordenar por nome
      </button>
      <p>Página {page} de 10</p>
    </>
  )
}
```

---

## 🎨 Usar Dialog/Drawer

```typescript
'use client'

import { useDrawerState } from '@/hooks'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'

export default function Page() {
  const { isOpen, open, close } = useDrawerState()

  return (
    <>
      <button onClick={open}>Abrir</button>

      <Drawer open={isOpen} onOpenChange={isOpen ? close : open}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Título</DrawerTitle>
          </DrawerHeader>
          {/* Conteúdo */}
        </DrawerContent>
      </Drawer>
    </>
  )
}
```

---

## 📱 Usar useIsMobile

```typescript
'use client'

import { useIsMobile } from '@/hooks'

export default function MyComponent() {
  const isMobile = useIsMobile()

  return (
    <div>
      {isMobile ? (
        <MobileLayout />
      ) : (
        <DesktopLayout />
      )}
    </div>
  )
}
```

---

## 🎯 Padrões Comuns

### 1. Deletar com Confirmação

```typescript
const [toDelete, setToDelete] = useState<string | null>(null)

{
  id: 'actions',
  cell: ({ row }) => (
    <>
      <Button onClick={() => setToDelete(row.original.id)}>
        Deletar
      </Button>
      {toDelete === row.original.id && (
        <ConfirmDialog
          onConfirm={() => {
            // Deletar API call aqui
            setToDelete(null)
          }}
          onCancel={() => setToDelete(null)}
        />
      )}
    </>
  ),
}
```

### 2. Editar em Modal

```typescript
const [editingId, setEditingId] = useState<string | null>(null)

{
  id: 'actions',
  cell: ({ row }) => (
    <>
      <Button onClick={() => setEditingId(row.original.id)}>
        Editar
      </Button>
      {editingId === row.original.id && (
        <EditDialog
          item={row.original}
          onSave={() => setEditingId(null)}
          onCancel={() => setEditingId(null)}
        />
      )}
    </>
  ),
}
```

### 3. Exportar Selecionados

```typescript
{
  id: 'bulk-actions',
  cell: () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    
    return selectedRows.length > 0 && (
      <Button onClick={() => {
        const data = selectedRows.map(r => r.original)
        exportToCSV(data)
      }}>
        Exportar {selectedRows.length}
      </Button>
    )
  },
}
```

---

## 🚀 Scripts Disponíveis

```bash
# Type checking
npm run type-check

# Build
npm run build

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format

# Dev server
npm run dev
```

---

## 📍 Imports Rápidos

```typescript
// Componentes
import { 
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
  DataTableToolbar,
  DataTableViewOptions,
} from '@/components'

// Hooks
import {
  useIsMobile,
  useDialogState,
  useURLTableState,
  useDrawerState,
} from '@/hooks'

// UI Components
import { Button, Card, Badge } from '@/components'
import { 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell 
} from '@/components/ui/table'
```

---

## ⚡ Performance Tips

1. **Usar `getCoreRowModel()` primeiro**
   ```typescript
   getCoreRowModel: getCoreRowModel(),     // Sempre primeiro
   getFilteredRowModel: getFilteredRowModel(),
   getSortedRowModel: getSortedRowModel(),
   getPaginationRowModel: getPaginationRowModel(),
   ```

2. **Lazy load grandes tabelas**
   ```typescript
   const DataTable = lazy(() => import('@/components/data-table'))
   ```

3. **Memoizar columns**
   ```typescript
   const columns = useMemo(() => [...], [])
   ```

4. **Virtual scroll para 1000+ linhas**
   ```typescript
   // Ver TanStack Virtual documentation
   import { useVirtualizer } from '@tanstack/react-virtual'
   ```

---

## 🐛 Debug Tips

### Ver estado da tabela
```typescript
console.log('Sorting:', table.getState().sorting)
console.log('Filtering:', table.getState().columnFilters)
console.log('Pagination:', table.getState().pagination)
```

### Verificar dados
```typescript
console.log('Row model:', table.getRowModel().rows)
console.log('Selected:', table.getFilteredSelectedRowModel().rows)
```

### Verificar URL state
```typescript
const searchParams = useSearchParams()
console.log('URL params:', Object.fromEntries(searchParams))
```

---

## 📞 Referências

- [React Table Docs](https://tanstack.com/table/latest)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Next.js Docs](https://nextjs.org)

Ver também:
- `DATATABLE_USAGE_GUIDE.md` - Guia completo
- `DATATABLE_EXAMPLE.md` - Exemplo completo
- `IMPLEMENTATION_SUMMARY.md` - Resumo técnico

---

**Last Updated: 2024**  
**Version: 1.0**
