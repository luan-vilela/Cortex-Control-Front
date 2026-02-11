'use client'

import { useEffect, useState } from 'react'

const MOBILE_BREAKPOINT = 768

export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    // Set initial value
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    setIsMobile(mq.matches)

    // Listen for changes
    const onChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
    }

    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // During SSR and initial client-side render, return false
  if (isMobile === undefined) return false

  return isMobile
}
