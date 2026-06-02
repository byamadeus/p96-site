// 404 page — matches landing page style.
// Wheel animation centered, "404" in display font where logo would be.
'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import './world-cup/world-cup.css'

const WHEEL_REF = 400
const COG_DUR = 6
const COG_STAGGER = COG_DUR / 10

type SlicePos = { top: number; left: number; w: number; h: number; rotate: number; z: number }
type TrophyPos = { top: number; left: number; w: number; h: number }

const SLICES: SlicePos[] = [
  { top:  559, left:  222, w: 400, h: 400, rotate: 0, z:  1 },
  { top: -126, left:  310, w: 400, h: 400, rotate: 0, z:  2 },
  { top: -310, left:   40, w: 400, h: 400, rotate: 0, z:  3 },
  { top:  257, left:  424, w: 400, h: 400, rotate: 0, z:  4 },
  { top:  464, left:  352, w: 400, h: 400, rotate: 0, z:  5 },
  { top: -272, left: -224, w: 400, h: 400, rotate: 0, z:  6 },
  { top:  508, left:  -65, w: 400, h: 400, rotate: 0, z:  7 },
  { top: -185, left: -390, w: 400, h: 400, rotate: 0, z:  8 },
  { top:    7, left: -433, w: 400, h: 400, rotate: 0, z:  9 },
  { top:  366, left: -317, w: 400, h: 400, rotate: 0, z: 10 },
]

const TROPHY: TrophyPos = { top: -97, left: -139, w: 680, h: 680 }

const pct = (n: number) => `${(n / WHEEL_REF) * 100}%`

export default function NotFound() {
  useEffect(() => {
    document.documentElement.style.backgroundColor = '#7BBAD6'
    document.body.style.backgroundColor = 'transparent'
    return () => {
      document.documentElement.style.backgroundColor = ''
      document.body.style.backgroundColor = ''
    }
  }, [])

  return (
    <>
      <style>{`
        @keyframes cogPop {
          0%   { transform: translate(0, 0); }
          5%   { transform: translate(calc(var(--dx) * 14px), calc(var(--dy) * 14px)); }
          15%  { transform: translate(0, 0); }
          100% { transform: translate(0, 0); }
        }
      `}</style>

      <main style={{
        minHeight: '100dvh',
        background: 'radial-gradient(ellipse at 70% 50%, #FFFFFF 0%, #C5E8F5 42%, #7BBAD6 100%)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>

        {/* Wheel — centered behind content */}
        <div className="wheel-container" style={{ position: 'absolute', inset: 0, margin: 'auto' }}>
          {SLICES.map((s, i) => {
            const mag = Math.sqrt(s.left * s.left + s.top * s.top) || 1
            return (
              <div key={i} style={{
                position: 'absolute',
                top: pct(s.top), left: pct(s.left),
                width: pct(s.w), height: pct(s.h),
                zIndex: s.z,
                '--dx': s.left / mag,
                '--dy': s.top  / mag,
                animation: `cogPop ${COG_DUR}s ease-in-out ${i * COG_STAGGER}s infinite`,
              } as React.CSSProperties}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/landing/slice${i + 1}.png`} alt="" draggable={false}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', userSelect: 'none', pointerEvents: 'none' }}
                />
              </div>
            )
          })}

          <div style={{
            position: 'absolute',
            top: pct(TROPHY.top), left: pct(TROPHY.left),
            width: pct(TROPHY.w), height: pct(TROPHY.h),
            zIndex: 20,
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/landing/TROPHY.svg" alt="" draggable={false}
              style={{ width: '100%', height: '100%', objectFit: 'contain', userSelect: 'none', pointerEvents: 'none' }}
            />
          </div>
        </div>

        {/* Centered content */}
        <div style={{
          position: 'relative', zIndex: 30,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          textAlign: 'center',
          pointerEvents: 'none',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(96px, 20vw, 200px)',
            fontWeight: 900,
            lineHeight: 0.85,
            letterSpacing: '-0.04em',
            color: '#0E0E0E',
            display: 'block',
            marginBottom: 16,
          }}>
            404
          </span>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11, fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.45)',
            marginBottom: 32,
          }}>
            Page not found
          </p>

          <Link
            href="/"
            style={{
              pointerEvents: 'auto',
              background: '#0E0E0E',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 4,
              padding: '14px 40px',
              fontSize: 12,
              fontWeight: 800,
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Go Home
          </Link>
        </div>
      </main>
    </>
  )
}
