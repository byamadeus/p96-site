'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const DIASPORA_NATIONS = [
  { code: 'ZA', flag: '🇿🇦', name: 'South Africa' },
  { code: 'MA', flag: '🇲🇦', name: 'Morocco' },
  { code: 'SN', flag: '🇸🇳', name: 'Senegal' },
  { code: 'DZ', flag: '🇩🇿', name: 'Algeria' },
  { code: 'CV', flag: '🇨🇻', name: 'Cape Verde' },
  { code: 'EG', flag: '🇪🇬', name: 'Egypt' },
  { code: 'TN', flag: '🇹🇳', name: 'Tunisia' },
  { code: 'CI', flag: '🇨🇮', name: 'Ivory Coast' },
  { code: 'GH', flag: '🇬🇭', name: 'Ghana' },
  { code: 'CD', flag: '🇨🇩', name: 'DR Congo' },
  { code: 'HT', flag: '🇭🇹', name: 'Haiti' },
  { code: 'CW', flag: '🇨🇼', name: 'Curaçao' },
]

const BOROUGHS = ['Manhattan', 'Brooklyn', 'Queens', 'The Bronx', 'Staten Island', 'Outside NYC']

export default function IntakeForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('')
  const [borough, setBorough] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setError('')

    try {
      // Save to Supabase (non-blocking — don't gate UX on it)
      supabase.from('intake').insert({ email, country: country || null, borough: borough || null })

      // Save to cookie
      const intake = { email, country, borough, ts: Date.now() }
      document.cookie = `p96_intake=${encodeURIComponent(JSON.stringify(intake))}; path=/; max-age=${60 * 60 * 24 * 180}`

      router.push('/calendar')
    } catch {
      setError('Something went wrong. Try again.')
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--c-surface)',
    border: '1px solid var(--c-border-emphasis)',
    borderRadius: 'var(--radius-sm)',
    padding: '14px var(--space-4)',
    fontSize: 16,
    color: 'var(--c-text)',
    outline: 'none',
    fontFamily: 'inherit',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--c-text-muted)',
    marginBottom: 'var(--space-2)',
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <label style={labelStyle} htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle} htmlFor="country">Who do you rep?</label>
        <select
          id="country"
          value={country}
          onChange={e => setCountry(e.target.value)}
          style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
        >
          <option value="">Pick your nation (optional)</option>
          {DIASPORA_NATIONS.map(n => (
            <option key={n.code} value={n.code}>
              {n.flag} {n.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelStyle} htmlFor="borough">Where are you?</label>
        <select
          id="borough"
          value={borough}
          onChange={e => setBorough(e.target.value)}
          style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
        >
          <option value="">Your borough (optional)</option>
          {BOROUGHS.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {error && (
        <p style={{ fontSize: 13, color: 'var(--c-red)' }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !email}
        style={{
          marginTop: 'var(--space-2)',
          width: '100%',
          padding: '16px',
          background: loading || !email ? 'var(--c-surface2)' : 'var(--c-gold)',
          color: loading || !email ? 'var(--c-text-muted)' : '#000',
          border: 'none',
          borderRadius: 'var(--radius-pill)',
          fontSize: 15,
          fontWeight: 700,
          fontFamily: 'inherit',
          cursor: loading || !email ? 'not-allowed' : 'pointer',
          transition: 'background 0.15s, color 0.15s',
        }}
      >
        {loading ? 'Let\'s go…' : 'Find my games →'}
      </button>

      <button
        type="button"
        onClick={() => router.push('/calendar')}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--c-text-muted)',
          fontSize: 13,
          fontFamily: 'inherit',
          cursor: 'pointer',
          textAlign: 'center',
          padding: 'var(--space-2)',
        }}
      >
        Skip for now
      </button>
    </form>
  )
}
