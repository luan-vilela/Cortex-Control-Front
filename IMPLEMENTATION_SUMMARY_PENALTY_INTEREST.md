# 📋 Resumo de Implementação - Multa e Juros de Mora

**Data**: 12 de fevereiro de 2026  
**Status**: ✅ Frontend Implementado | 📋 Backend Documentado

---

## ✅ Mudanças Frontend (Concluído)

### 1. Tipos e Schema - [interestBlock.types.ts](src/modules/financeiro/components/interest/interestBlock.types.ts)

**Adicionado:**
- ✨ Enum `InterestPeriod` com opções `MONTHLY` (padrão) e `ANNUAL` (futuro, desabilitado)
- ✨ Campo `interestPercentage` opcional no schema
- ✨ Campo `interestPeriod` com default `MONTHLY`

```typescript
export enum InterestPeriod {
  MONTHLY = 'MONTHLY',
  ANNUAL = 'ANNUAL',
}

// Schema agora inclui:
penaltyPercentage: z.number().optional(),  // Multa fixa %
interestPerMonth: z.number().optional(),   // Juros de mora
interestPeriod: z.nativeEnum(InterestPeriod).default(InterestPeriod.MONTHLY)
```

---

### 2. UI - [InterestConfig.tsx](src/modules/financeiro/components/interest/InterestConfig.tsx)

**Aba 2 "Multa e Mora" agora contém:**

| Campo | Tipo | Default | Status |
|-------|------|---------|--------|
| Multa (%) | InputNumber | 0 | ✅ Editável |
| Juros de Mora (%) | InputNumber | 0 | ✅ Editável |
| Período | Radio (MONTHLY/ANNUAL) | MONTHLY | ✅ MONTHLY ativo, ANNUAL desabilitado (futuro) |

**Visual:**
- Multa e Mora são campos opcionais
- Campo de período permite seleção de MONTHLY vs ANNUAL
- ANNUAL aparece com tag "(futuro)" e é desabilitado por enquanto
- Fórmula de cálculo exibida para referência do usuário

---

### 3. Payload - [TransactionForm.tsx](src/modules/financeiro/components/TransactionForm.tsx)

**Enviado para API:**

```typescript
interestConfig: {
  type: 'PERCENTAGE' | 'FLAT',
  percentage?: number,
  flatAmount?: number,
  description?: string,
  // ✨ Novos campos
  penaltyPercentage?: number,        // Ex: 2 (para 2% multa)
  interestPerMonth?: number,         // Ex: 1 (para 1% juros)
  interestPeriod: 'MONTHLY' | 'ANNUAL'  // Default: MONTHLY
}
```

---

## 📋 Mudanças Backend (Documentado)

Veja [BACKEND_IMPLEMENTATION_PENALTY_INTEREST.md](./BACKEND_IMPLEMENTATION_PENALTY_INTEREST.md) para:

### 1. Migration SQL
```sql
ALTER TABLE financeiro_interest_config
  ADD COLUMN penalty_percentage DECIMAL(5,2),
  ADD COLUMN interest_per_month DECIMAL(5,2),
  ADD COLUMN interest_period VARCHAR(20) DEFAULT 'MONTHLY';
```

### 2. TypeORM Entity (`interest-config.entity.ts`)
```typescript
@Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
penaltyPercentage: number | null

@Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
interestPerMonth: number | null

@Column({ type: 'varchar', length: 20, default: 'MONTHLY' })
interestPeriod: string
```

### 3. DTOs
- `CreateInterestConfigDto` - Validações com `@IsNumber()`, `@Min(0)`, `@Max(100)`
- `InterestConfigResponseDto` - Retorno de dados

### 4. Tipos Frontend
Atualizar `InterestConfigEntity` em [src/modules/financeiro/types/index.ts](src/modules/financeiro/types/index.ts)

### 5. Serviço de Cálculo (Futuro)
`PenaltyCalculatorService` - Calcula multa + juros proporcionais ao período

---

## 🔄 Fluxo de Dados Completo

