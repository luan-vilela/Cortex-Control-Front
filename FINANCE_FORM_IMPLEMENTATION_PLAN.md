# Plano de Implementação - Frontend Finance Form

## Visão Geral

Refatorar o formulário de transação financeira (`/app/(protected)/finance/new`) para suportar:

- **Modo À Vista (CASH)** com recorrência opcional + juros opcionais
- **Modo Parcelado (INSTALLMENT)** com 3 tipos de plano, entrada opcional + juros opcionais

## Estrutura de Componentes

### 1. **PaymentModeSelector** (novo)

Componente para seleção do modo de pagamento com radio buttons.

```typescript
// src/modules/finance/components/PaymentModeSelector.tsx
interface PaymentModeSelectorProps {
  value: PaymentMode;
  onChange: (mode: PaymentMode) => void;
}

export const PaymentModeSelector = ({ value, onChange }: PaymentModeSelectorProps) => {
  return (
    <Card>
      <CardHeader>Modo de Pagamento</CardHeader>
      <CardContent>
        <RadioGroup value={value} onValueChange={(v) => onChange(v as PaymentMode)}>
          <Label>
            <RadioGroupItem value={PaymentMode.CASH} />
            À Vista (Pagamento único com recorrência opcional)
          </Label>
          <Label>
            <RadioGroupItem value={PaymentMode.INSTALLMENT} />
            Parcelado (Múltiplas parcelas)
          </Label>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
```

---

### 2. **CashPaymentSection** (novo)

Configuração específica para modo CASH.

```typescript
// src/modules/finance/components/CashPaymentSection.tsx
interface CashPaymentSectionProps {
  config: CashPaymentConfig;
  onChange: (config: CashPaymentConfig) => void;
}

export const CashPaymentSection = ({ config, onChange }: CashPaymentSectionProps) => {
  const [showRecurrence, setShowRecurrence] = useState(!!config.recurrence);
  const [showInterest, setShowInterest] = useState(!!config.interest);

  return (
    <div className="space-y-4">
      {/* Recurrence Toggle */}
      <Collapsible open={showRecurrence} onOpenChange={setShowRecurrence}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span>Recorrência (Opcional)</span>
            <span>{showRecurrence ? '▼' : '▶'}</span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-4">
          {/* Type selection */}
          <div>
            <Label>Tipo de Recorrência</Label>
            <Select
              value={config.recurrence?.type || RecurrenceType.MONTHLY}
              onValueChange={(type) =>
                onChange({
                  ...config,
                  recurrence: { ...config.recurrence, type: type as RecurrenceType },
                })
              }
            >
              <SelectContent>
                <SelectItem value={RecurrenceType.DAILY}>Diária</SelectItem>
                <SelectItem value={RecurrenceType.WEEKLY}>Semanal</SelectItem>
                <SelectItem value={RecurrenceType.BIWEEKLY}>Quinzenal</SelectItem>
                <SelectItem value={RecurrenceType.MONTHLY}>Mensal</SelectItem>
                <SelectItem value={RecurrenceType.QUARTERLY}>Trimestral</SelectItem>
                <SelectItem value={RecurrenceType.SEMIANNUAL}>Semestral</SelectItem>
                <SelectItem value={RecurrenceType.ANNUAL}>Anual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Occurrences OR End Date */}
          <Tabs defaultValue="occurrences">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="occurrences">Por Ocorrências</TabsTrigger>
              <TabsTrigger value="endDate">Por Data Final</TabsTrigger>
            </TabsList>
            <TabsContent value="occurrences" className="space-y-2">
              <Label>Número de Ocorrências</Label>
              <Input
                type="number"
                min="1"
                value={config.recurrence?.occurrences || ''}
                onChange={(e) =>
                  onChange({
                    ...config,
                    recurrence: {
                      ...config.recurrence!,
                      occurrences: e.target.value ? parseInt(e.target.value) : undefined,
                      endDate: undefined,
                    },
                  })
                }
                placeholder="Ex: 12 para 12 meses"
              />
            </TabsContent>
            <TabsContent value="endDate" className="space-y-2">
              <Label>Data Final</Label>
              <DatePicker
                value={config.recurrence?.endDate}
                onChange={(date) =>
                  onChange({
                    ...config,
                    recurrence: {
                      ...config.recurrence!,
                      endDate: date,
                      occurrences: undefined,
                    },
                  })
                }
              />
            </TabsContent>
          </Tabs>
        </CollapsibleContent>
      </Collapsible>

      {/* Interest Toggle */}
      <Collapsible open={showInterest} onOpenChange={setShowInterest}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span>Juros/Taxas (Opcional)</span>
            <span>{showInterest ? '▼' : '▶'}</span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-4">
          <InterestConfiguration
            interest={config.interest}
            onChange={(interest) => onChange({ ...config, interest })}
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
```

