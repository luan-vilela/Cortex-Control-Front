"use client";

import { useState } from "react";
import { DatePicker } from "@/components/patterns/DatePicker";
import { DateRangePicker } from "@/components/patterns/DateRangePicker";
import { ComponentShowcase } from "./ComponentShowcase";
import { Label } from "@/components/ui/label";

export function DatePatternsShowcase() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [dateRange, setDateRange] = useState<
    { from: Date; to?: Date } | undefined
  >({ from: new Date(new Date().setDate(new Date().getDate() - 7)) });

  return (
    <ComponentShowcase
      title="Padrões de Data"
      description="Componentes para seleção de datas"
    >
      <div className="space-y-4">
        {/* DatePicker */}
        <div className="space-y-2">
          <Label>DatePicker</Label>
          <DatePicker
            value={date}
            onValueChange={setDate}
            placeholder="Selecionar data"
          />
          {date && (
            <p className="text-sm text-gray-600">
              Data selecionada: {date.toLocaleDateString("pt-BR")}
            </p>
          )}
        </div>

        {/* DateRangePicker */}
        <div className="space-y-2">
          <Label>DateRangePicker</Label>
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            placeholder="Selecionar período"
          />
          {dateRange?.from && (
            <p className="text-sm text-gray-600">
              Período: {dateRange.from.toLocaleDateString("pt-BR")}
              {dateRange.to &&
                ` até ${dateRange.to.toLocaleDateString("pt-BR")}`}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t">
        <h4 className="text-sm font-semibold mb-2">Código:</h4>
        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-auto">
          {`<DatePicker
  value={date}
  onValueChange={setDate}
  placeholder="Selecionar data"
/>

<DateRangePicker
  value={dateRange}
  onChange={setDateRange}
  placeholder="Selecionar período"
/>`}
        </pre>
      </div>
    </ComponentShowcase>
  );
}
