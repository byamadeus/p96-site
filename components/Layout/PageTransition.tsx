'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(false)
    // Double rAF: first frame resets state, second triggers transition
    let inner: number
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setVisible(true))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [pathname])

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      // No transform here — transforms break position:fixed children
      transition: visible
        ? 'opacity var(--duration-base) var(--ease-out)'
        : 'none',
    }}>
      {children}
    </div>
  )
}
