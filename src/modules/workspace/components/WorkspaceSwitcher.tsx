"use client";

import { useState, useEffect } from "react";
import { useWorkspaceStore } from "../store/workspace.store";
import { ChevronDown, Building2, Plus, Check, Package } from "lucide-react";
import Link from "next/link";

export function WorkspaceSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    workspaces,
    activeWorkspace,
    switchWorkspace,
    fetchWorkspaces,
    _hasHydrated,
  } = useWorkspaceStore();

  // Carregar workspaces na montagem do componente
  useEffect(() => {
    if (_hasHydrated) {
      fetchWorkspaces();
    }
  }, [_hasHydrated, fetchWorkspaces]);

  // Se ainda está carregando ou sem workspace, não renderiza o botão
  if (!_hasHydrated || !activeWorkspace || workspaces.length === 0) {
    return null;
  }

  const handleSwitchWorkspace = async (workspaceId: string) => {
    try {
      await switchWorkspace(workspaceId);
      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao trocar workspace:", error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gh-border hover:bg-gh-bg transition-colors"
      >
        <Building2 className="w-4 h-4 text-gh-text-secondary" />
        <span className="text-sm font-medium text-gh-text">
          {activeWorkspace.name}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gh-text-secondary transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute top-full mt-2 w-64 bg-gh-card rounded-lg shadow-lg border border-gh-border z-20">
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gh-text-secondary uppercase tracking-wider">
                Seus Workspaces
              </div>

              {workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  onClick={() => handleSwitchWorkspace(workspace.id)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gh-bg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gh-text-secondary" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-gh-text">
                        {workspace.name}
                      </div>
                      <div className="text-xs text-gh-text-secondary capitalize">
                        {workspace.role}
                      </div>
                    </div>
                  </div>

                  {activeWorkspace.id === workspace.id && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}

              <div className="my-2 border-t border-gh-border" />

              <Link
                href="/workspaces/new"
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gh-bg transition-colors text-blue-600"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Criar Workspace</span>
              </Link>

              <Link
                href={`/workspaces/${activeWorkspace.id}/modules`}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gh-bg transition-colors text-gh-text"
              >
                <Package className="w-4 h-4" />
                <span className="text-sm font-medium">Instalar Módulos</span>
              </Link>

              <Link
                href="/workspaces"
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gh-bg transition-colors text-gh-text"
              >
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Gerenciar Workspaces
                </span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
