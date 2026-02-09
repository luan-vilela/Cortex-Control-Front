'use client'

import type { InterestConfig } from '../types'
import { InterestType } from '../types'

import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface InterestConfigComponentProps {
  interest?: InterestConfig
  onChange: (interest: InterestConfig | undefined) => void
}

export function InterestConfigComponent({ interest, onChange }: InterestConfigComponentProps) {
  const [type, setType] = useState<InterestType>(interest?.type || InterestType.PERCENTAGE)

  const handleEnableInterest = () => {
    const newConfig: InterestConfig = {
      type: InterestType.PERCENTAGE,
      percentage: 1,
    }
    onChange(newConfig)
    setType(InterestType.PERCENTAGE)
  }

  const handleDisableInterest = () => {
    onChange(undefined)
  }

  return (
    <div className="space-y-3">
      <RadioGroup
        value={interest ? 'with' : 'without'}
        onValueChange={(value) => {
          if (value === 'without') {
            handleDisableInterest()
          } else {
            handleEnableInterest()
          }
        }}
      >
        {/* Opção 1: Sem Taxas ou Juros */}
        <label className="border-input hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10 dark:has-[[data-state=checked]]:bg-primary/20 flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors">
          <RadioGroupItem value="without" id="interest-without" className="mt-1" />
          <div className="flex-1">
            <p className="text-foreground font-medium">Sem Taxas ou Juros</p>
            <p className="text-muted-foreground text-xs">Nenhuma taxa adicional</p>
          </div>
        </label>

        {/* Opção 2: Com Taxas ou Juros */}
        <label className="border-input hover:bg-accent has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/10 dark:has-[[data-state=checked]]:bg-primary/20 flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors">
          <RadioGroupItem value="with" id="interest-with" className="mt-1" />
          <div className="flex-1">
            <p className="text-foreground font-medium">Com Taxas ou Juros</p>
            <p className="text-muted-foreground text-xs">Adicionar juros ou taxas</p>
          </div>
        </label>
      </RadioGroup>

      {/* Opções de Taxas - Aparecem quando "Com Taxas ou Juros" selecionado */}
      {interest && (
        <div className="border-border space-y-3 border-t pt-4">
          {/* Tipo: Percentual ou Valor Fixo */}
          <div className="flex gap-2">
            <label className="border-input hover:bg-accent flex flex-1 cursor-pointer items-center gap-2 rounded border p-2 transition-colors">
              <input
                type="radio"
                name="chargeType"
                value="percentage"
                checked={type === InterestType.PERCENTAGE}
                onChange={() => {
                  setType(InterestType.PERCENTAGE)
                  onChange({
                    type: InterestType.PERCENTAGE,
                    percentage: interest.percentage || 1,
                  })
                }}
                className="h-3 w-3"
              />
              <span className="text-foreground text-xs font-medium">Percentual (%)</span>
            </label>

            <label className="border-input hover:bg-accent flex flex-1 cursor-pointer items-center gap-2 rounded border p-2 transition-colors">
              <input
                type="radio"
                name="chargeType"
                value="flat"
                checked={type === InterestType.FLAT}
                onChange={() => {
                  setType(InterestType.FLAT)
                  onChange({
                    type: InterestType.FLAT,
                    flatAmount: interest.flatAmount || 0,
                  })
                }}
                className="h-3 w-3"
              />
              <span className="text-foreground text-xs font-medium">Valor Fixo (R$)</span>
            </label>
          </div>

          {/* Campo de Valor */}
          <div className="space-y-2">
            <label className="text-muted-foreground text-xs font-medium">
              {type === InterestType.PERCENTAGE ? 'Taxa (%)' : 'Valor (R$)'}
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={
                type === InterestType.PERCENTAGE
                  ? interest.percentage || 0
                  : interest.flatAmount || 0
              }
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0
                if (type === InterestType.PERCENTAGE) {
                  onChange({
                    type,
                    percentage: value,
                    description: interest.description,
                  })
                } else {
                  onChange({
                    type,
                    flatAmount: value,
                    description: interest.description,
                  })
                }
              }}
              placeholder="0"
            />
          </div>

          {/* Campo de Descrição */}
          <div className="space-y-2">
            <label className="text-muted-foreground text-xs font-medium">
              Descrição (opcional)
            </label>
            <Input
              type="text"
              value={interest.description || ''}
              onChange={(e) =>
                onChange({
                  ...interest,
                  description: e.target.value,
                })
              }
              placeholder="Ex: Taxa de administração"
            />
          </div>
        </div>
      )}
    </div>
  )
}
