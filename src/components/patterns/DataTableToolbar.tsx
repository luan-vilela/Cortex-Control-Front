"use client";

import React from "react";
import { SearchInput } from "./SearchInput";
import { ExportButton } from "./ExportButton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  value: string;
}

interface DataTableToolbarProps {
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  onExport?: (format: string) => void;
  exportData?: any[];
  exportFilename?: string;
  filters?: {
    id: string;
    label: string;
    options: FilterOption[];
    onChange: (value: string) => void;
    value?: string;
  }[];
  additionalActions?: React.ReactNode;
  isLoading?: boolean;
}

export function DataTableToolbar({
  searchPlaceholder = "Pesquisar...",
  onSearch,
  exportData = [],
  exportFilename,
  filters,
  additionalActions,
  isLoading = false,
}: DataTableToolbarProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Linha 1: Search + Export */}
      <div className="flex items-center gap-2">
        {onSearch && (
          <SearchInput
            placeholder={searchPlaceholder}
            onSearch={onSearch}
            disabled={isLoading}
            className="flex-1"
          />
        )}
        {exportData.length > 0 && (
          <ExportButton
            data={exportData}
            filename={exportFilename}
            isLoading={isLoading}
          />
        )}
        {additionalActions}
      </div>

      {/* Linha 2: Filtros */}
      {filters && filters.length > 0 && (
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {filters.map((filter) => (
            <Select
              key={filter.id}
              value={filter.value || ""}
              onValueChange={filter.onChange}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option.id} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      )}
    </div>
  );
}
