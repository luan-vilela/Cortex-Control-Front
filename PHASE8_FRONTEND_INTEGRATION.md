# Phase 8 - Frontend Integration ✨ IN PROGRESS

## Overview

Integração completa do frontend (Next.js + React) com a nova API Contact do backend (NestJS).

## 🎯 Objetivos

✅ Criar React hooks para Contact API  
✅ Implementar componentes reutilizáveis  
✅ Criar páginas de gerenciamento de contatos  
✅ Manter compatibilidade com `/persons` (backward compatibility)  
⏳ Testes E2E (próximo passo)

## 📦 Estrutura Implementada

### 1. Types & DTOs (`src/modules/contact/types/`)

```typescript
export interface Contact {
  id: string
  workspaceId: string
  name: string
  type: ContactType (PF | PJ)
  document: string
  email: string
  website?: string
  address?: string
  active: boolean
  phones?: ContactPhone[]
  clientRole?: ClientRole
  supplierRole?: SupplierRole
  partnerRole?: PartnerRole
}
```

**Enums:**

- `ContactType`: PF, PJ
- `ClientStatus`: PROSPECT, ACTIVE, INACTIVE
- `SupplierStatus`: PROSPECT, ACTIVE, BLOCKED
- `PartnerStatus`: PROSPECT, ACTIVE, INACTIVE
- `PhoneType`: WHATSAPP, PERSONAL, COMMERCIAL

**DTOs:**

- `CreateContactDTO` - Criar contato
- `UpdateContactDTO` - Atualizar contato
- `CreateContactPhoneDTO` - Adicionar telefone
- `UpdateContactPhoneDTO` - Atualizar telefone
- `CreateClientRoleDTO` - Adicionar papel de cliente
- `UpdateClientRoleDTO` - Atualizar papel de cliente
- `CreateSupplierRoleDTO` - Adicionar papel de fornecedor
- `UpdateSupplierRoleDTO` - Atualizar papel de fornecedor
- `CreatePartnerRoleDTO` - Adicionar papel de parceiro
- `UpdatePartnerRoleDTO` - Atualizar papel de parceiro

### 2. API Client (`src/lib/api.ts`)

```typescript
export const contactAPI = {
  // CRUD
  createContact(workspaceId, data)
  getContact(workspaceId, contactId)
  listContacts(workspaceId, roleType?, active?)
  updateContact(workspaceId, contactId, data)
  deleteContact(workspaceId, contactId)
  restoreContact(workspaceId, contactId)
  hardDeleteContact(workspaceId, contactId)

  // Phones
  addPhone(workspaceId, contactId, data)
  updatePhone(workspaceId, contactId, phoneId, data)
  deletePhone(workspaceId, contactId, phoneId)

  // Roles
  addClientRole(workspaceId, contactId, data)
  updateClientRole(workspaceId, contactId, data)
  removeClientRole(workspaceId, contactId)
  // ... supplier e partner roles
}
```

### 3. React Hooks (`src/modules/contact/hooks/`)

**Query Hooks (Read):**

```typescript
useContact(workspaceId, contactId)        // Fetch single
useContacts(workspaceId, roleType?, active?) // Fetch list
useContactPhones(workspaceId, contactId)   // Fetch phones
```

**Mutation Hooks (Write):**

```typescript
useCreateContact(workspaceId); // Create
useUpdateContact(workspaceId, contactId); // Update
useDeleteContact(workspaceId); // Delete (soft)
useRestoreContact(workspaceId); // Restore
useHardDeleteContact(workspaceId); // Delete (hard)
useAddPhone(workspaceId, contactId); // Add phone
useUpdatePhone(workspaceId, contactId, phoneId);
useDeletePhone(workspaceId, contactId);
useAddClientRole(workspaceId, contactId); // Add client role
useUpdateClientRole(workspaceId, contactId);
useRemoveClientRole(workspaceId, contactId);
// ... supplier e partner roles
```

**Recurso Especial:** Invalidação automática de cache após mutações

### 4. Componentes React (`src/modules/contact/components/`)

#### ContactForm.tsx

- Formulário React Hook Form + Zod validation
- Suporta criar e editar
- Campos: name, type (PF/PJ), document, email, website, address
- Validações: documento > 11 caracteres, email válido, etc.

#### ContactList.tsx

- Lista de contatos com status visual
- Badges: Cliente, Fornecedor, Parceiro
- Ações: Ver, Deletar, Restaurar
- Estado inativo destacado
- Responsivo com dark mode

### 5. Páginas (`src/app/(protected)/workspaces/[workspaceId]/contacts/`)

#### `/contacts` (page.tsx)

- Listagem de todos os contatos
- Botão "Novo Contato"
- Integração com ContactList component

#### `/contacts/new` (new/page.tsx)

- Formulário para criar novo contato
- Integração com ContactForm component
- Redirecionamento após sucesso
- Toast notifications (success/error)

#### `/contacts/[contactId]` (✨ ADVANCED)

- Página de detalhe do contato
- Abas: Informações, Telefones, Papéis
- Edição inline
- Informações do sistema (ID, timestamps, status)

### 6. Backward Compatibility (`src/app/(protected)/persons/page-new.tsx`)

```typescript
// Mantém rota /persons existente
// Mas usa nova API Contact internamente
// Permite migração gradual de usuários
// Mesmos filtros e busca da versão anterior
```

