"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store/auth.store";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { useWorkspaces } from "@/modules/workspace/hooks";
import { Navbar } from "@/components/Navbar";
import { SecondaryHeader } from "@/components/SecondaryHeader";
import { LayoutProvider } from "@/context/layout-provider";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

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
    <SidebarProvider>
      <LayoutProvider>
        <div className="min-h-screen bg-gh-bg flex flex-col">
          {/* Primary Header */}
          <Navbar />

          {/* Layout com Sidebar + Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <AppSidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Secondary Header with Breadcrumbs */}
              <SecondaryHeader />

              {/* Content */}
              <div className="flex-1 overflow-auto">{children}</div>
            </div>
          </div>
        </div>
      </LayoutProvider>
    </SidebarProvider>
  );
}
