"use client";

import React from "react";
import { Users, Briefcase, Handshake } from "lucide-react";

interface RolesBadgeProps {
  papeisList?: string[];
  showIcons?: boolean;
}

const roleIcons = {
  Cliente: { Icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
  Fornecedor: { Icon: Briefcase, color: "text-green-600", bg: "bg-green-100" },
  Parceiro: { Icon: Handshake, color: "text-purple-600", bg: "bg-purple-100" },
};

export function RolesBadge({ papeisList, showIcons = false }: RolesBadgeProps) {
  if (!papeisList || papeisList.length === 0) {
    return <span className="text-xs text-gh-text-secondary">-</span>;
  }

  if (showIcons) {
    return (
      <div className="flex flex-wrap gap-2">
        {papeisList.map((papel) => {
          const config = roleIcons[papel as keyof typeof roleIcons];
          if (!config) return null;

          const { Icon, color, bg } = config;

          return (
            <div
              key={papel}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bg}`}
              title={papel}
            >
              <Icon className={`w-3.5 h-3.5 ${color}`} />
              {/* <span className={color}>{papel}</span> */}
            </div>
          );
        })}
      </div>
    );
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
