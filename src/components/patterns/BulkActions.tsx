"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Download, Trash2, Copy } from "lucide-react";

interface BulkAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: (selectedIds: string[]) => void | Promise<void>;
  variant?: "default" | "destructive" | "ghost";
  requiresConfirm?: boolean;
}

interface BulkActionsProps {
  selectedCount: number;
  actions?: BulkAction[];
  selectedIds: string[];
  onClearSelection: () => void;
  isLoading?: boolean;
}

export function BulkActions({
  selectedCount,
  actions,
  selectedIds,
  onClearSelection,
  isLoading = false,
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  const defaultActions: BulkAction[] = [
    {
      id: "delete",
      label: "Deletar selecionados",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => console.log("Delete action"),
      variant: "destructive",
      requiresConfirm: true,
    },
  ];

  const allActions = actions || defaultActions;

  return (
    <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex-1">
        <p className="text-sm font-medium text-blue-900">
          {selectedCount} item{selectedCount !== 1 ? "ns" : ""} selecionado
          {selectedCount !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {allActions.length === 1 ? (
          <Button
            variant={allActions[0].variant}
            size="sm"
            onClick={() => allActions[0].onClick(selectedIds)}
            disabled={isLoading}
          >
            {allActions[0].icon}
            <span className="ml-2">{allActions[0].label}</span>
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {allActions.map((action) => (
                <DropdownMenuItem
                  key={action.id}
                  onClick={() => action.onClick(selectedIds)}
                  disabled={isLoading}
                >
                  {action.icon}
                  <span className="ml-2">{action.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          disabled={isLoading}
        >
          Limpar
        </Button>
      </div>
    </div>
  );
}
