"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup } from "@/components/ui/RadioGroup";
import { RadioButton } from "@/components/ui/RadioButton";
import { Checkbox } from "@/components/ui/checkbox";
import { ComponentShowcase } from "./ComponentShowcase";

export function SelectsShowcase() {
  return (
    <ComponentShowcase
      title="Selects, Radios e Checkboxes"
      description="Componentes de seleção"
    >
      <div className="space-y-6">
        {/* Select */}
        <div className="space-y-2">
          <Label htmlFor="select">Select</Label>
          <Select>
            <SelectTrigger id="select">
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="opcao1">Opção 1</SelectItem>
              <SelectItem value="opcao2">Opção 2</SelectItem>
              <SelectItem value="opcao3">Opção 3</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* RadioGroup */}
        <div className="space-y-2">
          <Label>RadioGroup</Label>
          <RadioGroup
            name="exemplo"
            value="opcao1"
            label="Escolha uma opção"
            containerClassName="flex flex-col gap-2"
          >
            <RadioButton
              id="radio1"
              name="exemplo"
              value="opcao1"
              label="Opção 1"
            />
            <RadioButton
              id="radio2"
              name="exemplo"
              value="opcao2"
              label="Opção 2"
            />
            <RadioButton
              id="radio3"
              name="exemplo"
              value="opcao3"
              label="Opção 3"
            />
          </RadioGroup>
        </div>

        {/* Checkboxes */}
        <div className="space-y-2">
          <Label>Checkboxes</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="check1" defaultChecked />
              <Label htmlFor="check1" className="font-normal cursor-pointer">
                Opção 1
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="check2" />
              <Label htmlFor="check2" className="font-normal cursor-pointer">
                Opção 2
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="check3" disabled />
              <Label
                htmlFor="check3"
                className="font-normal cursor-pointer opacity-50"
              >
                Opção 3 (desabilitada)
              </Label>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <h4 className="text-sm font-semibold mb-2">Código:</h4>
        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-auto">
          {`<Select>
  <SelectTrigger>
    <SelectValue placeholder="Selecione" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="opcao1">Opção 1</SelectItem>
  </SelectContent>
</Select>

<RadioGroup name="field" value="opcao1">
  <RadioButton id="radio1" value="opcao1" label="Opção 1" />
</RadioGroup>

<Checkbox id="check1" defaultChecked />`}
        </pre>
      </div>
    </ComponentShowcase>
  );
}
