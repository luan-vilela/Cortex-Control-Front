"use client";

import { useParams, useRouter } from "next/navigation";
import { useActiveWorkspace } from "@/modules/workspace/hooks/useActiveWorkspace";
import {
  useTransactionDetail,
  useUpdateTransaction,
  useDeleteTransaction,
} from "@/modules/finance/hooks/useFinance";
import { TransactionDetail } from "@/modules/finance/components";
import { ModuleGuard } from "@/modules/workspace/components/ModuleGuard";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Trash2 } from "lucide-react";
import { TransactionStatus } from "@/modules/finance/types";
import { useState } from "react";

export default function TransactionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { activeWorkspace } = useActiveWorkspace();
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  const transactionId = Number(params.transactionId);
  const workspaceId = activeWorkspace?.id || "";

  const { data: transaction, isLoading } = useTransactionDetail(
    workspaceId,
    transactionId,
    !!workspaceId && !!transactionId,
  );

  const { mutate: updateTransaction } = useUpdateTransaction(
    workspaceId,
    transactionId,
  );

  const { mutate: deleteTransaction } = useDeleteTransaction(workspaceId);

  if (!workspaceId) {
    return (
      <div className="text-center py-12">
        <p className="text-gh-text-secondary">Workspace não disponível</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gh-bg via-gh-bg to-gh-hover p-6">
        <div className="max-w-4xl mx-auto">
          <div className="h-96 bg-gh-card border border-gh-border rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gh-bg via-gh-bg to-gh-hover p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-gh-text-secondary">Transação não encontrada</p>
          <Button
            onClick={() => router.push("/finance")}
            className="mt-4"
            variant="outline"
          >
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const handleStatusChange = (newStatus: TransactionStatus) => {
    updateTransaction(
      { status: newStatus },
      {
        onSuccess: () => {
          setIsChangingStatus(false);
        },
      },
    );
  };

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja deletar esta transação?")) {
      deleteTransaction(transactionId, {
        onSuccess: () => {
          router.push("/finance");
        },
      });
    }
  };

  const handleMarkAsPaid = () => {
    updateTransaction({
      status: TransactionStatus.PAID,
      paidDate: new Date(),
    });
  };

  return (
    <ModuleGuard moduleId="finance" workspaceId={activeWorkspace?.id}>
      <div className="min-h-screen bg-gradient-to-br from-gh-bg via-gh-bg to-gh-hover p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/finance")}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Voltar
            </Button>
          </div>

          {/* Main Content */}
          <div className="bg-gh-card border border-gh-border rounded-lg p-8 mb-6">
            <TransactionDetail transaction={transaction} />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-between">
            <div className="flex gap-3">
              {transaction.status === TransactionStatus.PENDING && (
                <Button
                  onClick={handleMarkAsPaid}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  Marcar como Pago
                </Button>
              )}

              {[
                TransactionStatus.PENDING,
                TransactionStatus.PARTIALLY_PAID,
              ].includes(transaction.status) && (
                <div className="relative group">
                  <Button variant="outline">Alterar Status</Button>

                  <div className="absolute hidden group-hover:block left-0 mt-1 bg-gh-card border border-gh-border rounded-lg shadow-lg z-10 min-w-max">
                    {Object.values(TransactionStatus)
                      .filter((s) => s !== transaction.status)
                      .map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          className="block w-full text-left px-4 py-2 text-sm text-gh-text hover:bg-gh-hover first:rounded-t last:rounded-b"
                        >
                          {status}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <Button
              size="sm"
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700"
            >
              <Trash2 size={16} />
              Deletar
            </Button>
          </div>
        </div>
      </div>
    </ModuleGuard>
  );
}