---

### 3. **InstallmentPaymentSection** (novo)

Configuração específica para modo INSTALLMENT.

```typescript
// src/modules/finance/components/InstallmentPaymentSection.tsx
interface InstallmentPaymentSectionProps {
  config: InstallmentPaymentConfig;
  totalAmount: number;
  onChange: (config: InstallmentPaymentConfig) => void;
}

export const InstallmentPaymentSection = ({
  config,
  totalAmount,
  onChange,
}: InstallmentPaymentSectionProps) => {
  const [showDownpayment, setShowDownpayment] = useState(!!config.downpayment);
  const [showInterest, setShowInterest] = useState(!!config.interest);

  const financedAmount = totalAmount - (config.downpayment || 0);

  return (
    <div className="space-y-6">
      {/* Plan Type Selection */}
      <div>
        <Label className="text-base font-semibold">Tipo de Parcelamento</Label>
        <div className="grid grid-cols-3 gap-4 mt-3">
          {[
            { type: InstallmentPlanType.PRICE_TABLE, label: "Tabela Price", desc: "Parcelas iguais com juros" },
            { type: InstallmentPlanType.SAC, label: "SAC", desc: "Amortização constante" },
            { type: InstallmentPlanType.SIMPLE, label: "Simples", desc: "Divisão simples" },
          ].map(({ type, label, desc }) => (
            <Button
              key={type}
              variant={config.planType === type ? "default" : "outline"}
              className="h-auto flex-col items-start p-4"
              onClick={() => onChange({ ...config, planType: type })}
            >
              <div className="font-semibold">{label}</div>
              <div className="text-xs text-muted-foreground">{desc}</div>
            </Button>
          ))}
        </div>
      </div>

      {/* Number of Installments */}
      <div>
        <Label htmlFor="installments">Número de Parcelas</Label>
        <Input
          id="installments"
          type="number"
          min="2"
          max="120"
          value={config.numberOfInstallments || ''}
          onChange={(e) =>
            onChange({ ...config, numberOfInstallments: parseInt(e.target.value) })
          }
        />
      </div>

      {/* Downpayment Toggle */}
      <Collapsible open={showDownpayment} onOpenChange={setShowDownpayment}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span>Entrada (Opcional)</span>
            <span>{showDownpayment ? '▼' : '▶'}</span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="downpayment">Valor da Entrada</Label>
              <Input
                id="downpayment"
                type="number"
                step="0.01"
                value={config.downpayment || ''}
                onChange={(e) =>
                  onChange({
                    ...config,
                    downpayment: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="downpaymentDate">Data da Entrada</Label>
              <DatePicker
                value={config.downpaymentDate}
                onChange={(date) => onChange({ ...config, downpaymentDate: date })}
              />
            </div>
          </div>
          <Alert>
            <AlertDescription>
              Valor financiado: R$ {financedAmount.toFixed(2)}
            </AlertDescription>
          </Alert>
        </CollapsibleContent>
      </Collapsible>

      {/* First Installment Date */}
      <div>
        <Label htmlFor="firstInstallment">Data da 1ª Parcela</Label>
        <DatePicker
          value={config.firstInstallmentDate}
          onChange={(date) => onChange({ ...config, firstInstallmentDate: date! })}
        />
      </div>

      {/* Installment Interval */}
      <div>
        <Label htmlFor="interval">Intervalo entre Parcelas (dias)</Label>
        <Input
          id="interval"
          type="number"
          min="1"
          value={config.installmentIntervalDays || 30}
          onChange={(e) =>
            onChange({
              ...config,
              installmentIntervalDays: parseInt(e.target.value) || 30,
            })
          }
        />
        <p className="text-xs text-muted-foreground mt-1">
          Padrão: 30 dias (mensal)
        </p>
      </div>

      {/* Interest Toggle */}
      <Collapsible open={showInterest} onOpenChange={setShowInterest}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span>Juros/Taxas (Opcional)</span>
            <span>{showInterest ? '▼' : '▶'}</span>
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-4">
          <InterestConfiguration
            interest={config.interest}
            onChange={(interest) => onChange({ ...config, interest })}
            financedAmount={financedAmount}
          />
        </CollapsibleContent>
      </Collapsible>

      {/* Summary */}
      <InstallmentSummary config={config} totalAmount={totalAmount} />
    </div>
  );
};
```

---

### 4. **InterestConfiguration** (novo)

