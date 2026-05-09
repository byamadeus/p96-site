'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const NATIONS = [
  { code: 'MA', flag: '🇲🇦', name: 'Morocco' },
  { code: 'SN', flag: '🇸🇳', name: 'Senegal' },
  { code: 'GH', flag: '🇬🇭', name: 'Ghana' },
  { code: 'DZ', flag: '🇩🇿', name: 'Algeria' },
  { code: 'EG', flag: '🇪🇬', name: 'Egypt' },
  { code: 'TN', flag: '🇹🇳', name: 'Tunisia' },
  { code: 'CI', flag: '🇨🇮', name: 'Ivory Coast' },
  { code: 'CD', flag: '🇨🇩', name: 'DR Congo' },
  { code: 'ZA', flag: '🇿🇦', name: 'South Africa' },
  { code: 'CV', flag: '🇨🇻', name: 'Cape Verde' },
  { code: 'HT', flag: '🇭🇹', name: 'Haiti' },
  { code: 'CW', flag: '🇨🇼', name: 'Curaçao' },
]

const BOROUGHS = ['Manhattan', 'Brooklyn', 'Queens', 'The Bronx', 'Staten Island', 'Outside NYC']

const primaryBtn: React.CSSProperties = {
  width: '100%',
  padding: '16px',
  background: 'var(--c-gold)',
  color: '#000',
  border: 'none',
  borderRadius: 'var(--radius-pill)',
  fontSize: 15,
  fontWeight: 700,
  fontFamily: 'inherit',
  cursor: 'pointer',
  letterSpacing: '-0.01em',
}

const skipBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--c-text-muted)',
  fontSize: 13,
  fontFamily: 'inherit',
  cursor: 'pointer',
  textAlign: 'center',
  padding: 'var(--space-3)',
  width: '100%',
}

interface IntakeModalProps {
  onDone?: (intake: { country: string; borough: string; email: string }) => void
}

export default function IntakeModal({ onDone }: IntakeModalProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [nation, setNation] = useState('')
  const [borough, setBorough] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTimeout(() => setMounted(true), 80)
  }, [])

  async function finish(skip = false) {
    setLoading(true)
    if (!skip && email) {
      supabase.from('intake').insert({ email, country: nation || null, borough: borough || null })
    }
    const intake = { email, country: nation, borough, ts: Date.now() }
    document.cookie = `p96_intake=${encodeURIComponent(JSON.stringify(intake))}; path=/; max-age=${60 * 60 * 24 * 180}`
    if (onDone) {
      onDone({ country: nation, borough, email })
    } else {
      router.push('/calendar')
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--c-bg)',
        zIndex: 100,
        overflowY: 'auto',
        transform: mounted ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.45s cubic-bezier(0.32, 0.72, 0, 1)',
      }}
    >
      <div
        style={{
          maxWidth: 'var(--max-width)',
          margin: '0 auto',
          width: '100%',
          padding: 'var(--space-8) var(--page-padding)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100dvh',
        }}
      >
        {/* Progress */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 'var(--space-8)' }}>
          {[1, 2, 3].map(n => (
            <div
              key={n}
              style={{
                height: 4,
                borderRadius: 2,
                width: n === step ? 28 : 8,
                background: n <= step ? 'var(--c-gold)' : 'var(--c-surface2)',
                transition: 'width 0.3s, background 0.3s',
              }}
            />
          ))}
        </div>

        {step === 1 && <NationStep nation={nation} setNation={setNation} onNext={() => setStep(2)} />}
        {step === 2 && <BoroughStep borough={borough} setBorough={setBorough} onNext={() => setStep(3)} />}
        {step === 3 && <EmailStep email={email} setEmail={setEmail} loading={loading} onFinish={finish} />}
      </div>
    </div>
  )
}

