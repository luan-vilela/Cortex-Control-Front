# Módulo de Auditoria - Frontend

## Estrutura

```
src/modules/auditoria/
├── types/
│   └── index.ts                  # Tipos TypeScript (AuditLog, AuditAction, etc)
├── components/
│   ├── ActionBadge.tsx          # Badge para exibir tipo de ação
│   └── ModuleBadge.tsx          # Badge para exibir módulo/feature
├── hooks/
│   └── useAuditoria.ts          # Hooks React Query
├── auditoria.service.ts          # Serviço de comunicação com API
└── index.ts                      # Exports públicos
```

## Página

```
src/app/(protected)/auditoria/
└── page.tsx                      # Página principal com tabela e filtros
```

## Componentes Principais

### ActionBadge

Badge colorido para exibir o tipo de ação:

- **CREATE**: Verde (success)
- **UPDATE**: Padrão (default)
- **DELETE**: Vermelho (destructive)
- **STATUS_CHANGE**: Secundário (secondary)

### ModuleBadge

Badge que exibe módulo e feature (se houver):

- Módulo em badge outline
- Feature em badge secondary (menor)
- Separados por seta →

## Filtros Disponíveis

### Filtros Básicos

- **Módulo**: Filtrar por módulo (financeiro, contatos, ordem-servico, workspace)
- **Ação**: Filtrar por tipo de ação (CREATE, UPDATE, DELETE, STATUS_CHANGE)
- **Data Range**: Filtrar por período (startDate e endDate)

### Filtros Avançados

- **Nome da Entidade**: Filtrar por tipo de entidade (ex: Transaction, Contact)
- **ID da Entidade**: Filtrar por ID específico
- **Feature**: Filtrar por sub-módulo (ex: controle-contas, fluxo-caixa)

## Hooks Disponíveis

### useAuditLogs

Lista logs de auditoria com filtros e paginação:

```typescript
const { data, isLoading } = useAuditLogs(workspaceId, filters)
```

### useEntityHistory

Obtém histórico completo de uma entidade específica:

```typescript
const { data } = useEntityHistory(workspaceId, 'Transaction', 123)
```

### useRecentActivity

Obtém atividade recente do workspace:

```typescript
const { data } = useRecentActivity(workspaceId, 20)
```

### useAuditStatistics

Obtém estatísticas de auditoria:

```typescript
const { data } = useAuditStatistics(workspaceId, startDate, endDate)
```

## Serviço API

### Métodos Disponíveis

#### getAuditLogs

Lista logs com filtros:

```typescript
const logs = await auditoriaService.getAuditLogs(workspaceId, {
  module: 'financeiro',
  action: AuditAction.CREATE,
  startDate: new Date('2024-01-01'),
  endDate: new Date('2024-12-31'),
  page: 1,
  limit: 20,
})
```

#### getEntityHistory

Histórico de uma entidade:

```typescript
const history = await auditoriaService.getEntityHistory(workspaceId, 'Transaction', 123)
```

#### getRecentActivity

Atividade recente:

```typescript
const recent = await auditoriaService.getRecentActivity(workspaceId, 20)
```

#### getStatistics

Estatísticas:

```typescript
const stats = await auditoriaService.getStatistics(
  workspaceId,
  new Date('2024-01-01'),
  new Date('2024-12-31')
)
```

## Estrutura da Resposta

### AuditLog

```typescript
{
  id: number
  module: string              // 'financeiro', 'contatos', etc
  feature?: string            // 'controle-contas', 'fluxo-caixa', etc
  entityName: string          // 'Transaction', 'Contact', etc
  entityId: number
  action: AuditAction
  oldValue?: Record<string, any>
  newValue?: Record<string, any>
  userId: string
  workspaceId: string
  ipAddress?: string
  userAgent?: string
  createdAt: string
  user?: {
    id: string
    name: string
    email: string
  }
}
```

### GetAuditLogsResponse

```typescript
{
  data: AuditLog[]
  total: number
  page: number
  limit: number
  totalPages: number
}
```

## Dialog de Detalhes

Ao clicar em "Ver Detalhes" em um log, abre um dialog com:

- Informações básicas (data, usuário, módulo, ação)
- Entidade afetada (nome e ID)
- IP Address e User Agent
- Valor anterior (oldValue) em JSON formatado
- Novo valor (newValue) em JSON formatado

## Integração com Módulos

O módulo está integrado ao sistema de módulos do workspace:

- **ID**: `auditoria`
- **Nome**: Auditoria
- **Descrição**: Registro completo de ações realizadas no sistema
- **Ícone**: FileSearch
- **Categoria**: core
- **Dependências**: settings

## Configuração no Backend

O módulo está registrado em:

- `/home/luan/Level67/crm/cortex-control/src/modules/workspace/config/modules.config.ts`
- Rota: `/auditoria`
- Habilitado por padrão no workspace: `5ac74f2f-4192-4c9b-a494-8bc68578080b`

## Exemplo de Uso

```tsx
import { useAuditLogs } from '@/modules/auditoria'
import { AuditAction } from '@/modules/auditoria/types'

function AuditoriaPage() {
  const [filters, setFilters] = useState({
    module: 'financeiro',
    action: AuditAction.CREATE,
    page: 1,
    limit: 20,
  })

  const { data, isLoading } = useAuditLogs(workspaceId, filters)

  return (
    <div>
      {data?.data.map((log) => (
        <div key={log.id}>
          <ActionBadge action={log.action} />
          <ModuleBadge module={log.module} feature={log.feature} />
          <p>
            {log.entityName} #{log.entityId}
          </p>
          <p>{log.user?.name}</p>
        </div>
      ))}
    </div>
  )
}
```

## Próximos Passos

1. ✅ Estrutura básica implementada
2. ✅ Tabela com filtros e paginação
3. ✅ Dialog de detalhes
4. ✅ Integração com sistema de módulos
5. ⏳ Dashboard de estatísticas
6. ⏳ Timeline de mudanças por entidade
7. ⏳ Exportação de relatórios
8. ⏳ Alertas automáticos
