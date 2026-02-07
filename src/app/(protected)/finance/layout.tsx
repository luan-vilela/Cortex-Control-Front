"use client";

import { ReactNode } from "react";
import { ModuleLayout } from "@/components/layouts/ModuleLayout";

export default function FinanceLayout({ children }: { children: ReactNode }) {
  // Finance não tem menu lateral, então o conteúdo ocupa todo o espaço
  return <ModuleLayout>{children}</ModuleLayout>;
}
