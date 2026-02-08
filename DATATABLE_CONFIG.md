# DataTable - Configuração de Paginação Sticky

## Como Usar

A paginação sticky no bottom é **habilitada por padrão** em todas as DataTables.

### Habilitar (Padrão - já vem assim)

```tsx
<DataTable
  headers={columns}
  data={data}
  // stickyPagination={true}  // já é o padrão
/>
```

### Desabilitar em casos específicos

```tsx
<DataTable
  headers={columns}
  data={data}
  stickyPagination={false} // desabilita a paginação sticky
/>
```

## Propriedades

| Prop               | Tipo      | Padrão  | Descrição                                      |
| ------------------ | --------- | ------- | ---------------------------------------------- |
| `stickyPagination` | `boolean` | `true`  | Habilita/desabilita paginação sticky no bottom |
| `pageSize`         | `number`  | `20`    | Quantidade de itens por página                 |
| `maxPageSize`      | `number`  | `100`   | Máximo de itens permitidos por página          |
| `selectable`       | `boolean` | `false` | Habilita checkboxes de seleção                 |

## Exemplo Completo

```tsx
import { Column, DataTable, RowAction } from '@/components/DataTable'

export function MyPage() {
  const columns: Column[] = [
    {
      key: 'name',
      label: 'Nome',
      render: (value) => <span>{value}</span>,
    },
  ]

  const rowActions: RowAction[] = [
    {
      id: 'edit',
      label: 'Editar',
      onClick: (row) => console.log(row),
    },
  ]

  return (
    <DataTable
      headers={columns}
      data={items}
      selectable={true}
      pageSize={10}
      stickyPagination={true} // ou true (padrão)
      rowActions={rowActions}
      onRowClick={(row) => navigate(`/item/${row.id}`)}
    />
  )
}
```

## Onde Está Implementado

- **Componente**: `src/components/DataTable/DataTable.tsx`
- **Prop padrão**: Linha 81 - `stickyPagination = true`
- **Aplicação**: Linha 189 - Condicional na classe do container
- **Classe**: `cn("...", stickyPagination && "sticky bottom-0")`

## Padrão Global

Para **manter como padrão em todas as tabelas**, simplesmente use o DataTable sem a prop:

```tsx
// Já vem com paginação sticky
<DataTable headers={columns} data={data} />

// Se quiser remover em casos específicos
<DataTable headers={columns} data={data} stickyPagination={false} />
```

A paginação sticky fica visível no bottom da tela, com:

- ✅ Seletor de itens por página (10, 20, 50, 100)
- ✅ Informação de página atual
- ✅ Botões de navegação (anterior, números, próxima)
- ✅ Sempre fixo no bottom ao rolar
