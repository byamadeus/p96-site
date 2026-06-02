'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Bug } from 'lucide-react'
import P96Logo from './P96Logo'

interface NavbarProps {
  light?: boolean
}

const DISABLED_ITEMS = new Set<string>([])

function DisabledNavItem({ label, light }: { label: string; light: boolean }) {
  const [hovered, setHovered] = useState(false)
  const disabled = light ? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.18)'

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        fontSize: 10, fontWeight: 600, letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: hovered ? disabled : disabled,
        fontFamily: 'var(--font-body)',
        cursor: 'default',
        userSelect: 'none',
      }}
    >
      {hovered ? 'COMING SOON' : label}
    </span>
  )
}

export default function Navbar({ light = false }: NavbarProps) {
  const subtle = light ? 'rgba(0,0,0,0.35)' : 'var(--c-text-subtle)'
  const muted  = light ? 'rgba(0,0,0,0.6)'  : 'var(--c-text-muted)'
  const border = light ? 'rgba(0,0,0,0.08)' : 'var(--c-border)'
  const logo   = light ? '#111111'           : '#ffffff'

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px 24px',
      borderBottom: `1px solid ${border}`,
    }}>
      <Link href="/" aria-label="P96 home">
        <P96Logo color={logo} height={18} />
      </Link>

      <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'center' }}>
        {(['EVENTS', 'SHOP', 'ABOUT'] as const).map(item => {
          if (DISABLED_ITEMS.has(item)) {
            return <DisabledNavItem key={item} label={item} light={light} />
          }
          const href = item === 'EVENTS' ? '/calendar' : item === 'SHOP' ? '/shop' : '/about'
          return (
            <Link
              key={item}
              href={href}
              style={{
                fontSize: 10, fontWeight: 600, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: subtle,
                fontFamily: 'var(--font-body)', transition: 'color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = muted)}
              onMouseLeave={e => (e.currentTarget.style.color = subtle)}
            >
              {item}
            </Link>
          )
        })}

        <Link href="/admin" aria-label="Admin" title="Admin"
          style={{ display: 'flex', alignItems: 'center', color: subtle, transition: 'color 0.15s' }}
          onMouseEnter={e => (e.currentTarget.style.color = muted)}
          onMouseLeave={e => (e.currentTarget.style.color = subtle)}
        >
          <Bug size={14} strokeWidth={1.75} />
        </Link>
      </div>
    </nav>
  )
}
