'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, X } from 'lucide-react'
import { supabase, Event } from '@/lib/supabase'
import EventForm from '@/components/Admin/EventForm'

const TYPE_COLOR: Record<string, string> = {
  watch_party:    '#FFDA44',
  talks:          '#1B4FD8',
  workshop:       '#F97B22',
  hangout:        '#1A7F3C',
  collaboration:  '#E8412C',
  film_screening: 'rgba(255,255,255,0.35)',
}

const TYPE_LABEL: Record<string, string> = {
  watch_party:    'Watch Party',
  talks:          'Talks',
  workshop:       'Workshop',
  hangout:        'Hangout',
  collaboration:  'Collab',
  film_screening: 'Film',
}

function fmtDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [view, setView] = useState<'list' | 'new' | 'edit'>('list')
  const [editing, setEditing] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
    setEvents((data ?? []) as Event[])
    setLoading(false)
  }, [])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  async function togglePublish(event: Event) {
    await supabase.from('events').update({ is_published: !event.is_published }).eq('id', event.id)
    fetchEvents()
  }

  async function deleteEvent(event: Event) {
    if (!confirm(`Delete "${event.title}"?`)) return
    await supabase.from('events').delete().eq('id', event.id)
    fetchEvents()
  }

  async function logout() {
    await supabase.auth.signOut()
  }

  function openEdit(ev: Event) {
    setEditing(ev)
    setView('edit')
  }

  function afterSave() {
    fetchEvents()
    setView('list')
    setEditing(null)
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#0e0e0e', color: '#fff', fontFamily: 'inherit' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 16px 48px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700 }}>P96 Admin</h1>
          <button
            onClick={logout}
            style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 99, color: 'rgba(255,255,255,0.45)', fontSize: 12, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            Sign out
          </button>
        </div>

        {/* New event form */}
        {view === 'new' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <button onClick={() => setView('list')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)', cursor: 'pointer', padding: 0, lineHeight: 1, display: 'flex', alignItems: 'center' }}><ArrowLeft size={18} strokeWidth={2} /></button>
              <h2 style={{ fontSize: 15, fontWeight: 700 }}>New event</h2>
            </div>
            <EventForm onSaved={afterSave} onCancel={() => setView('list')} />
          </div>
        )}

        {/* Edit form */}
        {view === 'edit' && editing && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <button onClick={() => { setView('list'); setEditing(null) }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)', cursor: 'pointer', padding: 0, lineHeight: 1, display: 'flex', alignItems: 'center' }}><ArrowLeft size={18} strokeWidth={2} /></button>
              <h2 style={{ fontSize: 15, fontWeight: 700 }}>Edit event</h2>
            </div>
            <EventForm existing={editing} onSaved={afterSave} onCancel={() => { setView('list'); setEditing(null) }} />
          </div>
        )}

        {/* List view */}
        {view === 'list' && (
          <>
            <button
              onClick={() => setView('new')}
              style={{ width: '100%', padding: '13px', background: '#F5C842', color: '#000', border: 'none', borderRadius: 99, fontSize: 14, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', marginBottom: 24 }}
            >
              + New event
            </button>

            {loading ? (
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, textAlign: 'center', paddingTop: 32 }}>Loading…</p>
            ) : events.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, textAlign: 'center', paddingTop: 32 }}>No events yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {events.map(ev => (
                  <div
                    key={ev.id}
                    style={{
                      background: '#161616',
                      border: '1px solid rgba(255,255,255,0.07)',
                      borderRadius: 10,
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    {/* Color dot */}
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: TYPE_COLOR[ev.category], flexShrink: 0 }} />

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.title}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                        {fmtDate(ev.date)} · {TYPE_LABEL[ev.category]}
                      </div>
                    </div>

                    {/* Published toggle */}
                    <div
                      onClick={() => togglePublish(ev)}
                      style={{
                        width: 36,
                        height: 20,
                        borderRadius: 10,
                        background: ev.is_published ? '#1A7F3C' : '#333',
                        position: 'relative',
                        cursor: 'pointer',
                        flexShrink: 0,
                        transition: 'background 0.2s',
                      }}
                    >
                      <div style={{
                        position: 'absolute', top: 2, left: ev.is_published ? 18 : 2,
                        width: 16, height: 16, borderRadius: '50%', background: '#fff',
                        transition: 'left 0.2s',
                      }} />
                    </div>

                    {/* Edit */}
                    <button
                      onClick={() => openEdit(ev)}
                      style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: 'rgba(255,255,255,0.45)', fontSize: 12, padding: '5px 10px', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}
                    >
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteEvent(ev)}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', padding: '0 2px', lineHeight: 1, flexShrink: 0, display: 'flex', alignItems: 'center' }}
                    >
                      <X size={16} strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
