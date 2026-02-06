interface DataTableHeaderProps {
  headers: {
    key: string;
    label: string;
    align?: "left" | "right";
  }[];
  selectable?: boolean;
  selectAll?: boolean;
  onSelectAll?: () => void;
}

export function DataTableHeader({
  headers,
  selectable = false,
  selectAll = false,
  onSelectAll,
}: DataTableHeaderProps) {
  return (
    <thead className="bg-gh-bg">
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
            }`}
          >
            {header.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}
