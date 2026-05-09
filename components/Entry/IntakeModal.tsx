'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { NATIONS, BOROUGHS } from '@/lib/nations'
import { useAppStore, saveIntakeCookie, type IntakeData } from '@/lib/store'
import P96Logo from '@/components/Layout/P96Logo'

interface IntakeModalProps {
  onDone: () => void
  onSkip?: () => void
}

const darkBtn: React.CSSProperties = {
  width: '100%',
  padding: '16px',
  background: '#111111',
  color: '#ffffff',
  border: 'none',
  borderRadius: 4,
  fontSize: 15,
  fontWeight: 700,
  fontFamily: 'var(--font-body)',
  cursor: 'pointer',
  letterSpacing: '-0.01em',
}

const skipBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'rgba(0,0,0,0.45)',
  fontSize: 13,
  fontFamily: 'var(--font-body)',
  cursor: 'pointer',
  textAlign: 'center' as const,
  padding: '12px',
  width: '100%',
  letterSpacing: '0.01em',
}

export default function IntakeModal({ onDone, onSkip }: IntakeModalProps) {
  const setIntake = useAppStore(s => s.setIntake)
  const [step, setStep] = useState(1)
  const [nations, setNations] = useState<string[]>([])
  const [borough, setBorough] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTimeout(() => setMounted(true), 60)
  }, [])

  async function finish(skip = false) {
    setLoading(true)
    const data: IntakeData = {
      nations,
      borough,
      email: email || null,
      phone: phone || null,
    }
    saveIntakeCookie(data)
    setIntake(data)

    if (!skip && email) {
      supabase.from('intake').insert({
        email,
        phone: phone || null,
        country: nations[0] ?? null,
        borough,
      })
    }

    onDone()
  }

  function handleSkip() {
    const data: IntakeData = { nations, borough, email: null, phone: null }
    saveIntakeCookie(data)
    setIntake(data)
    if (onSkip) onSkip()
    else onDone()
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--c-intake-bg)',
        zIndex: 200,
        overflowY: 'auto',
        transform: mounted ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.42s cubic-bezier(0.32, 0.72, 0, 1)',
      }}
    >
      <div
        style={{
          maxWidth: 520,
          margin: '0 auto',
          width: '100%',
          padding: '28px 24px 48px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100dvh',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 40,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 20,
                fontWeight: 800,
                color: 'var(--c-intake-text)',
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
              }}
            >
              CLUB
            </span>
            <P96Logo color="#111111" height={18} />
          </div>

          <button
            onClick={handleSkip}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--c-intake-text)',
              letterSpacing: '0.02em',
              padding: '4px 2px',
            }}
            aria-label="Close"
          >
            [x]
          </button>
        </div>

        {step === 1 && (
          <NationStep selected={nations} setSelected={setNations} onNext={() => setStep(2)} />
        )}
        {step === 2 && (
          <BoroughStep selected={borough} setSelected={setBorough} onNext={() => setStep(3)} />
        )}
        {step === 3 && (
          <EmailStep
            email={email}
            setEmail={setEmail}
            phone={phone}
            setPhone={setPhone}
            loading={loading}
            onFinish={finish}
            onSkip={handleSkip}
          />
        )}
      </div>
    </div>
  )
}

