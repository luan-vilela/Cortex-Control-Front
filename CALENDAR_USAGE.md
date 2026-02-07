# Calendar Component Usage

O shadcn/ui Calendar foi instalado com sucesso. Este componente fornece um calendário elegante e acessível com suporte a temas.

## Instalação ✅

```bash
npx shadcn@latest add calendar --yes
```

**Dependências instaladas:**

- `react-day-picker@^9.13.1` - Para lógica de calendário
- `lucide-react` - Para ícones (já existente)

**Arquivo criado:**

- `src/components/ui/calendar.tsx`

## Uso Básico

### 1. Calendar Standalone

```tsx
"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

export function MyCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  );
}
```

### 2. Com Popover (Calendar em Dropdown)

```tsx
"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export function DatePickerPopover() {
  const [date, setDate] = useState<Date>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-start text-left">
          {date ? format(date, "PPP") : "Selecionar data"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
```

### 3. Com React Hook Form

```tsx
"use client";

import { useForm } from "react-hook-form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export function FormWithDatePicker() {
  const form = useForm({
    defaultValues: {
      startDate: new Date(),
    },
  });

  return (
    <FormField
      control={form.control}
      name="startDate"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Data de Início</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className="w-[200px] justify-start text-left"
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Selecionar data</span>
                  )}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </FormItem>
      )}
    />
  );
}
```

### 4. Range de Datas (Seleção Múltipla)

```tsx
"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

export function DateRangePicker() {
  const [range, setRange] = useState<DateRange | undefined>();

  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
      className="rounded-md border"
    />
  );
}
```

## Props Disponíveis

```typescript
interface CalendarProps extends React.ComponentProps<typeof DayPicker> {
  buttonVariant?: "default" | "outline" | "ghost" | "secondary";
  showOutsideDays?: boolean;
  captionLayout?: "label" | "dropdown" | "dropdown-buttons";
  formatters?: Partial<Formatters>;
  components?: Partial<Components>;
}
```

## Modos Disponíveis

- **`single`** - Selecionar uma única data
- **`multiple`** - Selecionar múltiplas datas individuais
- **`range`** - Selecionar um intervalo de datas (com start e end)

## Casos de Uso no Projeto

### 📊 Finance Page

```tsx
// Range de datas para filtrar transações
<Calendar mode="range" selected={dateRange} onSelect={setDateRange} />
```

### 📅 Agendamentos/Eventos

```tsx
// Selecionar data de agendamento
<Calendar
  mode="single"
  selected={appointmentDate}
  onSelect={setAppointmentDate}
  disabled={(date) => date < new Date()}
/>
```

### 📋 Filtros de Relatórios

```tsx
// Período de geração de relatório
<Calendar mode="range" selected={reportPeriod} onSelect={setReportPeriod} />
```

## Customização com Tailwind

```tsx
<Calendar
  className="rounded-lg shadow-lg"
  classNames={{
    caption: "text-sm font-semibold",
    head_cell: "text-xs text-gray-600",
    cell: "h-9 w-9 text-center text-sm p-0",
    day_selected: "bg-blue-600 text-white",
    day_today: "bg-gray-200 font-bold",
    day_disabled: "text-gray-300 cursor-not-allowed",
  }}
/>
```

## Integração com Themes (Dark Mode)

O componente Calendar herda automaticamente o tema configurado:

```tsx
// Em globals.css
@layer base {
  :root {
    /* Light theme */
    --background: 0 0% 100%;
    --foreground: 0 0% 3.6%;
    --primary: 0 0% 9%;
  }

  .dark {
    /* Dark theme */
    --background: 0 0% 3.6%;
    --foreground: 0 0% 98%;
    --primary: 0 0% 98%;
  }
}
```

## Exemplo Completo com DataTable

```tsx
"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { DataTable } from "@/components/DataTable";
import { DateRange } from "react-day-picker";

export function FilteredDataView() {
  const [dateRange, setDateRange] = useState<DateRange>();

  const filteredData = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return data;
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= dateRange.from && itemDate <= dateRange.to;
    });
  }, [data, dateRange]);

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-3">Período</h3>
        <Calendar mode="range" selected={dateRange} onSelect={setDateRange} />
      </div>

      <DataTable headers={columns} data={filteredData} />
    </div>
  );
}
```

## Dependências Adicionais Úteis

Para melhor integração, considere instalar:

```bash
# Para formatação de datas
npm install date-fns

# Para parsing de datas
npm install date-fns-tz
```

## Validação com Zod

```tsx
import { z } from "zod";

const dateRangeSchema = z
  .object({
    startDate: z.date({
      required_error: "Data inicial é obrigatória",
    }),
    endDate: z.date({
      required_error: "Data final é obrigatória",
    }),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: "Data inicial deve ser anterior à data final",
    path: ["endDate"],
  });
```

## Links Úteis

- [shadcn/ui Calendar Docs](https://ui.shadcn.com/docs/components/calendar)
- [react-day-picker Docs](https://react-day-picker.js.org/)
- [date-fns Docs](https://date-fns.org/)

## Status ✅

- ✅ Componente Calendar instalado
- ✅ react-day-picker v9.13.1 instalado
- ✅ Pronto para uso em Finance, Contatos, Relatórios, etc.
