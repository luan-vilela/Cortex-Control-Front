# Cortex Control - Frontend

Frontend Next.js 16 para o CRM Cortex Control, um sistema multi-tenant para gestão de clientes, fornecedores e parceiros.

## Começando

### Instalar dependências
```bash
npm install
```

### Iniciar servidor de desenvolvimento
```bash
npm run dev
```

Acesse [http://localhost:3001](http://localhost:3001) no navegador.

### Build para produção
```bash
npm run build
npm start
```

## Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── (protected)/       # Rotas autenticadas
│   │   ├── persons/       # Módulo de contatos (PRINCIPAL)
│   │   ├── leads/         # Módulo de leads
│   │   ├── workspace/     # Configurações do workspace
│   │   └── ...
│   └── (public)/          # Rotas públicas (login, register)
├── components/            # Componentes reutilizáveis
├── lib/                   # Utilitários (API client, query client)
├── modules/               # Módulos de negócio
│   ├── person/           # Person service, hooks, tipos
│   ├── auth/             # Autenticação
│   ├── wallet/           # Sistema de créditos
│   └── ...
├── contexts/             # Contextos React (Alerts)
├── providers/            # Providers (Theme, Query, etc)
└── store/                # Zustand stores (workspace, theme)
```

## Principais Módulos

### Contatos (Persons)
- **Rota**: `/workspaces/[id]/contatos`
- **Funcionalidades**: CRUD de contatos com papéis (CLIENTE, FORNECEDOR, PARCEIRO)
- **Hooks**: `usePersons`, `usePerson`, `useCreatePerson`, `useUpdatePerson`, `useDeletePerson`
- **Arquivo de referência**: [MODULO_CONTATOS_PADRONIZADO.md](../MODULO_CONTATOS_PADRONIZADO.md)

### Leads
- **Rota**: `/workspaces/[id]/leads`
- **Funcionalidades**: Gestão de leads e conversão para cliente

### Workspace
- **Rota**: `/workspaces/[id]/settings`
- **Funcionalidades**: Configurações, membros, módulos ativos

## Stack Tecnológico

- **Framework**: Next.js 16.1.6 (App Router)
- **React**: 18.3
- **State Management**: 
  - **Server State**: React Query (@tanstack/react-query 5.63.1)
  - **Client State**: Zustand 4.5.5
- **Formulários**: React Hook Form + Zod
- **Styling**: Tailwind CSS 4.0 + gh-theme customizado
- **Icons**: Lucide React
- **HTTP Client**: Axios com interceptor JWT
- **Testing**: Jest + React Testing Library

## Convenções de Código

### Hooks de Dados
```typescript
// Queries (leitura)
const { data, isLoading, error } = usePersons(workspaceId, filters);
const { data: person } = usePerson(workspaceId, id);

// Mutations (escrita)
const createMutation = useCreatePerson(workspaceId);
createMutation.mutate(data, {
  onSuccess: () => {
    queryClient.invalidateQueries(['persons', workspaceId]);
  }
});
```

### Componentes
```typescript
export default function MyComponent() {
  const { activeWorkspace } = useWorkspaceStore();
  const router = useRouter();
  
  return (
    <div className="space-y-4">
      {/* Tailwind + gh-theme */}
    </div>
  );
}
```

### Autenticação
- JWT token armazenado em localStorage
- Interceptor automático em requisições HTTP
- Guard de rotas em `middleware.ts`

## Testes

```bash
npm test                # Testes unitários
npm test -- --watch     # Watch mode
npm test -- --coverage  # Cobertura
```

## Troubleshooting

### Turbopack causando problemas?
```bash
TURBOPACK=0 npm run dev
```

### Limpar cache
```bash
rm -rf .next && npm run dev
```

### Rreconstruir dependências
```bash
rm -rf node_modules package-lock.json && npm install
```

## Integração com Backend

### API Base URL
- Desenvolvimento: `http://localhost:3000`
- Produção: Configurável via `NEXT_PUBLIC_API_URL`

### Endpoints Principais
- `POST /auth/login` - Login com email/senha ou Google/Facebook
- `POST /auth/register` - Registro de novo usuário
- `GET /workspaces/:id` - Detalhes do workspace
- `GET /workspaces/:id/contatos` - Lista de contatos
- `POST /workspaces/:id/contatos` - Criar contato
- `PATCH /workspaces/:id/contatos/:personId` - Editar contato
- `DELETE /workspaces/:id/contatos/:personId` - Deletar contato

Ver [INTEGRACAO_FRONTEND.md](../INTEGRACAO_FRONTEND.md) para documentação completa da integração.

## Documentação Relacionada

- [CONTEXTO_PROJETO.md](../CONTEXTO_PROJETO.md) - Visão geral do projeto
- [MODULO_CONTATOS_PADRONIZADO.md](../MODULO_CONTATOS_PADRONIZADO.md) - Detalhes do módulo de contatos
- [INTEGRACAO_FRONTEND.md](../INTEGRACAO_FRONTEND.md) - Comunicação com backend
- [INTERFACE_PESSOAS.md](./INTERFACE_PESSOAS.md) - Interface do módulo de pessoas
