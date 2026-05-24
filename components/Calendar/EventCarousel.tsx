'use client'

import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react'
import { Event } from '@/lib/supabase'
import { Match } from '@/data/matches'
import EventCard, { WhiteCard, CardBody } from './EventCard'

function fmtDateLabel(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00')
    .toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    .toUpperCase()
}

interface EventCarouselProps {
  date: string
  events: Event[]
  isLocked: boolean
  onGetNotified: () => void
  getMatch: (e: Event) => Match | null
  light?: boolean
  mobile?: boolean
}

export default function EventCarousel({
  date, events, isLocked, onGetNotified, getMatch, light = false, mobile = false,
}: EventCarouselProps) {
  const [idx, setIdx] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const cards = isLocked ? [] : events
  const canPrev = idx > 0
  const canNext = idx < cards.length - 1

  const dateLabel = fmtDateLabel(date)

  const arrowStyle = (enabled: boolean, side: 'left' | 'right'): React.CSSProperties => ({
    position: 'absolute',
    [side]: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 40, height: 40,
    borderRadius: '50%',
    border: `1.5px solid ${enabled
      ? (light ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.25)')
      : (light ? 'rgba(0,0,0,0.07)' : 'rgba(255,255,255,0.06)')}`,
    background: enabled
      ? (light ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)')
      : 'transparent',
    color: enabled
      ? (light ? '#111' : '#fff')
      : (light ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)'),
    cursor: enabled ? 'pointer' : 'default',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'all 0.15s',
    zIndex: 2,
  })

  if (isLocked) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <WhiteCard style={{ width: 300, maxWidth: '90vw' }}>
          <div style={{
            height: 220, background: '#F0F0F0',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            <Lock size={28} strokeWidth={1.5} style={{ color: '#999' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#999' }}>
              DROPPING SOON
            </span>
          </div>
          <CardBody>
            <h3 style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.03em', color: '#111', marginBottom: 8, lineHeight: 1.1 }}>
              Something&apos;s cooking.
            </h3>
            <p style={{ fontSize: 13, color: '#666', lineHeight: 1.5, marginBottom: 20, fontFamily: 'var(--font-body)' }}>
              Drop your email to get first access when this drops.
            </p>
            <button onClick={onGetNotified} style={{
              width: '100%', padding: '13px',
              background: '#111', color: '#fff',
              border: 'none', borderRadius: 8,
              fontSize: 13, fontWeight: 800,
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.04em', textTransform: 'uppercase',
              cursor: 'pointer',
            }}>
              GET NOTIFIED →
            </button>
          </CardBody>
        </WhiteCard>
      </div>
    )
  }

  if (cards.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{
          fontSize: 12, fontWeight: 600, letterSpacing: '0.08em',
          textTransform: 'uppercase', fontFamily: 'var(--font-body)',
          color: light ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)',
        }}>
          No events match filter
        </span>
      </div>
    )
  }

  const prevEvent = canPrev ? cards[idx - 1] : null
  const currEvent = cards[idx]
  const nextEvent = canNext ? cards[idx + 1] : null

  function handleMobileScroll() {
    const el = scrollRef.current
    if (!el) return
    const i = Math.round(el.scrollLeft / el.clientWidth)
    setIdx(i)
  }

  // ── Mobile: full-width scroll-snap carousel ──────────────────────
  if (mobile) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <style>{`.ec-mobile-scroll::-webkit-scrollbar { display: none }`}</style>
        <div
          ref={scrollRef}
          onScroll={handleMobileScroll}
          className="ec-mobile-scroll"
          style={{
            flex: 1,
            display: 'flex',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
          }}
        >
          {cards.map((event, i) => (
            <div
              key={event.id ?? i}
              style={{
                minWidth: '100%',
                scrollSnapAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px 24px',
                boxSizing: 'border-box',
              }}
            >
              <EventCard event={event} match={getMatch(event)} focal />
            </div>
          ))}
        </div>

        {/* Dots + date */}
        <div style={{
          padding: '12px 24px 28px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 8, flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 800,
            letterSpacing: '0.06em', textTransform: 'uppercase',
            color: 'rgba(0,0,0,0.4)',
          }}>
            {dateLabel}
          </span>
          {cards.length > 1 && (
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {cards.map((_, i) => (
                <button key={i} onClick={() => {
                  scrollRef.current?.scrollTo({ left: i * (scrollRef.current?.clientWidth ?? 0), behavior: 'smooth' })
                  setIdx(i)
                }} style={{
                  width: i === idx ? 20 : 6, height: 6,
                  borderRadius: 3,
                  background: i === idx ? '#111' : 'rgba(0,0,0,0.2)',
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'all 0.2s',
                }} />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Card stage */}
      <div style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 64px 8px',
        overflow: 'hidden',
      }}>
        {/* Left arrow — outside card group */}
        <button
          onClick={() => canPrev && setIdx(i => i - 1)}
          disabled={!canPrev}
          style={arrowStyle(canPrev, 'left')}
        >
          <ChevronLeft size={18} strokeWidth={2} />
        </button>

        {/* Cards row — all full opacity, no scaling */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {prevEvent && (
            <div style={{ cursor: 'pointer' }} onClick={() => setIdx(i => i - 1)}>
              <EventCard event={prevEvent} match={getMatch(prevEvent)} />
            </div>
          )}
          {currEvent && (
            <EventCard event={currEvent} match={getMatch(currEvent)} focal />
          )}
          {nextEvent && (
            <div style={{ cursor: 'pointer' }} onClick={() => setIdx(i => i + 1)}>
              <EventCard event={nextEvent} match={getMatch(nextEvent)} />
            </div>
          )}
        </div>

        {/* Right arrow — outside card group */}
        <button
          onClick={() => canNext && setIdx(i => i + 1)}
          disabled={!canNext}
          style={arrowStyle(canNext, 'right')}
        >
          <ChevronRight size={18} strokeWidth={2} />
        </button>
      </div>

      {/* Bottom — date label + dots */}
      <div style={{
        padding: '12px 24px 28px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 8, flexShrink: 0,
      }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 800,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: light ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.55)',
        }}>
          {dateLabel}
        </span>
        {cards.length > 1 && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {cards.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} style={{
                width: i === idx ? 20 : 6, height: 6,
                borderRadius: 3,
                background: i === idx
                  ? (light ? '#111' : '#fff')
                  : (light ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.25)'),
                border: 'none', cursor: 'pointer', padding: 0,
                transition: 'all 0.2s',
              }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

