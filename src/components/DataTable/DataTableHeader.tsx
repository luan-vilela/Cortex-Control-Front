interface DataTableHeaderProps {
  headers: {
    key: string;
    label: string;
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
    <thead className="border-b border-gh-border bg-gh-bg">
      <tr>
        {selectable && (
          <th className="px-6 py-3 text-left text-xs font-medium text-gh-text-secondary uppercase w-12">
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
            className="px-6 py-3 text-left text-xs font-medium text-gh-text-secondary uppercase"
          >
            {header.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}
