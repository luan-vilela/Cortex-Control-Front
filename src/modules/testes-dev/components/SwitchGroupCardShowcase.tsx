'use client'

import { useState } from 'react'

import { DollarSign, FileText } from 'lucide-react'

import { SwitchGroupCard, SwitchGroupCards } from '@/components/patterns/SwitchGroupCard'

import { ComponentShowcase } from './ComponentShowcase'

export function SwitchGroupCardShowcase() {
  const [isBillable, setIsBillable] = useState(true)
  const [isActive, setIsActive] = useState(false)

  return (
    <ComponentShowcase
      title="Switch Group Cards"
      description="Componentes de switch estilizados como cards para seleção binária"
    >
      <div className="space-y-6">
        {/* Exemplo Simples */}
        <div className="space-y-3">
          <h3 className="text-gh-text text-base font-semibold">Exemplo: Switch Simples</h3>
          <SwitchGroupCard
            value={isBillable}
            onValueChange={setIsBillable}
            title="Faturável"
            description="Marque se esta ordem deve gerar transações financeiras"
          />

          <div className="mt-4 rounded bg-blue-50 p-3 text-sm text-blue-900 dark:bg-blue-950/20 dark:text-blue-100">
            Estado: <strong>{isBillable ? 'Faturável' : 'Não faturável'}</strong>
          </div>
        </div>

        {/* Exemplo Lado a Lado */}
        <div className="mt-8 space-y-4 border-t pt-6">
          <h3 className="text-gh-text text-base font-semibold">
            Exemplo: Grupo de Switches (Entrada/Saída)
          </h3>
          <SwitchGroupCards
            value={isActive}
            onValueChange={setIsActive}
            trueOption={{
              title: 'Ativo',
              description: 'Item está disponível e funcionando',
            }}
            falseOption={{
              title: 'Inativo',
              description: 'Item está desabilitado temporariamente',
            }}
          />

          <div className="mt-4 rounded bg-purple-50 p-3 text-sm text-purple-900 dark:bg-purple-950/20 dark:text-purple-100">
            Estado: <strong>{isActive ? 'Ativo' : 'Inativo'}</strong>
          </div>
        </div>

        {/* Exemplo com Ícones */}
        <div className="mt-8 space-y-4 border-t pt-6">
          <h3 className="text-gh-text text-base font-semibold">
            Exemplo: Com Ícones (Faturável/Não Faturável)
          </h3>
          <div className="grid max-w-2xl grid-cols-2 gap-4">
            <SwitchGroupCard
              value={isBillable}
              onValueChange={setIsBillable}
              title={
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Faturável
                </div>
              }
              description="Gera transações no financeiro"
            />

            <SwitchGroupCard
              value={!isBillable}
              onValueChange={(value) => setIsBillable(!value)}
              title={
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-600" />
                  Não Faturável
                </div>
              }
              description="Apenas registro, sem impacto financeiro"
            />
          </div>

          <div className="mt-4 rounded bg-green-50 p-3 text-sm text-green-900 dark:bg-green-950/20 dark:text-green-100">
            Estado: <strong>{isBillable ? 'Faturável' : 'Não faturável'}</strong>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t pt-4">
        <h4 className="mb-2 text-sm font-semibold">Código:</h4>
        <pre className="overflow-auto rounded bg-gray-100 p-2 text-xs dark:bg-gray-800">
          {`import { SwitchGroupCard, SwitchGroupCards } from "@/components/patterns/SwitchGroupCard"

// Switch simples
<SwitchGroupCard
  value={isBillable}
  onValueChange={setIsBillable}
  title="Faturável"
  description="Marque se esta ordem deve gerar transações financeiras"
/>

// Grupo de switches
<SwitchGroupCards
  value={isActive}
  onValueChange={setIsActive}
  trueOption={{
    title: "Ativo",
    description: "Item está disponível"
  }}
  falseOption={{
    title: "Inativo",
    description: "Item está desabilitado"
  }}
/>`}
        </pre>
      </div>
    </ComponentShowcase>
  )
}
