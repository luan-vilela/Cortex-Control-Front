"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Loader2,
  Search,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Tipos Compartilhados
export interface Column {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  render?: (value: any, row: any) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

export interface PaginationConfig {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
}

export interface SortingConfig {
  sortBy?: string;
  sortOrder: "asc" | "desc";
  onSort: (column: string) => void;
}

export interface RowAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (row: any) => void;
  variant?: "default" | "destructive" | "ghost";
  hidden?: (row: any) => boolean;
}

interface DataTableProps {
  headers: Column[];
  data: any[];
  isLoading?: boolean;
  emptyMessage?: string;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: any[]) => void;
  onRowClick?: (row: any) => void;
  pagination?: PaginationConfig;
  sorting?: SortingConfig;
  rowActions?: RowAction[];
  striped?: boolean;
  highlightRow?: (row: any) => boolean;
  pageSize?: number; // Default: 20
  maxPageSize?: number; // Default: 100
}

export function DataTable({
  headers,
  data,
  isLoading = false,
  emptyMessage = "Nenhum registro encontrado",
  selectable = false,
  onSelectionChange,
  onRowClick,
  pagination,
  sorting,
  rowActions,
  striped = false,
  highlightRow,
  pageSize = 20,
  maxPageSize = 100,
}: DataTableProps) {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Paginação automática (20 itens por página)
  const effectivePageSize =
    pageSize > 0 && pageSize <= maxPageSize ? pageSize : 20;
  const totalPages = Math.ceil(data.length / effectivePageSize);
  const startIndex = (currentPage - 1) * effectivePageSize;
  const endIndex = startIndex + effectivePageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  const dataKey = useMemo(() => {
    if (!data?.length) return "empty";
    return data.map((item) => item.id).join("|");
  }, [data]);

  const handleSelectRow = (rowId: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(rowId)) {
      newSelected.delete(rowId);
    } else {
      newSelected.add(rowId);
    }
    setSelectedRows(newSelected);
    const selected = data.filter((row) => newSelected.has(row.id));
    onSelectionChange?.(selected);

    if (newSelected.size !== paginatedData.length) {
      setSelectAll(false);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
      setSelectAll(false);
      onSelectionChange?.([]);
    } else {
      const allIds = new Set(paginatedData.map((row) => row.id));
      setSelectedRows(allIds);
      setSelectAll(true);
      onSelectionChange?.(paginatedData);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border rounded-lg">
        <Search className="w-10 h-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nenhum resultado</h3>
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table key={dataKey}>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {selectable && (
              <TableHead className="w-12">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                  aria-label="Selecionar todos"
                />
              </TableHead>
            )}
            {headers.map((header) => (
              <TableHead
                key={header.key}
                className={cn(
                  header.align === "center" && "text-center",
                  header.align === "right" && "text-right",
                  header.width && `w-[${header.width}]`,
                )}
              >
                <div className="flex items-center gap-2">
                  <span>{header.label}</span>
                  {header.sortable && sorting && (
                    <button
                      onClick={() => sorting.onSort(header.key)}
                      className="p-1 hover:bg-muted rounded transition-colors"
                    >
                      {sorting.sortBy === header.key ? (
                        sorting.sortOrder === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              </TableHead>
            ))}
            {rowActions && rowActions.length > 0 && (
              <TableHead className="w-12 text-right">Ações</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row, index) => {
            const visibleActions =
              rowActions?.filter((action) => !action.hidden?.(row)) || [];
            return (
              <TableRow
                key={row.id || index}
                className={cn(
                  striped && index % 2 === 0 && "bg-muted/30",
                  highlightRow?.(row) && "bg-yellow-50 hover:bg-yellow-100",
                  onRowClick && "cursor-pointer",
                )}
                onClick={() => onRowClick?.(row)}
              >
                {selectable && (
                  <TableCell className="w-12">
                    <Checkbox
                      checked={selectedRows.has(row.id)}
                      onCheckedChange={() => handleSelectRow(row.id)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Selecionar ${row.id}`}
                    />
                  </TableCell>
                )}
                {headers.map((column) => (
                  <TableCell
                    key={`${row.id}-${column.key}`}
                    className={cn(
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right",
                    )}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </TableCell>
                ))}
                {visibleActions.length > 0 && (
                  <TableCell className="w-12 text-right">
                    {visibleActions.length === 1 ? (
                      <Button
                        variant={visibleActions[0].variant || "ghost"}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          visibleActions[0].onClick(row);
                        }}
                      >
                        {visibleActions[0].icon}
                      </Button>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {visibleActions.map((action) => (
                            <DropdownMenuItem
                              key={action.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                action.onClick(row);
                              }}
                            >
                              {action.icon && (
                                <span className="mr-2">{action.icon}</span>
                              )}
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Paginação */}
      {data.length > effectivePageSize && (
        <div className="flex items-center justify-between gap-4 px-4 py-3 border-t border-border bg-muted/30">
          <div className="text-sm text-muted-foreground">
            Mostrando <span className="font-medium">{startIndex + 1}</span> a{" "}
            <span className="font-medium">
              {Math.min(endIndex, data.length)}
            </span>{" "}
            de <span className="font-medium">{data.length}</span> registros
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ),
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
