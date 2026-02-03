"use client";

import { useState, useEffect } from "react";
import { useWorkspaceStore } from "../store/workspace.store";
import { ChevronDown, Building2, Plus, Check } from "lucide-react";

export function WorkspaceSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    workspaces,
    activeWorkspace,
    switchWorkspace,
    fetchWorkspaces,
    _hasHydrated,
  } = useWorkspaceStore();

  useEffect(() => {
    if (_hasHydrated) {
      fetchWorkspaces();
    }
  }, [_hasHydrated]);

  if (!_hasHydrated || !activeWorkspace) {
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
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
      >
        <Building2 className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {activeWorkspace.name}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform ${
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
          <div className="absolute top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Seus Workspaces
              </div>

              {workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  onClick={() => handleSwitchWorkspace(workspace.id)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-600" />
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-900">
                        {workspace.name}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {workspace.role}
                      </div>
                    </div>
                  </div>

                  {activeWorkspace.id === workspace.id && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}

              <div className="my-2 border-t border-gray-200" />

              <a
                href="/workspaces/new"
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-blue-600"
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm font-medium">Criar Workspace</span>
              </a>

              <a
                href="/workspaces"
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-gray-700"
              >
                <Building2 className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Gerenciar Workspaces
                </span>
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
