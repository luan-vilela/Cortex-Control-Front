import React from "react";

interface DataTableRowProps {
  row: any;
  columns: {
    key: string;
    render?: (value: any, row: any) => React.ReactNode;
  }[];
  onHover?: boolean;
}

export function DataTableRow({
  row,
  columns,
  onHover = true,
}: DataTableRowProps) {
  return (
    <tr className={`${onHover ? "hover:bg-gh-hover transition-colors" : ""}`}>
      {columns.map((column) => (
        <td key={column.key} className="px-6 py-3">
          {column.render
            ? column.render(row[column.key], row)
            : String(row[column.key] || "-")}
        </td>
      ))}
    </tr>
  );
}
