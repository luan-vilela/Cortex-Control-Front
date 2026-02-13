# 📊 Campo `originalAmount` - Valor Original da Dívida

**Data**: 12 de fevereiro de 2026  
**Status**: ✅ Frontend implementado  
**Build**: ✅ Passou

---

## 🎯 O Problema

Quando há **parcelamento com entrada**, as transações filhas são criadas com valores diferentes:

```
Transação Original: R$ 10.000,00 (16h30)
├─ Entrada: R$ 2.000,00 (mesma transação, amount = 2.000)
└─ Parcelamento: 12x de R$ 666,67 (12 transações filhas, amount = 666,67 cada)

Problema:
- Se a última parcela atrasar 30 dias
- Precisa calcular: multa + juros SOBRE R$ 10.000,00 (valor original)
- Mas só tem amount = 666,67 (valor da parcela)
- Resultado: cálculo incorreto ❌
```

---

## ✅ A Solução

Adicionar campo `originalAmount` que armazena o **valor original da dívida** quando a transação é criada.

```typescript
interface FinanceiroTransaction {
  id: number
  amount: number // Valor atual (pode ser entrada ou parcela)
  originalAmount?: number // Valor original (imutável, para referência)
  // ...
}
```

---

## 📋 Fluxo de Dados

### Criação da Transação

```
┌─────────────────────────────────────────────────────────────┐
│ Formulário: Nova Transação                                  │
├─────────────────────────────────────────────────────────────┤
│ Valor Total: R$ 10.000,00                                  │
│ Entrada: R$ 2.000,00                                       │
│ Parcelamento: 12x de R$ 666,67                             │
└─────────────────────────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────────────────────────┐
│ POST /transactions (Payload)                                │
├─────────────────────────────────────────────────────────────┤
│ {                                                           │
│   sourceType: 'MANUAL',                                    │
│   amount: 10000,              // Valor do formulário       │
│   originalAmount: 10000,      // ✨ Registrado aqui        │
│   description: 'Venda de Produtos',                        │
│   paymentConfig: {                                         │
│     mode: 'INSTALLMENT',                                   │
│     numberOfInstallments: 12,                              │
│     downpayment: 2000,                                     │
│     firstInstallmentDate: '2026-03-15'                    │
│   }                                                         │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────────────────────────┐
│ Backend: Salva em financeiro_transactions                   │
├─────────────────────────────────────────────────────────────┤
│ ID: 1                                                       │
│ amount: 10000          ← Pode ser alterado                 │
│ originalAmount: 10000  ← Imutável (referência)             │
│ created_at: 2026-02-12T16:30:00Z                           │
└─────────────────────────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────────────────────────┐
│ Sistema cria 13 transações filhas:                          │
├─────────────────────────────────────────────────────────────┤
│ 1. Entrada (linkedTo: 1)                                   │
│    amount: 2000                                            │
│    originalAmount: 10000  ← Herda do pai                  │
│                                                             │
│ 2-13. Parcelas 1-12 (linkedTo: 1)                          │
│    amount: 666.67                                          │
│    originalAmount: 10000  ← Todas herdam                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧮 Cenário: Cálculo de Multa e Juros

### Parcela 5 com 45 dias de atraso:

```
Dados da Parcela:
- amount: 666,67 (valor da parcela)
- originalAmount: 10.000,00 (valor original)
- daysOverdue: 45
- penaltyPercentage: 2%
- interestPercentage: 1%
- interestPeriod: 'MONTHLY'

Cálculo (CORRETO - usando originalAmount):
─────────────────────────────────────────
multa = 10.000 × (2% / 100) = 200,00
juros = 10.000 × (1% / 100) × (45 / 30) = 150,00
total = 10.000 + 200 + 150 = 10.350,00

❌ Cálculo ERRADO (se usasse amount da parcela):
─────────────────────────────────────────────
multa = 666,67 × (2% / 100) = 13,33
juros = 666,67 × (1% / 100) × (45 / 30) = 10,00
total = 666,67 + 13,33 + 10,00 = 690,00  ← Muito menor!
```

---

## 📊 Tabela: Relação amount vs originalAmount

| Cenário                   | Transação          | amount | originalAmount | Uso            |
| ------------------------- | ------------------ | ------ | -------------- | -------------- |
| **À Vista**               | Principal          | 5.000  | 5.000          | Mesmo valor    |
| **À Vista Recorrente**    | Gerada (pai)       | 5.000  | 5.000          | Mesmo valor    |
| **À Vista Recorrente**    | Gerada (filho)     | 5.000  | 5.000          | Mesmo valor    |
| **Parcelado Simples**     | Principal          | 10.000 | 10.000         | Valor total    |
| **Parcelado com Entrada** | Principal          | 10.000 | 10.000         | Valor total    |
| **Parcelado com Entrada** | Entrada (filha)    | 2.000  | 10.000         | ✨ Diferentes! |
| **Parcelado com Entrada** | Parcela 1 (filha)  | 666,67 | 10.000         | ✨ Diferentes! |
| **Parcelado com Entrada** | Parcela 12 (filha) | 666,67 | 10.000         | ✨ Diferentes! |

---

## 🔧 Implementação

### Frontend ✅

**Arquivo**: [src/modules/financeiro/types/index.ts](src/modules/financeiro/types/index.ts)

```typescript
export interface FinanceiroTransaction {
  id: number
  // ...
  amount: number
  // ✨ Valor original da dívida (para referência em cálculos de multa/juros)
  // Útil em parcelamentos com entrada: originalAmount = totalValue, amount = parcela
  originalAmount?: number
  // ...
}

