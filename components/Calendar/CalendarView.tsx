'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Share2, ChevronUp, RotateCcw } from 'lucide-react'
import Navbar from '@/components/Layout/Navbar'
import IntakeModal from '@/components/Entry/IntakeModal'
import EventCard from './EventCard'
import EventDetail from './EventDetail'
import { Drawer } from 'vaul'
import { matches, Match } from '@/data/matches'
import { Event, EventCategory, getCategoryMeta } from '@/lib/supabase'
import { NATIONS, BOROUGHS } from '@/lib/nations'
import { useAppStore, hasIntakeCookie } from '@/lib/store'

const CATEGORIES: { key: EventCategory; label: string }[] = [
  { key: 'watch_party',   label: 'World Cup Watch Party' },
  { key: 'talks',         label: 'Talks' },
  { key: 'workshop',      label: 'Workshop' },
  { key: 'hangout',       label: 'Hangout' },
  { key: 'collaboration', label: 'Collaboration' },
  { key: 'film_screening',label: 'Film Screenings' },
]

function fmtDateShort(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  })
}

function relativeDay(dateStr: string): string {
  const today = new Date(); today.setHours(0,0,0,0)
  const d = new Date(dateStr + 'T00:00:00'); d.setHours(0,0,0,0)
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000)
  if (diff === 0) return 'TODAY'
  if (diff === 1) return 'TOMORROW'
  if (diff === -1) return 'YESTERDAY'
  if (diff > 0) return `IN ${diff} DAYS`
  return `${Math.abs(diff)} DAYS AGO`
}

function groupByDate(events: Event[]): [string, Event[]][] {
  const map: Record<string, Event[]> = {}
  for (const e of events) {
    if (!map[e.date]) map[e.date] = []
    map[e.date].push(e)
  }
  return Object.entries(map).sort(([a], [b]) => a.localeCompare(b))
}

function getMatchForEvent(event: Event): Match | null {
  if (!event.game_id) return null
  return matches.find(m => m.id === event.game_id) ?? null
}