function NationStep({
  nation, setNation, onNext,
}: { nation: string; setNation: (v: string) => void; onNext: () => void }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: 38, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 'var(--space-8)' }}>
        WHO YOU<br />REPPIN?
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--space-3)',
          flex: 1,
          marginBottom: 'var(--space-6)',
        }}
      >
        {NATIONS.map(n => {
          const selected = nation === n.code
          return (
            <button
              key={n.code}
              onClick={() => setNation(selected ? '' : n.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: '12px var(--space-3)',
                background: selected ? 'rgba(245,200,66,0.1)' : 'var(--c-surface)',
                border: `1.5px solid ${selected ? 'var(--c-gold)' : 'var(--c-border)'}`,
                borderRadius: 'var(--radius-card)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                textAlign: 'left',
                transition: 'border-color 0.15s, background 0.15s',
              }}
            >
              <span style={{ fontSize: 22 }}>{n.flag}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: selected ? 'var(--c-gold)' : 'var(--c-text)', lineHeight: 1.2 }}>
                {n.name}
              </span>
            </button>
          )
        })}
      </div>

      <button onClick={onNext} style={primaryBtn}>
        {nation ? `${NATIONS.find(n => n.code === nation)?.flag} Next →` : 'Next →'}
      </button>
      <button onClick={onNext} style={skipBtn}>Skip</button>
    </div>
  )
}

function BoroughStep({
  borough, setBorough, onNext,
}: { borough: string; setBorough: (v: string) => void; onNext: () => void }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: 38, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 'var(--space-8)' }}>
        WHICH<br />BOROUGH?
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1, marginBottom: 'var(--space-6)' }}>
        {BOROUGHS.map(b => {
          const selected = borough === b
          return (
            <button
              key={b}
              onClick={() => setBorough(selected ? '' : b)}
              style={{
                padding: '15px var(--space-6)',
                background: selected ? 'rgba(245,200,66,0.1)' : 'var(--c-surface)',
                border: `1.5px solid ${selected ? 'var(--c-gold)' : 'var(--c-border)'}`,
                borderRadius: 'var(--radius-pill)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: 15,
                fontWeight: 600,
                color: selected ? 'var(--c-gold)' : 'var(--c-text)',
                textAlign: 'left',
                transition: 'border-color 0.15s, background 0.15s, color 0.15s',
              }}
            >
              {b}
            </button>
          )
        })}
      </div>

      <button onClick={onNext} style={primaryBtn}>Next →</button>
      <button onClick={onNext} style={skipBtn}>Skip</button>
    </div>
  )
}

function EmailStep({
  email, setEmail, loading, onFinish,
}: { email: string; setEmail: (v: string) => void; loading: boolean; onFinish: (skip?: boolean) => void }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: 38, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em', marginBottom: 'var(--space-3)' }}>
        STAY IN<br />THE LOOP
      </h2>
      <p style={{ fontSize: 15, color: 'var(--c-text-muted)', marginBottom: 'var(--space-8)', lineHeight: 1.5 }}>
        Game days, watch parties, community events — first to know.
      </p>

      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter' && email) onFinish() }}
        autoFocus
        style={{
          width: '100%',
          background: 'var(--c-surface)',
          border: '1.5px solid var(--c-border-emphasis)',
          borderRadius: 'var(--radius-sm)',
          padding: '16px var(--space-4)',
          fontSize: 16,
          color: 'var(--c-text)',
          outline: 'none',
          fontFamily: 'inherit',
          marginBottom: 'var(--space-3)',
        }}
      />

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', paddingTop: 'var(--space-6)' }}>
        <button
          onClick={() => onFinish()}
          disabled={loading || !email}
          style={{
            ...primaryBtn,
            background: !email ? 'var(--c-surface2)' : 'var(--c-gold)',
            color: !email ? 'var(--c-text-subtle)' : '#000',
            cursor: !email ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? "Let's go…" : "I'm in →"}
        </button>
        <button onClick={() => onFinish(true)} style={skipBtn}>Skip for now</button>
      </div>
    </div>
  )
}
