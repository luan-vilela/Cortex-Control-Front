interface DataTableHeaderProps {
  headers: {
    key: string;
    label: string;
  }[];
}

export function DataTableHeader({ headers }: DataTableHeaderProps) {
  return (
    <thead className="border-b border-gh-border bg-gh-bg">
      <tr>
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
