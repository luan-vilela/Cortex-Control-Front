"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateWorkspace } from "@/modules/workspace/hooks";
import { useAlerts } from "@/contexts/AlertContext";
import { WorkspaceSwitcher } from "@/modules/workspace/components/WorkspaceSwitcher";
import { NotificationBell } from "@/components/NotificationBell";
import { WalletDisplay } from "@/components/WalletDisplay";
import { UserMenu } from "@/components/UserMenu";
import { ArrowLeft } from "lucide-react";

export default function NewWorkspacePage() {
  const router = useRouter();
  const createWorkspaceMutation = useCreateWorkspace();
  const alerts = useAlerts();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createWorkspaceMutation.mutate(
      { name, description },
      {
        onSuccess: () => {
          alerts.success("Workspace criado com sucesso!");
          router.push("/workspaces");
        },
        onError: (err: any) => {
          alerts.error(
            err.response?.data?.message || "Erro ao criar workspace",
          );
        },
      },
    );
  };

  return (
    <div className="min-h-screen bg-gh-bg">
      {/* Header */}
      <header className="bg-gh-card border border-gh-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gh-text">Cortex Control</h1>
            <WorkspaceSwitcher />
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
            <WalletDisplay />
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <a
          href="/workspaces"
          className="inline-flex items-center gap-2 text-gh-hover hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para workspaces
        </a>

        <div className="bg-gh-card border border-gh-border rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gh-text mb-6">
            Criar Novo Workspace
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gh-text mb-2"
              >
                Nome do Workspace
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gh-border rounded-lg text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:ring-2 focus:ring-gh-hover focus:border-gh-hover"
                placeholder="Minha Empresa"
                required
                minLength={2}
              />
              <p className="mt-2 text-sm text-gh-text-secondary">
                Escolha um nome descritivo para seu workspace
              </p>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gh-text mb-2"
              >
                Descrição (opcional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gh-border rounded-lg text-gh-text placeholder:text-gh-text-secondary focus:outline-none focus:ring-2 focus:ring-gh-hover focus:border-gh-hover"
                placeholder="Descreva o propósito deste workspace..."
                rows={3}
              />
              <p className="mt-2 text-sm text-gh-text-secondary">
                Ajuda a equipe a entender o objetivo do workspace
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push("/workspaces")}
                className="flex-1 px-6 py-3 border border-gh-border text-gh-text rounded-lg hover:bg-gh-bg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={createWorkspaceMutation.isPending}
                className="flex-1 px-6 py-3 bg-gh-hover text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {createWorkspaceMutation.isPending
                  ? "Criando..."
                  : "Criar Workspace"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
