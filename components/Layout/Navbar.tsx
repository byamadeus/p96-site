'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 'var(--space-6)',
        paddingBottom: 'var(--space-4)',
      }}
    >
      <Link href="/" style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>
        P96
      </Link>

      <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'center' }}>
        <Link
          href="/calendar"
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: pathname === '/calendar' ? 'var(--c-text)' : 'var(--c-text-muted)',
          }}
        >
          Calendar
        </Link>
        <Link
          href="/about"
          style={{ fontSize: 14, fontWeight: 600, color: 'var(--c-text-muted)' }}
        >
          About
        </Link>
        <Link
          href="/shop"
          style={{ fontSize: 14, fontWeight: 600, color: 'var(--c-text-muted)' }}
        >
          Shop
        </Link>
      </div>
    </nav>
  )
}