function NationStep({
  selected,
  setSelected,
  onNext,
}: {
  selected: string[]
  setSelected: (v: string[]) => void
  onNext: () => void
}) {
  function toggle(code: string) {
    setSelected(
      selected.includes(code)
        ? selected.filter(c => c !== code)
        : [...selected, code]
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(30px, 7vw, 40px)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          color: 'var(--c-intake-text)',
          marginBottom: 10,
        }}
      >
        Who you repping<br />this year?
      </h2>
      <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.55)', marginBottom: 28, lineHeight: 1.5 }}>
        12 diaspora nations made it to the World Cup 2026. Who will you be rooting for?
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10,
          marginBottom: 28,
        }}
      >
        {NATIONS.map(n => {
          const on = selected.includes(n.code)
          return (
            <button
              key={n.code}
              onClick={() => toggle(n.code)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                padding: '12px 8px',
                background: on ? '#111111' : 'rgba(0,0,0,0.08)',
                border: `2px solid ${on ? '#111111' : 'transparent'}`,
                borderRadius: 8,
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                transition: 'background 0.15s, border-color 0.15s',
              }}
            >
              <span style={{ fontSize: 26, lineHeight: 1 }}>{n.flag}</span>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: on ? '#ffffff' : '#111111',
                  textTransform: 'uppercase',
                }}
              >
                {n.short}
              </span>
            </button>
          )
        })}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <button onClick={onNext} style={darkBtn}>
          {selected.length > 0 ? `Next → (${selected.length} selected)` : 'Next →'}
        </button>
        <button onClick={onNext} style={skipBtn}>Skip</button>
      </div>
    </div>
  )
}

function BoroughStep({
  selected,
  setSelected,
  onNext,
}: {
  selected: string | null
  setSelected: (v: string | null) => void
  onNext: () => void
}) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(30px, 7vw, 40px)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          color: 'var(--c-intake-text)',
          marginBottom: 10,
        }}
      >
        What Borough<br />are you in?
      </h2>
      <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.55)', marginBottom: 28 }}>
        We&apos;ll let you know about events happening nearby!
      </p>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 28,
          flex: 1,
          alignContent: 'flex-start',
        }}
      >
        {BOROUGHS.map(b => {
          const on = selected === b
          return (
            <button
              key={b}
              onClick={() => setSelected(on ? null : b)}
              style={{
                padding: '10px 16px',
                background: on ? '#111111' : 'rgba(0,0,0,0.08)',
                border: `2px solid ${on ? '#111111' : 'transparent'}`,
                borderRadius: 'var(--radius-pill)',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 600,
                color: on ? '#ffffff' : '#111111',
                transition: 'background 0.15s, border-color 0.15s, color 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              {b}
            </button>
          )
        })}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <button onClick={onNext} style={darkBtn}>Next →</button>
        <button onClick={onNext} style={skipBtn}>Skip</button>
      </div>
    </div>
  )
}

function EmailStep({
  email,
  setEmail,
  phone,
  setPhone,
  loading,
  onFinish,
  onSkip,
}: {
  email: string
  setEmail: (v: string) => void
  phone: string
  setPhone: (v: string) => void
  loading: boolean
  onFinish: (skip?: boolean) => void
  onSkip: () => void
}) {
  const fieldStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(0,0,0,0.08)',
    border: '2px solid transparent',
    borderRadius: 6,
    padding: '14px 16px',
    fontSize: 15,
    color: '#111111',
    outline: 'none',
    fontFamily: 'var(--font-body)',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'rgba(0,0,0,0.55)',
    marginBottom: 6,
    display: 'block',
    fontFamily: 'var(--font-body)',
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(30px, 7vw, 40px)',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          color: 'var(--c-intake-text)',
          marginBottom: 10,
        }}
      >
        What&apos;s your<br />email?
      </h2>
      <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.55)', marginBottom: 32, lineHeight: 1.5 }}>
        Get access to events the second they are announced. No spam, ever.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
        <div>
          <label style={labelStyle}>Email Address</label>
          <input
            type="email"
            placeholder="email@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && email) onFinish() }}
            autoFocus
            style={fieldStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Phone Number <span style={{ opacity: 0.5, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
          <input
            type="tel"
            placeholder="+1 (000) 000-0000"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            style={fieldStyle}
          />
        </div>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <button
          onClick={() => onFinish()}
          disabled={loading || !email}
          style={{
            ...darkBtn,
            background: !email ? 'rgba(0,0,0,0.25)' : '#111111',
            color: !email ? 'rgba(0,0,0,0.4)' : '#ffffff',
            cursor: !email ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'One sec…' : "I'm in →"}
        </button>
        <button onClick={onSkip} style={skipBtn}>Skip for now</button>
      </div>
    </div>
  )
}
