"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileJson, FileText } from "lucide-react";

interface ExportFormat {
  id: string;
  label: string;
  icon: React.ReactNode;
  export: (data: any[]) => void;
}

interface ExportButtonProps {
  data: any[];
  filename?: string;
  formats?: ExportFormat[];
  isLoading?: boolean;
}

const defaultExport = (data: any[], filename: string, format: string) => {
  let content: string;
  let type: string;

  if (format === "json") {
    content = JSON.stringify(data, null, 2);
    type = "application/json";
  } else {
    // CSV
    const headers = data[0] ? Object.keys(data[0]) : [];
    const rows = data.map((item) =>
      headers
        .map((h) => `"${String(item[h] || "").replace(/"/g, '""')}"`)
        .join(","),
    );
    content = [headers.join(","), ...rows].join("\n");
    type = "text/csv";
  }

  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.${format}`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

export function ExportButton({
  data,
  filename = "dados",
  formats,
  isLoading = false,
}: ExportButtonProps) {
  const defaultFormats: ExportFormat[] = [
    {
      id: "json",
      label: "JSON",
      icon: <FileJson className="w-4 h-4" />,
      export: (data) => defaultExport(data, filename, "json"),
    },
    {
      id: "csv",
      label: "CSV",
      icon: <FileText className="w-4 h-4" />,
      export: (data) => defaultExport(data, filename, "csv"),
    },
  ];

  const allFormats = formats || defaultFormats;

  if (data.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isLoading}>
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {allFormats.map((format) => (
          <DropdownMenuItem
            key={format.id}
            onClick={() => format.export(data)}
            disabled={isLoading}
          >
            {format.icon}
            <span className="ml-2">{format.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
