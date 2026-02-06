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
  FinancialCharge,
} from "../types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import {
  PaymentModeConfig,
  RecurrenceConfigComponent,
  FinancialChargesConfig,
} from "./index";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  const [financialCharges, setFinancialCharges] = useState<FinancialCharge[]>(
    [],
  );

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
      recurrenceConfig,
      financialCharges:
        financialCharges.length > 0 ? financialCharges : undefined,
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
        setFinancialCharges([]);
        setPartyType(TransactionActorType.INCOME);
        setShowAdvanced(false);
        onSuccess?.();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-4 py-6">
      {/* Tipo de Transação - Rádio Buttons */}
      <div className="flex gap-3">
        <label className="flex items-center gap-3 flex-1 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
          <input
            type="radio"
            name="partyType"
            value={TransactionActorType.INCOME}
            checked={partyType === TransactionActorType.INCOME}
            onChange={(e) =>
              setPartyType(e.target.value as TransactionActorType)
            }
            className="w-4 h-4 cursor-pointer"
          />
          <span className="text-sm font-medium text-gh-text">Entrada</span>
        </label>
        <label className="flex items-center gap-3 flex-1 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
          <input
            type="radio"
            name="partyType"
            value={TransactionActorType.EXPENSE}
            checked={partyType === TransactionActorType.EXPENSE}
            onChange={(e) =>
              setPartyType(e.target.value as TransactionActorType)
            }
            className="w-4 h-4 cursor-pointer"
          />
          <span className="text-sm font-medium text-gh-text">Saída</span>
        </label>
      </div>

      {/* Descrição */}
      <Input
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
        <Input
          type="number"
          label="Valor"
          step="0.01"
          min="0"
          placeholder="0,00"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        />
        <Input
          type="date"
          label="Vencimento"
          value={formData.dueDate}
          onChange={(e) =>
            setFormData({ ...formData, dueDate: e.target.value })
          }
        />
      </div>

      {/* Notas */}
      <Textarea
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

            {/* Encargos Financeiros */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <FinancialChargesConfig
                charges={financialCharges}
                onChange={setFinancialCharges}
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
