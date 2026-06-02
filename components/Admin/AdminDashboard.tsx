'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Plus, Pencil, Trash2, X, Copy } from 'lucide-react'
import { supabase, Event, getCategoryMeta } from '@/lib/supabase'
import CalendarGrid, { DateStrip } from '@/components/Calendar/CalendarGrid'
import EventForm from '@/components/Admin/EventForm'
import Navbar from '@/components/Layout/Navbar'
import P96Logo from '@/components/Layout/P96Logo'
import ShimmerBar from '@/components/Layout/ShimmerBar'
import PageFooter from '@/components/Layout/PageFooter'
import EventCard from '@/components/Calendar/EventCard'

const YEAR = 2026
const MIN_MONTH = 6
const MAX_MONTH = 7
const PAGE_GRADIENT = 'radial-gradient(ellipse at 70% 50%, #FFFFFF 0%, #C5E8F5 42%, #7BBAD6 100%)'

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
type ViewSlide = 'hidden' | 'visible' | 'exiting'

export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<AdminTab>('calendar')
  const [month, setMonth] = useState(MIN_MONTH)
  const [monthVisible, setMonthVisible] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState(false)
  const [viewSlide, setViewSlide] = useState<ViewSlide>('hidden')
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formDate, setFormDate] = useState<string | undefined>(undefined)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

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
    document.documentElement.style.backgroundColor = '#7BBAD6'
    document.body.style.backgroundColor = 'transparent'
    return () => {
      document.documentElement.style.backgroundColor = ''
      document.body.style.backgroundColor = ''
    }
  }, [])

  useEffect(() => {
    fetchEvents()
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [fetchEvents])

  // ── Transitions ────────────────────────────────────────────────
  function openViewMode() {
    setViewMode(true)
    setViewSlide('hidden')
    requestAnimationFrame(() => requestAnimationFrame(() => setViewSlide('visible')))
  }

  function closeViewMode() {
    setViewSlide('exiting')
    setTimeout(() => { setViewMode(false); setViewSlide('hidden') }, 250)
  }

  function changeMonth(dir: 1 | -1) {
    setMonthVisible(false)
    setTimeout(() => {
      setMonth(m => m + dir)
      setSelectedDate(null)
      if (viewMode) closeViewMode()
      requestAnimationFrame(() => requestAnimationFrame(() => setMonthVisible(true)))
    }, 200)
  }

  // ── Event actions ───────────────────────────────────────────────
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

  async function duplicateEvent(ev: Event) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, created_at, ...fields } = ev
    await supabase.from('events').insert({
      ...fields,
      title: `${ev.title} (Copy)`,
      is_published: false,
    })
    fetchEvents()
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
    openViewMode()
  }

  const allEventDates = new Set(events.map(e => e.date))
  const eventCategories = new Map<string, string>()
  events.forEach(e => { if (!eventCategories.has(e.date)) eventCategories.set(e.date, e.category) })
  const eventsForDate = selectedDate ? events.filter(e => e.date === selectedDate) : []

  return (
    <>
      {/* Fixed gradient background */}
      <div style={{ position: 'fixed', inset: 0, background: PAGE_GRADIENT, zIndex: -1 }} />

      <div style={{ height: '100dvh', background: 'transparent', display: 'flex', flexDirection: 'column', overflowX: 'hidden', width: '100%' }}>
        <ShimmerBar />
        <Navbar light />

        {/* Page header */}
        <div style={{ padding: '16px 20px 0', background: 'transparent', flexShrink: 0 }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800,
                letterSpacing: '-0.03em', color: '#0E0E0E', textTransform: 'uppercase', lineHeight: 1,
              }}>
                Admin
              </h1>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  onClick={() => openCreate()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: '#0E0E0E', color: '#fff', border: 'none', borderRadius: 4,
                    fontSize: 11, fontWeight: 800, fontFamily: 'var(--font-display)',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    padding: '8px 14px', cursor: 'pointer',
                    transition: 'background var(--duration-base) var(--ease-out)',
                  }}
                >
                  <Plus size={12} strokeWidth={2.5} />
                  NEW
                </button>
                <button
                  onClick={logout}
                  style={{
                    background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(0,0,0,0.12)',
                    borderRadius: 4, color: 'rgba(0,0,0,0.5)',
                    fontSize: 11, padding: '7px 12px',
                    cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600,
                    transition: 'background var(--duration-base) var(--ease-out)',
                  }}
                >
                  Sign out
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              {(['calendar', 'list'] as AdminTab[]).map(t => (
                <button
                  key={t}
                  onClick={() => { setTab(t); if (viewMode) closeViewMode() }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: '9px 14px 10px',
                    fontSize: 10, fontWeight: 800, letterSpacing: '0.1em',
                    textTransform: 'uppercase', fontFamily: 'var(--font-body)',
                    color: tab === t ? '#0E0E0E' : 'rgba(0,0,0,0.4)',
                    borderBottom: tab === t ? '2px solid #0E0E0E' : '2px solid transparent',
                    marginBottom: -1,
                    transition: 'color var(--duration-base) var(--ease-out)',
                  }}
                >
                  {t === 'calendar' ? 'Calendar' : 'All Events'}
                </button>
              ))}

              {/* Right: stats + month nav */}
              <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 12, paddingBottom: 4 }}>
                {!loading && (
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: 'rgba(0,0,0,0.45)', fontFamily: 'var(--font-body)' }}>
                    {events.filter(e => e.is_published).length} LIVE · {events.filter(e => !e.is_published).length} DRAFT
                  </span>
                )}
                {tab === 'calendar' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <button
                      onClick={() => month > MIN_MONTH && changeMonth(-1)}
                      disabled={month === MIN_MONTH}
                      style={{
                        background: 'none', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 4,
                        padding: '4px 5px', cursor: month === MIN_MONTH ? 'default' : 'pointer',
                        color: month === MIN_MONTH ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.5)',
                        display: 'flex', alignItems: 'center',
                        transition: 'color var(--duration-base) var(--ease-out)',
                      }}
                    >
                      <ChevronLeft size={12} strokeWidth={2.5} />
                    </button>
                    <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0E0E0E', fontFamily: 'var(--font-display)', minWidth: 64, textAlign: 'center' }}>
                      {month === 6 ? 'JUNE' : 'JULY'} 2026
                    </span>
                    <button
                      onClick={() => month < MAX_MONTH && changeMonth(1)}
                      disabled={month === MAX_MONTH}
                      style={{
                        background: 'none', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 4,
                        padding: '4px 5px', cursor: month === MAX_MONTH ? 'default' : 'pointer',
                        color: month === MAX_MONTH ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.5)',
                        display: 'flex', alignItems: 'center',
                        transition: 'color var(--duration-base) var(--ease-out)',
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
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', width: '100%' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
              {loading ? (
                <div style={{ padding: '48px 20px', textAlign: 'center', color: 'rgba(0,0,0,0.4)', fontSize: 13, fontFamily: 'var(--font-body)' }}>
                  Loading…
                </div>
              ) : (
                <div style={{
                  opacity: monthVisible ? 1 : 0,
                  transform: `translateY(${monthVisible ? 0 : 8}px)`,
                  transition: 'opacity var(--duration-base) var(--ease-out), transform var(--duration-base) var(--ease-out)',
                }}>
                  <CalendarGrid
                    year={YEAR} month={month}
                    eventDates={allEventDates}
                    selectedDate={selectedDate}
                    onSelectDate={handleDateSelect}
                    eventCategories={eventCategories}
                    isMobile={isMobile}
                    adminMode
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── LIST TAB ─────────────────────────────────────────────── */}
        {tab === 'list' && (
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', width: '100%' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', padding: '16px 20px 48px' }}>
              {loading ? (
                <p style={{ color: 'rgba(0,0,0,0.35)', fontSize: 13, textAlign: 'center', paddingTop: 40, fontFamily: 'var(--font-body)' }}>Loading…</p>
              ) : events.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 60 }}>
                  <p style={{ color: 'rgba(0,0,0,0.35)', fontSize: 13, fontFamily: 'var(--font-body)' }}>No events yet</p>
                  <button
                    onClick={() => openCreate()}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0E0E0E', color: '#fff', border: 'none', borderRadius: 4, fontSize: 12, fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '0.04em', textTransform: 'uppercase', padding: '10px 18px', cursor: 'pointer' }}
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
                          background: 'rgba(255,255,255,0.55)',
                          border: '1px solid rgba(255,255,255,0.7)',
                          borderRadius: 8,
                          padding: '11px 14px',
                          display: 'flex', alignItems: 'center', gap: 10,
                          transition: 'background var(--duration-base) var(--ease-out)',
                        }}
                      >
                        {/* Category dot */}
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: meta.color, flexShrink: 0 }} />

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#0E0E0E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: 'var(--font-body)' }}>
                            {ev.title}
                          </div>
                          <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.45)', marginTop: 1, fontFamily: 'var(--font-body)' }}>
                            {fmtDateShort(ev.date)} · {meta.label}
                          </div>
                        </div>

                        {/* Status pill */}
                        <button
                          onClick={() => togglePublish(ev)}
                          style={{
                            padding: '3px 9px', borderRadius: 99, cursor: 'pointer',
                            fontSize: 10, fontWeight: 800, letterSpacing: '0.08em',
                            fontFamily: 'var(--font-body)', flexShrink: 0,
                            background: ev.is_published ? 'rgba(26,127,60,0.12)' : 'rgba(0,0,0,0.07)',
                            color: ev.is_published ? '#1A7F3C' : 'rgba(0,0,0,0.45)',
                            border: ev.is_published ? '1px solid rgba(26,127,60,0.22)' : '1px solid rgba(0,0,0,0.12)',
                            transition: 'all var(--duration-base) var(--ease-out)',
                          }}
                        >
                          {ev.is_published ? 'LIVE' : 'DRAFT'}
                        </button>

                        {/* Duplicate */}
                        <button
                          onClick={() => duplicateEvent(ev)}
                          title="Duplicate"
                          style={{ background: 'none', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 4, color: 'rgba(0,0,0,0.4)', padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0, transition: 'color var(--duration-base) var(--ease-out)' }}
                        >
                          <Copy size={12} strokeWidth={2} />
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => openEdit(ev)}
                          style={{ background: 'none', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 4, color: 'rgba(0,0,0,0.5)', padding: '5px 10px', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-body)', flexShrink: 0, transition: 'color var(--duration-base) var(--ease-out)' }}
                        >
                          Edit
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => deleteEvent(ev)}
                          disabled={deleting === ev.id}
                          style={{ background: 'none', border: 'none', color: '#E8412C', cursor: deleting ? 'default' : 'pointer', padding: '0 2px', display: 'flex', alignItems: 'center', flexShrink: 0, opacity: deleting === ev.id ? 0.4 : 1, transition: 'opacity var(--duration-base) var(--ease-out)' }}
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

      {/* ── DATE VIEW MODE ───────────────────────────────────────── */}
      {viewMode && selectedDate && tab === 'calendar' && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: PAGE_GRADIENT,
          display: 'flex', flexDirection: 'column',
          transform: viewSlide === 'visible' ? 'translateX(0)' : 'translateX(100%)',
          transition: (viewSlide === 'visible' || viewSlide === 'exiting')
            ? 'transform var(--duration-base) var(--ease-out)'
            : 'none',
        }}>
          <ShimmerBar />

          {/* Top bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 24px', height: 56, flexShrink: 0,
            borderBottom: '1px solid rgba(0,0,0,0.08)',
          }}>
            <button
              onClick={() => closeViewMode()}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'rgba(0,0,0,0.5)', padding: 0,
                fontFamily: 'var(--font-display)', fontSize: 13,
                fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase',
                transition: 'color var(--duration-base) var(--ease-out)',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#0E0E0E')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.5)')}
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
              {fmtDateLabel(selectedDate)}
            </button>

            <P96Logo height={20} color="#0E0E0E" />

            <button
              onClick={() => openCreate(selectedDate)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: '#0E0E0E', color: '#fff', border: 'none', borderRadius: 4,
                fontSize: 11, fontWeight: 800, fontFamily: 'var(--font-display)',
                letterSpacing: '0.06em', textTransform: 'uppercase',
                padding: '8px 14px', cursor: 'pointer',
                transition: 'background var(--duration-base) var(--ease-out)',
              }}
            >
              <Plus size={12} strokeWidth={2.5} />
              ADD EVENT
            </button>
          </div>

          {/* Body */}
          <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
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
                adminMode
                light
              />
            </div>

            {/* Event cards area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px 48px' }}>
              {eventsForDate.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 14 }}>
                  <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.4)', fontFamily: 'var(--font-body)' }}>
                    No events for this date
                  </p>
                  <button
                    onClick={() => openCreate(selectedDate)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: '#0E0E0E', color: '#fff', border: 'none', borderRadius: 4,
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
                      onDuplicate={() => duplicateEvent(ev)}
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
  onDuplicate: () => void
  onTogglePublish: () => void
  deleting: boolean
}

function AdminEventCard({ event, onEdit, onDelete, onDuplicate, onTogglePublish, deleting }: AdminEventCardProps) {
  return (
    <div style={{ width: 300, display: 'flex', flexDirection: 'column' }}>
      <EventCard event={event} />

      <div style={{ display: 'flex', gap: 5, padding: '10px 2px 0', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Publish toggle */}
        <button
          onClick={onTogglePublish}
          style={{
            flex: 1, padding: '8px 10px', borderRadius: 4,
            background: event.is_published ? 'rgba(26,127,60,0.1)' : 'rgba(0,0,0,0.05)',
            color: event.is_published ? '#1A7F3C' : 'rgba(0,0,0,0.4)',
            border: event.is_published ? '1px solid rgba(26,127,60,0.22)' : '1px solid rgba(0,0,0,0.1)',
            fontSize: 10, fontWeight: 800, letterSpacing: '0.08em',
            fontFamily: 'var(--font-body)', cursor: 'pointer',
            textTransform: 'uppercase',
            transition: 'all var(--duration-base) var(--ease-out)',
          }}
        >
          {event.is_published ? '● LIVE' : '○ DRAFT'}
        </button>

        {/* Edit */}
        <button
          onClick={onEdit}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '8px 10px', borderRadius: 4,
            background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.1)',
            color: '#111', fontSize: 11, fontWeight: 600,
            fontFamily: 'var(--font-body)', cursor: 'pointer',
            transition: 'background var(--duration-base) var(--ease-out)',
          }}
        >
          <Pencil size={11} strokeWidth={2} />
          Edit
        </button>

        {/* Duplicate */}
        <button
          onClick={onDuplicate}
          title="Duplicate"
          style={{
            display: 'flex', alignItems: 'center', padding: '8px 9px', borderRadius: 4,
            background: 'none', border: '1px solid rgba(0,0,0,0.1)',
            color: 'rgba(0,0,0,0.4)', cursor: 'pointer',
            transition: 'color var(--duration-base) var(--ease-out)',
          }}
        >
          <Copy size={12} strokeWidth={2} />
        </button>

        {/* Delete */}
        <button
          onClick={onDelete}
          disabled={deleting}
          style={{
            display: 'flex', alignItems: 'center', padding: '8px 9px', borderRadius: 4,
            background: 'none', border: '1px solid rgba(0,0,0,0.1)',
            color: '#E8412C', cursor: deleting ? 'default' : 'pointer',
            opacity: deleting ? 0.4 : 1,
            transition: 'opacity var(--duration-base) var(--ease-out)',
          }}
        >
          <Trash2 size={13} strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
