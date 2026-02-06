"use client";

import { TransactionStatus } from "../types";

const statusConfig: Record<
  TransactionStatus,
  { label: string; bgColor: string; textColor: string; icon: string }
> = {
  [TransactionStatus.PENDING]: {
    label: "Pendente",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
    icon: "⏳",
  },
  [TransactionStatus.PAID]: {
    label: "Pago",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    icon: "✅",
  },
  [TransactionStatus.PARTIALLY_PAID]: {
    label: "Parcialmente Pago",
    bgColor: "bg-blue-100",
    textColor: "text-blue-700",
    icon: "📊",
  },
  [TransactionStatus.CANCELLED]: {
    label: "Cancelado",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
    icon: "❌",
  },
};

export function StatusBadge({
  status,
  showIcon = true,
}: {
  status: TransactionStatus;
  showIcon?: boolean;
}) {
  const config = statusConfig[status];

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
    >
      {showIcon && <span>{config.icon}</span>}
      <span>{config.label}</span>
    </div>
  );
}
