# ✅ Padronização de Resposta - Dados de Parcelamento

## Data: 12 de Fevereiro de 2026

### Decisão Arquitetural

**Padrão Senior:** Dados de parcelamento armazenados **APENAS em sourceMetadata**, sem redundância.

```json
{
  "id": 199,
  "description": "venda 3x - Parcela 1/3",
  "amount": "30.00",
  "originalAmount": "99.99",
  "installmentNumber": null,        ← Não será populado (sem redundância)
  "sourceMetadata": {
    "installment": {
      "number": 1,                  ← Fonte de verdade
      "total": 3,
      "planType": "SIMPLE",
      "originalAmount": 99.99,
      "interest": 0,
      "amortization": 30,
      "saldoDevedor": 39.99
    }
  }
}
```

### Implementação

#### Backend (NestJS)

- Arquivo: `src/modules/finance/finance.service.ts`
- Método: `createInstallmentTransactions()` (linhas 223-400)
- **Não modifica** root level `installmentNumber`
- **Popula corretamente** `sourceMetadata.installment.number` com valores (1, 2, 3...)
- Campo raiz permanece NULL por design

#### Frontend (Next.js)

- Arquivo: [src/app/(protected)/financeiro/page.tsx](<src/app/(protected)/financeiro/page.tsx#L155-L162>)
- Coluna "Nº Parcela" acessa: `row.sourceMetadata?.installment?.number`
- Render seguro com fallback para '-' se não existir

### Benefícios

✅ **Sem Redundância**: Dados em um único lugar  
✅ **Padrão Senior**: Estrutura limpa e previsível  
✅ **Reutilizável**: Frontend sabe exatamente onde procurar  
✅ **Extensível**: sourceMetadata contém contexto completo se necessário  
✅ **Compatível**: Banco mantém campo `installmentNumber` para futuro uso

### Verificação

Ambos os componentes compilados com sucesso:

- ✅ Backend: `npm run build` (webpack 5.97.1 compiled successfully)
- ✅ Frontend: `npm run build` (compiled successfully)

### Padrão Aplicável

Este padrão deve ser seguido em:

1. Criação de transações com parcelamento via `paymentConfig`
2. Retorno de listagens de transações (`/finance/transactions`)
3. Retorno de transações individuais (`/finance/transactions/:id`)
4. Qualquer endpoint que retorne Transaction objects

### API Response Format

**Obrigatório:**

- `sourceMetadata.installment.number` = número da parcela (1, 2, 3...)
- `sourceMetadata.installment.total` = total de parcelas
- `sourceMetadata.installment.planType` = tipo do plano (SIMPLE, PRICE_TABLE, SAC)

**Opcional:**

- `sourceMetadata.installment.originalAmount` = valor original da venda
- `sourceMetadata.installment.interest` = juros aplicados
- `sourceMetadata.installment.amortization` = amortização
- `sourceMetadata.installment.saldoDevedor` = saldo devedor (SAC)

---

**Responsável**: Implementação completada  
**Status**: ✅ Pronto para Produção
