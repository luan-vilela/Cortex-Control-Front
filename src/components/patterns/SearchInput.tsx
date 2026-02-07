"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onSearch, className, ...props }, ref) => {
    return (
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={ref}
          type="search"
          placeholder="Pesquisar..."
          className={cn("pl-10", className)}
          onChange={(e) => onSearch?.(e.target.value)}
          {...props}
        />
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";
