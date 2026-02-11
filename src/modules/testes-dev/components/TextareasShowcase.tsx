"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormTextarea } from "@/components/FormTextarea";
import { ComponentShowcase } from "./ComponentShowcase";

export function TextareasShowcase() {
  return (
    <ComponentShowcase
      title="Textareas"
      description="Componentes de entrada de texto multi-linha"
    >
      <div className="space-y-4">
        {/* Shadcn Textarea */}
        <div className="space-y-2">
          <Label htmlFor="textarea1">Textarea (shadcn)</Label>
          <Textarea
            id="textarea1"
            placeholder="Digite um texto mais longo..."
            defaultValue="Exemplo de texto"
          />
        </div>

        {/* FormTextarea */}
        <FormTextarea
          label="FormTextarea (custom wrapper)"
          placeholder="Exemplo com label integrado"
          defaultValue="Texto de exemplo"
          rows={3}
        />

        {/* Diferentes tamanhos */}
        <div className="space-y-2">
          <Label htmlFor="small">Pequeno (2 linhas)</Label>
          <Textarea id="small" placeholder="..." rows={2} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="large">Grande (5 linhas)</Label>
          <Textarea id="large" placeholder="..." rows={5} />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <h4 className="text-sm font-semibold mb-2">Código:</h4>
        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-auto">
          {`<Textarea placeholder="..." />

<FormTextarea
  label="FormTextarea"
  placeholder="Exemplo"
  rows={3}
/>`}
        </pre>
      </div>
    </ComponentShowcase>
  );
}
