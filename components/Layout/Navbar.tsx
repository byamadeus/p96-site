'use client'

import Link from 'next/link'
import P96Logo from './P96Logo'

export default function Navbar() {
  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px',
        borderBottom: '1px solid var(--c-border)',
      }}
    >
      <Link href="/" aria-label="P96 home">
        <P96Logo color="#ffffff" height={18} />
      </Link>

      <div
        style={{
          display: 'flex',
          gap: 'var(--space-6)',
          alignItems: 'center',
        }}
      >
        {(['EVENTS', 'SHOP', 'ABOUT'] as const).map(item => (
          <Link
            key={item}
            href={item === 'EVENTS' ? '/calendar' : `/${item.toLowerCase()}`}
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--c-text-subtle)',
              fontFamily: 'var(--font-body)',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--c-text-muted)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--c-text-subtle)')}
          >
            {item}
          </Link>
        ))}
      </div>
    </nav>
  )
}
