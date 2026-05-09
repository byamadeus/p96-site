'use client'

import Link from 'next/link'
import P96Logo from '@/components/Layout/P96Logo'

const navItem = (href: string, label: string, size: string) => (
  <Link
    key={label}
    href={href}
    style={{
      fontFamily: 'var(--font-display)',
      fontSize: size,
      fontWeight: 800,
      lineHeight: 0.95,
      letterSpacing: '-0.03em',
      color: '#ffffff',
      display: 'block',
      textTransform: 'uppercase' as const,
      textDecoration: 'none',
    }}
  >
    {label}
  </Link>
)

export default function HomepageLayout() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0E0E0E',
        overflow: 'hidden',
      }}
    >
      {/* Video background */}
      <video
        src="/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.72,
        }}
      />

      {/* Dark scrim */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Content layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '28px 28px 24px',
        }}
      >
        {/* Top: logo */}
        <Link href="/" aria-label="P96 home">
          <P96Logo color="#ffffff" height={22} />
        </Link>

        {/* Bottom nav block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {/* EVENTS with badge */}
          <Link
            href="/calendar"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              flexWrap: 'wrap',
              textDecoration: 'none',
            }}
          >
            <span style={{ fontSize: 'clamp(52px, 12vw, 80px)', textTransform: 'uppercase' }}>
              EVENTS
            </span>
            <span
              style={{
                display: 'inline-block',
                background: 'var(--c-gold)',
                color: '#111',
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(11px, 2.2vw, 14px)',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '5px 12px',
                borderRadius: 3,
                verticalAlign: 'middle',
                marginBottom: 4,
              }}
            >
              2026 WORLD CUP
            </span>
          </Link>

          {/* SHOP + ABOUT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {navItem('/shop', 'SHOP', 'clamp(40px, 9vw, 64px)')}
            {navItem('/about', 'ABOUT', 'clamp(40px, 9vw, 64px)')}
          </div>
        </div>

        {/* Footer bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.38)',
              fontFamily: 'var(--font-body)',
            }}
          >
            P96 IS THE PLACE
          </span>
          <a
            href="mailto:info@p96.nyc"
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.38)',
              fontFamily: 'var(--font-body)',
              textDecoration: 'none',
            }}
          >
            STAY IN TOUCH
          </a>
        </div>
      </div>
    </div>
  )
}
