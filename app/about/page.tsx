'use client'

import { useState } from 'react'
import ShimmerBar from '@/components/Layout/ShimmerBar'
import Navbar from '@/components/Layout/Navbar'
import PageFooter from '@/components/Layout/PageFooter'
import LeadCaptureModal from '@/components/Calendar/LeadCaptureModal'

const PAGE_GRADIENT = 'radial-gradient(ellipse at 70% 50%, #FFFFFF 0%, #C5E8F5 42%, #7BBAD6 100%)'
const EMAIL = 'pninetysix@gmail.com'

export default function AboutPage() {
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [touchHover, setTouchHover] = useState(false)

  function copyEmail() {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  return (
    <div style={{ background: PAGE_GRADIENT }}>
      <ShimmerBar />
      <Navbar light />

      {/* ── HERO + CTAs — single block ─────────────────────────── */}
      <div style={{
        minHeight: 'calc(100dvh - 61px)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        maxWidth: 1100, margin: '0 auto', width: '100%',
        padding: '0 clamp(24px, 5vw, 80px) clamp(48px, 7vw, 80px)',
      }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)',
          marginBottom: 20,
        }}>
          Est. 2016 · New York City · 10th Year
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(52px, 10vw, 120px)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 0.92,
          color: '#0E0E0E',
          textTransform: 'uppercase',
          marginBottom: 'clamp(20px, 3vw, 36px)',
        }}>
          Built by<br />the culture.
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(15px, 1.8vw, 19px)',
          lineHeight: 1.65,
          color: 'rgba(0,0,0,0.55)',
          maxWidth: 520,
          marginBottom: 'clamp(28px, 4vw, 40px)',
        }}>
          Project 96 is a cultural platform rooted in the African Diaspora.
          We build community through experiences, media, fashion, and products.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Newsletter — filled */}
          <button
            onClick={() => setShowModal(true)}
            className="get-access-btn"
            style={{
              background: '#0E0E0E', color: '#FFFFFF',
              border: '1.5px solid #0E0E0E', borderRadius: 4,
              padding: '14px 36px', fontSize: 13, fontWeight: 800,
              fontFamily: 'var(--font-display)', letterSpacing: '0.1em',
              textTransform: 'uppercase', cursor: 'pointer',
            }}
          >
            Newsletter
          </button>

          {/* Get in Touch — outline, hover shows "Copy Email" */}
          <button
            onClick={copyEmail}
            onMouseEnter={() => setTouchHover(true)}
            onMouseLeave={() => setTouchHover(false)}
            style={{
              background: 'transparent', color: '#0E0E0E',
              border: '1.5px solid rgba(14,14,14,0.35)', borderRadius: 4,
              padding: '14px 36px', fontSize: 13, fontWeight: 800,
              fontFamily: 'var(--font-display)', letterSpacing: '0.1em',
              textTransform: 'uppercase', cursor: 'pointer',
              transition: 'border-color 0.15s',
            }}
          >
            {touchHover ? 'Copy Email' : 'Get in Touch'}
          </button>
        </div>
      </div>

      <PageFooter showContact />

      {/* Copied toast */}
      <div style={{
        position: 'fixed', bottom: 32, left: '50%',
        transform: copied ? 'translate(-50%, 0)' : 'translate(-50%, 12px)',
        opacity: copied ? 1 : 0,
        transition: 'opacity 0.2s, transform 0.2s',
        background: '#0E0E0E', color: '#fff',
        fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        padding: '10px 18px', borderRadius: 99,
        pointerEvents: 'none', zIndex: 999,
        whiteSpace: 'nowrap',
      }}>
        Copied email ✓
      </div>

      {showModal && <LeadCaptureModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
