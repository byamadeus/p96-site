'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import P96Logo from '@/components/Layout/P96Logo'

const PLAYBACK_ID = 'sMAbbc8JVvn202la005w0102yrGGLRT2JSsX9dapewP7HPw'

export default function HomepageLayout() {
  const [hovered, setHovered] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    import('@mux/mux-video').then(() => {
      if (videoRef.current) {
        videoRef.current.muted = true
        videoRef.current.play().catch(() => {})
      }
    })
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0E0E0E',
      }}
    >
      {/* Video container — overflow hidden here so content layer labels aren't clipped */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        {/* @ts-expect-error mux-video web component */}
        <mux-video
          ref={videoRef}
          playback-id={PLAYBACK_ID}
          autoplay
          loop
          playsinline
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.72,
          }}
        />
      </div>

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

          {/* EVENTS — active, hover fades slightly */}
          <Link
            href="/calendar"
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

          {/* SHOP — coming soon */}
          <div
            onMouseEnter={() => setHovered('shop')}
            onMouseLeave={() => setHovered(null)}
            style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'default', userSelect: 'none' }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(40px, 9vw, 64px)',
                fontWeight: 800,
                lineHeight: 0.95,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                textTransform: 'uppercase',
                opacity: hovered === 'shop' ? 0.35 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              SHOP
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--c-gold)',
                fontFamily: 'var(--font-body)',
                whiteSpace: 'nowrap',
                opacity: hovered === 'shop' ? 1 : 0,
                transition: 'opacity 0.2s',
                pointerEvents: 'none',
              }}
            >
              COMING SOON
            </span>
          </div>

          {/* ABOUT — coming soon */}
          <div
            onMouseEnter={() => setHovered('about')}
            onMouseLeave={() => setHovered(null)}
            style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'default', userSelect: 'none' }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(40px, 9vw, 64px)',
                fontWeight: 800,
                lineHeight: 0.95,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                textTransform: 'uppercase',
                opacity: hovered === 'about' ? 0.35 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              ABOUT
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--c-gold)',
                fontFamily: 'var(--font-body)',
                whiteSpace: 'nowrap',
                opacity: hovered === 'about' ? 1 : 0,
                transition: 'opacity 0.2s',
                pointerEvents: 'none',
              }}
            >
              COMING SOON
            </span>
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
