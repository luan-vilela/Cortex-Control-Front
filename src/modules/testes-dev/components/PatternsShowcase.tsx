"use client";

import { PageHeader } from "@/components/patterns/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ComponentShowcase } from "./ComponentShowcase";

export function PatternsShowcase() {
  return (
    <ComponentShowcase
      title="Padrões Layout"
      description="Componentes padrão para estrutura de páginas"
    >
      <div className="space-y-6">
        {/* PageHeader */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">PageHeader</Label>
          <div className="border rounded p-4 bg-gray-50 dark:bg-gray-900">
            <PageHeader
              title="Exemplo de PageHeader"
              subtitle="Usado em páginas principais"
              action={{
                label: "Botão de ação",
                onClick: () => console.log("Clicado!"),
              }}
            />
          </div>
        </div>

        {/* DataTableToolbar Pattern */}
        <div className="space-y-2">
          <p className="text-sm font-semibold">DataTableToolbar</p>
          <div className="border rounded p-4 bg-gray-50 dark:bg-gray-900">
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" variant="outline">
                Filtro 1
              </Button>
              <Button size="sm" variant="outline">
                Filtro 2
              </Button>
              <Button size="sm" variant="outline">
                Buscar
              </Button>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              Usado para filtros e busca em tabelas
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <h4 className="text-sm font-semibold mb-2">Código:</h4>
        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-auto">
          {`<PageHeader
  title="Título da página"
  subtitle="Subtítulo opcional"
  action={{
    label: "Ação",
    onClick: () => handleAction()
  }}
/>`}
        </pre>
      </div>
    </ComponentShowcase>
  );
}

import { Label } from "@/components/ui/label";
