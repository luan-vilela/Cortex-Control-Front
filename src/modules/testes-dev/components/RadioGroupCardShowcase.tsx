"use client";

import { useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ComponentShowcase } from "./ComponentShowcase";

export function RadioGroupCardShowcase() {
  const [selected, setSelected] = useState("kubernetes");
  const [transactionType, setTransactionType] = useState("income");

  return (
    <ComponentShowcase
      title="RadioGroup Cards"
      description="RadioGroup com Field para seleção de opções mais complexas"
    >
      <div className="space-y-4">
        <div className="space-y-3">
          <RadioGroup
            defaultValue={selected}
            onValueChange={setSelected}
            className="max-w-2xl"
          >
            <FieldLabel htmlFor="kubernetes-plan">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Kubernetes</FieldTitle>
                  <FieldDescription>
                    Run GPU workloads on a K8s configured cluster. This is the
                    default.
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem value="kubernetes" id="kubernetes-plan" />
              </Field>
            </FieldLabel>
            <FieldLabel htmlFor="vm-plan">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Virtual Machine</FieldTitle>
                  <FieldDescription>
                    Access a VM configured cluster to run workloads. (Coming
                    soon)
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem value="vm" id="vm-plan" />
              </Field>
            </FieldLabel>
          </RadioGroup>
        </div>

        <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-950/20 rounded text-sm text-blue-900 dark:text-blue-100">
          Selected: <strong>{selected}</strong>
        </div>

        {/* Exemplo Lado a Lado com Ícones */}
        <div className="mt-8 pt-6 border-t space-y-4">
          <h3 className="text-base font-semibold text-gh-text">
            Exemplo: Lado a Lado com Ícones (Entrada/Saída)
          </h3>
          <RadioGroup
            value={transactionType}
            onValueChange={setTransactionType}
            className="grid grid-cols-2 gap-4 max-w-2xl"
          >
            <FieldLabel htmlFor="income" className="cursor-pointer">
              <Field orientation="horizontal" className="flex flex-col">
                <div className="flex items-start justify-between w-full gap-4">
                  <FieldContent>
                    <FieldTitle className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Entrada
                    </FieldTitle>
                    <FieldDescription>
                      Vendas, serviços, investimentos
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem value="income" id="income" className="mt-1" />
                </div>
              </Field>
            </FieldLabel>

            <FieldLabel htmlFor="expense" className="cursor-pointer">
              <Field orientation="horizontal" className="flex flex-col">
                <div className="flex items-start justify-between w-full gap-4">
                  <FieldContent>
                    <FieldTitle className="flex items-center gap-3">
                      <TrendingDown className="w-5 h-5 text-red-600" />
                      Saída
                    </FieldTitle>
                    <FieldDescription>
                      Despesas, custos, pagamentos
                    </FieldDescription>
                  </FieldContent>
                  <RadioGroupItem
                    value="expense"
                    id="expense"
                    className="mt-1"
                  />
                </div>
              </Field>
            </FieldLabel>
          </RadioGroup>

          <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/20 rounded text-sm text-purple-900 dark:text-purple-100">
            Selected: <strong>{transactionType}</strong>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <h4 className="text-sm font-semibold mb-2">Código:</h4>
        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-auto">
          {`import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function RadioGroupChoiceCard() {
  return (
    <RadioGroup defaultValue="kubernetes" className="max-w-sm">
      <FieldLabel htmlFor="kubernetes-plan">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Kubernetes</FieldTitle>
            <FieldDescription>
              Run GPU workloads on a K8s configured cluster.
            </FieldDescription>
          </FieldContent>
          <RadioGroupItem value="kubernetes" id="kubernetes-plan" />
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="vm-plan">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Virtual Machine</FieldTitle>
            <FieldDescription>
              Access a VM configured cluster to run workloads.
            </FieldDescription>
          </FieldContent>
          <RadioGroupItem value="vm" id="vm-plan" />
        </Field>
      </FieldLabel>
    </RadioGroup>
  )
}`}
        </pre>
      </div>
    </ComponentShowcase>
  );
}
