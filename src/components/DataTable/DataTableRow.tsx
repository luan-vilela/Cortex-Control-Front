import React from "react";

interface DataTableRowProps {
  row: any;
  columns: {
    key: string;
    align?: "left" | "right";
    render?: (value: any, row: any) => React.ReactNode;
  }[];
  onHover?: boolean;
  selectable?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onRowClick?: () => void;
}

export function DataTableRow({
  row,
  columns,
  onHover = true,
  selectable = false,
  isSelected = false,
  onSelect,
  onRowClick,
}: DataTableRowProps) {
  return (
    <tr
      onClick={onRowClick}
      className={`${onHover ? "hover:bg-gh-bg transition-colors cursor-pointer" : ""} ${isSelected ? "bg-blue-50" : ""}`}
    >
      {selectable && (
        <td className="px-6 py-4 whitespace-nowrap w-12">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="w-4 h-4 rounded border-gh-border cursor-pointer"
          />
        </td>
      )}
      {columns.map((column) => (
        <td
          key={column.key}
          className={`px-6 py-4 whitespace-nowrap text-sm ${
            column.align === "right" ? "text-right" : "text-left"
          }`}
        >
          {column.render
            ? column.render(row[column.key], row)
            : String(row[column.key] || "-")}
        </td>
      ))}
    </tr>
  );
}
