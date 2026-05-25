// TEMPORARY — World Cup landing page, serving at / for the WC2026 campaign.
// Legacy homepage lives at /homepage. Swap back when campaign ends.
'use client'

import { useState, useEffect } from 'react'
import LeadCaptureModal from '@/components/Calendar/LeadCaptureModal'
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

// ← SCALE: change w and h here (both same value = square).
const TROPHY: TrophyPos = { top: -97, left: -139, w: 680, h: 680 }

const pct = (n: number) => `${(n / WHEEL_REF) * 100}%`

export default function WorldCupLanding() {
  const [showModal, setShowModal] = useState(false)

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
        @keyframes ctaPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(14,14,14,0.25); }
          50%       { box-shadow: 0 0 0 8px rgba(14,14,14,0); }
        }
      `}</style>

      <main style={{
        minHeight: '100dvh',
        background: 'radial-gradient(ellipse at 70% 50%, #FFFFFF 0%, #C5E8F5 42%, #7BBAD6 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>

        <div className="wheel-container">
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
            <img src="/landing/TROPHY.svg" alt="World Cup Trophy" draggable={false}
              style={{ width: '100%', height: '100%', objectFit: 'contain', userSelect: 'none', pointerEvents: 'none' }}
            />
          </div>
        </div>

        <div className="landing-content" style={{
          position: 'relative', zIndex: 1,
          margin: '0 auto',
          minHeight: '100dvh', boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          pointerEvents: 'none',
        }}>
          {/* Logo block — top left */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', pointerEvents: 'auto', width: 'fit-content' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/landing/image-1779745706618.webp" alt="Project96" draggable={false}
              style={{ maxWidth: 130, width: '100%', height: 'auto' }}
            />
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#0E0E0E', opacity: 0.45,
              display: 'block', textAlign: 'left', width: '100%',
              marginTop: 4, padding: '0 4px',
            }}>Presents</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', pointerEvents: 'auto' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px, 3.2vw, 48px)',
              fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.04em',
              color: '#0E0E0E', textTransform: 'uppercase', marginBottom: 20,
            }}>
              Diaspora<br />World Cup<br />Activation<br />Series
            </h1>
            <p style={{ backgroundColor: '#000000', padding: '2px 4px',
              fontFamily: 'var(--font-body)', fontSize: 11,
              letterSpacing: '0.09em', textTransform: 'uppercase', fontWeight: 700,
              color: '#ffffffd3', opacity: 1, marginBottom: 6,
            }}>NYC • New York City</p>

            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.13em', textTransform: 'uppercase',
              color: '#0E0E0E', opacity: 0.55, marginBottom: 6,
            }}>Watch Parties · Play Days · Community Programming</p>

            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 11,
              letterSpacing: '0.09em', textTransform: 'uppercase',
              color: '#0E0E0E', opacity: 0.55, marginBottom: 24,
            }}>June – July 2026</p>

            <button onClick={() => setShowModal(true)} className="get-access-btn" style={{
              background: '#0E0E0E', color: '#FFFFFF', border: 'none', borderRadius: 4,
              padding: '16px 48px', fontSize: 13, fontWeight: 800,
              fontFamily: 'var(--font-display)', letterSpacing: '0.1em',
              textTransform: 'uppercase', cursor: 'pointer', marginBottom: 16,
              animation: 'ctaPulse 3s ease-in-out 2s infinite',
            }}>Get Access</button>
          </div>
        </div>
      </main>

      {showModal && <LeadCaptureModal onClose={() => setShowModal(false)} />}
    </>
  )
}
