'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

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

  const input: React.CSSProperties = {
    width: '100%',
    background: '#1a1a1a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 6,
    padding: '12px 14px',
    fontSize: 15,
    color: '#fff',
    fontFamily: 'inherit',
    outline: 'none',
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#0e0e0e', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <form onSubmit={login} style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>P96 Admin</h1>

        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={input} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={input} />

        {error && <p style={{ fontSize: 13, color: '#E8412C' }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{ padding: '12px', background: '#F5C842', color: '#000', border: 'none', borderRadius: 99, fontSize: 14, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
