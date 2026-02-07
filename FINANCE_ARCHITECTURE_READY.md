# Sumário: Arquitetura de Parcelamento, Recorrência e Juros - Pronto para Implementação

**Data**: 7 de fevereiro de 2026  
**Status**: ✅ Estrutura Backend Completa | ✅ Tipos TypeScript Atualizados | 🔄 Implementação Frontend Pendente

---

## O Que Foi Feito

### 1. **Banco de Dados - Migração 011**

📁 **Arquivo**: `/cortex-control/migrations/011_add_installment_recurrence_interest_config.sql`

**4 Novas Tabelas Criadas**:

| Tabela                            | Propósito                                                | Campos Principais                                                                                     |
| --------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `financeiro_installment_plans`    | Configura parcelamento (Tabela Price, SAC, Simples)      | `plan_type`, `numberOfInstallments`, `downpayment`, `firstInstallmentDate`, `installmentIntervalDays` |
| `financeiro_recurrence_config`    | Rastreia recorrência em modo à vista                     | `originalTransactionId`, `recurrenceType`, `occurrences`, `endDate`                                   |
| `financeiro_recurrence_instances` | Liga transações geradas à sua recorrência (parent-child) | `recurrenceConfigId`, `generatedTransactionId`                                                        |
| `financeiro_interest_config`      | Armazena juros (% ou valor fixo)                         | `interestType`, `percentage`, `flatAmount`                                                            |

**Relacionamentos**: Todas linkadas à `financeiro_transactions` (parent) via FK.

---

### 2. **TypeORM Entities**

📁 **Backend**: Criadas 3 novas entities

- **`installment-plan.entity.ts`** → `InstallmentPlan` (Maps `financeiro_installment_plans`)
- **`recurrence-config.entity.ts`** → `RecurrenceConfig` (Maps `financeiro_recurrence_config`)
- **`recurrence-instance.entity.ts`** → `RecurrenceInstance` (Maps `financeiro_recurrence_instances`)
- **`interest-config.entity.ts`** → `InterestConfig` (Maps `financeiro_interest_config`)

Todas com relações `@ManyToOne` para `Transaction`.

---

### 3. **Tipos TypeScript Atualizados**

📁 **Arquivo**: `/cortex-control-front/src/modules/finance/types/index.ts`

**Enums Novos**:

```typescript
enum PaymentMode { CASH, INSTALLMENT }                    // Removido DEFERRED
enum InstallmentPlanType { PRICE_TABLE, SAC, SIMPLE }
enum InterestType { PERCENTAGE, FLAT }
enum RecurrenceType { DAILY, WEEKLY, MONTHLY, ANNUAL... }
```

**Interfaces Novas**:

```typescript
CashPaymentConfig {
  mode: CASH,
  recurrence?: RecurrenceConfig,    // Opcional
  interest?: InterestConfig          // Opcional
}

InstallmentPaymentConfig {
  mode: INSTALLMENT,
  planType: InstallmentPlanType,
  numberOfInstallments: number,
  downpayment?: number,              // Opcional
  firstInstallmentDate: Date,
  installmentIntervalDays?: number,
  interest?: InterestConfig           // Opcional
}

PaymentConfig = CashPaymentConfig | InstallmentPaymentConfig
```

---

### 4. **Documentação Arquitetural**

📁 **Arquivo**: `/cortex-control/ARQUITETURA_PARCELAMENTO_RECORRENCIA_JUROS.md`

**Inclui**:

- ✅ Visão geral dos 2 modos (À Vista + Parcelado)
- ✅ Exemplos de queries SQL (parent-child relationships)
- ✅ Fluxos de cálculo (4 cenários reais)
- ✅ Validações e regras de negócio
- ✅ Diagramas de relacionamento
- ✅ Tabela de compatibilidade de features

---

## Arquitetura Resumida

### **Modo À Vista (CASH)**

```
┌─────────────────────────────────────────┐
│ Transação Única ou Recorrente           │
├─────────────────────────────────────────┤
│ • Sem parcelamento                      │
│ • Recorrência OPCIONAL:                 │
│   - Tipo: DAILY, WEEKLY, MONTHLY, ...   │
│   - Fim: OCCURRENCES ou END_DATE        │
│   - Gera múltiplas transações (via job) │
│ • Juros OPCIONAIS:                      │
│   - Tipo: % ou R$                       │
│   - Aplica-se na transação              │
└─────────────────────────────────────────┘

Tabelas:
- financeiro_transactions (original)
- financeiro_recurrence_config (se recorrência)
- financeiro_recurrence_instances (se recorrência)
- financeiro_interest_config (se juros)
```

### **Modo Parcelado (INSTALLMENT)**

```
┌─────────────────────────────────────────┐
│ Múltiplas Parcelas                      │
├─────────────────────────────────────────┤
│ • Tipo Plano: PRICE_TABLE, SAC, SIMPLE  │
│ • Número de Parcelas: 2-120x            │
│ • Entrada OPCIONAL                      │
│   - Valor + Data                        │
│ • Intervalo: dias entre parcelas (°30)  │
│ • Juros OPCIONAIS:                      │
│   - Tipo: % ou R$                       │
│   - Aplicados ao valor financiado       │
└─────────────────────────────────────────┘

Tabelas:
- financeiro_transactions (original)
- financeiro_installment_plans
- financeiro_interest_config (se juros)
```

---

## Exemplos de Cálculo

### **Exemplo 1: À Vista com Recorrência + Juros**

