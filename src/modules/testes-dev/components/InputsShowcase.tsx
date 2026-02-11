"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormInput } from "@/components/FormInput";
import { ComponentShowcase } from "./ComponentShowcase";

export function InputsShowcase() {
  return (
    <ComponentShowcase
      title="Inputs"
      description="Componentes de entrada de dados"
    >
      <div className="space-y-4">
        {/* Shadcn Input */}
        <div className="space-y-2">
          <Label htmlFor="input1">Input (shadcn)</Label>
          <Input
            id="input1"
            placeholder="Digite algo..."
            defaultValue="Exemplo de entrada"
          />
        </div>

        {/* FormInput */}
        <FormInput
          label="FormInput (custom wrapper)"
          placeholder="Exemplo com label integrado"
          defaultValue="Texto de exemplo"
        />

        {/* Diferentes tipos */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="seu@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="number">Number</Label>
            <Input id="number" type="number" placeholder="123" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input id="search" type="search" placeholder="Buscar..." />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <h4 className="text-sm font-semibold mb-2">Código:</h4>
        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-auto">
          {`<Input placeholder="Digite algo..." />

<FormInput
  label="FormInput (custom wrapper)"
  placeholder="Exemplo com label integrado"
/>`}
        </pre>
      </div>
    </ComponentShowcase>
  );
}
