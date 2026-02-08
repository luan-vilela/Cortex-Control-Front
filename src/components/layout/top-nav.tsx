import { Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { ModuleMenuGroup, ModuleMenuItem } from '@/components/layouts/ModuleLayout'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

type TopNavProps = React.HTMLAttributes<HTMLElement> & {
  links?: ModuleMenuGroup[]
}

export function TopNav({ className, links, ...props }: TopNavProps) {
  const pathname = usePathname()

  if (!links) return null

  const isSectionItem = (item: ModuleMenuGroup): item is any => 'section' in item
  const isItemActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const flattenedItems = links
    .filter((item): item is ModuleMenuItem => !isSectionItem(item))
    .slice(0, 5)

  return (
    <>
      <div className="lg:hidden">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="outline" className="md:size-7">
              <Menu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start">
            {flattenedItems.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link
                  href={item.href}
                  className={!isItemActive(item.href) ? 'text-muted-foreground' : ''}
                >
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav
        className={cn('hidden items-center space-x-4 lg:flex lg:space-x-4 xl:space-x-6', className)}
        {...props}
      >
        {flattenedItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`hover:text-primary text-sm font-medium transition-colors ${isItemActive(item.href) ? '' : 'text-muted-foreground'}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  )
}
