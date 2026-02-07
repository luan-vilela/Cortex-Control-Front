import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { Column } from "./DataTable";

interface DataTableHeaderProps {
  headers: Column[];
  selectable?: boolean;
  selectAll?: boolean;
  onSelectAll?: () => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (column: string) => void;
}

export function DataTableHeader({
  headers,
  selectable = false,
  selectAll = false,
  onSelectAll,
  sortBy,
  sortOrder,
  onSort,
}: DataTableHeaderProps) {
  return (
    <thead className="bg-gh-bg border-b border-gh-border">
      <tr>
        {selectable && (
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={onSelectAll}
              className="w-4 h-4 rounded border-gh-border cursor-pointer"
            />
          </th>
        )}
        {headers.map((header) => (
          <th
            key={header.key}
            className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
              header.align === "right" ? "text-right" : "text-left"
            } ${header.sortable ? "cursor-pointer hover:bg-gh-card" : ""}`}
            onClick={() => header.sortable && onSort && onSort(header.key)}
          >
            <div className="flex items-center gap-2">
              {header.label}
              {header.sortable && (
                <span className="inline-block">
                  {sortBy === header.key ? (
                    sortOrder === "asc" ? (
                      <ArrowUp className="w-4 h-4 text-gh-hover" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-gh-hover" />
                    )
                  ) : (
                    <ArrowUpDown className="w-4 h-4 text-gh-text-secondary opacity-30" />
                  )}
                </span>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}
