'use client'

import { ConfigDrawer } from '../config-drawer'
import { Header } from '../layout/header'
import { TopNav } from '../layout/top-nav'
import { ProfileDropdown } from '../profile-dropdown'
import { Search } from '../search'
import { ThemeSwitch } from '../theme-switch'

import type { ReactNode } from 'react'

import type { LucideIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

export interface ModuleMenuItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: number | string
}

export interface ModuleMenuSection {
  section: string
  label: string
  items: ModuleMenuItem[]
}

export type ModuleMenuGroup = ModuleMenuItem | ModuleMenuSection

interface ModuleLayoutProps {
  children: ReactNode
  menuItems?: ModuleMenuGroup[]
  menuTitle?: string
  topNav?: ModuleMenuGroup[]
}

export function ModuleLayout({ children, menuItems, menuTitle, topNav }: ModuleLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href.endsWith('/') && pathname.endsWith('/')) {
      return pathname === href
    }
    if (!href.endsWith('/') && !pathname.endsWith('/')) {
      return pathname === href || pathname.startsWith(href + '/')
    }
    return false
  }

  const renderMenuItem = (item: ModuleMenuItem, isActive: boolean) => {
    const Icon = item.icon
    return (
      <button
        key={item.href}
        onClick={() => router.push(item.href)}
        className={`flex w-full items-center justify-between border-l-2 px-4 py-3 text-sm transition-colors ${
          isActive
            ? 'bg-gh-bg text-gh-text border-blue-500 font-medium'
            : 'text-gh-text-secondary hover:bg-gh-hover hover:text-gh-text border-transparent'
        } `}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Icon className="h-4 w-4 shrink-0" />
          <span className="truncate">{item.label}</span>
        </div>
        {item.badge !== undefined && (
          <span className="bg-gh-badge-bg text-gh-text ml-2 shrink-0 rounded-full px-2 py-0.5 text-xs">
            {item.badge}
          </span>
        )}
      </button>
    )
  }

  const isSectionItem = (item: ModuleMenuGroup): item is ModuleMenuSection => 'section' in item

  // Layout com 2 colunas (menu + conteúdo)
  return (
    <div>
      <Header>
        <TopNav links={topNav} />
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex gap-6">
          {/* Sidebar Menu */}
          {menuItems && (
            <nav className="w-64 shrink-0">
              <div className="bg-gh-bg border-gh-border sticky top-24 overflow-hidden rounded-lg border">
                {/* Menu Title */}
                {menuTitle && (
                  <div className="border-gh-border bg-gh-bg border-b px-4 py-3">
                    <h3 className="text-gh-text-secondary text-xs font-semibold tracking-wide uppercase">
                      {menuTitle}
                    </h3>
                  </div>
                )}

                {/* Menu Items */}
                <div>
                  {menuItems?.map((item, index) => {
                    // Se é uma seção
                    if (isSectionItem(item)) {
                      return (
                        <div key={`section-${index}`}>
                          <div className="text-gh-text-secondary border-gh-border bg-gh-bg border-t px-4 py-3 text-xs font-semibold tracking-wide uppercase">
                            {item.label}
                          </div>
                          {item.items.map((subItem) => (
                            <div key={subItem.href} className="border-gh-border border-t">
                              {renderMenuItem(subItem, isActive(subItem.href))}
                            </div>
                          ))}
                        </div>
                      )
                    }

                    // Se é um item regular
                    return (
                      <div
                        key={item.href}
                        className={index !== 0 ? 'border-gh-border border-t' : ''}
                      >
                        {renderMenuItem(item, isActive(item.href))}
                      </div>
                    )
                  })}
                </div>
              </div>
            </nav>
          )}

          {/* Main Content */}
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </div>
    </div>
  )
}
