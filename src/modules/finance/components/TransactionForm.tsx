"use client";

import { useState } from "react";
import { useCreateTransaction } from "../hooks/useFinance";
import {
  CreateTransactionPayload,
  TransactionSourceType,
  TransactionActorType,
  PaymentConfig,
  PaymentMode,
  RecurrenceConfig,
  InterestConfig,
} from "../types";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/FormInput";
import { FormTextarea } from "@/components/FormTextarea";
import { DatePicker } from "@/components/patterns/DatePicker";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  PaymentModeConfig,
  RecurrenceConfigComponent,
  InterestConfigComponent,
} from "./index";
import { ChevronDown, ChevronUp, TrendingUp, TrendingDown } from "lucide-react";

interface TransactionFormProps {
  workspaceId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TransactionForm({
  workspaceId,
  onSuccess,
  onCancel,
}: TransactionFormProps) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    dueDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [partyType, setPartyType] = useState<TransactionActorType>(
    TransactionActorType.INCOME,
  );
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>({
    mode: PaymentMode.CASH,
  });
  const [recurrenceConfig, setRecurrenceConfig] = useState<
    RecurrenceConfig | undefined
  >();
  const [interest, setInterest] = useState<InterestConfig | undefined>();

  const { mutate: createTransaction, isPending } =
    useCreateTransaction(workspaceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      alert("Descrição é obrigatória");
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert("Valor deve ser maior que zero");
      return;
    }

    const payload: CreateTransactionPayload = {
      sourceType: TransactionSourceType.MANUAL,
      sourceId: "manual-" + Date.now(),
      amount: parseFloat(formData.amount),
      description: formData.description,
      dueDate: new Date(formData.dueDate),
      notes: formData.notes || undefined,
      paymentConfig,
      parties: [
        {
          workspaceId: workspaceId,
          partyType: partyType,
        },
      ],
    };

    createTransaction(payload, {
      onSuccess: () => {
        setFormData({
          description: "",
          amount: "",
          dueDate: new Date().toISOString().split("T")[0],
          notes: "",
        });
        setPaymentConfig({ mode: PaymentMode.CASH });
        setRecurrenceConfig(undefined);
        setInterest(undefined);
        setPartyType(TransactionActorType.INCOME);
        setShowAdvanced(false);
        onSuccess?.();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 px-4 py-6">
      {/* Tipo de Transação - RadioGroup Cards em Linha */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gh-text">
          Tipo de Transação
        </h3>
        <RadioGroup
          value={partyType}
          onValueChange={(value) => setPartyType(value as TransactionActorType)}
          className="grid grid-cols-2 gap-4 max-w-2xl"
        >
          <FieldLabel htmlFor="income-type" className="cursor-pointer">
            <Field orientation="horizontal" className="flex flex-col">
              <div className="flex items-start justify-between w-full gap-4">
                <FieldContent>
                  <FieldTitle className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Entrada
                  </FieldTitle>
                  <FieldDescription>
                    Vendas, serviços, investimentos
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  value={TransactionActorType.INCOME}
                  id="income-type"
                  className="mt-1"
                />
              </div>
            </Field>
          </FieldLabel>

          <FieldLabel htmlFor="expense-type" className="cursor-pointer">
            <Field orientation="horizontal" className="flex flex-col">
              <div className="flex items-start justify-between w-full gap-4">
                <FieldContent>
                  <FieldTitle className="flex items-center gap-3">
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    Saída
                  </FieldTitle>
                  <FieldDescription>
                    Despesas, custos, pagamentos
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  value={TransactionActorType.EXPENSE}
                  id="expense-type"
                  className="mt-1"
                />
              </div>
            </Field>
          </FieldLabel>
        </RadioGroup>
      </div>

      {/* Descrição */}
      <FormInput
        type="text"
        label="Descrição"
        placeholder="Ex: Serviço de consultoria, Venda de produtos..."
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
      />

      {/* Valor e Data */}
      <div className="grid grid-cols-2 gap-3">
        <FormInput
          type="number"
          label="Valor"
          step="0.01"
          min="0"
          placeholder="0,00"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />
        <div className="space-y-2">
          <label className="text-sm font-medium text-gh-text">Vencimento</label>
          <DatePicker
            value={new Date(formData.dueDate)}
            onValueChange={(date) => {
              if (date) {
                setFormData({
                  ...formData,
                  dueDate: date.toISOString().split("T")[0],
                });
              }
            }}
            placeholder="Selecionar data"
          />
        </div>
      </div>

      {/* Notas */}
      <FormTextarea
        label="Notas (opcional)"
        placeholder="Adicione observações sobre essa transação..."
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        rows={2}
      />

      {/* Configurações Avançadas */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group"
        >
          <span className="text-sm font-medium text-gh-text group-hover:text-blue-600">
            Configurações Avançadas
          </span>
          {showAdvanced ? (
            <ChevronUp className="w-4 h-4 text-gh-text-secondary" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gh-text-secondary" />
          )}
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            {/* Modo de Pagamento */}
            <div>
              <PaymentModeConfig
                config={paymentConfig}
                onChange={setPaymentConfig}
              />
            </div>

            {/* Recorrência */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <RecurrenceConfigComponent
                config={recurrenceConfig}
                onChange={setRecurrenceConfig}
              />
            </div>

            {/* Juros */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <InterestConfigComponent
                interest={interest}
                onChange={setInterest}
              />
            </div>
          </div>
        )}
      </div>

      {/* Botões */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? "Salvando..." : "Criar Transação"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="flex-1"
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
