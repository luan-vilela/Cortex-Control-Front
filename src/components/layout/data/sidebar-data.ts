import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  HelpCircle,
  FileText,
  BarChart3,
  Briefcase,
  Bell,
} from "lucide-react";
import { type SidebarData } from "../types";

export const sidebarData: SidebarData = {
  user: {
    name: "Usuário Cortex",
    email: "user@cortex.local",
    avatar: "/avatars/default.jpg",
  },
  teams: [
    {
      name: "Cortex Control",
      logo: Briefcase,
      plan: "CRM Pro",
    },
  ],
  navGroups: [
    {
      title: "Principal",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Contatos",
          url: "/contatos",
          icon: Users,
        },
        {
          title: "Finanças",
          url: "/finance",
          icon: CreditCard,
        },
      ],
    },
    {
      title: "Ferramentas",
      items: [
        {
          title: "Relatórios",
          url: "/reports",
          icon: BarChart3,
        },
        {
          title: "Documentos",
          url: "/documents",
          icon: FileText,
        },
        {
          title: "Notificações",
          url: "/notifications",
          icon: Bell,
          badge: "0",
        },
      ],
    },
    {
      title: "Administração",
      items: [
        {
          title: "Configurações",
          url: "/settings",
          icon: Settings,
        },
        {
          title: "Ajuda",
          url: "/help",
          icon: HelpCircle,
        },
      ],
    },
  ],
};
