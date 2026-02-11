# 📖 Guia: Aplicar Padrão de Página em Suas Páginas

## ✅ O Que Foi Criado

Dois novos componentes para padronizar páginas como o shadcn-admin:

1. **PageHeader** - Título, descrição e ações
2. **PageContent** - Container para conteúdo com espaçamento

## 🎯 Como Usar em Uma Página Existente

### Antes (Sem Padrão)
```typescript
export default function MinhaPage() {
  return (
    <div>
      <h1>Título</h1>
      <table>{/* dados */}</table>
    </div>
  )
}
```

### Depois (Com Padrão)
```typescript
'use client'

import { PageHeader, PageContent, Button, DataTable } from '@/components'
import { Plus } from 'lucide-react'

export default function MinhaPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      {/* 1. Header */}
      <PageHeader
        title="Minha Página"
        description="Descrição"
      >
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo
        </Button>
      </PageHeader>

      {/* 2. Conteúdo */}
      <PageContent>
        <Input placeholder="Search..." />
        <DataTable columns={columns} data={data} />
      </PageContent>
    </div>
  )
}
```

## 📋 Passo a Passo

### 1️⃣ Adicionar Imports
```typescript
import { 
  PageHeader, 
  PageContent, 
  Button,
  DataTable 
} from '@/components'
import { Plus } from 'lucide-react'
```

### 2️⃣ Envolver com Div de Container
```typescript
<div className="flex-1 space-y-8 p-8 pt-6">
  {/* Seu conteúdo aqui */}
</div>
```

**Classes importantes:**
- `flex-1` - Toma todo espaço disponível
- `space-y-8` - Espaçamento entre seções (header, filtros, tabela)
- `p-8` - Padding geral
- `pt-6` - Padding menor no topo (debaixo do SecondaryHeader fixo)

### 3️⃣ Adicionar PageHeader
```typescript
<PageHeader
  title="Seu Título"
  description="Descrição opcional"
>
  {/* Botões e ações aqui */}
  <Button>Novo</Button>
  <Button variant="outline">Exportar</Button>
</PageHeader>
```

### 4️⃣ Adicionar PageContent
```typescript
<PageContent>
  {/* Seus componentes aqui */}
  <Input placeholder="Search..." />
  <Select>...</Select>
  <DataTable columns={cols} data={data} />
</PageContent>
```

## 🎨 Exemplos Reais

### Exemplo 1: Página de Pessoas
```typescript
export default function PeoplePage() {
  const { data } = useQuery(...)
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <PageHeader
        title="Pessoas"
        description="Gerenciar pessoas do seu workspace"
      >
        <Button onClick={() => setOpenDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Pessoa
        </Button>
      </PageHeader>

      <PageContent>
        <div className="flex gap-2">
          <Input placeholder="Buscar..." />
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filtro" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cliente">Cliente</SelectItem>
              <SelectItem value="fornecedor">Fornecedor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DataTable columns={columns} data={data} />
      </PageContent>

      <CreatePersonDialog 
        open={openDialog}
        onOpenChange={setOpenDialog}
      />
    </div>
  )
}
```

### Exemplo 2: Página de Transações
```typescript
export default function TransactionsPage() {
  const { data } = useQuery(...)

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <PageHeader
        title="Transações"
        description="Histórico de movimentação de créditos"
      >
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </PageHeader>

      <PageContent>
        <div className="flex gap-2">
          <Input placeholder="Buscar transação..." />
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="debit">Débito</SelectItem>
              <SelectItem value="credit">Crédito</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DataTable columns={columns} data={data} />
      </PageContent>
    </div>
  )
}
```

## 📐 Estrutura Visual

```
┌─────────────────────────────────────────┐
│         SecondaryHeader (fixo)          │
├─────────────────────────────────────────┤
│                                         │
│  ┌─ p-8 ──────────────────────────────┐ │
│  │                                     │ │
│  │  Título                     [Ação]  │  space-y-8
│  │  Descrição                          │ │
│  │                                     │ │
│  ├─────────────────────────────────────┤ │
│  │                                     │ │
│  │  [Input] [Select] [Select] [View]  │  space-y-4
│  │                                     │ │ (dentro de
│  ├─────────────────────────────────────┤ │  PageContent)
│  │                                     │ │
│  │  ┌─ border ─────────────────────┐  │ │
│  │  │                              │  │ │
│  │  │     Tabela / Dados           │  │ │
│  │  │                              │  │ │
│  │  └──────────────────────────────┘  │ │
│  │                                     │ │
│  └─────────────────────────────────────┘ │
│                                         │
```

## 🎯 Checklist de Implementação

- [ ] Importar `PageHeader` e `PageContent` de `@/components`
- [ ] Envolver página com `<div className="flex-1 space-y-8 p-8 pt-6">`
- [ ] Adicionar `<PageHeader title="..." description="...">` com ações
- [ ] Adicionar `<PageContent>` com filtros e tabela
- [ ] Testar responsividade em mobile
- [ ] Verificar espaçamento visual
- [ ] Commit e pronto! ✅

## 🎨 Dicas de Estilo

### Botões
```typescript
// Primário (ação principal)
<Button>Nova Página</Button>

// Secundário (ações adicionais)
<Button variant="outline">Exportar</Button>

// Com ícone
<Button>
  <Plus className="mr-2 h-4 w-4" />
  Novo
</Button>
```

### Filtros
```typescript
// Sempre dentro de PageContent
<div className="flex flex-col gap-4 md:flex-row md:items-center">
  <Input placeholder="Search..." className="w-full md:w-64" />
  <Select>...</Select>
  <Button>Filter</Button>
</div>
```

### Tabela
```typescript
// Use DataTable do projeto
<DataTable 
  columns={columns} 
  data={data}
  searchableColumns={[{ id: 'name', title: 'Nome' }]}
/>
```

## 📱 Responsividade

O padrão já é responsivo:
- Mobile: layout em coluna, inputs full width
- Desktop (md+): layout em linha, inputs com width fixo

```typescript
<div className="flex flex-col gap-4 md:flex-row">
  <Input className="w-full md:w-64" />  {/* Full mobile, 64 desktop */}
</div>
```

## 🚀 Próximos Passos

1. Copie o padrão para suas páginas existentes
2. Ajuste títulos e descrições
3. Coloque seus filtros e tabelas em `PageContent`
4. Teste em mobile e desktop
5. Commit! ✅

---

**Exemplo completo em:** `/src/app/(protected)/exemplo-pagina/page.tsx`

**Documentação:** [PAGE_LAYOUT_PATTERN.md](../PAGE_LAYOUT_PATTERN.md)