Componente reutilizável para configurar juros.

```typescript
// src/modules/finance/components/InterestConfiguration.tsx
interface InterestConfigurationProps {
  interest?: InterestConfig;
  onChange: (interest: InterestConfig) => void;
  financedAmount?: number;
}

export const InterestConfiguration = ({
  interest,
  onChange,
  financedAmount,
}: InterestConfigurationProps) => {
  const [type, setType] = useState<InterestType>(
    interest?.type || InterestType.PERCENTAGE
  );

  return (
    <div className="space-y-4">
      <div>
        <Label>Tipo de Juros</Label>
        <RadioGroup value={type} onValueChange={(v) => setType(v as InterestType)}>
          <Label>
            <RadioGroupItem value={InterestType.PERCENTAGE} />
            Percentual (%)
          </Label>
          <Label>
            <RadioGroupItem value={InterestType.FLAT} />
            Valor Fixo (R$)
          </Label>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="interestValue">
          {type === InterestType.PERCENTAGE ? "Percentual" : "Valor"}
        </Label>
        <Input
          id="interestValue"
          type="number"
          step={type === InterestType.PERCENTAGE ? "0.01" : "0.01"}
          value={
            type === InterestType.PERCENTAGE
              ? interest?.percentage || ''
              : interest?.flatAmount || ''
          }
          onChange={(e) => {
            const value = e.target.value ? parseFloat(e.target.value) : undefined;
            onChange({
              type,
              percentage: type === InterestType.PERCENTAGE ? value : undefined,
              flatAmount: type === InterestType.FLAT ? value : undefined,
              description: interest?.description,
            });
          }}
          placeholder={type === InterestType.PERCENTAGE ? "Ex: 5.00" : "Ex: 150.00"}
        />
      </div>

      <div>
        <Label htmlFor="interestDesc">Descrição (opcional)</Label>
        <Input
          id="interestDesc"
          value={interest?.description || ''}
          onChange={(e) =>
            onChange({
              ...interest!,
              type,
              description: e.target.value,
            })
          }
          placeholder="Ex: Taxa de juros mensal"
        />
      </div>

      {/* Interest Preview */}
      {interest && financedAmount && (
        <Alert className="bg-blue-50">
          <AlertDescription>
            {type === InterestType.PERCENTAGE
              ? `Juros: R$ ${(financedAmount * (interest.percentage || 0)) / 100} (${interest.percentage}%)`
              : `Juros: R$ ${interest.flatAmount}`}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
```

---

### 5. **InstallmentSummary** (novo)

Preview visual do parcelamento.

```typescript
// src/modules/finance/components/InstallmentSummary.tsx
interface InstallmentSummaryProps {
  config: InstallmentPaymentConfig;
  totalAmount: number;
}

export const InstallmentSummary = ({ config, totalAmount }: InstallmentSummaryProps) => {
  const downpayment = config.downpayment || 0;
  const financedAmount = totalAmount - downpayment;
  const interestAmount = config.interest
    ? config.interest.type === InterestType.PERCENTAGE
      ? (financedAmount * (config.interest.percentage || 0)) / 100
      : config.interest.flatAmount || 0
    : 0;

  const totalWithInterest = financedAmount + interestAmount;
  const installmentAmount = totalWithInterest / config.numberOfInstallments;

  return (
    <Card className="bg-slate-50">
      <CardHeader>
        <CardTitle className="text-sm">Resumo do Parcelamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Valor Total:</span>
          <span className="font-semibold">R$ {totalAmount.toFixed(2)}</span>
        </div>
        {downpayment > 0 && (
          <div className="flex justify-between">
            <span>Entrada:</span>
            <span className="font-semibold text-green-600">-R$ {downpayment.toFixed(2)}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between">
          <span>Valor a Financiar:</span>
          <span>R$ {financedAmount.toFixed(2)}</span>
        </div>
        {interestAmount > 0 && (
          <div className="flex justify-between">
            <span>Juros:</span>
            <span className="text-orange-600">+R$ {interestAmount.toFixed(2)}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between pt-2">
          <span className="font-semibold">Valor por Parcela:</span>
          <span className="font-semibold text-lg">R$ {installmentAmount.toFixed(2)}</span>
        </div>
        <div className="text-xs text-muted-foreground pt-2">
          {config.numberOfInstallments}x de R$ {installmentAmount.toFixed(2)} ({config.planType})
          {config.installmentIntervalDays !== 30 && ` a cada ${config.installmentIntervalDays} dias`}
        </div>
      </CardContent>
    </Card>
  );
};
```

---

### 6. **TransactionFormNew** (refatorado)

