'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash2, X } from 'lucide-react'
import { supabase, Event, getCategoryMeta } from '@/lib/supabase'
import CalendarGrid, { DateStrip } from '@/components/Calendar/CalendarGrid'
import EventForm from '@/components/Admin/EventForm'
import Navbar from '@/components/Layout/Navbar'
import P96Logo from '@/components/Layout/P96Logo'
import ShimmerBar from '@/components/Layout/ShimmerBar'
import PageFooter from '@/components/Layout/PageFooter'
import EventCard, { fmtTime } from '@/components/Calendar/EventCard'

const YEAR = 2026
const MIN_MONTH = 6
const MAX_MONTH = 7

function fmtDateLabel(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00')
    .toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    .toUpperCase()
}

function fmtDateShort(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00')
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

type AdminTab = 'calendar' | 'list'

export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<AdminTab>('calendar')
  const [month, setMonth] = useState(MIN_MONTH)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formDate, setFormDate] = useState<string | undefined>(undefined)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true })
    setEvents((data ?? []) as Event[])
    setLoading(false)
  }, [])

  useEffect(() => {
    document.documentElement.style.backgroundColor = '#FFFFFF'
    document.body.style.backgroundColor = '#FFFFFF'
    return () => {
      document.documentElement.style.backgroundColor = ''
      document.body.style.backgroundColor = ''
    }
  }, [])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  async function togglePublish(ev: Event) {
    await supabase.from('events').update({ is_published: !ev.is_published }).eq('id', ev.id)
    fetchEvents()
  }

  async function deleteEvent(ev: Event) {
    if (!confirm(`Delete "${ev.title}"?`)) return
    setDeleting(ev.id)
    await supabase.from('events').delete().eq('id', ev.id)
    await fetchEvents()
    setDeleting(null)
  }

  async function logout() {
    await supabase.auth.signOut()
  }

  function openCreate(date?: string) {
    setFormDate(date)
    setEditingEvent(null)
    setShowForm(true)
  }

  function openEdit(ev: Event) {
    setEditingEvent(ev)
    setFormDate(undefined)
    setShowForm(true)
  }

  function afterSave() {
    fetchEvents()
    setShowForm(false)
    setEditingEvent(null)
  }

  function closeForm() {
    setShowForm(false)
    setEditingEvent(null)
  }

  function handleDateSelect(date: string) {
    setSelectedDate(date)
    setViewMode(true)
  }

  const allEventDates = new Set(events.map(e => e.date))
  const eventsForDate = selectedDate ? events.filter(e => e.date === selectedDate) : []

  return (
    <>
      <div style={{ minHeight: '100dvh', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
        <ShimmerBar />

        <Navbar light />

        {/* Page header */}
        <div style={{
          padding: '20px 20px 0',
          background: 'linear-gradient(180deg, #FFFBEF 0%, #FFFFFF 100%)',
          flexShrink: 0,
        }}>
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
                <h1 style={{
                  fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800,
                  letterSpacing: '-0.03em', color: '#111', textTransform: 'uppercase', lineHeight: 1,
                }}>
                  Admin
                </h1>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 800,
                  letterSpacing: '0.12em', textTransform: 'uppercase', color: '#0E0E0E',
                  background: 'linear-gradient(90deg, var(--c-gold) 0%, #FF8C00 100%)',
                  padding: '3px 8px 4px', borderRadius: 4, marginBottom: 3,
                }}>
                  WC 2026
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', paddingBottom: 2 }}>
                <button
                  onClick={() => openCreate()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: '#111', color: '#fff', border: 'none', borderRadius: 8,
                    fontSize: 11, fontWeight: 800, fontFamily: 'var(--font-display)',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    padding: '8px 14px', cursor: 'pointer',
                  }}
                >
                  <Plus size={12} strokeWidth={2.5} />
                  NEW
                </button>
                <button
                  onClick={logout}
                  style={{
                    background: 'none', border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: 8, color: 'rgba(0,0,0,0.4)',
                    fontSize: 11, padding: '7px 12px',
                    cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600,
                  }}
                >
                  Sign out
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
              {(['calendar', 'list'] as AdminTab[]).map(t => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setViewMode(false) }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '9px 14px 10px',
                    fontSize: 10, fontWeight: 800, letterSpacing: '0.1em',
                    textTransform: 'uppercase', fontFamily: 'var(--font-body)',
                    color: tab === t ? '#111' : 'rgba(0,0,0,0.35)',
                    borderBottom: tab === t ? '2px solid #111' : '2px solid transparent',
                    marginBottom: -1,
                    transition: 'color 0.15s',
                  }}
                >
                  {t === 'calendar' ? 'Calendar' : 'All Events'}
                </button>
              ))}
              {/* Right: month nav + event count */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, paddingBottom: 4 }}>
                {!loading && (
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: 'rgba(0,0,0,0.3)', fontFamily: 'var(--font-body)' }}>
                    {events.filter(e => e.is_published).length} LIVE · {events.filter(e => !e.is_published).length} DRAFT
                  </span>
                )}
                {tab === 'calendar' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button
                      onClick={() => { setMonth(m => m - 1); setSelectedDate(null); setViewMode(false) }}
                      disabled={month === MIN_MONTH}
                      style={{
                        background: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 5,
                        padding: '4px 5px', cursor: month === MIN_MONTH ? 'default' : 'pointer',
                        color: month === MIN_MONTH ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.5)',
                        display: 'flex', alignItems: 'center',
                      }}
                    >
                      <ChevronLeft size={12} strokeWidth={2.5} />
                    </button>
                    <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#111', fontFamily: 'var(--font-body)', minWidth: 52, textAlign: 'center' }}>
                      {month === 6 ? 'JUN' : 'JUL'} 2026
                    </span>
                    <button
                      onClick={() => { setMonth(m => m + 1); setSelectedDate(null); setViewMode(false) }}
                      disabled={month === MAX_MONTH}
                      style={{
                        background: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 5,
                        padding: '4px 5px', cursor: month === MAX_MONTH ? 'default' : 'pointer',
                        color: month === MAX_MONTH ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.5)',
                        display: 'flex', alignItems: 'center',
                      }}
                    >
                      <ChevronRight size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── CALENDAR TAB ─────────────────────────────────────────── */}
        {tab === 'calendar' && (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{ maxWidth: 480, margin: '0 auto' }}>
              {loading ? (
                <div style={{ padding: '48px 20px', textAlign: 'center', color: 'rgba(0,0,0,0.3)', fontSize: 13, fontFamily: 'var(--font-body)' }}>
                  Loading…
                </div>
              ) : (
                <CalendarGrid
                  year={YEAR} month={month}
                  eventDates={allEventDates}
                  selectedDate={selectedDate}
                  onSelectDate={handleDateSelect}
                  light
                  adminMode
                />
              )}
            </div>
          </div>
        )}

        {/* ── LIST TAB ─────────────────────────────────────────────── */}
        {tab === 'list' && (
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px 20px 48px' }}>
              {loading ? (
                <p style={{ color: 'rgba(0,0,0,0.35)', fontSize: 13, textAlign: 'center', paddingTop: 40, fontFamily: 'var(--font-body)' }}>Loading…</p>
              ) : events.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 60 }}>
                  <p style={{ color: 'rgba(0,0,0,0.35)', fontSize: 13, fontFamily: 'var(--font-body)' }}>No events yet</p>
                  <button
                    onClick={() => openCreate()}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#111', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '0.04em', textTransform: 'uppercase', padding: '10px 18px', cursor: 'pointer' }}
                  >
                    <Plus size={13} strokeWidth={2.5} /> Create first event
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {events.map(ev => {
                    const meta = getCategoryMeta(ev.category)
                    return (
                      <div
                        key={ev.id}
                        style={{
                          background: '#FAFAFA',
                          border: '1px solid rgba(0,0,0,0.07)',
                          borderRadius: 10,
                          padding: '11px 14px',
                          display: 'flex', alignItems: 'center', gap: 10,
                        }}
                      >
                        {/* Category dot */}
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: meta.color, flexShrink: 0 }} />

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'var(--font-body)' }}>
                            {ev.title}
                          </div>
                          <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.38)', marginTop: 1, fontFamily: 'var(--font-body)' }}>
                            {fmtDateShort(ev.date)} · {meta.label}
                          </div>
                        </div>

                        {/* Status pill — click to toggle */}
                        <button
                          onClick={() => togglePublish(ev)}
                          style={{
                            padding: '3px 9px', borderRadius: 99, cursor: 'pointer',
                            fontSize: 10, fontWeight: 800, letterSpacing: '0.08em',
                            fontFamily: 'var(--font-body)', flexShrink: 0,
                            background: ev.is_published ? 'rgba(26,127,60,0.1)' : 'rgba(0,0,0,0.06)',
                            color: ev.is_published ? '#1A7F3C' : 'rgba(0,0,0,0.4)',
                            border: ev.is_published ? '1px solid rgba(26,127,60,0.2)' : '1px solid rgba(0,0,0,0.1)',
                            transition: 'all 0.15s',
                          }}
                        >
                          {ev.is_published ? 'LIVE' : 'DRAFT'}
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => openEdit(ev)}
                          style={{ background: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 6, color: 'rgba(0,0,0,0.45)', padding: '5px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-body)', flexShrink: 0 }}
                        >
                          Edit
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => deleteEvent(ev)}
                          disabled={deleting === ev.id}
                          style={{ background: 'none', border: 'none', color: 'rgba(0,0,0,0.2)', cursor: 'pointer', padding: '0 2px', display: 'flex', alignItems: 'center', flexShrink: 0, opacity: deleting === ev.id ? 0.4 : 1 }}
                        >
                          <Trash2 size={14} strokeWidth={2} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        <PageFooter label="P96 ADMIN" />
      </div>

      {/* ── DATE VIEW MODE — full-screen overlay ─────────────────── */}
      {viewMode && selectedDate && tab === 'calendar' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: '#FFFFFF',
          display: 'flex', flexDirection: 'column',
        }}>
          {/* Shimmer */}
          <div style={{
            height: 3, flexShrink: 0,
            background: 'linear-gradient(90deg, var(--c-gold) 0%, var(--c-red) 50%, var(--c-gold) 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s linear infinite',
          }} />

          {/* Top bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 24px', height: 56, flexShrink: 0,
            borderBottom: '1px solid rgba(0,0,0,0.08)',
          }}>
            <button
              onClick={() => setViewMode(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(0,0,0,0.5)', padding: 0,
                fontFamily: 'var(--font-display)', fontSize: 13,
                fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#111')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.5)')}
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
              {fmtDateLabel(selectedDate)}
            </button>

            <P96Logo height={20} color="#111111" />

            <button
              onClick={() => openCreate(selectedDate)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#111', color: '#fff', border: 'none', borderRadius: 8,
                fontSize: 11, fontWeight: 800, fontFamily: 'var(--font-display)',
                letterSpacing: '0.06em', textTransform: 'uppercase',
                padding: '8px 14px', cursor: 'pointer',
              }}
            >
              <Plus size={12} strokeWidth={2.5} />
              ADD EVENT
            </button>
          </div>

          {/* Body */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* Date strip sidebar */}
            <div style={{
              width: 64, flexShrink: 0,
              borderRight: '1px solid rgba(0,0,0,0.08)',
              overflowY: 'auto', overflowX: 'hidden',
            }}>
              <DateStrip
                year={YEAR} month={month}
                eventDates={allEventDates}
                selectedDate={selectedDate}
                onSelectDate={date => setSelectedDate(date)}
                light
                adminMode
              />
            </div>

            {/* Event cards area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px 48px' }}>
              {eventsForDate.length === 0 ? (
                <div style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  height: '100%', gap: 14,
                }}>
                  <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.35)', fontFamily: 'var(--font-body)' }}>
                    No events for this date
                  </p>
                  <button
                    onClick={() => openCreate(selectedDate)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: '#111', color: '#fff', border: 'none', borderRadius: 8,
                      fontSize: 12, fontWeight: 800, fontFamily: 'var(--font-display)',
                      letterSpacing: '0.04em', textTransform: 'uppercase',
                      padding: '11px 20px', cursor: 'pointer',
                    }}
                  >
                    <Plus size={13} strokeWidth={2.5} />
                    Create Event
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  {eventsForDate.map(ev => (
                    <AdminEventCard
                      key={ev.id}
                      event={ev}
                      onEdit={() => openEdit(ev)}
                      onDelete={() => deleteEvent(ev)}
                      onTogglePublish={() => togglePublish(ev)}
                      deleting={deleting === ev.id}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── FORM MODAL ───────────────────────────────────────────── */}
      {showForm && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.45)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          }}
          onClick={e => { if (e.target === e.currentTarget) closeForm() }}
        >
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px 20px 0 0',
            width: '100%', maxWidth: 560,
            maxHeight: '92dvh',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
          }}>
            {/* Modal header */}
            <div style={{
              padding: '18px 24px 14px',
              borderBottom: '1px solid rgba(0,0,0,0.07)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              flexShrink: 0,
            }}>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800,
                letterSpacing: '-0.02em', color: '#111',
              }}>
                {editingEvent ? 'Edit Event' : formDate ? `New Event — ${fmtDateLabel(formDate)}` : 'New Event'}
              </h2>
              <button
                onClick={closeForm}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', padding: 4 }}
              >
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            {/* Scrollable form */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 36px' }}>
              <EventForm
                existing={editingEvent ?? undefined}
                initialDate={formDate}
                onSaved={afterSave}
                onCancel={closeForm}
              />
            </div>
          </div>
        </div>
      )}

    </>
  )
}