## 📊 Características Implementadas

✅ **CRUD Completo**

- Create contact (com validação de documento único)
- Read (single e list)
- Update (preserva documento e type)
- Delete (soft delete com restore)
- Hard delete

✅ **Gerenciamento de Papéis**

- Client role (status, creditLimit, paymentTerms)
- Supplier role (status, paymentTerms, bankAccount)
- Partner role (status, commissionPercentage)
- Cada contato pode ter múltiplos papéis

✅ **Gerenciamento de Telefones**

- Múltiplos telefones por contato
- Tipos: WHATSAPP, PERSONAL, COMMERCIAL
- Marca telefone principal
- Atualização e remoção

✅ **Busca e Filtros**

- Busca por nome, email, documento
- Filtro por tipo de papel (client, supplier, partner)
- Filtro por status ativo/inativo

✅ **UI/UX Apple-style**

- Design minimalista e clean
- Dark mode support
- Transições suaves
- Feedback visual (loading, errors, success)
- Responsivo mobile-first

✅ **State Management**

- React Query para server state
- Invalidação automática de cache
- Otimistic updates em mutations
- Behandling de erros estruturado

## 🚀 Como Usar

### Criar Contato

```typescript
const mutation = useCreateContact(workspaceId);

await mutation.mutateAsync({
  name: "João Silva",
  type: "PF",
  document: "12345678901",
  email: "joao@example.com",
});
```

### Listar Contatos

```typescript
const { data, isLoading } = useContacts(workspaceId, "client");

// data.data = Contact[]
// data.total = número total
```

### Adicionar Role de Cliente

```typescript
const mutation = useAddClientRole(workspaceId, contactId);

await mutation.mutateAsync({
  status: "ACTIVE",
  creditLimit: 10000,
  paymentTerms: "30 dias",
});
```

## 📁 Estrutura de Pastas

```
src/
├── modules/
│   └── contact/
│       ├── types/
│       │   └── index.ts          (Contact types & enums)
│       ├── hooks/
│       │   └── index.ts          (React Query hooks)
│       ├── components/
│       │   ├── ContactForm.tsx    (Form component)
│       │   ├── ContactList.tsx    (List component)
│       │   └── index.ts           (exports)
├── app/
│   └── (protected)/
│       ├── workspaces/
│       │   └── [workspaceId]/
│       │       └── contacts/
│       │           ├── page.tsx           (list)
│       │           ├── new/page.tsx       (create)
│       │           └── [contactId]/page.tsx (detail)
│       └── persons/
│           └── page-new.tsx      (backward compatibility)
└── lib/
    └── api.ts                    (contactAPI endpoints)
```

## ✨ Próximos Passos (Phase 8 Continuation)

1. **Tabs & Advanced Features**
   - [ ] Tab "Telefones" - Listagem e management
   - [ ] Tab "Papéis" - Management de roles
   - [ ] Forms inline para edição de roles

2. **Testes E2E**
   - [ ] Cypress/Playwright tests
   - [ ] Fluxo completo: create → read → update → delete
   - [ ] Validação de backend integration

3. **Integrações**
   - [ ] Avisos/Alertas (toast notifications) ✓
   - [ ] Paginação de listas (se necessário)
   - [ ] Export de contatos (CSV)
   - [ ] Importação em bulk

4. **Validações Avançadas**
   - [ ] Mask para CPF/CNPJ
   - [ ] Validação em tempo real
   - [ ] Verificação de duplicatas

5. **Performance**
   - [ ] Lazy loading de listas grandes
   - [ ] Virtualização de listas
   - [ ] Prefetch de dados

## 🔗 API Integration Status

| Operação             | Status | Teste   |
| -------------------- | ------ | ------- |
| POST /contacts       | ✅     | manual  |
| GET /contacts        | ✅     | manual  |
| GET /contacts/:id    | ✅     | manual  |
| PUT /contacts/:id    | ✅     | manual  |
| DELETE /contacts/:id | ✅     | manual  |
| PATCH /restore       | ✅     | manual  |
| DELETE /hard         | ✅     | manual  |
| POST /phones         | ⏳     | pending |
| PUT /phones/:id      | ⏳     | pending |
| DELETE /phones/:id   | ⏳     | pending |
| POST /client-role    | ⏳     | pending |
| POST /supplier-role  | ⏳     | pending |
| POST /partner-role   | ⏳     | pending |

## 📝 Notas de Desenvolvimento

- **Error Handling:** Centralizado em hooks (catch + addAlert)
- **Loading States:** Todos os mutations têm `isPending` flag
- **Invalidation:** QueryClient invalida seletivamente por workspaceId
- **Types:** 100% TypeScript com DTOs typed
- **Styling:** Tailwind CSS 4.0 com dark mode nativo
- **Dark Mode:** Classes `dark:` aplicadas em todos os componentes

## 🎉 Status

- ✅ Phase 8.1 - Core Architecture (DONE)
  - Types & DTOs
  - API Client
  - React Hooks
  - Componentes básicos
  - Páginas principais

- ⏳ Phase 8.2 - Advanced Features (IN PROGRESS)
  - Tabs & advanced UI
  - E2E Tests
  - Performance optimizations

---

**Criado em**: 5 de fevereiro de 2026  
**Status**: 50% Complete (Core done, Advanced pending)  
**Próxima revisão**: Após E2E tests
