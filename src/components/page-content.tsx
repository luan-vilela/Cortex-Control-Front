'use client'

interface PageContentProps {
  children: React.ReactNode
}

export function PageContent({ children }: PageContentProps) {
  return (
    <div className="space-y-4">
      {children}
    </div>
  )
}