```
Valor: R$1000 | Recorrência: MONTHLY (12x) | Juros: 5%

Cálculo:
- Juros: 1000 * 5% = R$50
- Total por mês: R$1050
- Gera 12 transações de R$1050

Banco de Dados:
1. financeiro_transactions [ID=1] → R$1050 (original)
2. financeiro_recurrence_config [ID=1] → recurrence_type=MONTHLY, occurrences=12
3. financeiro_interest_config [ID=1] → percentage=5.00
4. financeiro_recurrence_instances [N=12] → ID 2-13 linkadas à config
```

### **Exemplo 2: Parcelado Tabela Price com Entrada + Juros**

```
Valor Total: R$10000 | Entrada: R$2000 | Parcelas: 12x | Juros: 5%

Cálculo:
- Valor a financiar: 10000 - 2000 = R$8000
- Juros: 8000 * 5% = R$400
- Total financiado: R$8400
- Parcela: 8400 / 12 = R$700

Banco de Dados:
1. financeiro_transactions [ID=1] → R$10000
2. financeiro_installment_plans [ID=1] → planType=PRICE_TABLE, numberOfInstallments=12, downpayment=2000
3. financeiro_interest_config [ID=1] → percentage=5.00
```

---

## Fluxo de Implementação Frontend

### **Fase 1: Componentes Base**

1. `PaymentModeSelector` - Seleção CASH vs INSTALLMENT
2. `CashPaymentSection` - Recorrência + Juros (colapsáveis)
3. `InstallmentPaymentSection` - Tipo plano, parcelas, entrada, juros

### **Fase 2: Componentes Auxiliares**

4. `InterestConfiguration` - Configuração de juros reutilizável
5. `InstallmentSummary` - Preview visual do parcelamento
6. `Validação` - Regras de negócio (modo CASH ≠ recorrência + installment)

### **Fase 3: Integração**

7. Refatorar `TransactionFormNew` para orquestrar componentes
8. Integração com API backend
9. Testes E2E

---

## Checklist de Preparação

### Backend ✅

- [x] Migração de banco criada
- [x] Entities TypeORM criadas
- [x] Relacionamentos definidos
- [ ] DTOs de request/response (pendente)
- [ ] Endpoints para criar transações com configs (pendente)
- [ ] Lógica de cálculo de juros (pendente)
- [ ] Job de geração de recorrências (pendente)

### Frontend ✅

- [x] Tipos TypeScript atualizados
- [x] Enums corrigidos (removido DEFERRED)
- [x] Interfaces de PaymentConfig definidas
- [ ] Componentes implementados (pendente)
- [ ] Validações implementadas (pendente)
- [ ] Integração com API (pendente)
- [ ] Testes (pendente)

### Documentação ✅

- [x] `ARQUITETURA_PARCELAMENTO_RECORRENCIA_JUROS.md` completo
- [x] `FINANCE_FORM_IMPLEMENTATION_PLAN.md` com exemplos de código
- [x] Fluxos de cálculo documentados
- [x] Queries SQL de exemplo para parent-child relationships

---

## Próximas Ações (Pela Ordem)

### **1. Backend - DTOs e Endpoints** (Crítico)

```typescript
// Criar DTOs para receber PaymentConfig
CreateTransactionWithPaymentConfigDto {
  sourceType, sourceId, amount, description, dueDate,
  paymentConfig: PaymentConfig,
  parties: CreateTransactionPartyPayload[]
}

// Criar service methods para:
// - Calcular juros
// - Validar configs
// - Criar installment_plan ou recurrence_config conforme necessário
```

### **2. Backend - Job de Recorrência** (Importante)

```typescript
// Scheduled job que:
// 1. Busca financeiro_recurrence_config ativas
// 2. Verifica se precisa criar nova instância
// 3. Cria nova financeiro_transactions
// 4. Registra em financeiro_recurrence_instances
```

### **3. Frontend - Componentes** (Em Paralelo)

Seguir `FINANCE_FORM_IMPLEMENTATION_PLAN.md` passo a passo.

---

## Arquivos Críticos

| Arquivo                                                                     | Tipo      | Descrição             |
| --------------------------------------------------------------------------- | --------- | --------------------- |
| `cortex-control/migrations/011_...sql`                                      | Migration | Cria 4 tabelas        |
| `cortex-control/src/modules/finance/entities/installment-plan.entity.ts`    | Entity    | TypeORM entity        |
| `cortex-control/src/modules/finance/entities/recurrence-config.entity.ts`   | Entity    | TypeORM entity        |
| `cortex-control/src/modules/finance/entities/recurrence-instance.entity.ts` | Entity    | TypeORM entity        |
| `cortex-control/src/modules/finance/entities/interest-config.entity.ts`     | Entity    | TypeORM entity        |
| `cortex-control/ARQUITETURA_PARCELAMENTO_RECORRENCIA_JUROS.md`              | Docs      | Visão arquitetural    |
| `cortex-control-front/src/modules/finance/types/index.ts`                   | Types     | Tipos atualizados     |
| `cortex-control-front/FINANCE_FORM_IMPLEMENTATION_PLAN.md`                  | Docs      | Guia de implementação |

---

## Resumo Executivo

**Situação**: Sistema pronto para implementação da lógica de negócio de transações financeiras.

**Escopo Definido**:

- ✅ 2 modos de pagamento (CASH, INSTALLMENT)
- ✅ Recorrência com relacionamento parent-child (CASH)
- ✅ Parcelamento com 3 tipos (INSTALLMENT)
- ✅ Juros/taxas em ambos os modos
- ✅ Entrada opcional (INSTALLMENT)
- ✅ Data final opcional em recorrência (CASH)

**Próximo Passo**: Implementar componentes frontend seguindo plano documentado.
