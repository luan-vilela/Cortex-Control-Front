"use client";

import { useRouter, useParams } from "next/navigation";
import { useActiveWorkspace } from "@/modules/workspace/hooks/useActiveWorkspace";
import { TransactionForm } from "@/modules/finance/components";
import { ModuleGuard } from "@/modules/workspace/components/ModuleGuard";
import { ArrowLeft } from "lucide-react";

export default function NewTransactionPage() {
  const router = useRouter();
  const { activeWorkspace } = useActiveWorkspace();

  if (!activeWorkspace?.id) {
    return (
      <div className="text-center py-12">
        <p className="text-gh-text-secondary">Workspace não disponível</p>
      </div>
    );
  }

  return (
    <ModuleGuard moduleId="finance" workspaceId={activeWorkspace?.id}>
      <div className="min-h-screen bg-gradient-to-br from-gh-bg via-gh-bg to-gh-hover p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header com Voltar */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Voltar</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gh-text">
                Nova Transação
              </h1>
              <p className="text-gh-text-secondary mt-1">
                Preencha os detalhes da transação
              </p>
            </div>
          </div>

          {/* Formulário */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <TransactionForm
              workspaceId={activeWorkspace.id}
              onSuccess={() => {
                router.back();
              }}
              onCancel={() => {
                router.back();
              }}
            />
          </div>
        </div>
      </div>
    </ModuleGuard>
  );
}
