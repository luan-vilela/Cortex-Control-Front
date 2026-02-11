# Exemplo: Implementação de DataTable Completa

Este é um exemplo prático de como usar os componentes de DataTable do cortex-control-front seguindo padrões do shadcn-admin.

## Arquivo: `src/app/(protected)/pessoas/columns.tsx`

```typescript
import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components'
import { DataTableColumnHeader } from '@/components'
import { MoreHorizontal, Edit, Trash } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface PessoaRow {
  id: string
  name: string
  email: string
  phone?: string
  roles: string[] // CLIENTE, FORNECEDOR, LEAD, PARCEIRO
  status: 'active' | 'inactive'
  createdAt: Date
}

export const columns: ColumnDef<PessoaRow>[] = [
  // Checkbox para seleção
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // Coluna Nome
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nome" />
    ),
    cell: ({ row }) => {
      const name = row.getValue('name') as string
      return (
        <div className="font-medium">
          {name}
        </div>
      )
    },
  },

  // Coluna Email
  {
    id: 'email',
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      const email = row.getValue('email') as string
      return (
        <div className="text-sm text-muted-foreground">
          {email}
        </div>
      )
    },
  },

  // Coluna Papéis (Roles)
  {
    id: 'roles',
    accessorKey: 'roles',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Papéis" />
    ),
    cell: ({ row }) => {
      const roles = row.getValue('roles') as string[]
      const colorMap: Record<string, string> = {
        CLIENTE: 'bg-blue-100 text-blue-800',
        FORNECEDOR: 'bg-green-100 text-green-800',
        LEAD: 'bg-yellow-100 text-yellow-800',
        PARCEIRO: 'bg-purple-100 text-purple-800',
      }

      return (
        <div className="flex gap-2">
          {roles.map((role) => (
            <Badge
              key={role}
              variant="outline"
              className={colorMap[role] || ''}
            >
              {role}
            </Badge>
          ))}
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const roles = row.getValue(id) as string[]
      return value.some((v: string) => roles.includes(v))
    },
  },

  // Coluna Status
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as 'active' | 'inactive'
      return (
        <Badge variant={status === 'active' ? 'default' : 'secondary'}>
          {status === 'active' ? 'Ativo' : 'Inativo'}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  // Coluna Criado em
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Criado em" />
    ),
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date
      return new Date(date).toLocaleDateString('pt-BR')
    },
  },

  // Coluna Ações (não é sortável)
  {
    id: 'actions',
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const pessoa = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                // Editar pessoa
                console.log('Edit:', pessoa.id)
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                // Deletar pessoa
                console.log('Delete:', pessoa.id)
              }}
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              Deletar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
```

## Arquivo: `src/app/(protected)/pessoas/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components'
import { columns, type PessoaRow } from './columns'
import { api } from '@/lib/api'

export default function PessoasPage() {
  const [data, setData] = useState<PessoaRow[]>([])

  // Buscar dados da API
  const { data: pessoas, isLoading } = useQuery({
    queryKey: ['pessoas'],
    queryFn: async () => {
      const response = await api.get('/persons')
      // Transformar resposta para formato compatível com a tabela
      return response.data.map((p: any) => ({
        id: p.id,
        name: p.name,
        email: p.email,
        phone: p.phone,
        roles: p.roles.map((r: any) => r.type),
        status: p.active ? 'active' : 'inactive',
        createdAt: new Date(p.createdAt),
      }))
    },
  })

  useEffect(() => {
    if (pessoas) {
      setData(pessoas)
    }
  }, [pessoas])

  if (isLoading) {
    return <div>Carregando...</div>
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">Pessoas</h1>
        <p className="text-muted-foreground">
          Gerenciar todas as pessoas no workspace
        </p>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  )
}
```

## Características Implementadas

✅ **Checkbox de seleção** - Selecionar múltiplas linhas  
✅ **DataTableColumnHeader** - Sorting (ASC/DESC)  
✅ **Filtros** - Status, Roles  
✅ **Paginação** - Com ellipsis  
✅ **Column visibility** - Toggle de colunas  
✅ **Actions menu** - Editar/Deletar  
✅ **Badges** - Para status e roles  
✅ **Responsive** - Funciona em mobile  

## Passo a Passo para Adicionar a Sua Tabela

1. **Criar arquivo `columns.tsx`**
   - Importar `ColumnDef` do @tanstack/react-table
   - Criar interface com seus dados
   - Definir coluna header com `DataTableColumnHeader`

2. **Criar página com o componente**
   - Importar `DataTable` de `@/components`
   - Passar `columns` e `data`
   - Buscar dados com React Query

3. **Customizar filtros**
   - Usar `DataTableFacetedFilter` para cada filtro
   - Adicionar `filterFn` na coluna

4. **Adicionar ações**
   - Criar dropdown menu na coluna `actions`
   - Implementar handlers para editar/deletar

## Hooks Disponíveis

```typescript
// Sincronizar com URL
const { page, pageSize, sort, search, updateUrl, reset } = useURLTableState()

// Estado de drawer/dialog
const { isOpen, open, close, toggle, setIsOpen } = useDrawerState()
```

Veja também: [DATATABLE_USAGE_GUIDE.md](../DATATABLE_USAGE_GUIDE.md)
