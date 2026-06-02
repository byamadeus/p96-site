'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import P96Logo from '@/components/Layout/P96Logo'
import ShimmerBar from '@/components/Layout/ShimmerBar'

const PAGE_GRADIENT = 'radial-gradient(ellipse at 70% 50%, #FFFFFF 0%, #C5E8F5 42%, #7BBAD6 100%)'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#FAFAFA',
    border: '1px solid rgba(0,0,0,0.12)',
    borderRadius: 8,
    padding: '12px 14px',
    fontSize: 15,
    color: '#111',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: PAGE_GRADIENT, zIndex: -1 }} />
      <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <ShimmerBar />

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: 20,
            padding: '36px 32px 40px',
            width: '100%', maxWidth: 380,
            boxShadow: '0 8px 40px rgba(0,0,0,0.13)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28 }}>
              <P96Logo color="#0E0E0E" height={22} />
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 26, fontWeight: 800,
              letterSpacing: '-0.03em', color: '#0E0E0E',
              textAlign: 'center', marginBottom: 6, lineHeight: 1.1,
            }}>
              Admin
            </h1>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13, color: 'rgba(0,0,0,0.45)',
              textAlign: 'center', marginBottom: 28,
            }}>
              Sign in to manage events
            </p>

            <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', fontFamily: 'var(--font-body)', marginBottom: 5 }}>
                  Email
                </div>
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)', fontFamily: 'var(--font-body)', marginBottom: 5 }}>
                  Password
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={inputStyle}
                />
              </div>

              {error && (
                <p style={{ fontSize: 13, color: '#E8412C', fontFamily: 'var(--font-body)', margin: 0 }}>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: 8,
                  padding: '13px',
                  background: email && password ? '#0E0E0E' : 'rgba(0,0,0,0.08)',
                  color: email && password ? '#fff' : 'rgba(0,0,0,0.35)',
                  border: 'none', borderRadius: 8,
                  fontSize: 13, fontWeight: 800,
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                  cursor: loading || !email || !password ? 'default' : 'pointer',
                  transition: 'background 0.15s, color 0.15s',
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? 'Signing in…' : 'Sign in →'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
