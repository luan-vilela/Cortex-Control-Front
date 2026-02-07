import React from "react";
import type { Column, RowAction } from "./DataTable";

interface DataTableRowProps {
  row: any;
  columns: Column[];
  onHover?: boolean;
  selectable?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onRowClick?: () => void;
  actions?: RowAction[];
  striped?: boolean;
  index?: number;
}

export function DataTableRow({
  row,
  columns,
  onHover = true,
  selectable = false,
  isSelected = false,
  onSelect,
  onRowClick,
  actions,
  striped = false,
  index = 0,
}: DataTableRowProps) {
  return (
    <tr
      onClick={onRowClick}
      className={`border-b border-gh-border ${
        striped && index % 2 === 1 ? "bg-gh-bg" : ""
      } ${onHover ? "hover:bg-gh-badge-bg transition-colors cursor-pointer" : ""} ${
        isSelected ? "bg-gh-badge-bg" : ""
      }`}
    >
      {selectable && (
        <td className="px-6 py-4 w-12">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 rounded border-gh-border cursor-pointer"
          />
        </td>
      )}
      {columns.map((column) => (
        <td
          key={column.key}
          className={`px-6 py-4 text-sm text-gh-text ${
            column.align === "right" ? "text-right" : "text-left"
          }`}
        >
          {column.render
            ? column.render(row[column.key], row)
            : String(row[column.key] || "-")}
        </td>
      ))}
      {actions && actions.length > 0 && (
        <td className="px-6 py-4 text-sm">
          <div className="flex items-center gap-2">
            {actions
              .filter((action) => !action.hidden || !action.hidden(row))
              .map((action) => (
                <button
                  key={action.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick(row);
                  }}
                  className={`p-2 rounded inline-flex items-center justify-center transition-colors ${
                    action.variant === "destructive"
                      ? "text-red-600 hover:bg-red-50"
                      : "text-gh-text-secondary hover:bg-gh-card"
                  }`}
                  title={action.label}
                >
                  {action.icon}
                </button>
              ))}
          </div>
        </td>
      )}
    </tr>
  );
}
