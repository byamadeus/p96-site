'use client'

import { useState, useRef, useEffect } from 'react'
import { Lock } from 'lucide-react'
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
  onIdxChange?: (idx: number, total: number) => void
}

export default function EventCarousel({
  date, events, isLocked, onGetNotified, getMatch, light = false, mobile = false, onIdxChange,
}: EventCarouselProps) {
  const [idx, setIdx] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLDivElement>(null)

  const cards = isLocked ? [] : events
  const dateLabel = fmtDateLabel(date)

  // Scroll active card into center whenever idx changes
  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }, [idx])

  function navigate(newIdx: number) {
    setIdx(newIdx)
    onIdxChange?.(newIdx, cards.length)
  }

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
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', color: '#999' }}>
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
          No events
        </span>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <style>{`
        .ec-track::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Peek strip — all cards visible, active centered + larger */}
      <div style={{ flex: 1, position: 'relative' }}>
        <div
          ref={trackRef}
          className="ec-track"
          onScroll={() => {
            const track = trackRef.current
            if (!track) return
            const center = track.scrollLeft + track.clientWidth / 2
            let closest = 0
            let minDist = Infinity
            Array.from(track.children).forEach((child, i) => {
              const el = child as HTMLElement
              const childCenter = el.offsetLeft + el.offsetWidth / 2
              const dist = Math.abs(childCenter - center)
              if (dist < minDist) { minDist = dist; closest = i }
            })
            if (closest !== idx) {
              setIdx(closest)
              onIdxChange?.(closest, cards.length)
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            padding: '24px calc(50% - 150px) 32px',
            scrollSnapType: 'x mandatory',
            boxSizing: 'border-box',
          } as React.CSSProperties}
        >
          {cards.map((event, i) => {
            const isActive = i === idx
            return (
              <div
                key={event.id ?? i}
                ref={isActive ? activeRef : null}
                onClick={() => !isActive && navigate(i)}
                style={{
                  flexShrink: 0,
                  scrollSnapAlign: 'center',
                  transform: isActive ? 'scale(1)' : 'scale(0.88)',
                  opacity: isActive ? 1 : 0.6,
                  transition: 'transform var(--duration-base) var(--ease-out), opacity var(--duration-base) var(--ease-out)',
                  cursor: isActive ? 'default' : 'pointer',
                  transformOrigin: 'center center',
                }}
              >
                <EventCard event={event} match={getMatch(event)} focal />
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom — date label + dots */}
      {!mobile && (
        <div style={{
          padding: '0 24px 28px',
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
                <button key={i} onClick={() => navigate(i)} style={{
                  width: i === idx ? 20 : 6, height: 6,
                  borderRadius: 3,
                  background: i === idx
                    ? (light ? '#111' : '#fff')
                    : (light ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.25)'),
                  border: 'none', cursor: 'pointer', padding: 0,
                  transition: 'all var(--duration-base) var(--ease-out)',
                }} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