export default function CalendarView({ events }: { events: Event[] }) {
  const router = useRouter()
  const store = useAppStore()

  const [showIntake, setShowIntake] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [filterCopied, setFilterCopied] = useState(false)

  // Load state from URL params, then cookie
  useEffect(() => {
    const { setActiveNations, setActiveBorough, setActiveCategory, setWcMode, loadFromCookie } = useAppStore.getState()
    const params = new URLSearchParams(window.location.search)
    const urlNations = params.get('n')?.split(',').filter(Boolean) ?? []
    const urlBorough = params.get('b') ?? null
    const urlCat = params.get('cat') as EventCategory | null
    const urlWc = params.get('wc') === '1'

    if (urlNations.length || urlBorough || urlCat || urlWc) {
      setActiveNations(urlNations)
      setActiveBorough(urlBorough)
      if (urlCat) setActiveCategory(urlCat)
      if (urlWc) setWcMode(true)
    } else {
      loadFromCookie()
    }

    if (!hasIntakeCookie()) {
      setShowIntake(true)
    }

    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync filters → URL params
  const syncUrl = useCallback(() => {
    const params = new URLSearchParams()
    if (store.activeNations.length) params.set('n', store.activeNations.join(','))
    if (store.activeBorough) params.set('b', store.activeBorough)
    if (store.activeCategory) params.set('cat', store.activeCategory)
    if (store.wcMode) params.set('wc', '1')
    const qs = params.toString()
    window.history.replaceState({}, '', qs ? `?${qs}` : window.location.pathname)
  }, [store.activeNations, store.activeBorough, store.activeCategory, store.wcMode])

  useEffect(() => { syncUrl() }, [syncUrl])

  function copyFilterLink() {
    navigator.clipboard.writeText(window.location.href)
    setFilterCopied(true)
    setTimeout(() => setFilterCopied(false), 2200)
  }

  // Filter events
  const filtered = events.filter(e => {
    if (store.activeCategory && e.category !== store.activeCategory) return false
    if (store.activeBorough && e.location_name) {
      // borough filter is soft — only filter if location matches
    }
    if (store.wcMode && store.activeNations.length > 0 && e.game_id) {
      const match = getMatchForEvent(e)
      if (match) {
        const plays = store.activeNations.includes(match.teamA.code) ||
                      store.activeNations.includes(match.teamB.code)
        if (!plays) return false
      }
    }
    return true
  })

  const grouped = groupByDate(filtered)

  const showNationChips = store.wcMode || store.activeCategory === 'watch_party'

  if (showIntake) {
    return (
      <>
        <div style={{ minHeight: '100dvh', background: 'var(--c-bg)' }}>
          <Navbar />
        </div>
        <IntakeModal
          onDone={() => {
            setShowIntake(false)
            router.refresh()
          }}
          onSkip={() => setShowIntake(false)}
        />
      </>
    )
  }

  return (
    <div style={{ minHeight: '100dvh', background: store.wcMode ? '#0E0E0E' : 'var(--c-bg)' }}>
      {/* WC mode accent bar */}
      {store.wcMode && (
        <div
          style={{
            height: 3,
            background: `linear-gradient(90deg, var(--c-gold) 0%, var(--c-red) 50%, var(--c-gold) 100%)`,
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s linear infinite',
          }}
        />
      )}

      <Navbar />

      {/* Page header */}
      <div
        style={{
          borderBottom: '1px solid var(--c-border)',
          padding: '20px 24px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--c-text)',
              textTransform: 'uppercase',
            }}
          >
            Events
          </h1>

          {/* WC MODE toggle */}
          <button
            onClick={() => store.setWcMode(!store.wcMode)}
            style={{
              padding: '5px 12px',
              borderRadius: 4,
              border: store.wcMode
                ? '1.5px solid var(--c-gold)'
                : '1.5px solid var(--c-border-emphasis)',
              background: store.wcMode ? 'rgba(255,218,68,0.12)' : 'transparent',
              color: store.wcMode ? 'var(--c-gold)' : 'var(--c-text-muted)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.1em',
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              textTransform: 'uppercase',
              transition: 'all 0.2s',
            }}
          >
            ⚽ WC 2026
          </button>
        </div>

        {/* Save filter */}
        <button
          onClick={copyFilterLink}
          title="Copy shareable filter link"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 4,
            border: '1.5px solid var(--c-border)',
            background: 'transparent',
            color: filterCopied ? 'var(--c-green)' : 'rgba(255,255,255,0.65)',
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-body)',
            cursor: 'pointer',
            transition: 'color 0.2s, border-color 0.2s',
          }}
        >
          {filterCopied
            ? <><Check size={11} strokeWidth={2.5} /> COPIED</>
            : <><Share2 size={11} strokeWidth={2} /> SAVE FILTER</>
          }
        </button>
      </div>

      {/* 3-col layout */}
      <div
        style={{
          display: 'flex',
          maxWidth: 1280,
          margin: '0 auto',
          minHeight: 'calc(100dvh - 120px)',
        }}
      >
        {/* Left: filter sidebar */}
        <aside
          style={{
            width: 256,
            borderRight: '1px solid var(--c-border)',
            padding: '20px 0',
            flexShrink: 0,
            display: isMobile ? 'none' : 'block',
          }}
        >
          {/* Borough filter */}
          <FilterGroup
            label="Borough"
            items={BOROUGHS.map(b => ({ key: b, label: b }))}
            activeKey={store.activeBorough}
            onSelect={store.setActiveBorough}
            getCount={b => events.filter(e => e.location_name?.toLowerCase().includes(b.toLowerCase())).length}
          />

          {/* Event type filter */}
          <FilterGroup
            label="Event Type"
            items={CATEGORIES.map(c => ({ key: c.key, label: c.label }))}
            activeKey={store.activeCategory}
            onSelect={k => store.setActiveCategory(k as typeof store.activeCategory)}
            getCount={k => events.filter(e => e.category === k).length}
            getColor={k => getCategoryMeta(k).color}
          />

          {/* Clear */}
          {(store.activeCategory || store.activeBorough || store.wcMode) && (
            <button
              onClick={() => {
                store.setActiveCategory(null)
                store.setActiveBorough(null)
                store.setWcMode(false)
                store.setActiveNations([])
              }}
              style={{
                margin: '20px 20px 0',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.06em',
                color: 'var(--c-text-subtle)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-body)',
                textDecoration: 'underline',
                textUnderlineOffset: 3,
              }}
            >
              Clear all filters
            </button>
          )}
        </aside>

        {/* Center: event list */}
        <main style={{ flex: 1, minWidth: 0, padding: '0' }}>
          {/* Nation chips — only when WC mode or watch party category */}
          {showNationChips && (
            <div
              style={{
                padding: '12px 20px',
                borderBottom: '1px solid var(--c-border)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flexWrap: 'wrap',
                background: store.wcMode ? 'rgba(255,218,68,0.04)' : 'transparent',
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: store.wcMode ? 'var(--c-gold)' : 'rgba(255,255,255,0.65)',
                  fontFamily: 'var(--font-body)',
                  flexShrink: 0,
                }}
              >
                Nations:
              </span>
              {NATIONS.map(n => {
                const on = store.activeNations.includes(n.code)
                return (
                  <button
                    key={n.code}
                    onClick={() =>
                      store.setActiveNations(
                        on
                          ? store.activeNations.filter(c => c !== n.code)
                          : [...store.activeNations, n.code]
                      )
                    }
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '4px 10px 4px 8px',
                      borderRadius: 'var(--radius-pill)',
                      border: `1.5px solid ${on ? 'var(--c-gold)' : 'var(--c-border-emphasis)'}`,
                      background: on ? 'rgba(255,218,68,0.12)' : 'transparent',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      fontSize: 11,
                      fontWeight: 700,
                      color: on ? 'var(--c-gold)' : 'var(--c-text-muted)',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: 14 }}>{n.flag}</span>
                    {n.short}
                  </button>
                )
              })}
            </div>
          )}

          {/* Event list */}
          <div style={{ padding: '0' }}>
            {grouped.length === 0 ? (
              <div
                style={{
                  padding: '64px 24px',
                  textAlign: 'center',
                  color: 'var(--c-text-muted)',
                  fontSize: 14,
                }}
              >
                No events match your filters — check back soon.
              </div>
            ) : (
              grouped.map(([date, dayEvents]) => (
                <div key={date}>
                  {/* Date header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      padding: '16px 20px 10px',
                      borderBottom: '1px solid var(--c-border)',
                      position: 'sticky',
                      top: 0,
                      background: store.wcMode ? '#0E0E0E' : 'var(--c-bg)',
                      zIndex: 10,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 13,
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        color: 'var(--c-text)',
                      }}
                    >
                      {fmtDateShort(date).toUpperCase()}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        color: store.wcMode ? 'var(--c-gold)' : 'rgba(255,255,255,0.5)',
                        textTransform: 'uppercase',
                        fontFamily: 'var(--font-body)',
                      }}
                    >
                      {relativeDay(date)}
                    </span>
                  </div>

                  {/* Events for this day */}
                  {dayEvents.map(ev => (
                    <EventCard
                      key={ev.id}
                      event={ev}
                      match={getMatchForEvent(ev)}
                      wcMode={store.wcMode}
                      selected={selectedEvent?.id === ev.id}
                      onOpen={() => setSelectedEvent(ev)}
                    />
                  ))}
                </div>
              ))
            )}
          </div>
        </main>

        {/* Right: detail panel (desktop only) */}
        {!isMobile && (
          <aside
            style={{
              width: 320,
              borderLeft: '1px solid var(--c-border)',
              flexShrink: 0,
              position: 'sticky',
              top: 0,
              height: '100dvh',
              overflowY: 'auto',
            }}
          >
            <EventDetail event={selectedEvent} wcMode={store.wcMode} />
          </aside>
        )}
      </div>

      {/* Mobile drawer (Vaul) */}
      {isMobile && (
        <Drawer.Root
          open={!!selectedEvent}
          onOpenChange={open => { if (!open) setSelectedEvent(null) }}
        >
          <Drawer.Portal>
            <Drawer.Overlay
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.65)',
                zIndex: 100,
              }}
            />
            <Drawer.Content
              style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 101,
                background: 'var(--c-surface)',
                borderRadius: '20px 20px 0 0',
                maxHeight: '88dvh',
                overflowY: 'auto',
                outline: 'none',
              }}
            >
              <Drawer.Handle
                style={{
                  width: 36,
                  height: 4,
                  borderRadius: 2,
                  background: 'var(--c-border-emphasis)',
                  margin: '12px auto 0',
                  display: 'block',
                }}
              />
              <EventDetail event={selectedEvent} wcMode={store.wcMode} />
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      )}

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--c-border)',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.38)',
            fontFamily: 'var(--font-body)',
          }}
        >
          P96 IS THE PLACE
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <a
            href="mailto:info@p96.nyc"
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.38)',
              fontFamily: 'var(--font-body)',
              textDecoration: 'none',
            }}
          >
            STAY IN TOUCH
          </a>
          <button
            onClick={() => {
              document.cookie = 'p96_intake=; path=/; max-age=0'
              window.location.reload()
            }}
            title="Reset intake cookie (dev)"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              color: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
          >
            <RotateCcw size={12} strokeWidth={2} />
          </button>
        </div>
      </footer>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 0% }
          100% { background-position: 200% 0% }
        }
      `}</style>
    </div>
  )
}

// ─── FilterGroup ─────────────────────────────────────────────────────────────

const SHOW_MAX = 6

function FilterGroup({
  label,
  items,
  activeKey,
  onSelect,
  getCount,
  getColor,
}: {
  label: string
  items: { key: string; label: string }[]
  activeKey: string | null
  onSelect: (key: string | null) => void
  getCount: (key: string) => number
  getColor?: (key: string) => string
}) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? items : items.slice(0, SHOW_MAX)
  const hidden = items.length - SHOW_MAX

  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.65)',
          padding: '0 16px',
          marginBottom: 10,
          fontFamily: 'var(--font-body)',
        }}
      >
        {label}
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          padding: '0 16px',
        }}
      >
        {visible.map(item => {
          const on = activeKey === item.key
          const color = getColor?.(item.key) ?? 'var(--c-text)'
          const count = getCount(item.key)
          return (
            <button
              key={item.key}
              onClick={() => onSelect(on ? null : item.key)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 10px',
                borderRadius: 4,
                border: on
                  ? `1.5px solid ${color}`
                  : '1.5px solid rgba(255,255,255,0.18)',
                background: on ? `${color}18` : 'transparent',
                color: on ? color : 'rgba(255,255,255,0.72)',
                fontSize: 12,
                fontWeight: on ? 700 : 500,
                fontFamily: 'var(--font-body)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.12s',
              }}
            >
              {item.label}
              <span style={{ fontSize: 10, opacity: 0.55 }}>({count})</span>
            </button>
          )
        })}
      </div>

      {items.length > SHOW_MAX && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            display: 'block',
            margin: '8px 16px 0',
            fontSize: 11,
            fontWeight: 600,
            color: 'rgba(255,255,255,0.5)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.04em',
            padding: 0,
          }}
        >
          {expanded
            ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>Show less <ChevronUp size={11} strokeWidth={2} /></span>
            : `+${hidden} more`
          }
        </button>
      )}
    </div>
  )
}
