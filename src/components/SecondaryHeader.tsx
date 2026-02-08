"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { WorkspaceSwitcher } from "@/modules/workspace/components/WorkspaceSwitcher";
import { useBreadcrumbStore } from "@/modules/workspace/store/breadcrumb.store";
import { NotificationBell } from "@/components/NotificationBell";
import { WalletDisplay } from "@/components/WalletDisplay";
import { UserMenu } from "@/components/UserMenu";

export function SecondaryHeader() {
  const breadcrumbs = useBreadcrumbStore((state) => state.breadcrumbs);

  return (
    <div className="bg-gh-card border-b border-gh-border">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between gap-8">
          {/* Left side: Sidebar Trigger + Breadcrumbs */}
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-1" />

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
          </div>

          {/* Right side: Notifications, Wallet, Workspace Switcher, User Menu */}
          <div className="flex items-center gap-3">
            <NotificationBell />
            <WalletDisplay />
            <div className="w-px h-6 bg-gh-border" />
            <WorkspaceSwitcher />
            <div className="w-px h-6 bg-gh-border" />
            <UserMenu />
          </div>
        </div>
      </div>
    </div>
  );
}
