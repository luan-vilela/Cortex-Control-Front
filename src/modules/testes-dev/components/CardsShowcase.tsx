"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComponentShowcase } from "./ComponentShowcase";

export function CardsShowcase() {
  return (
    <ComponentShowcase
      title="Cards e Badges"
      description="Componentes de container e rótulos"
    >
      <div className="space-y-4">
        {/* Diferentes Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Card Simples</CardTitle>
          </CardHeader>
          <CardContent>
            Conteúdo do card. Use para agrupar informações relacionadas.
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-900">
          <CardHeader>
            <CardTitle className="text-blue-700 dark:text-blue-400">
              Card Customizado
            </CardTitle>
          </CardHeader>
          <CardContent>
            Cards podem ter cores e estilos customizados via className.
          </CardContent>
        </Card>

        {/* Badges */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className="bg-green-100 text-green-800">Sucesso</Badge>
            <Badge className="bg-yellow-100 text-yellow-800">Aviso</Badge>
            <Badge className="bg-blue-100 text-blue-800">Informação</Badge>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <h4 className="text-sm font-semibold mb-2">Código:</h4>
        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-auto">
          {`<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    Conteúdo
  </CardContent>
</Card>

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Destructive</Badge>`}
        </pre>
      </div>
    </ComponentShowcase>
  );
}