// ── Admin event card ──────────────────────────────────────────────

interface AdminEventCardProps {
  event: Event
  onEdit: () => void
  onDelete: () => void
  onTogglePublish: () => void
  deleting: boolean
}

function AdminEventCard({ event, onEdit, onDelete, onTogglePublish, deleting }: AdminEventCardProps) {
  return (
    <div style={{ width: 240, display: 'flex', flexDirection: 'column' }}>
      {/* Shared EventCard visual — identical to public view */}
      <EventCard event={event} />

      {/* Admin controls */}
      <div style={{ display: 'flex', gap: 6, padding: '10px 2px 0', alignItems: 'center' }}>
        <button
          onClick={onTogglePublish}
          style={{
            flex: 1, padding: '8px 10px', borderRadius: 8,
            background: event.is_published ? 'rgba(26,127,60,0.1)' : 'rgba(0,0,0,0.05)',
            color: event.is_published ? '#1A7F3C' : 'rgba(0,0,0,0.4)',
            border: event.is_published ? '1px solid rgba(26,127,60,0.22)' : '1px solid rgba(0,0,0,0.1)',
            fontSize: 10, fontWeight: 800, letterSpacing: '0.08em',
            fontFamily: 'var(--font-body)', cursor: 'pointer',
            textTransform: 'uppercase', transition: 'all 0.15s',
          }}
        >
          {event.is_published ? '● LIVE' : '○ DRAFT'}
        </button>
        <button
          onClick={onEdit}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '8px 12px', borderRadius: 8,
            background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.1)',
            color: '#111', fontSize: 11, fontWeight: 600,
            fontFamily: 'var(--font-body)', cursor: 'pointer',
          }}
        >
          <Pencil size={11} strokeWidth={2} />
          Edit
        </button>
        <button
          onClick={onDelete}
          disabled={deleting}
          style={{
            display: 'flex', alignItems: 'center', padding: '8px 9px', borderRadius: 8,
            background: 'none', border: '1px solid rgba(0,0,0,0.1)',
            color: '#E8412C', cursor: deleting ? 'default' : 'pointer',
            opacity: deleting ? 0.4 : 1, transition: 'opacity 0.15s',
          }}
        >
          <Trash2 size={13} strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
