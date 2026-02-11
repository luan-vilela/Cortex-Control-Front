"use client";

import { FornecedorListComponent } from "@/modules/fornecedor/components/FornecedorListComponent";
import { ModuleGuard } from "@/modules/workspace/components/ModuleGuard";
import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";

export default function FornecedoresPage() {
  const { activeWorkspace } = useWorkspaceStore();

  if (!activeWorkspace) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gh-text-secondary">Selecione um workspace</p>
      </div>
    );
  }

  return (
    <ModuleGuard moduleId="contacts" workspaceId={activeWorkspace.id}>
      <FornecedorListComponent />
    </ModuleGuard>
  );
}
