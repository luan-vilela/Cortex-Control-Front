# React Query - Implementação Completa ✅

## 🎉 O que foi implementado

React Query (TanStack Query) foi integrado ao projeto para gerenciar **cache e estado de servidor**, substituindo a necessidade de gerenciar estados de loading, dados e errors manualmente.

## 📦 Pacotes Instalados

```bash
@tanstack/react-query
@tanstack/react-query-devtools
```

## 🏗️ Estrutura Criada

```
src/
├── lib/
│   ├── queryClient.ts      # Configuração do QueryClient
│   └── QueryProvider.tsx   # Provider com DevTools
│
└── modules/workspace/hooks/
    ├── index.ts                       # Exports centralizados
    ├── queryKeys.ts                   # Query keys organizadas
    ├── useWorkspaceQueries.ts        # Hooks de queries (GET)
    └── useWorkspaceMutations.ts      # Hooks de mutations (POST/PATCH/DELETE)
```

## 🔑 Query Keys

Organização hierárquica para invalidação inteligente:

```typescript
workspaceKeys = {
  all: ['workspaces']                    // Invalida TUDO
  lists: () => ['workspaces', 'list']    // Invalida listas
  details: () => ['workspaces', 'detail'] // Invalida detalhes
  detail: (id) => ['workspaces', 'detail', id] // Workspace específico
  members: (id) => ['workspaces', 'detail', id, 'members'] // Membros
  invites: () => ['workspaces', 'invites'] // Convites
}
```

## 📝 Hooks Criados

### Queries (GET - Leitura)

- ✅ `useWorkspaces()` - Lista todos os workspaces
- ✅ `useWorkspace(id)` - Detalhes de um workspace
- ✅ `useWorkspaceMembers(workspaceId)` - Membros de um workspace
- ✅ `useWorkspaceInvites()` - Convites pendentes

### Mutations (POST/PATCH/DELETE - Escrita)

- ✅ `useCreateWorkspace()` - Criar workspace
- ✅ `useUpdateWorkspace(id)` - Atualizar workspace
- ✅ `useDeleteWorkspace()` - Deletar workspace
- ✅ `useInviteMember(workspaceId)` - Convidar membro
- ✅ `useUpdateMemberPermissions(workspaceId)` - Atualizar permissões
- ✅ `useRemoveMember(workspaceId)` - Remover membro
- ✅ `useAcceptInvite()` - Aceitar convite
- ✅ `useRejectInvite()` - Rejeitar convite
- ✅ `useSwitchWorkspace()` - Trocar workspace ativo

## 🔄 Páginas Migradas

Todas as páginas de workspaces foram migradas para usar React Query:

1. ✅ [dashboard/page.tsx](<cortex-control-front/src/app/(protected)/dashboard/page.tsx>)
2. ✅ [workspaces/page.tsx](<cortex-control-front/src/app/(protected)/workspaces/page.tsx>)
3. ✅ [workspaces/new/page.tsx](<cortex-control-front/src/app/(protected)/workspaces/new/page.tsx>)
4. ✅ [workspaces/invites/page.tsx](<cortex-control-front/src/app/(protected)/workspaces/invites/page.tsx>)
5. ✅ [workspaces/[id]/members/page.tsx](<cortex-control-front/src/app/(protected)/workspaces/%5Bid%5D/members/page.tsx>)

## 📊 Antes vs Depois

### Antes (com useState e useEffect)

```tsx
const [members, setMembers] = useState<WorkspaceMember[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await workspaceService.getWorkspaceMembers(workspaceId);
      setMembers(data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  loadMembers();
}, [workspaceId]);

// Mutation
const handleInvite = async () => {
  setInviteLoading(true);
  try {
    await workspaceService.inviteMember(workspaceId, data);
    await loadMembers(); // Refetch manual
  } catch (error) {
    setError(error);
  } finally {
    setInviteLoading(false);
  }
};
```

### Depois (com React Query)

```tsx
const { data: members = [], isLoading } = useWorkspaceMembers(workspaceId);
const inviteMutation = useInviteMember(workspaceId);

// Mutation
const handleInvite = () => {
  inviteMutation.mutate(data, {
    onSuccess: () => {
      // Cache atualizado automaticamente!
      alert("Convite enviado!");
    },
    onError: (error) => {
      alert("Erro ao enviar convite");
    },
  });
};
```

