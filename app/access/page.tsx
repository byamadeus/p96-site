// Access gate — studio storefront photo bg, "Get Access" routes into the calendar.
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import './access.css'

export default function AccessGate() {
  const router = useRouter()

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
        @keyframes ctaPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(14,14,14,0.25); }
          50%       { box-shadow: 0 0 0 8px rgba(14,14,14,0); }
        }
      `}</style>

      <main style={{
        minHeight: '100dvh',
        backgroundImage: 'url(/studio-storefront.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Dark scrim */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.3)',
        }} />

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
              style={{ maxWidth: 130, width: '100%', height: 'auto', filter: 'invert(1)' }}
            />
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#FFFFFF', opacity: 0.45,
              display: 'block', textAlign: 'left', width: '100%',
              marginTop: 4, padding: '0 4px',
            }}>Presents</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', pointerEvents: 'auto' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px, 3.2vw, 48px)',
              fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.04em',
              color: '#FFFFFF', textTransform: 'uppercase', marginBottom: 20,
            }}>
              Culture<br />Community<br />Every<br />Day
            </h1>
            <p style={{ backgroundColor: '#000000', padding: '2px 4px',
              fontFamily: 'var(--font-body)', fontSize: 11,
              letterSpacing: '0.09em', textTransform: 'uppercase', fontWeight: 700,
              color: '#ffffffd3', opacity: 1, marginBottom: 6,
            }}>NYC • New York City</p>

            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.13em', textTransform: 'uppercase',
              color: '#FFFFFF', opacity: 0.55, marginBottom: 24,
            }}>Music · Art · Wellness · Food · Film</p>

            <button onClick={() => router.push('/calendar')} className="get-access-btn" style={{
              background: '#0E0E0E', color: '#FFFFFF', border: 'none', borderRadius: 4,
              padding: '16px 48px', fontSize: 13, fontWeight: 800,
              fontFamily: 'var(--font-display)', letterSpacing: '0.1em',
              textTransform: 'uppercase', cursor: 'pointer', marginBottom: 16,
              animation: 'ctaPulse 3s ease-in-out 2s infinite',
            }}>Get Access</button>
          </div>
        </div>
      </main>

    </>
  )
}
