# Phase 8.2 - Advanced Features Implementation Guide

## 📋 Overview

Continuação do Phase 8 (Frontend Integration). Neste phase vamos implementar os recursos avançados:

- Tabs para gerenciamento de Telefones e Papéis
- UI para adicionar/editar/remover telefones
- UI para adicionar/editar/remover roles
- E2E tests

---

## 🎯 Task 1: Implementar Tab de Telefones

### 1.1 Criar PhoneForm Component

```typescript
// src/modules/contact/components/PhoneForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PhoneType, CreateContactPhoneDTO } from "../types";
import { useAddPhone } from "../hooks";

const phoneSchema = z.object({
  number: z.string().min(10, "Número deve ter pelo menos 10 dígitos"),
  type: z.enum(["WHATSAPP", "PERSONAL", "COMMERCIAL"]),
  primary: z.boolean(),
});

export function PhoneForm({ workspaceId, contactId, onSuccess }) {
  // Implementação similar ao ContactForm
  // Usar useAddPhone mutation
  // Validação de número de telefone
}
```

### 1.2 Criar PhoneList Component

```typescript
// src/modules/contact/components/PhoneList.tsx
"use client";

export function PhoneList({ phones, workspaceId, contactId, onDelete }) {
  // Renderizar lista de telefones
  // Mostrar tipo (WHATSAPP, PERSONAL, COMMERCIAL)
  // Badge para telefone principal
  // Ações: Editar, Deletar
}
```

### 1.3 Atualizar Detail Page com Tab

```typescript
// src/app/(protected)/workspaces/[workspaceId]/contacts/[contactId]/page.tsx

// Adicionar:
const [activeTab, setActiveTab] = useState("info");

// Renderizar tabs:
// 1. Informações (já existe)
// 2. Telefones (novo)
// 3. Papéis (próximo)

// Conteúdo do tab Telefones:
{activeTab === "phones" && (
  <div>
    <PhoneForm ... />
    <PhoneList ... />
  </div>
)}
```

---

## 🎯 Task 2: Implementar Tab de Papéis

### 2.1 Criar RoleForm Components

```typescript
// src/modules/contact/components/ClientRoleForm.tsx
// src/modules/contact/components/SupplierRoleForm.tsx
// src/modules/contact/components/PartnerRoleForm.tsx

// Cada um com seus campos específicos:

// ClientRole:
-status(PROSPECT, ACTIVE, INACTIVE) -
  creditLimit -
  paymentTerms -
  description -
  // SupplierRole:
  status(PROSPECT, ACTIVE, BLOCKED) -
  paymentTerms -
  bankAccount -
  description -
  // PartnerRole:
  status(PROSPECT, ACTIVE, INACTIVE) -
  commissionPercentage -
  description;
```

### 2.2 Criar RoleList Component

```typescript
// src/modules/contact/components/RoleList.tsx

export function RoleList({
  clientRole,
  supplierRole,
  partnerRole,
  workspaceId,
  contactId,
  onUpdate,
}) {
  // Renderizar cards para cada role existente
  // Botões: Editar, Remover
  // Se não existir role, mostrar botão "Adicionar"
}
```

### 2.3 Atualizar Detail Page com Tab Papéis

```typescript
{activeTab === "roles" && (
  <div className="space-y-4">
    {contact.clientRole ? (
      <ClientRoleForm contact={contact} onUpdate={...} />
    ) : (
      <button>+ Adicionar Papel de Cliente</button>
    )}
    {/* Similar para Supplier e Partner */}
  </div>
)}
```

---

## 📝 Checklist de Implementação

### Phase 8.2 Tasks

- [ ] **PhoneForm Component** (estarei guiado)
  - [ ] Form com React Hook Form
  - [ ] Validação de número
  - [ ] Select para PhoneType
  - [ ] Checkbox para principal
  - [ ] Submit com useAddPhone

- [ ] **PhoneList Component**
  - [ ] Renderizar phones array
  - [ ] Badges de tipo
  - [ ] Actions (edit, delete)
  - [ ] Loading states

- [ ] **ClientRoleForm Component**
  - [ ] Campos: status, creditLimit, paymentTerms, description
  - [ ] useAddClientRole / useUpdateClientRole
  - [ ] Select para status enum

- [ ] **SupplierRoleForm Component**
  - [ ] Campos: status, paymentTerms, bankAccount, description
  - [ ] useAddSupplierRole / useUpdateSupplierRole