## 🎯 Benefícios Obtidos

### 1. **Menos Código**

- ❌ Não precisa mais de `useState` para dados, loading e error
- ❌ Não precisa mais de `useEffect` para carregar dados
- ❌ Não precisa mais de refetch manual após mutations

### 2. **Cache Inteligente**

- ✅ Dados compartilhados entre componentes
- ✅ Reduz requisições ao backend
- ✅ Navegação instantânea (dados em cache)

### 3. **Sincronização Automática**

- ✅ Mutations invalidam queries relacionadas
- ✅ Todos os componentes atualizados automaticamente
- ✅ Estado sempre consistente

### 4. **UX Melhorada**

- ✅ Loading states automáticos
- ✅ Retry automático em caso de erro
- ✅ Revalidação em segundo plano

### 5. **DevTools**

- ✅ Visualizar todas as queries em tempo real
- ✅ Ver cache e estados
- ✅ Debug facilitado

## 🔧 Configuração do QueryClient

```typescript
// lib/queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minuto
      gcTime: 5 * 60 * 1000, // 5 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
```

### Stale Time por Hook

Ajustamos o `staleTime` baseado na volatilidade dos dados:

- **Workspaces**: 2 minutos (dados estáveis)
- **Membros**: 1 minuto (dados moderadamente voláteis)
- **Convites**: 30 segundos (dados muito voláteis)

## 🎨 DevTools

React Query DevTools está disponível no canto inferior direito em ambiente de desenvolvimento:

- 🔍 Visualizar queries ativas
- 📊 Ver estados (fetching, success, error)
- 🗂️ Inspecionar cache
- ⚡ Refetch manual
- 🗑️ Limpar cache

## 🔄 Zustand vs React Query

### Mantém Zustand

- ✅ **Auth** (`useAuthStore`) - Estado global de autenticação
  - user, token, isAuthenticated
  - Login/logout
  - Persistência em localStorage

### Usa React Query

- ✅ **Workspaces** - Dados de servidor com cache
- ✅ **Membros** - Dados temporários de página
- ✅ **Convites** - Dados voláteis

## 📖 Como Usar

### 1. Query Simples

```tsx
import { useWorkspaces } from "@/modules/workspace/hooks";

function MyComponent() {
  const { data: workspaces = [], isLoading, error } = useWorkspaces();

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return <WorkspaceList workspaces={workspaces} />;
}
```

### 2. Mutation

```tsx
import { useCreateWorkspace } from "@/modules/workspace/hooks";

function CreateForm() {
  const createMutation = useCreateWorkspace();

  const handleSubmit = (data) => {
    createMutation.mutate(data, {
      onSuccess: () => router.push("/workspaces"),
      onError: (error) => alert(error.message),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <button disabled={createMutation.isPending}>
        {createMutation.isPending ? "Criando..." : "Criar"}
      </button>
    </form>
  );
}
```

### 3. Query com Parâmetros

```tsx
import { useWorkspaceMembers } from "@/modules/workspace/hooks";

function MembersPage({ workspaceId }: { workspaceId: string }) {
  const { data: members = [], isLoading } = useWorkspaceMembers(workspaceId);

  // Query só executa se workspaceId existe (enabled: !!id)
  // Cache diferente para cada workspaceId
}
```

## 🚀 Próximos Passos

Sugestões para expandir o uso do React Query:

1. **Auth Queries**
   - `useMe()` - Dados do usuário logado
   - `useRefreshToken()` - Refresh automático

2. **Optimistic Updates**
   - Atualizar UI antes da resposta do servidor
   - Rollback automático em caso de erro

3. **Infinite Queries**
   - Paginação infinita de membros/workspaces
   - Scroll infinito

4. **Prefetch**
   - Pré-carregar dados ao hover
   - Navegação instantânea

5. **Parallel Queries**
   - Carregar múltiplas queries em paralelo
   - `useQueries()` hook

## 📚 Referências

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Query Keys Best Practices](https://tkdodo.eu/blog/effective-react-query-keys)
- [React Query DevTools](https://tanstack.com/query/latest/docs/react/devtools)

---

**✅ Implementação completa e funcional!**

Todos os componentes de workspace agora usam React Query, com cache inteligente, sincronização automática e melhor UX. 🚀
