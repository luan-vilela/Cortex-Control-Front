"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

export interface FilterOption {
  value: string | number;
  label: string;
  count?: number;
}

interface FilterWithBadgeProps {
  label: string;
  options: FilterOption[];
  value?: string | number | (string | number)[];
  onValueChange: (
    value: string | number | (string | number)[] | undefined,
  ) => void;
  width?: string;
  multiple?: boolean;
  searchable?: boolean;
}

export function FilterWithBadge({
  label,
  options,
  value,
  onValueChange,
  width = "w-64",
  multiple = false,
  searchable = false,
}: FilterWithBadgeProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Normalizar value para array se multiple, ou string se single
  const values = multiple
    ? Array.isArray(value)
      ? value
      : value
        ? [value]
        : []
    : value && !Array.isArray(value)
      ? value
      : undefined;

  const selectedOptions = multiple
    ? options.filter((opt) =>
        (values as (string | number)[]).includes(opt.value),
      )
    : value && !Array.isArray(value)
      ? [options.find((opt) => opt.value === value)].filter(Boolean)
      : [];

  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : options;

  const handleChange = (optionValue: string | number, checked: boolean) => {
    if (multiple) {
      const newValues = (values as (string | number)[]).includes(optionValue)
        ? (values as (string | number)[]).filter((v) => v !== optionValue)
        : [...(values as (string | number)[]), optionValue];
      onValueChange(newValues.length > 0 ? newValues : undefined);
    } else {
      onValueChange(checked ? optionValue : undefined);
    }
  };

  const handleClear = () => {
    onValueChange(undefined);
    setSearchTerm("");
  };

  return (
    <div className="inline-flex items-center border border-dashed border-gh-border rounded-md px-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            {label}
            {selectedOptions.length > 0 && multiple && (
              <span className="ml-1 text-xs font-semibold text-gh-text-secondary">
                ({selectedOptions.length})
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className={width}>
          {searchable && (
            <div className="p-2 pb-1 border-b border-gh-border">
              <Input
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          )}

          <div className="p-2 space-y-2 max-h-64 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <p className="text-sm text-gh-text-secondary text-center py-2">
                Nenhum resultado
              </p>
            ) : (
              filteredOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-gh-hover"
                >
                  <Checkbox
                    checked={
                      multiple
                        ? (values as (string | number)[]).includes(option.value)
                        : value === option.value
                    }
                    onCheckedChange={(checked) => {
                      handleChange(option.value, checked as boolean);
                    }}
                  />
                  <span className="text-sm flex-1">{option.label}</span>
                  {option.count !== undefined && (
                    <span className="text-xs text-gh-text-secondary ml-auto">
                      {option.count}
                    </span>
                  )}
                </label>
              ))
            )}
          </div>

          {selectedOptions.length > 0 && (
            <div className="p-2 border-t border-gh-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="w-full text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Limpar filtros
              </Button>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedOptions.length > 0 && (
        <div className="flex items-center gap-1 pl-1 border-l border-dashed border-gh-border">
          {selectedOptions.map((opt, idx) => (
            <Badge
              key={opt?.value}
              variant="secondary"
              className={`rounded-sm text-xs ${idx === 0 ? "ml-1" : ""}`}
            >
              {opt?.label}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
