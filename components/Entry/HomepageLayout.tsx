'use client'

import { useState } from 'react'
import Link from 'next/link'
import P96Logo from '@/components/Layout/P96Logo'

export default function HomepageLayout() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#0E0E0E' }}>
      {/* Background image */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'url(/capture-11.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.85,
      }} />

      {/* Dark scrim */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.4) 100%)',
      }} />

      {/* Content layer */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '28px 28px 24px',
      }}>
        {/* Top: logo */}
        <Link href="/" aria-label="P96 home">
          <P96Logo color="#ffffff" height={22} />
        </Link>

        {/* Bottom nav block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

          {/* WORLD CUP — active */}
          <Link
            href="/world-cup"
            onMouseEnter={() => setHovered('events')}
            onMouseLeave={() => setHovered(null)}
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
              opacity: hovered === 'events' ? 0.7 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            <span style={{ fontSize: 'clamp(40px, 9vw, 64px)', textTransform: 'uppercase' }}>
              WORLD CUP
            </span>
          </Link>

          {/* SHOP */}
          <Link
            href="/shop"
            onMouseEnter={() => setHovered('shop')}
            onMouseLeave={() => setHovered(null)}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 9vw, 64px)',
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              textTransform: 'uppercase',
              textDecoration: 'none',
              opacity: hovered === 'shop' ? 0.7 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            SHOP
          </Link>

          {/* ABOUT */}
          <Link
            href="/about"
            onMouseEnter={() => setHovered('about')}
            onMouseLeave={() => setHovered(null)}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 9vw, 64px)',
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              textTransform: 'uppercase',
              textDecoration: 'none',
              opacity: hovered === 'about' ? 0.7 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            ABOUT
          </Link>
        </div>

        {/* Footer bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.38)',
            fontFamily: 'var(--font-body)',
          }}>
            P96 IS THE PLACE
          </span>
          <a href="mailto:team@pninetysix.com" style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.38)',
            fontFamily: 'var(--font-body)',
            textDecoration: 'none',
          }}>
            Inquiries · Collabs · Sponsorships · Partnerships
          </a>
        </div>
      </div>
    </div>
  )
}
