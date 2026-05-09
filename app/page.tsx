import Link from 'next/link'
import PageWrapper from '@/components/Layout/PageWrapper'
import Navbar from '@/components/Layout/Navbar'

export default function Home() {
  return (
    <PageWrapper>
      <Navbar />

      {/* Hero image placeholder */}
      <div
        style={{
          width: '100%',
          aspectRatio: '4/5',
          background: 'linear-gradient(160deg, #1a1a1a 0%, #0e0e0e 100%)',
          borderRadius: 'var(--radius-card)',
          marginTop: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
          display: 'flex',
          alignItems: 'flex-end',
          padding: 'var(--space-6)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Placeholder glow */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at 30% 70%, rgba(245,200,66,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(26,127,60,0.08) 0%, transparent 55%)',
        }} />

        {/* Placeholder text */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--c-gold)', marginBottom: 'var(--space-2)' }}>
            Hero image
          </p>
          <p style={{ fontSize: 13, color: 'var(--c-text-muted)' }}>Replace with P96 event photo</p>
        </div>
      </div>

      {/* WC 2026 widget */}
      <Link
        href="/calendar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--c-surface)',
          border: '1.5px solid rgba(245,200,66,0.35)',
          borderRadius: 'var(--radius-card)',
          padding: 'var(--space-4) var(--space-6)',
          marginBottom: 'var(--space-4)',
          textDecoration: 'none',
        }}
      >
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--c-gold)', marginBottom: 4 }}>
            ⚽ FIFA World Cup 2026
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--c-text)', letterSpacing: '-0.01em' }}>
            Find your game day
          </div>
          <div style={{ fontSize: 13, color: 'var(--c-text-muted)', marginTop: 2 }}>
            Diaspora nations · NYC watch parties
          </div>
        </div>
        <div style={{ fontSize: 22, flexShrink: 0, marginLeft: 'var(--space-4)' }}>→</div>
      </Link>

      {/* Tagline */}
      <div style={{ paddingTop: 'var(--space-4)', paddingBottom: 'var(--space-12)' }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.03em', marginBottom: 'var(--space-4)' }}>
          Your game.<br />Your people.<br />Your summer.
        </h1>
        <p style={{ fontSize: 15, color: 'var(--c-text-muted)', lineHeight: 1.6 }}>
          P96 Culture House — community events for the Black diaspora in NYC.
        </p>
      </div>
    </PageWrapper>
  )
}
