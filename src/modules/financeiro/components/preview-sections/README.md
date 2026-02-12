# Preview de Transação - Estrutura Modular

## 📁 Estrutura de Arquivos

```
preview-sections/
├── BasicInfoSection.tsx      # Informações básicas (descrição, valor, data)
├── InterestSection.tsx        # Taxas e ajustes (percentual ou valor fixo)
├── PenaltySection.tsx         # Multa e mora para atraso
├── PaymentSection.tsx         # Forma de pagamento (à vista ou parcelado)
├── TotalSection.tsx           # Valor total final
└── index.ts                   # Exports centralizados
```

## 🎯 Componentes Reutilizáveis

### 1. BasicInfoSection

Exibe informações básicas da transação.

**Props:**

- `description`: string
- `baseAmount`: number
- `dueDate`: Date
- `notes?`: string (opcional)
- `formatCurrency`: (value: number) => string

### 2. InterestSection

Mostra taxas e ajustes aplicados.

**Props:**

- `interestType`: InterestType (PERCENTAGE | FIXED_VALUE)
- `adjustmentLabel`: string (ex: "10%")
- `adjustmentAmount`: number (valor calculado)
- `description?`: string (opcional)
- `formatCurrency`: (value: number) => string

### 3. PenaltySection

Exibe multa e mora para pagamentos atrasados.

**Props:**

- `penaltyPercentage?`: number (opcional)
- `interestPerMonth?`: number (opcional)

### 4. PaymentSection

Forma de pagamento (à vista ou parcelado com tabela).

**Props:**

- `mode`: PaymentMode (CASH | INSTALLMENT)
- `formatCurrency`: (value: number) => string
- Para parcelado:
  - `downPaymentAmount?`: number
  - `numberOfInstallments?`: number
  - `installmentAmount?`: number
  - `firstInstallmentDate?`: Date
  - `installmentIntervalDays?`: number
  - `financed?`: number
  - `installments?`: Installment[]

### 5. TotalSection

Valor total com breakdown (base + ajustes).

**Props:**

- `totalAmount`: number
- `baseAmount`: number
- `adjustmentAmount`: number
- `formatCurrency`: (value: number) => string

## 🧪 Exemplo de Uso - À Vista com 10% de Juros

```tsx
import { PaymentMode } from '../types'

import { InterestType } from './interest/interestBlock.types'
import { BasicInfoSection, InterestSection, PaymentSection, TotalSection } from './preview-sections'

// Dados do exemplo: R$ 120,00 à vista com 10% de juros
const baseAmount = 120.0
const interestPercentage = 10
const adjustmentAmount = baseAmount * (interestPercentage / 100) // 12.00
const totalAmount = baseAmount + adjustmentAmount // 132.00

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

function ExemploPreview() {
  return (
    <div className="space-y-6">
      <BasicInfoSection
        description="Teste de pagamento à vista"
        baseAmount={baseAmount}
        dueDate={new Date()}
        formatCurrency={formatCurrency}
      />

      <InterestSection
        interestType={InterestType.PERCENTAGE}
        adjustmentLabel="10%"
        adjustmentAmount={adjustmentAmount}
        formatCurrency={formatCurrency}
      />

      <PaymentSection mode={PaymentMode.CASH} formatCurrency={formatCurrency} />

      <TotalSection
        totalAmount={totalAmount}
        baseAmount={baseAmount}
        adjustmentAmount={adjustmentAmount}
        formatCurrency={formatCurrency}
      />
    </div>
  )
}
```

## 📊 Resultado Esperado

**Informações Básicas:**

- Descrição: Teste de pagamento à vista
- Valor Base: R$ 120,00
- Vencimento: [data atual]

**Taxas e Ajustes:**

- Tipo: Percentual
- Valor do Ajuste: 10% = R$ 12,00

**Forma de Pagamento:**

- À Vista
- Pagamento integral na data de vencimento

**Valor Total:**

- **R$ 132,00**
- Base: R$ 120,00 + R$ 12,00

## ✅ Benefícios da Modularização

1. **Reutilizável**: Pode usar cada seção individualmente em outros contextos
2. **Testável**: Cada componente pode ser testado isoladamente
3. **Manutenível**: Mudanças em uma seção não afetam as outras
4. **Composable**: Combine as seções conforme necessário
5. **Clean**: TransactionPreview.tsx ficou com ~200 linhas (antes tinha 580+)

## 🔄 Otimizações Aplicadas

- **Lazy rendering**: Componente só monta quando `isPreviewOpen === true`
- **Memoização**: Cálculos só executam quando o Sheet está aberto (`open === true`)
- **Componentização**: Cada seção é independente e focada
