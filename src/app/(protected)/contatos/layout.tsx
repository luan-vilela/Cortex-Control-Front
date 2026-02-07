"use client";

import { useWorkspaceStore } from "@/modules/workspace/store/workspace.store";
import { usePersonStats } from "@/modules/person/hooks/usePersonQueries";
import {
  Users,
  UserPlus,
  TrendingUp,
  ShoppingCart,
  Briefcase,
  Handshake,
} from "lucide-react";
import {
  ModuleLayout,
  ModuleMenuGroup,
} from "@/components/layouts/ModuleLayout";

const getMenuItems = (stats: any): ModuleMenuGroup[] => [
  {
    label: "Todos os Contatos",
    href: "/contatos",
    icon: Users,
    badge: stats?.byType?.PERSON || 0,
  },
  {
    label: "Novo Contato",
    href: "/contatos/new",
    icon: UserPlus,
  },
  {
    section: "papel",
    label: "PAPÉIS",
    items: [
      {
        label: "Clientes",
        href: "/contatos/clientes",
        icon: ShoppingCart,
        badge: stats?.byType?.CLIENTE || 0,
      },
      {
        label: "Fornecedores",
        href: "/contatos/fornecedores",
        icon: Briefcase,
        badge: stats?.byType?.FORNECEDOR || 0,
      },
      {
        label: "Parceiros",
        href: "/contatos/parceiros",
        icon: Handshake,
        badge: stats?.byType?.PARCEIRO || 0,
      },
      {
        label: "Sem Papéis",
        href: "/contatos/sem-papeis",
        icon: TrendingUp,
        badge: stats?.byType?.LEAD || 0,
      },
    ],
  },
];

export default function ContatosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { activeWorkspace } = useWorkspaceStore();
  const { data: stats } = usePersonStats(activeWorkspace?.id || "");

  if (!activeWorkspace) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <p className="text-gh-text-secondary">
          Selecione um workspace para continuar
        </p>
      </div>
    );
  }

  const menuItems = getMenuItems(stats);

  return (
    <ModuleLayout menuItems={menuItems} menuTitle="Contatos">
      {children}
    </ModuleLayout>
  );
}
