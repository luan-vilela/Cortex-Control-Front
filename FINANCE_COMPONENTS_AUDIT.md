# Auditoria: Componentes Finance que Precisam de Atualização

## ✅ O Que Está OK

### Imports e Tipos

- `TransactionForm.tsx` - Usando corretamente `PaymentConfig` (union type)
- `TransactionList.tsx` - Usando `FinanceiroTransaction` ✅
- `TransactionDetail.tsx` - Usando `TransactionActorType` ✅
- `useFinance.ts` - Todos os imports corretos ✅
- `index.ts` - Exports atualizados (InterestConfigComponent) ✅

### Componentes Base

- `PaymentModeConfig.tsx` - Atualizado ✅
- `RecurrenceConfig.tsx` - Atualizado ✅
- `FinancialChargesConfig.tsx` → `InterestConfigComponent` ✅

---

## 🔄 O Que Precisa de Atualização

### 1. **TransactionForm.tsx** - Refatoração de FormControls

**Problema**: Está usando `FormInput` e `FormTextarea` legados em vez de componentes shadcn

**Área**: Linhas 145-160+ onde usam FormInput para description, amount, dueDate, notes

**Solução**: Refatorar para usar:

- `Input` do shadcn/ui (já existe em `/components/ui/button`)
- `Textarea` do shadcn/ui
- `DatePicker` existente para `dueDate` (não input date nativo)

**Exemplo do que está**:

```tsx
<FormInput
  type="text"
  label="Descrição"
  value={formData.description}
  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
/>
```

**Deveria ser**:

```tsx
<div>
  <Label htmlFor="description">Descrição</Label>
  <Input
    id="description"
    value={formData.description}
    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
  />
</div>
```

---

### 2. **TransactionForm.tsx** - DatePicker Não Está Sendo Usado

**Problema**: Field `dueDate` provavelmente está usando input date nativo em vez de DatePicker

**Solução**:

```tsx
import { DatePicker } from "@/components/patterns/DatePicker";

// Em vez de:
<FormInput type="date" />

// Usar:
<DatePicker
  value={new Date(formData.dueDate)}
  onChange={(date) => setFormData({ ...formData, dueDate: date?.toISOString().split('T')[0] })}
/>
```

---

### 3. **TransactionForm.tsx** - Falta de Componentes Layout

**Problema**: Não está usando `PageHeader` e `DataTableToolbar` como outras páginas

**Deveria ter**:

- `PageHeader` no topo (título + ações)
- Divisão clara de seções (informações básicas vs configuração de pagamento)
- `Card` do shadcn/ui para agrupar campos relacionados

---

### 4. **TransactionForm.tsx** - Validação de Esquema

**Problema**: Usando validação manual em `handleSubmit` em vez de `react-hook-form` + `zod`

**Padrão correto** (ver PersonEditForm.tsx):

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const transactionFormSchema = z.object({
  description: z.string().min(1, "Descrição obrigatória"),
  amount: z.number().positive("Valor deve ser positivo"),
  dueDate: z.date(),
  paymentConfig: z.union([...]) // PaymentConfig schema
});

export function TransactionForm() {
  const form = useForm({
    resolver: zodResolver(transactionFormSchema),
  });
}
```

---

### 5. **Componentes Auxiliares Faltando**

**Problema**: Os novos componentes para configuração de pagamento não existem ainda

**Faltam criar**:

- [ ] `CashPaymentSection` - Recorrência + Juros (colapsáveis)
- [ ] `InstallmentPaymentSection` - Tipo plano, parcelas, entrada, juros
- [ ] `InterestConfiguration` - Compartilhado entre os dois modos
- [ ] `InstallmentSummary` - Preview visual

**Referência**: Ver `FINANCE_FORM_IMPLEMENTATION_PLAN.md` para code examples

---

### 6. **Página `/finance/new/page.tsx`** - Layout

**Problema**: Usando estrutura manual em vez de padrão estabelecido

**Deveria usar**:

```tsx
<PageHeader
  title="Nova Transação"
  subtitle="..."
/>
// Conteúdo
<TransactionForm />
```

**Referência**: Ver `/contatos/page.tsx` e `/finance/page.tsx` para padrão

---

## 📋 Checklist de Refatoração

### Prioridade Alta (Bloqueia Compilação/Uso)

- [ ] Verificar se há imports/usos de tipos antigos em outros arquivos
- [ ] Garantir que `DateRangePicker` está sendo usado na página `/finance`
- [ ] Garantir que todos os components usam `shadcn/ui` (não FormInput legado)

### Prioridade Média (Qualidade/Padrão)

- [ ] Refatorar TransactionForm.tsx para usar `react-hook-form` + `zod`
- [ ] Adicionar `PageHeader` e layout cards
- [ ] Usar `DatePicker` em vez de input date nativo
- [ ] Usar `Input` e `Textarea` do shadcn

### Prioridade Baixa (Novos Componentes)

- [ ] Criar 4 novos componentes de pagamento (ver plano de implementação)
- [ ] Adicionar `InstallmentSummary` visual
- [ ] Melhorar validação de regras de negócio

---

## Resumo de Componentes Que Já Existem

| Componente        | Local                                   | Status    | Usar Em                   |
| ----------------- | --------------------------------------- | --------- | ------------------------- |
| `Input`           | `@/components/ui/input`                 | ✅ Existe | TransactionForm           |
| `Textarea`        | `@/components/ui/textarea`              | ✅ Existe | TransactionForm (notes)   |
| `DatePicker`      | `@/components/patterns/DatePicker`      | ✅ Existe | TransactionForm (dueDate) |
| `DateRangePicker` | `@/components/patterns/DateRangePicker` | ✅ Existe | Finance page (filtros)    |
| `PageHeader`      | `@/components/patterns/PageHeader`      | ✅ Existe | Finance pages             |
| `Card`            | `@/components/ui/card`                  | ✅ Existe | Agrupar seções            |
| `Button`          | `@/components/ui/button`                | ✅ Existe | Tudo                      |
| `Label`           | `@/components/ui/label`                 | ✅ Existe | Form labels               |
| `RadioGroup`      | `@/components/ui/radio-group`           | ✅ Existe | TransactionForm           |
| `Select`          | `@/components/ui/select`                | ✅ Existe | Dropdowns                 |

---

## Próximos Passos

1. **Verificar compilação** - Garantir que não há mais erros de imports
2. **Listar todos os FormInput** - No TransactionForm, contar quantos há
3. **Refatorar TransactionForm** em etapas:
   - Migrar FormInput → Input
   - Migrar date input → DatePicker
   - Adicionar PageHeader
   - Converterpara react-hook-form (se necessário)
4. **Criar novos componentes** - Seguindo plano documentado
5. **Testes** - Garantir que tudo funciona
