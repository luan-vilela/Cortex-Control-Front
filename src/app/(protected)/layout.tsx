"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { useWorkspaces } from "@/modules/workspace/hooks";
import { Header } from "@/components/Header";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  // Pré-carregar workspaces
  useWorkspaces();

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, _hasHydrated, router]);

  // Carregar workspaces ao fazer login
  useEffect(() => {
    if (_hasHydrated && isAuthenticated) {
      const { fetchWorkspaces } = useWorkspaceStore.getState();
      fetchWorkspaces();
    }
  }, [_hasHydrated, isAuthenticated]);

  // Mostra loading enquanto verifica autenticação
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Se não estiver autenticado, não renderiza nada (vai redirecionar)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gh-bg flex flex-col">
      {/* Header */}
      <Header />

      {/* Content */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
