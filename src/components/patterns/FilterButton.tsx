"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";

export interface FilterOption {
  value: string | number;
  label: string;
  count?: number;
}

interface FilterButtonProps {
  label: string;
  options: FilterOption[];
  value?: string | number;
  onValueChange: (value: string | number | undefined) => void;
  isActive?: boolean;
  width?: string;
}

export function FilterButton({
  label,
  options,
  value,
  onValueChange,
  isActive = false,
  width = "w-56",
}: FilterButtonProps) {
  const activeOption = options.find((opt) => opt.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={isActive ? "default" : "outline"} size="sm">
          {label}
          {isActive && <X className="w-3 h-3 ml-1.5 opacity-70" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className={width}>
        <div className="p-2 space-y-2">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-gh-hover"
            >
              <Checkbox
                checked={value === option.value}
                onCheckedChange={(checked) => {
                  onValueChange(checked ? option.value : undefined);
                }}
              />
              <span className="text-sm flex-1">{option.label}</span>
              {option.count !== undefined && (
                <span className="text-xs text-gh-text-secondary">
                  {option.count}
                </span>
              )}
            </label>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
