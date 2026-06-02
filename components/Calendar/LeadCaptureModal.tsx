'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import P96Logo from '@/components/Layout/P96Logo'

interface LeadCaptureModalProps {
  onClose: () => void
}

const NATIONS = [
  { code: 'MA', flag: '🇲🇦', name: 'Morocco' },
  { code: 'SN', flag: '🇸🇳', name: 'Senegal' },
  { code: 'GH', flag: '🇬🇭', name: 'Ghana' },
  { code: 'EG', flag: '🇪🇬', name: 'Egypt' },
  { code: 'DZ', flag: '🇩🇿', name: 'Algeria' },
  { code: 'CI', flag: '🇨🇮', name: 'Ivory Coast' },
  { code: 'TN', flag: '🇹🇳', name: 'Tunisia' },
  { code: 'ZA', flag: '🇿🇦', name: 'South Africa' },
  { code: 'CD', flag: '🇨🇩', name: 'DR Congo' },
  { code: 'CV', flag: '🇨🇻', name: 'Cape Verde' },
  { code: 'HT', flag: '🇭🇹', name: 'Haiti' },
  { code: 'CW', flag: '🇨🇼', name: 'Curaçao' },
]

export default function LeadCaptureModal({ onClose }: LeadCaptureModalProps) {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [country, setCountry] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [countryOpen, setCountryOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.innerWidth <= 480)
    document.body.style.overflow = 'hidden'
    let inner: number
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setVisible(true))
    })
    return () => {
      document.body.style.overflow = ''
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [])

  async function submit() {
    if (!email) return
    setLoading(true)
    await supabase.from('intake').insert({
      email,
      phone: phone || null,
      country: country || null,
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
    fontSize: 16,
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
          opacity: visible ? 1 : 0,
          transition: 'opacity var(--duration-base) var(--ease-out)',
        }}
      />

      <div
        className="modal-panel"
        style={{
          background: 'var(--c-surface)',
          border: '1px solid var(--c-border-emphasis)',
          padding: '28px 28px 32px',
          zIndex: 201,
          opacity: visible ? 1 : 0,
          // Desktop: slide up from slightly below center. Mobile: CSS handles position (no transform).
          transform: isMobile
            ? (visible ? 'translateY(0)' : 'translateY(24px)')
            : (visible ? 'translate(-50%, -50%)' : 'translate(-50%, calc(-50% + 20px))'),
          transition: 'opacity var(--duration-base) var(--ease-out), transform var(--duration-base) var(--ease-out)',
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
              Get access to events, match days, play days the second they drop.
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
                // autoFocus
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
                <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, opacity: 0.55 }}>
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

            {/* Who you repping — hidden for launch, re-enable when ready */}
            {false && <div style={{ marginBottom: 24 }}>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '0.1em',
                color: 'var(--c-text-muted)', textTransform: 'uppercase',
                fontFamily: 'var(--font-body)', marginBottom: 6,
              }}>
                Who you repping?{' '}
                <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, opacity: 0.55 }}>(optional)</span>
              </div>

              {/* Trigger */}
              <button
                onClick={() => setCountryOpen(o => !o)}
                style={{
                  ...inputStyle,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                }}
              >
                <span>
                  {country
                    ? `${NATIONS.find(n => n.code === country)?.flag} ${NATIONS.find(n => n.code === country)?.name}`
                    : 'Select your country'}
                </span>
                <span style={{ opacity: 0.4, fontSize: 12 }}>{countryOpen ? '▲' : '▼'}</span>
              </button>

              {/* Expanded list */}
              {countryOpen && (
                <div style={{
                  border: '1px solid var(--c-border-emphasis)',
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                  maxHeight: 220,
                  overflowY: 'auto',
                  background: 'var(--c-surface2)',
                }}>
                  {NATIONS.map(({ code, flag, name }) => {
                    const selected = country === code
                    return (
                      <button
                        key={code}
                        onClick={() => setCountry(selected ? null : code)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '11px 14px',
                          background: selected ? 'var(--c-text)' : 'transparent',
                          color: selected ? 'var(--c-bg)' : 'var(--c-text)',
                          border: 'none',
                          borderBottom: '1px solid var(--c-border)',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-body)',
                          fontSize: 15,
                          textAlign: 'left',
                        }}
                      >
                        <span style={{ fontSize: 20 }}>{flag}</span>
                        <span>{name}</span>
                        {selected && <span style={{ marginLeft: 'auto', fontSize: 12 }}>✓</span>}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>}

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
                fontSize: 16,
                fontWeight: 800,
                fontFamily: 'var(--font-display)',
                letterSpacing: '-0.01em',
                cursor: email ? 'pointer' : 'default',
                transition: 'background 0.15s, color 0.15s',
                marginBottom: 10,
              }}
            >
              {loading ? 'Saving...' : 'SIGN ME UP →'}
            </button>

          </>
        )}
      </div>
    </>
  )
}
