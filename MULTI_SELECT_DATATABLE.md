# Multi-Seleção no DataTable

## Funcionalidade

O componente `DataTable` agora suporta multi-seleção de registros com:

- ✅ Checkboxes para cada linha
- ✅ Checkbox "Selecionar Todos" no header
- ✅ Callback com lista de objetos selecionados
- ✅ Highlight visual (bg-blue-50) em linhas selecionadas

## Como Usar

### Props do DataTable

```typescript
interface DataTableProps {
  headers: Column[];
  data: any[];
  isLoading?: boolean;
  emptyMessage?: string;
  selectable?: boolean; // Nova prop
  onSelectionChange?: (selectedRows: any[]) => void; // Nova prop
}
```

### Exemplo de Implementação

```tsx
import { useState } from "react";
import { DataTable } from "@/components/DataTable";

export function MyListComponent() {
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  return (
    <DataTable
      headers={[
        { key: "nome", label: "Nome" },
        { key: "email", label: "Email" },
        // ... mais colunas
      ]}
      data={data || []}
      isLoading={isLoading}
      selectable={true} // Ativa multi-seleção
      onSelectionChange={(selected) => setSelectedItems(selected)}
    />
  );
}
```

## Retorno do onSelectionChange

Recebe um array de objetos completos selecionados:

```typescript
[
  {
    id: "123",
    person: { name: "João Silva" },
    email: "joao@example.com",
    status: "ATIVO",
    // ... todos os campos do objeto
  },
  {
    id: "456",
    person: { name: "Maria Santos" },
    email: "maria@example.com",
    status: "INATIVO",
    // ... todos os campos do objeto
  },
];
```

## Componentes Internos Modificados

### DataTable.tsx

- Adiciona state para rastrear seleções (`selectedRows`, `selectAll`)
- Gerencia lógica de seleção individual e coletiva
- Passa props de seleção para Header e Rows

### DataTableHeader.tsx

- Renderiza checkbox "Selecionar Todos" quando `selectable={true}`
- Coluna adicional com width: w-12

### DataTableRow.tsx

- Renderiza checkbox para cada linha quando `selectable={true}`
- Aplica classe `bg-blue-50` quando linha está selecionada
- Chama `onSelect` ao clicar no checkbox

## Estilos Aplicados

- **Coluna de checkbox**: `w-12` (largura fixa)
- **Linha selecionada**: `bg-blue-50` (fundo azul claro)
- **Checkboxes**: Classe `border-gh-border cursor-pointer`

## Componentes Já Implementados

✅ ClienteListComponent - Seleciona `selectedClientes`
✅ FornecedorListComponent - Seleciona `selectedFornecedores`
✅ ParceiroListComponent - Seleciona `selectedParceiros`

Todos têm debug boxes mostrando os objetos selecionados em JSON.

## Próximos Passos

Para remover os debug boxes e usar em produção:

1. Remover a div debug no componente
2. Usar `selectedItems` para ações em batch (delete, export, etc)
3. Adicionar botões de ação (Deletar Selecionados, Exportar, etc)
