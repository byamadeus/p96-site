'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import AdminLogin from '@/components/Admin/AdminLogin'
import AdminDashboard from '@/components/Admin/AdminDashboard'

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthed(!!session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setAuthed(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (authed === null) {
    return <div style={{ minHeight: '100dvh', background: '#0e0e0e' }} />
  }

  return authed ? <AdminDashboard /> : <AdminLogin />
}
