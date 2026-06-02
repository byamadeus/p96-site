'use client'

import { useEffect } from 'react'

/**
 * Sets html/body background color to match page gradient edge.
 * Prevents dark bleed-through on overscroll or short content.
 * Use in any server component page that has a fixed gradient bg.
 */
export default function PageBg({ color }: { color: string }) {
  useEffect(() => {
    document.documentElement.style.backgroundColor = color
    document.body.style.backgroundColor = 'transparent'
    return () => {
      document.documentElement.style.backgroundColor = ''
      document.body.style.backgroundColor = ''
    }
  }, [color])

  return null
}
