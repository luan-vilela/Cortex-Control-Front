"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    loading?: boolean;
  };
  backButton?: {
    href?: string;
    onClick?: () => void;
  };
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  action,
  backButton,
  children,
}: PageHeaderProps) {
  return (
    <div className="space-y-6">
      {/* Header com Back Button e Título */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {backButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={backButton.onClick}
                className="h-9 w-9"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>

        {action && (
          <Button onClick={action.onClick} disabled={action.loading}>
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
          </Button>
        )}
      </div>

      {/* Toolbar/Filters */}
      {children && <div className="flex flex-col gap-4">{children}</div>}
    </div>
  );
}
