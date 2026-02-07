"use client";

import { useState } from "react";
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