- [ ] **PartnerRoleForm Component**
  - [ ] Campos: status, commissionPercentage, description
  - [ ] useAddPartnerRole / useUpdatePartnerRole

- [ ] **RoleList Component**
  - [ ] Renderizar roles existentes
  - [ ] Actions: edit, remove
  - [ ] Mostrar "Adicionar papel" se não existir

- [ ] **Detail Page Tabs**
  - [ ] Refatorar para usar tabs
  - [ ] Tab 1: Informações (já existe)
  - [ ] Tab 2: Telefones (novo)
  - [ ] Tab 3: Papéis (novo)
  - [ ] Navegação entre tabs

- [ ] **E2E Tests**
  - [ ] Setup Cypress
  - [ ] Test: Create → Add Phone → Verify
  - [ ] Test: Create → Add ClientRole → Verify
  - [ ] Test: Edit Phone → Verify
  - [ ] Test: Remove Role → Verify

---

## 💡 Dicas de Implementação

### 1. Componentes de Form

```typescript
// Use o padrão já estabelecido:
const MyForm = ({ onSuccess, onError }) => {
  const { register, handleSubmit, errors } = useForm();
  const mutation = useMutation(...);

  const onSubmit = async (data) => {
    try {
      await mutation.mutateAsync(data);
      onSuccess?.();
    } catch (error) {
      onError?.(error);
    }
  };
};
```

### 2. States de Loading

```typescript
// Use isPending do mutation
{
  isLoading ? "Salvando..." : "Salvar";
}
disabled = { isLoading };
```

### 3. Validações

```typescript
// Use Zod schemas
const schema = z.object({
  creditLimit: z.number().positive("Deve ser > 0"),
  paymentTerms: z.string().min(1, "Obrigatório"),
});
```

### 4. Tabs Component

```typescript
// Padrão simples sem biblioteca externa
const [activeTab, setActiveTab] = useState("info");

<div className="border-b border-gray-200 dark:border-gray-700">
  <nav className="flex gap-4">
    <button
      onClick={() => setActiveTab("info")}
      className={activeTab === "info" ? "border-b-2 border-blue-600" : "..."}
    >
      Informações
    </button>
    {/* Mais tabs */}
  </nav>
</div>

{activeTab === "info" && <InfoContent />}
{activeTab === "phones" && <PhonesContent />}
```

---

## 🔗 Hooks Disponíveis

```typescript
// Já implementados em src/modules/contact/hooks/index.ts

// Phones
useContactPhones(workspaceId, contactId);
useAddPhone(workspaceId, contactId);
useUpdatePhone(workspaceId, contactId, phoneId);
useDeletePhone(workspaceId, contactId);

// Roles
useAddClientRole(workspaceId, contactId);
useUpdateClientRole(workspaceId, contactId);
useRemoveClientRole(workspaceId, contactId);

// Similar para Supplier e Partner
```

---

## 📚 Referências

### Código Existente

- [ContactForm.tsx](src/modules/contact/components/ContactForm.tsx) - Padrão de form
- [useContact hooks](src/modules/contact/hooks/index.ts) - Patterns de hooks
- [Contact types](src/modules/contact/types/index.ts) - Type definitions

### Recursos Úteis

- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [TailwindCSS Components](https://tailwindui.com/)

---

## 🚀 Ordem Recomendada

1. **Começar com Phones** (mais simples)
   - PhoneForm → PhoneList → Detail Page Tab
2. **Depois fazer Roles** (parecido, 3x)
   - ClientRoleForm → SupplierRoleForm → PartnerRoleForm
   - RoleList → Detail Page Tab
3. **Refatorar Detail Page**
   - Consolidar todos os tabs
   - Melhorar UI/UX
4. **E2E Tests**
   - Setup Cypress
   - Escrever testes

---

## ✅ Acceptance Criteria

Uma tarefa está pronta quando:

- ✅ Código escrito e compilado (sem erros TypeScript)
- ✅ Componente renderiza corretamente
- ✅ Forms submitam corretamente
- ✅ Mutações funcionam (pode-se ver no backend)
- ✅ UI atualiza corretamente após mutação
- ✅ Dark mode funciona
- ✅ Responsive em mobile

---

## 📞 Próximas Etapas

Após Phase 8.2 estar completa:

1. Executar E2E tests
2. Validar fluxos completos
3. Integração com outras features
4. Performance optimization
5. Data migration (Phase 9)

---

**Documento criado**: 5 de Fevereiro de 2026  
**Status**: Pronto para implementação  
**Próxima revisão**: Após conclusão de 8.2
