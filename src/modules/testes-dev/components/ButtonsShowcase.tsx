"use client";

import { Button } from "@/components/ui/button";
import { ComponentShowcase } from "./ComponentShowcase";

export function ButtonsShowcase() {
  return (
    <ComponentShowcase
      title="Botões"
      description="Componente Button do shadcn/ui com variações"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <h4 className="text-sm font-semibold mb-2">Código:</h4>
        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-auto">
          {`<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button disabled>Disabled</Button>`}
        </pre>
      </div>
    </ComponentShowcase>
  );
}
