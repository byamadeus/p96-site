'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Drawer } from 'vaul'
import Navbar from '@/components/Layout/Navbar'
import P96Logo from '@/components/Layout/P96Logo'
import ShimmerBar from '@/components/Layout/ShimmerBar'
import PageFooter from '@/components/Layout/PageFooter'
import CalendarGrid, { DateStrip } from './CalendarGrid'
import EventCarousel from './EventCarousel'
import LeadCaptureModal from './LeadCaptureModal'
import { matches, Match } from '@/data/matches'
import { Event } from '@/lib/supabase'
import { useAppStore } from '@/lib/store'

const YEAR = 2026
const MIN_MONTH = 6
const MAX_MONTH = 7

function getNextEventDate(eventDates: Set<string>): string | null {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const sorted = Array.from(eventDates).sort()
  for (const d of sorted) {
    if (new Date(d + 'T00:00:00') >= today) return d
  }
  return sorted[sorted.length - 1] ?? null
}

function getMatchForEvent(event: Event): Match | null {
  if (!event.game_id) return null
  return matches.find(m => m.id === event.game_id) ?? null
}

function fmtViewHeader(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00')
    .toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    .toUpperCase()
}

export default function CalendarView({ events }: { events: Event[] }) {
  const store = useAppStore()
  const [month, setMonth] = useState(MIN_MONTH)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState(false)
  const [showLeadCapture, setShowLeadCapture] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // override html/body dark bg for this page
    document.documentElement.style.backgroundColor = '#FFFFFF'
    document.body.style.backgroundColor = '#FFFFFF'
    return () => {
      document.documentElement.style.backgroundColor = ''
      document.body.style.backgroundColor = ''
    }
  }, [])

  useEffect(() => {
    store.loadFromCookie()
    setSelectedDate(getNextEventDate(new Set(events.map(e => e.date))))
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    setMounted(true)
    return () => window.removeEventListener('resize', check)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredEvents = events.filter(e => {
    if (store.activeNations.length === 0) return true
    if (!e.game_id) return true
    const match = getMatchForEvent(e)
    if (!match) return true
    return (
      store.activeNations.includes(match.teamA.code) ||
      store.activeNations.includes(match.teamB.code)
    )
  })

  const allEventDates = new Set(events.map(e => e.date))

  function handleDateSelect(date: string) {
    setSelectedDate(date)
    // no published events for this date → lead capture
    if (!allEventDates.has(date)) {
      setShowLeadCapture(true)
      return
    }
    if (isMobile) {
      setDrawerOpen(true)
    } else {
      setViewMode(true)
    }
  }

  const eventsForDate = selectedDate
    ? events.filter(e => e.date === selectedDate)
    : []
  // locked = no published events for selected date
  const locked = selectedDate ? !allEventDates.has(selectedDate) : false

  if (!mounted) return <div style={{ minHeight: '100dvh', background: '#FFFFFF' }} />

  return (
    <>
      {/* ── BROWSE MODE ─────────────────────────────────────────── */}
      <div style={{ minHeight: '100dvh', background: '#FFFFFF', display: 'flex', flexDirection: 'column' }}>
        <ShimmerBar />
        <Navbar light />

        {/* Header */}
        <div style={{
          padding: '20px 20px 0',
          background: 'linear-gradient(180deg, #FFFBEF 0%, #FFFFFF 100%)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          flexShrink: 0,
        }}>
          <div style={{
            maxWidth: 480, margin: '0 auto',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            paddingBottom: 16,
          }}>
            {/* Title + badge */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}>
              <h1 style={{
                fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800,
                letterSpacing: '-0.03em', color: '#111', textTransform: 'uppercase',
                lineHeight: 1,
              }}>
                Events
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

            {/* Month nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingBottom: 2 }}>
              <button
                onClick={() => { setMonth(m => m - 1); setSelectedDate(null); setViewMode(false) }}
                disabled={month === MIN_MONTH}
                style={{
                  background: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 6,
                  padding: '5px 6px', cursor: month === MIN_MONTH ? 'default' : 'pointer',
                  color: month === MIN_MONTH ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.5)',
                  display: 'flex', alignItems: 'center', transition: 'color 0.15s',
                }}
              >
                <ChevronLeft size={14} strokeWidth={2.5} />
              </button>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 800,
                letterSpacing: '0.1em', textTransform: 'uppercase', color: '#111',
                minWidth: 66, textAlign: 'center',
              }}>
                {month === 6 ? 'JUN' : 'JUL'} 2026
              </span>
              <button
                onClick={() => { setMonth(m => m + 1); setSelectedDate(null); setViewMode(false) }}
                disabled={month === MAX_MONTH}
                style={{
                  background: 'none', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 6,
                  padding: '5px 6px', cursor: month === MAX_MONTH ? 'default' : 'pointer',
                  color: month === MAX_MONTH ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.5)',
                  display: 'flex', alignItems: 'center', transition: 'color 0.15s',
                }}
              >
                <ChevronRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <CalendarGrid
              year={YEAR} month={month}
              eventDates={allEventDates}
              selectedDate={selectedDate}
              onSelectDate={handleDateSelect}
              light
            />
          </div>
        </div>

        <PageFooter showContact showDevReset />

        {/* Mobile drawer */}
        {isMobile && (
          <Drawer.Root open={drawerOpen} onOpenChange={open => { if (!open) setDrawerOpen(false) }}>
            <Drawer.Portal>
              <Drawer.Overlay style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }} />
              <Drawer.Content style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 101,
                background: '#FFFFFF',
                borderRadius: '20px 20px 0 0', height: '88dvh',
                display: 'flex', flexDirection: 'column', outline: 'none',
              }}>
                <Drawer.Handle style={{
                  width: 36, height: 4, borderRadius: 2,
                  background: 'rgba(0,0,0,0.15)', margin: '12px auto 0',
                  display: 'block', flexShrink: 0,
                }} />
                {selectedDate && (
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 20px 8px', flexShrink: 0,
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                  }}>
                    <button
                      onClick={() => setDrawerOpen(false)}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
                        gap: 6, fontSize: 12, fontWeight: 700,
                        fontFamily: 'var(--font-display)', letterSpacing: '0.04em',
                        textTransform: 'uppercase', padding: 0,
                      }}
                    >
                      <ChevronLeft size={16} strokeWidth={2.5} />
                      {fmtViewHeader(selectedDate)}
                    </button>
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: 'rgba(0,0,0,0.35)',
                      fontFamily: 'var(--font-body)', letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}>
                      {eventsForDate.length} {eventsForDate.length === 1 ? 'EVENT' : 'EVENTS'}
                    </span>
                  </div>
                )}
                {selectedDate && (
                  <EventCarousel
                    date={selectedDate}
                    events={eventsForDate}
                    isLocked={locked}
                    onGetNotified={() => { setDrawerOpen(false); setShowLeadCapture(true) }}
                    getMatch={getMatchForEvent}
                    light
                    mobile
                  />
                )}
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        )}
      </div>

      {/* ── VIEW MODE — full-screen overlay, light ───────────────── */}
      {viewMode && selectedDate && !isMobile && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: '#FFFFFF',
          display: 'flex', flexDirection: 'column',
        }}>
          <ShimmerBar />

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
              {fmtViewHeader(selectedDate)}
            </button>

            <P96Logo height={20} color="#111111" />

            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
              color: 'rgba(0,0,0,0.35)', fontFamily: 'var(--font-body)',
              textTransform: 'uppercase',
            }}>
              {eventsForDate.length} {eventsForDate.length === 1 ? 'EVENT' : 'EVENTS'}
            </span>
          </div>

          {/* Body: date strip + carousel */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {/* Minimized date strip */}
            <div style={{
              width: 64, flexShrink: 0,
              borderRight: '1px solid rgba(0,0,0,0.08)',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}>
              <DateStrip
                year={YEAR} month={month}
                eventDates={allEventDates}
                selectedDate={selectedDate}
                onSelectDate={date => {
                  if (!allEventDates.has(date)) {
                    setViewMode(false)
                    setShowLeadCapture(true)
                    return
                  }
                  setSelectedDate(date)
                }}
                light
              />
            </div>

            {/* Event carousel */}
            <EventCarousel
              date={selectedDate}
              events={eventsForDate}
              isLocked={locked}
              onGetNotified={() => { setViewMode(false); setShowLeadCapture(true) }}
              getMatch={getMatchForEvent}
              light
            />
          </div>
        </div>
      )}

      {showLeadCapture && (
        <LeadCaptureModal onClose={() => setShowLeadCapture(false)} />
      )}

    </>
  )
}
