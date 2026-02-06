"use client";

import React from "react";
import { Trash2 } from "lucide-react";

interface ActionButtonsProps {
  onView?: () => void;
  onDelete?: () => void;
  showView?: boolean;
  showDelete?: boolean;
}

export function ActionButtons({
  onView,
  onDelete,
  showView = true,
  showDelete = true,
}: ActionButtonsProps) {
  return (
    <div className="flex gap-2">
      {showView && onView && (
        <button
          onClick={onView}
          className="text-gh-accent hover:text-gh-accent-dark transition-colors text-xs font-medium"
        >
          Ver
        </button>
      )}
      {showDelete && onDelete && (
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 transition-colors text-xs font-medium"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
