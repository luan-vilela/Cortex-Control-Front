"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  value?: DateRange;
  onValueChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DateRangePicker({
  value,
  onValueChange,
  placeholder = "Selecionar período",
  disabled = false,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [tempRange, setTempRange] = React.useState<DateRange | undefined>(
    value,
  );

  // Sincroniza tempRange quando o popover abre
  React.useEffect(() => {
    if (open) {
      setTempRange(value);
    }
  }, [open, value]);

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return placeholder;

    const from = range.from.toLocaleDateString("pt-BR");
    const to = range.to
      ? range.to.toLocaleDateString("pt-BR")
      : range.from.toLocaleDateString("pt-BR");

    if (from === to) {
      return from;
    }

    return `${from} - ${to}`;
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && tempRange !== value) {
      // Popover está fechando, aplica a mudança
      onValueChange?.(tempRange);
    }
    setOpen(newOpen);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateRange(value)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={tempRange}
          onSelect={(range) => {
            setTempRange(range);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
