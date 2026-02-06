"use client";

import React from "react";

interface RolesBadgeProps {
  papeisList?: string[];
}

export function RolesBadge({ papeisList }: RolesBadgeProps) {
  if (!papeisList || papeisList.length === 0) {
    return <span className="text-xs text-gh-text-secondary">-</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {papeisList.map((papel) => (
        <span
          key={papel}
          className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        >
          {papel}
        </span>
      ))}
    </div>
  );
}
