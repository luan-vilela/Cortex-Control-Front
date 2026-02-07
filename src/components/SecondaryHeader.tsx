"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { WorkspaceSwitcher } from "@/modules/workspace/components/WorkspaceSwitcher";
import { useBreadcrumbStore } from "@/modules/workspace/store/breadcrumb.store";

export function SecondaryHeader() {
  const breadcrumbs = useBreadcrumbStore((state) => state.breadcrumbs);

  return (
    <div className="bg-gh-card border-b border-gh-border">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2">
            {breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gh-text-secondary" />
                )}

                {breadcrumb.href ? (
                  <Link
                    href={breadcrumb.href}
                    className="text-sm text-gh-text-secondary hover:text-gh-text transition-colors flex items-center gap-1"
                  >
                    {breadcrumb.icon && (
                      <>
                        {React.createElement(breadcrumb.icon, {
                          className: "w-4 h-4",
                        })}
                      </>
                    )}
                    {breadcrumb.label}
                  </Link>
                ) : (
                  <span className="text-sm text-gh-text font-medium flex items-center gap-1">
                    {breadcrumb.icon &&
                      React.createElement(breadcrumb.icon, {
                        className: "w-4 h-4",
                      })}
                    {breadcrumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* Workspace Switcher */}
          <WorkspaceSwitcher />
        </div>
      </div>
    </div>
  );
}
