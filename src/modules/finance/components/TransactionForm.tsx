"use client";

import { useState } from "react";
import { useCreateTransaction } from "../hooks/useFinance";
import {
  CreateTransactionPayload,
  TransactionSourceType,
  TransactionActorType,
} from "../types";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

interface TransactionFormProps {
  workspaceId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface ActorInput {
  workspaceId: string;
  actorType: TransactionActorType;
}

export function TransactionForm({
  workspaceId,
  onSuccess,
  onCancel,
}: TransactionFormProps) {
  const [formData, setFormData] = useState({
    sourceType: TransactionSourceType.MANUAL,
    sourceId: "",
    amount: 0,
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const [actors, setActors] = useState<ActorInput[]>([
    {
      workspaceId: workspaceId,
      actorType: TransactionActorType.INCOME,
    },
  ]);

  const { mutate: createTransaction, isPending } =
    useCreateTransaction(workspaceId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.sourceId.trim()) {
      alert("ID da origem é obrigatório");
      return;
    }

    if (formData.amount <= 0) {
      alert("Valor deve ser maior que zero");
      return;
    }

    if (actors.length === 0) {
      alert("Adicione pelo menos um ator");
      return;
    }

    const payload: CreateTransactionPayload = {
      sourceType: formData.sourceType as TransactionSourceType,
      sourceId: formData.sourceId,
      amount: formData.amount,
      description: formData.description,
      dueDate: new Date(formData.dueDate),
      notes: formData.notes || undefined,
      actors: actors.map((actor) => ({
        workspaceId: actor.workspaceId,
        actorType: actor.actorType,
      })),
    };

    createTransaction(payload, {
      onSuccess: () => {
        setFormData({
          sourceType: TransactionSourceType.MANUAL,
          sourceId: "",
          amount: 0,
          description: "",
          dueDate: new Date().toISOString().split("T")[0],
          notes: "",
        });
        setActors([
          {
            workspaceId: workspaceId,
            actorType: TransactionActorType.INCOME,
          },
        ]);
        onSuccess?.();
      },
    });
  };

  const addActor = () => {
    setActors([
      ...actors,
      {
        workspaceId: "",
        actorType: TransactionActorType.EXPENSE,
      },
    ]);
  };

  const removeActor = (index: number) => {
    setActors(actors.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tipo de Origem */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gh-text">
          Tipo de Origem
        </label>
        <select
          value={formData.sourceType}
          onChange={(e) =>
            setFormData({
              ...formData,
              sourceType: e.target.value as TransactionSourceType,
            })
          }
          className="w-full px-3 py-2 border border-gh-border rounded-lg bg-gh-card text-gh-text focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={TransactionSourceType.MANUAL}>Manual</option>
          <option value={TransactionSourceType.SERVICE_ORDER}>
            Ordem de Serviço
          </option>
          <option value={TransactionSourceType.PURCHASE_ORDER}>
            Pedido de Compra
          </option>
          <option value={TransactionSourceType.INVOICE}>Nota Fiscal</option>
        </select>
      </div>

      {/* ID da Origem */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gh-text">
          ID da Origem
        </label>
        <input
          type="text"
          placeholder="ex: OS-12345"
          value={formData.sourceId}
          onChange={(e) =>
            setFormData({ ...formData, sourceId: e.target.value })
          }
          className="w-full px-3 py-2 border border-gh-border rounded-lg bg-white dark:bg-gh-card text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gh-text">
          Descrição
        </label>
        <input
          type="text"
          placeholder="Descrição da transação"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-3 py-2 border border-gh-border rounded-lg bg-white dark:bg-gh-card text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Valor */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gh-text">Valor</label>
        <input
          type="number"
          placeholder="0.00"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={(e) =>
            setFormData({ ...formData, amount: parseFloat(e.target.value) })
          }
          className="w-full px-3 py-2 border border-gh-border rounded-lg bg-white dark:bg-gh-card text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Data de Vencimento */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gh-text">
          Data de Vencimento
        </label>
        <input
          type="date"
          value={formData.dueDate}
          onChange={(e) =>
            setFormData({ ...formData, dueDate: e.target.value })
          }
          className="w-full px-3 py-2 border border-gh-border rounded-lg bg-white dark:bg-gh-card text-gh-text focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Notas */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gh-text">Notas</label>
        <textarea
          placeholder="Notas internas (opcional)"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-3 py-2 border border-gh-border rounded-lg bg-white dark:bg-gh-card text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
        />
      </div>

      {/* Atores */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gh-text">
            Atores da Transação
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addActor}
            className="text-xs"
          >
            + Adicionar Ator
          </Button>
        </div>

        <div className="space-y-3">
          {actors.map((actor, index) => (
            <div
              key={index}
              className="flex items-end gap-2 p-3 border border-gh-border rounded-lg bg-white dark:bg-gh-card"
            >
              <div className="flex-1 space-y-2">
                <label className="text-xs font-medium text-gh-text-secondary">
                  Workspace
                </label>
                <input
                  type="text"
                  placeholder="ID do workspace"
                  value={actor.workspaceId}
                  onChange={(e) => {
                    const newActors = [...actors];
                    newActors[index].workspaceId = e.target.value;
                    setActors(newActors);
                  }}
                  className="w-full px-2 py-1.5 border border-gh-border rounded text-xs bg-white dark:bg-gh-bg text-gh-text focus:outline-none"
                />
              </div>

              <div className="flex-1 space-y-2">
                <label className="text-xs font-medium text-gh-text-secondary">
                  Tipo
                </label>
                <select
                  value={actor.actorType}
                  onChange={(e) => {
                    const newActors = [...actors];
                    newActors[index].actorType = e.target
                      .value as TransactionActorType;
                    setActors(newActors);
                  }}
                  className="w-full px-2 py-1.5 border border-gh-border rounded text-xs bg-white dark:bg-gh-bg text-gh-text focus:outline-none"
                >
                  <option value={TransactionActorType.INCOME}>Receita</option>
                  <option value={TransactionActorType.EXPENSE}>Despesa</option>
                </select>
              </div>

              {actors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeActor(index)}
                  className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isPending}
          className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
        >
          {isPending ? "Criando..." : "Criar Transação"}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
