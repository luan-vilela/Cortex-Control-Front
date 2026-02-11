'use client'

import { PageHeader } from '@/components/patterns/PageHeader'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

import { ComponentShowcase } from './ComponentShowcase'

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
          <div className="rounded border bg-gray-50 p-4 dark:bg-gray-900">
            <PageHeader
              title="Exemplo de PageHeader"
              description="Usado em páginas principais"
              action={{
                label: 'Botão de ação',
                onClick: () => console.log('Clicado!'),
              }}
            />
          </div>
        </div>

        {/* DataTableToolbar Pattern */}
        <div className="space-y-2">
          <p className="text-sm font-semibold">DataTableToolbar</p>
          <div className="rounded border bg-gray-50 p-4 dark:bg-gray-900">
            <div className="flex flex-wrap gap-2">
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
            <p className="mt-2 text-xs text-gray-600">Usado para filtros e busca em tabelas</p>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t pt-4">
        <h4 className="mb-2 text-sm font-semibold">Código:</h4>
        <pre className="overflow-auto rounded bg-gray-100 p-2 text-xs dark:bg-gray-800">
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
  )
}