### Configuração (Agora)
```
┌─────────────────────────────────────────────────────────────┐
│ InterestConfig.tsx (Aba 2: Multa e Mora)                    │
├─────────────────────────────────────────────────────────────┤
│ ☑ Multa (%):         [2.00]                                │
│ ☑ Juros de Mora (%): [1.00]                                │
│ ◉ Período:           [MONTHLY] ○ ANNUAL (futuro)          │
└─────────────────────────────────────────────────────────────┘
              ↓ onDataChange → transactionForm
┌─────────────────────────────────────────────────────────────┐
│ TransactionForm.tsx (Payload)                               │
├─────────────────────────────────────────────────────────────┤
│ interestConfig: {                                           │
│   penaltyPercentage: 2,                                    │
│   interestPerMonth: 1,                                     │
│   interestPeriod: 'MONTHLY',                               │
│   ... outros campos ...                                    │
│ }                                                           │
└─────────────────────────────────────────────────────────────┘
              ↓ POST /transactions
┌─────────────────────────────────────────────────────────────┐
│ Backend: Salva em financeiro_interest_config                │
├─────────────────────────────────────────────────────────────┤
│ penalty_percentage: 2.00                                   │
│ interest_per_month: 1.00                                   │
│ interest_period: 'MONTHLY'                                 │
└─────────────────────────────────────────────────────────────┘
```

### Cálculo de Atraso (Futuro)
```
Quando transação fica atrasada:
  1. Sistema detecta: daysOverdue = 15
  2. PenaltyCalculatorService calcula:
     - penaltyAmount = 1000 * (2% / 100) = 20.00
     - interestAmount = 1000 * (1% / 100) * (15 / 30) = 5.00
     - totalAmount = 1025.00
  3. Salva em financeiro_penalty_calculations (auditoria)
  4. Exibe em relatório com PenaltySection
```

---

## 📊 Exemplo Prático

**Transação Parcelada com Multa e Juros:**

```
Valor Total: R$ 1.000,00
Parcelamento: 10x
Multa: 2%
Juros de Mora: 1% ao mês

Se parcela de R$ 100,00 atrasar 45 dias:
  - Multa: 100 * 2% = R$ 2,00 (aplicada uma vez)
  - Juros: 100 * 1% * (45/30) = R$ 1,50
  - Total devido: R$ 103,50
```

---

## 🚀 Próximos Passos

### Imediato (hoje)
- [x] Frontend: Adicionar campos UI e validação ✅
- [x] Frontend: Enviar no payload ✅
- [ ] Backend: Executar migration SQL
- [ ] Backend: Atualizar Entity TypeORM
- [ ] Backend: Atualizar DTOs e tipos
- [ ] Testar endpoint POST /transactions

### Curto Prazo (essa semana)
- [ ] Implementar `PenaltyCalculatorService`
- [ ] Job/cron de detecção de atrasos
- [ ] Tabela `financeiro_penalty_calculations` para auditoria
- [ ] Endpoint GET `/transactions/:id/penalties`

### Médio Prazo (próximas 2 semanas)
- [ ] UI de relatório de multas/juros
- [ ] Suporte para período ANNUAL
- [ ] Integração com sistema de notificações
- [ ] Testes E2E

---

## 📁 Arquivos Modificados

| Arquivo | Mudança | Status |
|---------|---------|--------|
| [interestBlock.types.ts](src/modules/financeiro/components/interest/interestBlock.types.ts) | Enum + Schema | ✅ |
| [InterestConfig.tsx](src/modules/financeiro/components/interest/InterestConfig.tsx) | UI + import | ✅ |
| [TransactionForm.tsx](src/modules/financeiro/components/TransactionForm.tsx) | Payload | ✅ |
| Backend: interest-config.entity.ts | @Column | 📋 Documentado |
| Backend: DTOs | Validações | 📋 Documentado |
| Backend: index.ts (tipos) | Interfaces | 📋 Documentado |

---

## 📞 Questões & Decisões

**Q: Por que armazenar em tabela instead de calcular sob demanda?**  
A: Para auditoria e histórico. Permite rastrear quando penalidades foram aplicadas e por quem. Recalcular seria sempre diferente se taxa mudasse.

**Q: MONTHLY vs ANNUAL?**  
A: Padrão MONTHLY (maioria dos casos brasileiros). ANNUAL para uso futuro (alguns débitos internacionais/contratos longos).

**Q: Onde aplicar os cálculos?**  
A: Backend (detecção de atraso via job) ou Frontend (preview opcional). Hoje: Frontend só mostra configuração. Backend calcula no job.

---

## ✨ Validações Implementadas

- ✅ Multa: 0-100% (validação Zod)
- ✅ Juros: 0-100% (validação Zod)
- ✅ Período: enum MONTHLY | ANNUAL
- ✅ Opcionais: todos os 3 campos são opcionais
- ✅ Default: interestPeriod = MONTHLY

---

