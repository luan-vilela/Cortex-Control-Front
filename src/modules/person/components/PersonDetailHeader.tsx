"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import type { Person } from "@/modules/person/types/person.types";

interface PersonDetailHeaderProps {
  person: Person;
}

export function PersonDetailHeader({ person }: PersonDetailHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => router.back()}
        className="p-2 hover:bg-gh-hover rounded-md transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-gh-text" />
      </button>
      <div>
        <h2 className="text-2xl font-bold text-gh-text">{person.name}</h2>
        <p className="text-sm text-gh-text-secondary">
          {person.email || "Sem email"}
        </p>
      </div>
    </div>
  );
}
