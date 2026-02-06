import React, { useState, useEffect } from "react";
import { DataTableHeader } from "./DataTableHeader";
import { DataTableRow } from "./DataTableRow";
import { Loader2, Search } from "lucide-react";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  headers: Column[];
  data: any[];
  isLoading?: boolean;
  emptyMessage?: string;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: any[]) => void;
}

export function DataTable({
  headers,
  data,
  isLoading = false,
  emptyMessage = "Nenhum registro encontrado",
  selectable = false,
  onSelectionChange,
}: DataTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Atualizar seleção quando data muda
  useEffect(() => {
    setSelectedRows(new Set());
    setSelectAll(false);
  }, [data]);

  const handleSelectRow = (rowId: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }
    setSelectedRows(newSelected);
    
    // Chamar callback com objetos selecionados
    const selected = data.filter(
      (row) => newSelected.has(row.id)
    );
    onSelectionChange?.(selected);

    // Atualizar selectAll se não está totalmente selecionado
    if (newSelected.size !== data.length) {
      setSelectAll(false);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
      setSelectAll(false);
      onSelectionChange?.([]);
    } else {
      const allIds = new Set(data.map((row) => row.id));
      setSelectedRows(allIds);
      setSelectAll(true);
      onSelectionChange?.(data);
    }
  };
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-gh-text-secondary" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-gh-badge-bg rounded-full flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-gh-text-secondary" />
        </div>
        <h3 className="text-lg font-medium text-gh-text mb-2">
          Nenhum resultado
        </h3>
        <p className="text-sm text-gh-text-secondary">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-gh-card border border-gh-border rounded-md overflow-hidden">
      <table className="w-full">
        <DataTableHeader headers={headers} />
        <tbody className="divide-y divide-gh-border">
          {data.map((row, index) => (
            <DataTableRow key={row.id || index} row={row} columns={headers} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
