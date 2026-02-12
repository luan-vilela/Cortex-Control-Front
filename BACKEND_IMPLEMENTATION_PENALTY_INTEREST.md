# Implementação Backend - Multa e Juros de Mora

**Status**: Frontend pronto ✅ | Backend pendente 🔄

---

## 1. Migration SQL

**Arquivo**: `cortex-control/migrations/[TIMESTAMP]_add_penalty_and_interest_period_to_interest_config.sql`

```sql
-- Adiciona colunas para multa e período de juros à tabela financeiro_interest_config
ALTER TABLE financeiro_interest_config
  ADD COLUMN penalty_percentage DECIMAL(5,2) DEFAULT NULL COMMENT 'Multa fixa em % (aplicada uma vez)',
  ADD COLUMN interest_per_month DECIMAL(5,2) DEFAULT NULL COMMENT 'Juros no período (taxa da mora)',
  ADD COLUMN interest_period VARCHAR(20) DEFAULT 'MONTHLY' COMMENT 'Período de aplicação: MONTHLY, ANNUAL';

-- Criar índice para consultas de atraso
CREATE INDEX idx_interest_period ON financeiro_interest_config(interest_period);
```

---

## 2. TypeORM Entity

**Arquivo**: `cortex-control/src/modules/finance/entities/interest-config.entity.ts`

Adicionar `@Column()` para os 3 novos campos:

```typescript
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Transaction } from './transaction.entity'

@Entity('financeiro_interest_config')
export class InterestConfig {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'uuid' })
  workspaceId: string

  @Column()
  transactionId: number

  @ManyToOne(() => Transaction, (t) => t.interestConfig, { onDelete: 'CASCADE' })
  transaction: Transaction

  @Column({ type: 'enum', enum: ['PERCENTAGE', 'FLAT'] })
  interestType: string

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  percentage: number | null

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  flatAmount: number | null

  @Column({ type: 'text', nullable: true })
  description: string | null

  // ✨ Novos campos para multa e mora
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  penaltyPercentage: number | null

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  interestPerMonth: number | null

  @Column({ type: 'varchar', length: 20, default: 'MONTHLY' })
  interestPeriod: string // 'MONTHLY' | 'ANNUAL'

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null
}
```

---

## 3. DTOs (Request/Response)

**Arquivo**: `cortex-control/src/modules/finance/dto/create-interest-config.dto.ts`

```typescript
import { IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'

export enum InterestTypeEnum {
  PERCENTAGE = 'PERCENTAGE',
  FLAT = 'FLAT',
}

export enum InterestPeriodEnum {
  MONTHLY = 'MONTHLY',
  ANNUAL = 'ANNUAL',
}

export class CreateInterestConfigDto {
  @IsEnum(InterestTypeEnum)
  @IsOptional()
  type?: InterestTypeEnum

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  percentage?: number

  @IsNumber()
  @IsOptional()
  @Min(0)
  flatAmount?: number

  @IsString()
  @IsOptional()
  description?: string

  // ✨ Novos campos
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  penaltyPercentage?: number

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  interestPerMonth?: number

  @IsEnum(InterestPeriodEnum)
  @IsOptional()
  interestPeriod: InterestPeriodEnum = InterestPeriodEnum.MONTHLY
}
```

**Arquivo**: `cortex-control/src/modules/finance/dto/interest-config.response.dto.ts`

```typescript
export class InterestConfigResponseDto {
  id: number
  workspaceId: string
  transactionId: number
  interestType: string
  percentage: number | null
  flatAmount: number | null
  description: string | null
  penaltyPercentage: number | null
  interestPerMonth: number | null
  interestPeriod: string
  createdAt: Date
  updatedAt: Date
}
```

---

## 4. Tipos TypeScript (cortex-control-front)

**Arquivo**: `cortex-control-front/src/modules/financeiro/types/index.ts`

Atualizar `InterestConfigEntity`:

```typescript
export interface InterestConfigEntity {
  id: number
  workspaceId: string
  transactionId: number
  interestType: InterestType
  percentage?: number
  flatAmount?: number
  description?: string
  // ✨ Novos campos
  penaltyPercentage?: number
  interestPerMonth?: number
  interestPeriod: 'MONTHLY' | 'ANNUAL'
  createdAt: Date
  updatedAt: Date
}
```

---

## 5. Serviço de Cálculo de Penalidade

**Arquivo**: `cortex-control/src/modules/finance/services/penalty-calculator.service.ts`

```typescript
import { Injectable } from '@nestjs/common'

interface PenaltyCalculationInput {
  originalAmount: number
  daysOverdue: number
  penaltyPercentage?: number
  interestPerMonth?: number
  interestPeriod: 'MONTHLY' | 'ANNUAL'
}

interface PenaltyCalculationResult {
  penaltyAmount: number
  interestAmount: number
  totalAmount: number
  breakdown: {
    original: number
    penalty: number
    interest: number
  }
}

@Injectable()
export class PenaltyCalculatorService {
  calculatePenalty(input: PenaltyCalculationInput): PenaltyCalculationResult {
    const {
      originalAmount,
      daysOverdue,
      penaltyPercentage = 0,
      interestPerMonth = 0,
      interestPeriod,
    } = input

    // 1. Calcular multa (aplicada uma vez)
    const penaltyAmount = originalAmount * (penaltyPercentage / 100)

    // 2. Calcular juros de mora proporcionais ao período
    let interestAmount = 0
    if (interestPerMonth > 0) {
      if (interestPeriod === 'MONTHLY') {
        // Juros mensais: aplicado proporcionalmente por dia (30 dias/mês)
        interestAmount = originalAmount * (interestPerMonth / 100) * (daysOverdue / 30)
      } else if (interestPeriod === 'ANNUAL') {
        // Juros anuais: aplicado proporcionalmente por dia (365 dias/ano)
        interestAmount = originalAmount * (interestPerMonth / 100) * (daysOverdue / 365)
      }
    }

    const totalAmount = originalAmount + penaltyAmount + interestAmount

    return {
      penaltyAmount: Math.round(penaltyAmount * 100) / 100,
      interestAmount: Math.round(interestAmount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      breakdown: {
        original: originalAmount,
        penalty: Math.round(penaltyAmount * 100) / 100,
        interest: Math.round(interestAmount * 100) / 100,
      },
    }
  }
}
```

---

## 6. Checklist de Implementação

- [ ] Executar migration SQL
- [ ] Atualizar `InterestConfig` entity com `@Column()`
- [ ] Criar/atualizar DTOs
- [ ] Atualizar tipos em `cortex-control-front/src/modules/financeiro/types/index.ts`
- [ ] Implementar `PenaltyCalculatorService` (opcional agora, necessário para calcular atrasos)
- [ ] Atualizar endpoint POST `/transactions` para aceitar novos campos
- [ ] Testar salvamento e leitura de `penaltyPercentage`, `interestPerMonth`, `interestPeriod`

---

## 7. Próximos Passos (Futuro)

- [ ] Implementar job/cron que detecta transações atrasadas
- [ ] Calcular e armazenar penalidades em tabela `financeiro_penalty_calculations` (auditoria)
- [ ] Endpoints de relatório com agregação de multas e juros
- [ ] Implementar suporte a período ANNUAL

