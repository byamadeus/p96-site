'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Drawer } from 'vaul'
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

type ViewSlide = 'hidden' | 'visible' | 'exiting'

function parseInitialMonth(date: string | undefined): number {
  if (date) {
    const m = parseInt(date.split('-')[1], 10)
    return m >= MIN_MONTH && m <= MAX_MONTH ? m : MIN_MONTH
  }
  const current = new Date().getMonth() + 1
  return current >= MIN_MONTH && current <= MAX_MONTH ? current : MIN_MONTH
}

export default function CalendarView({ events, draftDates = new Set(), initialDate }: { events: Event[]; draftDates?: Set<string>; initialDate?: string }) {
  const store = useAppStore()
  const router = useRouter()
  const [month, setMonth] = useState(() => parseInitialMonth(initialDate))
  const [selectedDate, setSelectedDate] = useState<string | null>(initialDate ?? null)
  const [viewMode, setViewMode] = useState(false)
  const [viewSlide, setViewSlide] = useState<ViewSlide>('hidden')
  const [monthVisible, setMonthVisible] = useState(true)
  const [showLeadCapture, setShowLeadCapture] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [carouselIdx, setCarouselIdx] = useState(0)

  useEffect(() => {
    document.documentElement.style.backgroundColor = '#7BBAD6'
    document.body.style.backgroundColor = 'transparent'
    return () => {
      document.documentElement.style.backgroundColor = ''
      document.body.style.backgroundColor = ''
    }
  }, [])

  useEffect(() => {
    store.loadFromCookie()
    const eventDates = new Set(events.map(e => e.date))
    if (initialDate && eventDates.has(initialDate)) {
      const mobile = window.innerWidth < 768
      if (mobile) {
        setDrawerOpen(true)
      } else {
        openViewMode()
      }
    } else if (!initialDate) {
      setSelectedDate(getNextEventDate(eventDates))
    }
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    setMounted(true)
    return () => window.removeEventListener('resize', check)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  const allEventDates = new Set(events.map(e => e.date))

  // First category per date — drives soccer ball color in CalendarGrid
  const eventCategories = new Map<string, string>()
  events.forEach(e => { if (!eventCategories.has(e.date)) eventCategories.set(e.date, e.category) })

  // Match day flags — highest activationScore diaspora game per date, + total count
  const matchCountByDate = new Map<string, number>()
  matches.forEach(m => matchCountByDate.set(m.date, (matchCountByDate.get(m.date) ?? 0) + 1))

  // Hardcoded overrides: force a specific match ID to display for a given date
  const MATCH_DAY_OVERRIDES: Record<string, number> = {
    '2026-06-13': 2, // Brazil vs Morocco (id:2) — override Haiti/Scotland
  }

  const matchDays = new Map<string, { codeA: string; codeB: string; count: number }>()
  // Group by date, pick best diaspora match (highest activationScore), fallback to first
  const byDate = new Map<string, typeof matches>()
  matches.forEach(m => { const arr = byDate.get(m.date) ?? []; arr.push(m); byDate.set(m.date, arr) })
  byDate.forEach((dayMatches, date) => {
    const overrideId = MATCH_DAY_OVERRIDES[date]
    const best = overrideId
      ? (dayMatches.find(m => m.id === overrideId) ?? dayMatches[0])
      : (() => {
          const diaspora = dayMatches.filter(m => m.teamA.isDiaspora || m.teamB.isDiaspora)
          const pool = diaspora.length > 0 ? diaspora : dayMatches
          return pool.reduce((a, b) => b.activationScore >= a.activationScore ? b : a)
        })()
    matchDays.set(date, {
      codeA: best.teamA.code.toLowerCase(),
      codeB: best.teamB.code.toLowerCase(),
      count: dayMatches.length,
    })
  })

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
      router.replace('/calendar', { scroll: false })
      if (viewMode) closeViewMode()
      requestAnimationFrame(() => requestAnimationFrame(() => setMonthVisible(true)))
    }, 200)
  }

  function handleDateSelect(date: string) {
    setSelectedDate(date)
    router.replace(`/calendar?date=${date}`, { scroll: false })
    if (!allEventDates.has(date)) {
      setShowLeadCapture(true)
      return
    }
    if (isMobile) {
      setDrawerOpen(true)
    } else {
      openViewMode()
    }
  }

  const eventsForDate = selectedDate
    ? events.filter(e => e.date === selectedDate)
    : []
  // locked = no published events for selected date
  const locked = selectedDate ? !allEventDates.has(selectedDate) : false

  const PAGE_GRADIENT = 'radial-gradient(ellipse at 70% 50%, #FFFFFF 0%, #C5E8F5 42%, #7BBAD6 100%)'

  if (!mounted) return (
    <div style={{ height: '100dvh', background: PAGE_GRADIENT }} />
  )

  return (
    <>
      {/* ── BROWSE MODE ─────────────────────────────────────────── */}
      {/* Fixed gradient layer — stays put while calendar scrolls */}
      <div style={{
        position: 'fixed', inset: 0,
        background: PAGE_GRADIENT,
        zIndex: -1,
      }} />

      <div style={{ height: '100dvh', background: 'transparent', display: 'flex', flexDirection: 'column', overflowX: 'hidden', width: '100%' }}>
        <ShimmerBar />

        {/* Header — centered, no border */}
        <div style={{
          padding: '24px 20px 16px',
          background: 'transparent',
          flexShrink: 0,
          textAlign: 'center',
        }}>
          {/* P96 logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <Link href="/"><P96Logo color="#0E0E0E" height={20} /></Link>
          </div>

          {/* Title */}
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.65)', marginBottom: 14,
            maxWidth: '100%', wordBreak: 'break-word',
          }}>
            Diaspora World Cup Activation Calendar
          </p>

          {/* Month nav — display font, centered */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <button
              onClick={() => month > MIN_MONTH && changeMonth(-1)}
              disabled={month === MIN_MONTH}
              style={{
                background: 'none', border: 'none', padding: '4px',
                cursor: month === MIN_MONTH ? 'default' : 'pointer',
                color: month === MIN_MONTH ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.6)',
                display: 'flex', alignItems: 'center', transition: 'color 0.15s',
              }}
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>

            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              color: '#0E0E0E',
              lineHeight: 1,
            }}>
              {month === 6 ? 'June' : 'July'} 2026
            </span>

            <button
              onClick={() => month < MAX_MONTH && changeMonth(1)}
              disabled={month === MAX_MONTH}
              style={{
                background: 'none', border: 'none', padding: '4px',
                cursor: month === MAX_MONTH ? 'default' : 'pointer',
                color: month === MAX_MONTH ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.6)',
                display: 'flex', alignItems: 'center', transition: 'color 0.15s',
              }}
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', width: '100%' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
            {/* Month fade transition wrapper */}
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
                extraPriorityDates={draftDates}
                matchDays={matchDays}
                isMobile={isMobile}
              />
            </div>
          </div>
        </div>

        <PageFooter showContact showDevReset />

        {/* Mobile drawer */}
        {isMobile && (
          <Drawer.Root open={drawerOpen} onOpenChange={open => { if (!open) { setDrawerOpen(false); setCarouselIdx(0) } }}>
            <Drawer.Portal>
              <Drawer.Overlay style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }} />
              <Drawer.Content style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 101,
                background: '#FFFFFF',
                borderRadius: '20px 20px 0 0', height: '90dvh',
                display: 'flex', flexDirection: 'column', outline: 'none',
              }}>
                {/* Drag handle + dots row */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 24px 8px', flexShrink: 0 }}>
                  <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(0,0,0,0.15)', marginBottom: eventsForDate.length > 1 ? 10 : 0 }} />
                  {eventsForDate.length > 1 && (
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {eventsForDate.map((_, i) => (
                        <div key={i} style={{
                          width: i === carouselIdx ? 20 : 6, height: 6,
                          borderRadius: 3,
                          background: i === carouselIdx ? '#111' : 'rgba(0,0,0,0.2)',
                          transition: 'all var(--duration-base) var(--ease-out)',
                        }} />
                      ))}
                    </div>
                  )}
                </div>

                {selectedDate && (
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 20px 8px', flexShrink: 0,
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
                      fontSize: 12, fontWeight: 700, color: 'rgba(0,0,0,0.35)',
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
                    onIdxChange={(i) => setCarouselIdx(i)}
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
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#111')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.5)')}
            >
              <ChevronLeft size={18} strokeWidth={2.5} />
              {fmtViewHeader(selectedDate)}
            </button>

            <Link href="/"><P96Logo height={20} color="#111111" /></Link>

            <span style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
              color: 'rgba(0,0,0,0.35)', fontFamily: 'var(--font-body)',
              textTransform: 'uppercase',
            }}>
              {eventsForDate.length} {eventsForDate.length === 1 ? 'EVENT' : 'EVENTS'}
            </span>
          </div>

          {/* Body: date strip + carousel */}
          <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
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
                    closeViewMode()
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
