"use client";

import { WorkspaceStatus } from "@/modules/workspace/types/workspace.types";
import { CheckCircle, PauseCircle, Archive, AlertTriangle } from "lucide-react";

interface StatusBadgeProps {
  status: WorkspaceStatus;
  showIcon?: boolean;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

const statusConfig = {
  [WorkspaceStatus.ACTIVE]: {
    label: "Ativo",
    icon: CheckCircle,
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    borderColor: "border-green-300",
  },
  [WorkspaceStatus.INACTIVE]: {
    label: "Inativo",
    icon: PauseCircle,
    bgColor: "bg-gh-bg",
    textColor: "text-gh-text",
    borderColor: "border-gh-border",
  },
  [WorkspaceStatus.SUSPENDED]: {
    label: "Suspenso",
    icon: AlertTriangle,
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    borderColor: "border-red-300",
  },
  [WorkspaceStatus.ARCHIVED]: {
    label: "Arquivado",
    icon: Archive,
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    borderColor: "border-yellow-300",
  },
};

const sizeClasses = {
  sm: {
    text: "text-xs",
    padding: "px-2 py-0.5",
    icon: "w-3 h-3",
  },
  md: {
    text: "text-sm",
    padding: "px-3 py-1",
    icon: "w-4 h-4",
  },
  lg: {
    text: "text-base",
    padding: "px-4 py-1.5",
    icon: "w-5 h-5",
  },
};

export function StatusBadge({
  status,
  showIcon = true,
  showLabel = true,
  size = "md",
}: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizes = sizeClasses[size];

  // Se o status não for reconhecido, usar ACTIVE como fallback
  if (!config) {
    console.warn(
      `Status desconhecido: ${status}. Usando ACTIVE como fallback.`,
    );
    const fallbackConfig = statusConfig[WorkspaceStatus.ACTIVE];
    const Icon = fallbackConfig.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 ${sizes.padding} ${sizes.text} font-medium ${fallbackConfig.bgColor} ${fallbackConfig.textColor} ${fallbackConfig.borderColor} border rounded-full`}
      >
        {showIcon && <Icon className={sizes.icon} />}
        {showLabel && fallbackConfig.label}
      </span>
    );
  }

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${sizes.padding} ${sizes.text} font-medium ${config.bgColor} ${config.textColor} ${config.borderColor} border rounded-full`}
    >
      {showIcon && <Icon className={sizes.icon} />}
      {showLabel && config.label}
    </span>
  );
}