Componente principal que orquestra tudo.

```typescript
// src/modules/finance/components/TransactionFormNew.tsx
interface TransactionFormNewProps {
  onSuccess?: () => void;
}

export const TransactionFormNew = ({ onSuccess }: TransactionFormNewProps) => {
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(PaymentMode.CASH);
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [sourceType, setSourceType] = useState<TransactionSourceType>(
    TransactionSourceType.MANUAL
  );
  const [parties, setParties] = useState<CreateTransactionPartyPayload[]>([]);

  // Payment config per mode
  const [cashConfig, setCashConfig] = useState<CashPaymentConfig>({
    mode: PaymentMode.CASH,
  });
  const [installmentConfig, setInstallmentConfig] = useState<InstallmentPaymentConfig>({
    mode: PaymentMode.INSTALLMENT,
    planType: InstallmentPlanType.PRICE_TABLE,
    numberOfInstallments: 12,
    firstInstallmentDate: new Date(),
    installmentIntervalDays: 30,
  });

  const { mutate: createTransaction, isPending } = useCreateTransaction();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!dueDate || !description || amount <= 0 || parties.length === 0) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const paymentConfig: PaymentConfig =
      paymentMode === PaymentMode.CASH ? cashConfig : installmentConfig;

    const payload: CreateTransactionPayload = {
      sourceType,
      sourceId: `${sourceType}-${Date.now()}`,
      amount,
      description,
      dueDate,
      paymentConfig,
      parties,
    };

    createTransaction(payload, {
      onSuccess: () => {
        toast.success('Transação criada com sucesso');
        onSuccess?.();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Nova Transação"
        subtitle="Crie uma nova transação com modo de pagamento customizado"
      />

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="amount">Valor Total (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount || ''}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              required
            />
          </div>
          <div>
            <Label htmlFor="dueDate">Data de Vencimento</Label>
            <DatePicker
              value={dueDate}
              onChange={setDueDate}
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Mode Selection */}
      <PaymentModeSelector
        value={paymentMode}
        onChange={setPaymentMode}
      />

      {/* Mode-Specific Configuration */}
      {paymentMode === PaymentMode.CASH ? (
        <CashPaymentSection
          config={cashConfig}
          onChange={setCashConfig}
        />
      ) : (
        <InstallmentPaymentSection
          config={installmentConfig}
          totalAmount={amount}
          onChange={setInstallmentConfig}
        />
      )}

      {/* Parties/Actors Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Partes Envolvidas</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Parties selection UI */}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? 'Criando...' : 'Criar Transação'}
      </Button>
    </form>
  );
};
```

---

## Validação de Regras de Negócio

```typescript
// src/modules/finance/utils/validation.ts
export const validatePaymentConfig = (
  config: PaymentConfig,
  amount: number,
) => {
  const errors: string[] = [];

  if (config.mode === PaymentMode.CASH) {
    const cashConfig = config as CashPaymentConfig;

    // Recurrence should not have installment-related fields
    if (cashConfig.recurrence) {
      // Valid
    }
  } else if (config.mode === PaymentMode.INSTALLMENT) {
    const installConfig = config as InstallmentPaymentConfig;

    // Validate installment config
    if (installConfig.numberOfInstallments < 2) {
      errors.push("Número mínimo de parcelas é 2");
    }

    if (installConfig.downpayment && installConfig.downpayment >= amount) {
      errors.push("Entrada não pode ser maior ou igual ao valor total");
    }

    if (!installConfig.firstInstallmentDate) {
      errors.push("Data da primeira parcela é obrigatória");
    }

    if (!installConfig.planType) {
      errors.push("Tipo de parcelamento é obrigatório");
    }
  }

  // Validate interest
  if (config.interest) {
    if (config.interest.type === InterestType.PERCENTAGE) {
      if (!config.interest.percentage || config.interest.percentage < 0) {
        errors.push("Percentual de juros inválido");
      }
    } else if (config.interest.type === InterestType.FLAT) {
      if (!config.interest.flatAmount || config.interest.flatAmount < 0) {
        errors.push("Valor de juros inválido");
      }
    }
  }

  return errors;
};
```

---

## Próximos Passos

1. ✅ Criar entities no backend (InstallmentPlan, RecurrenceConfig, etc)
2. ✅ Criar migração de banco de dados
3. ✅ Atualizar tipos TypeScript
4. 🔄 Implementar componentes (CashPaymentSection, InstallmentPaymentSection, etc)
5. 🔄 Refatorar TransactionFormNew
6. 🔄 Implementar validações
7. 🔄 Integrar com API backend
8. 🔄 Testes
