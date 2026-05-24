'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import P96Logo from '@/components/Layout/P96Logo'

interface LeadCaptureModalProps {
  onClose: () => void
}

export default function LeadCaptureModal({ onClose }: LeadCaptureModalProps) {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function submit() {
    if (!email) return
    setLoading(true)
    await supabase.from('intake').insert({
      email,
      phone: phone || null,
      country: null,
      borough: null,
    })
    setLoading(false)
    setDone(true)
    setTimeout(onClose, 2000)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    background: 'var(--c-surface2)',
    border: '1px solid var(--c-border-emphasis)',
    borderRadius: 8,
    color: 'var(--c-text)',
    fontSize: 14,
    fontFamily: 'var(--font-body)',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.72)',
          zIndex: 200,
        }}
      />

      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(440px, calc(100vw - 32px))',
          background: 'var(--c-surface)',
          borderRadius: 16,
          border: '1px solid var(--c-border-emphasis)',
          padding: '28px 28px 32px',
          zIndex: 201,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 24,
          }}
        >
          <P96Logo height={22} />
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--c-text-muted)',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {done ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div
              style={{
                fontSize: 32,
                marginBottom: 12,
                color: 'var(--c-green)',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
              }}
            >
              ✓
            </div>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 20,
                fontWeight: 800,
                color: 'var(--c-text)',
                letterSpacing: '-0.02em',
              }}
            >
              You&apos;re on the list.
            </p>
          </div>
        ) : (
          <>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: 'var(--c-text)',
                marginBottom: 8,
              }}
            >
              Get early access.
            </h2>
            <p
              style={{
                fontSize: 14,
                color: 'var(--c-text-muted)',
                lineHeight: 1.55,
                marginBottom: 28,
                fontFamily: 'var(--font-body)',
              }}
            >
              Get access to events the second they drop. No spam, ever.
            </p>

            <label style={{ display: 'block', marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: 'var(--c-text-muted)',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-body)',
                  marginBottom: 6,
                }}
              >
                Email Address
              </div>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()}
                placeholder="you@email.com"
                style={inputStyle}
                autoFocus
              />
            </label>

            <label style={{ display: 'block', marginBottom: 24 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  color: 'var(--c-text-muted)',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-body)',
                  marginBottom: 6,
                }}
              >
                Phone{' '}
                <span
                  style={{
                    fontWeight: 400,
                    textTransform: 'none',
                    letterSpacing: 0,
                    opacity: 0.55,
                  }}
                >
                  (optional)
                </span>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                style={inputStyle}
              />
            </label>

            <button
              onClick={submit}
              disabled={!email || loading}
              style={{
                width: '100%',
                padding: '14px',
                background: email ? 'var(--c-text)' : 'rgba(255,255,255,0.08)',
                color: email ? 'var(--c-bg)' : 'var(--c-text-subtle)',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 800,
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.01em',
                cursor: email ? 'pointer' : 'default',
                transition: 'background 0.15s, color 0.15s',
                marginBottom: 10,
              }}
            >
              {loading ? 'Saving...' : 'NOTIFY ME →'}
            </button>

            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '10px',
                background: 'none',
                border: 'none',
                color: 'var(--c-text-subtle)',
                fontSize: 13,
                fontFamily: 'var(--font-body)',
                cursor: 'pointer',
              }}
            >
              Not now
            </button>
          </>
        )}
      </div>
    </>
  )
}
