"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { workspaceService } from "@/modules/workspace/services/workspace.service";
import { WorkspaceSwitcher } from "@/modules/workspace/components/WorkspaceSwitcher";
import { LogOut, ArrowLeft } from "lucide-react";

export default function NewWorkspacePage() {
  const router = useRouter();
  const { isAuthenticated, _hasHydrated, clearAuth } = useAuthStore();
  const { addWorkspace, clear: clearWorkspace } = useWorkspaceStore();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = () => {
    clearAuth();
    clearWorkspace();
    router.push("/auth/login");
  };

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, _hasHydrated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const workspace = await workspaceService.createWorkspace({ name });
      addWorkspace(workspace);
      router.push("/workspaces");
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao criar workspace");
    } finally {
      setLoading(false);
    }
  };

  if (!_hasHydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Cortex Control</h1>
            <WorkspaceSwitcher />
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <a
          href="/workspaces"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para workspaces
        </a>

        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Criar Novo Workspace
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nome do Workspace
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Minha Empresa"
                required
                minLength={2}
              />
              <p className="mt-2 text-sm text-gray-500">
                Escolha um nome descritivo para seu workspace
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push("/workspaces")}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Criando..." : "Criar Workspace"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