export interface CreateTransactionPayload {
  // ...
  amount: number
  // ✨ Valor original da dívida (salvo na criação)
  // Se não informado, frontend assume que originalAmount = amount
  originalAmount?: number
  // ...
}
```

**Arquivo**: [src/modules/financeiro/components/TransactionForm.tsx](src/modules/financeiro/components/TransactionForm.tsx)

```typescript
const payload: CreateTransactionPayload = {
  sourceType: TransactionSourceType.MANUAL,
  sourceId: 'manual-' + Date.now(),
  amount: infoConfig.amount,
  // ✨ Registrar valor original da dívida (sempre é o amount na criação)
  originalAmount: infoConfig.amount,
  description: infoConfig.description,
  // ...
}
```

---

### Backend 📋 (Próxima etapa)

**Migration SQL**:

```sql
ALTER TABLE financeiro_transactions
  ADD COLUMN original_amount DECIMAL(15,2) DEFAULT NULL COMMENT 'Valor original da dívida para referência',
  ADD INDEX idx_original_amount (original_amount);
```

**TypeORM Entity**:

```typescript
@Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
originalAmount: number | null
```

**Logic**:

- Na criação: `originalAmount = amount` (sempre)
- Em parcelamentos: as parcelas filhas herdam `originalAmount` do pai
- Em cálculos de multa/juros: sempre usar `originalAmount`, não `amount`

---

## 💡 Regras de Negócio

### 1. Criação Inicial

```
originalAmount = amount (sempre)
```

### 2. Transações Filhas (Parcelamentos/Recorrências)

```
originalAmount = pai.originalAmount
amount = valor específico da parcela/recorrência
```

### 3. Cálculo de Multa e Juros

```
BASE_PARA_CALCULO = transaction.originalAmount (não amount)

multa = originalAmount × (penaltyPercentage / 100)
juros = originalAmount × (interestPercentage / 100) × (daysOverdue / periodo)
```

### 4. Imutabilidade

```
originalAmount NUNCA muda após criação
amount pode mudar (por ajustes, descontos, etc)
```

---

## 🧪 Exemplo Completo

### Entrada de Dados

```
Total: R$ 10.000,00
Entrada: R$ 2.000,00
Parcelamento: 12x (automático: 666,67 cada)
Multa: 2%
Juros: 1% ao mês
```

### Transações Criadas

**T1 (Principal)**

```json
{
  "id": 1,
  "amount": 10000,
  "originalAmount": 10000,
  "description": "Venda de Produtos",
  "status": "PENDING"
}
```

**T2 (Entrada - Filha)**

```json
{
  "id": 2,
  "parentTransactionId": 1,
  "amount": 2000,
  "originalAmount": 10000,
  "dueDate": "2026-02-15",
  "status": "PENDING"
}
```

**T3-T14 (Parcelas 1-12 - Filhas)**

```json
[
  {
    "id": 3,
    "parentTransactionId": 1,
    "amount": 666.67,
    "originalAmount": 10000,
    "dueDate": "2026-03-15",
    "status": "PENDING"
  },
  // ... mais 11 parcelas ...
  {
    "id": 14,
    "parentTransactionId": 1,
    "amount": 666.67,
    "originalAmount": 10000,
    "dueDate": "2027-02-15",
    "status": "PENDING"
  }
]
```

### Simulação: Parcela 5 com 45 dias de atraso

```
T7 (Parcela 5):
- amount: 666,67
- originalAmount: 10000
- daysOverdue: 45
- penaltyPercentage: 2
- interestPercentage: 1
- interestPeriod: MONTHLY

Cálculo:
multa = 10.000 × 0.02 = 200,00 ✅
juros = 10.000 × 0.01 × (45/30) = 150,00 ✅
─────────────────────────────
total_devido = 10.350,00 ✅
```

---

## 🚀 Próximas Etapas

### Backend (Imediato)

- [ ] Adicionar coluna `original_amount` em migration
- [ ] Atualizar Entity TypeORM
- [ ] Atualizar endpoint POST `/transactions`
- [ ] Quando criar filhas (parcelamentos), herdar `originalAmount`

### Cálculo de Penalidades (Próxima semana)

- [ ] Implementar `PenaltyCalculatorService` usando `originalAmount`
- [ ] Job de detecção de atrasos
- [ ] Usar `originalAmount` como base, não `amount`

### Validação (Importante)

- [ ] Testes: parcelas filhas herdam `originalAmount`
- [ ] Testes: cálculos de multa usam `originalAmount`
- [ ] Testes: `originalAmount` é imutável

---

## 📝 Resumo

| Aspecto                 | Detalhe                                 |
| ----------------------- | --------------------------------------- |
| **Nome do campo**       | `originalAmount`                        |
| **Tipo**                | `decimal(15,2)` nullable                |
| **Quando é preenchido** | Na criação da transação                 |
| **Valor**               | Sempre igual ao `amount` inicial        |
| **Uso**                 | Referência para cálculos de multa/juros |
| **Mutabilidade**        | Imutável (nunca muda)                   |
| **Herança**             | Filhas herdam do pai                    |
| **Default**             | Se não informado, usa `amount`          |

---

**Status**: ✅ Frontend Pronto | 📋 Backend Documentado
