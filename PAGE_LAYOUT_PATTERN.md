# 📄 Page Layout Pattern - Padrão de Página

Novo padrão de página baseado no shadcn-admin para manter consistência visual.

## 🎨 Estrutura Padrão

```typescript
'use client'

import { PageHeader } from '@/components'
import { PageContent } from '@/components'
import { Button } from '@/components'

export default function MyPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      {/* 1. Header com título, descrição e ações */}
      <PageHeader
        title="Seu Título"
        description="Descrição da página"
      >
        <div className="flex gap-2">
          <Button>Ação 1</Button>
          <Button>Ação 2</Button>
        </div>
      </PageHeader>

      {/* 2. Conteúdo principal */}
      <PageContent>
        {/* Filtros, Search, etc */}
        <div>Filtros aqui</div>

        {/* Sua Tabela ou Conteúdo */}
        <div>DataTable aqui</div>
      </PageContent>
    </div>
  )
}
```

## 📦 Componentes Disponíveis

### PageHeader
```typescript
<PageHeader
  title="User List"           // Obrigatório
  description="Manage users"  // Opcional
>
  {/* Botões ou ações */}
  <Button>Add User</Button>
</PageHeader>
```

Renderiza:
- Título em grande (text-3xl)
- Descrição em cinza (muted-foreground)
- Ações à direita

### PageContent
```typescript
<PageContent>
  {/* Seu conteúdo aqui */}
  <DataTable columns={cols} data={data} />
</PageContent>
```

Renderiza:
- Container com espaçamento uniforme
- space-y-4 para espaçamento vertical

## 🎯 Exemplo Completo

Ver: `/src/app/(protected)/example/page.tsx`

Estructura:
1. **Container externo** - `flex-1 space-y-8 p-8 pt-6`
   - flex-1: toma todo espaço disponível
   - space-y-8: espaçamento entre seções
   - p-8: padding no conteúdo
   - pt-6: padding menor no topo (debaixo do header fixo)

2. **PageHeader** - Título + descrição + ações

3. **Filtros** - Input, Selects, etc

4. **DataTable** - Seu componente de tabela

5. **Paginação** - Automática no DataTable

## 🎨 Tema de Cores

Usa variáveis CSS do projeto:
- `--gh-bg`: Background (#f6f8fa)
- `--gh-card`: Card background (#ffffff)
- `--gh-text`: Text color (#24292f)
- `--gh-text-secondary`: Secondary text
- `--gh-border`: Borders

## 💡 Dicas

1. **Sempre use PageHeader + PageContent**
   - Mantém consistência visual
   - Fácil de manter

2. **Padding padrão: p-8**
   - Cria espaço respirável ao redor

3. **Espaçamento entre seções: space-y-8**
   - Separa visualmente header, filtros e tabela

4. **Responsive**
   - Usa Tailwind's responsive classes
   - Adapta automaticamente em mobile

## 📱 Mobile

O padrão é mobile-first:
```css
md:flex-row  /* Desktop */
flex-col     /* Mobile */
md:w-64      /* Desktop width */
w-full       /* Mobile width */
```

## 🔗 Exemplo Real

```typescript
import { PageHeader, PageContent, DataTable, Button } from '@/components'

export default function PeoplePage() {
  const { data } = useQuery(...)

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <PageHeader
        title="Pessoas"
        description="Gerenciar pessoas do workspace"
      >
        <Button onClick={() => setOpenDialog(true)}>
          + Nova Pessoa
        </Button>
      </PageHeader>

      <PageContent>
        <SearchAndFilters />
        <DataTable columns={columns} data={data} />
      </PageContent>
    </div>
  )
}
```

## ✅ Checklist

- [ ] Use `flex-1 space-y-8 p-8 pt-6` no container
- [ ] Use `PageHeader` para título e ações
- [ ] Use `PageContent` para conteúdo
- [ ] Adicione filtros dentro de `PageContent`
- [ ] Coloque `DataTable` dentro de `PageContent`
- [ ] Use `md:` classes para responsividade

---

Ver arquivo de exemplo: [/src/app/(protected)/example/page.tsx](../example/page.tsx)
