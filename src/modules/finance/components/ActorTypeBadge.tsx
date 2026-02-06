"use client";

import { TransactionActorType } from "../types";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

interface ActorTypeBadgeProps {
  partyType: TransactionActorType;
  showIcon?: boolean;
}

export function ActorTypeBadge({
  partyType,
  showIcon = true,
}: ActorTypeBadgeProps) {
  const isIncome = partyType === TransactionActorType.INCOME;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
        isIncome ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"
      }`}
    >
      {showIcon &&
        (isIncome ? (
          <ArrowUpRight className="w-3 h-3" />
        ) : (
          <ArrowDownLeft className="w-3 h-3" />
        ))}
      {isIncome ? "Entrada" : "Saída"}
    </div>
  );
}
