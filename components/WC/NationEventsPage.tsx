'use client'

import { useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, MapPin, Clock, ExternalLink } from 'lucide-react'
import { Event, getCategoryMeta } from '@/lib/supabase'
import { matches, Match } from '@/data/matches'
import { NATION_BY_CODE } from '@/lib/nations'
import P96Logo from '@/components/Layout/P96Logo'

const NATION_GRADIENTS: Record<string, [string, string]> = {
  MA: ['#C1121F', '#6B0F14'],
  GH: ['#006B3F', '#FCD20F'],
  SN: ['#00853F', '#E31E24'],
  DZ: ['#006233', '#004D28'],
  EG: ['#CE1126', '#1A1A1A'],
  TN: ['#E70013', '#8B000B'],
  CI: ['#F77F00', '#009A44'],
  CD: ['#007FFF', '#CE1020'],
  ZA: ['#007A4D', '#FFB612'],
  CV: ['#003893', '#CF2027'],
  HT: ['#00209F', '#D21034'],
  CW: ['#002395', '#F9C012'],
}

function formatStepperDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    .toUpperCase()
}

function formatCardDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    .toUpperCase()
}

function formatTime(timeStr: string | null): string {
  if (!timeStr) return ''
  const [h, m] = timeStr.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm} EST`
}

function getEventsForNation(events: Event[], nationCode: string): Event[] {
  const upper = nationCode.toUpperCase()
  return events
    .filter(event => {
      if (event.game_id) {
        const match = matches.find((m: Match) => m.id === event.game_id)
        if (!match) return false
        return match.teamA.code === upper || match.teamB.code === upper
      }
      return event.category !== 'watch_party'
    })
    .sort((a, b) => a.date.localeCompare(b.date))
}

interface EventCardProps {
  event: Event
}

function EventCard({ event }: EventCardProps) {
  const catMeta = getCategoryMeta(event.category)

  return (
    <div
      style={{
        flex: '0 0 100%',
        scrollSnapAlign: 'start',
        display: 'flex',
        flexDirection: 'column',
        padding: '0 16px',
        height: '100%',
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
        }}
      >
        {/* Flier hero — 46% of card */}
        <div
          style={{
            background: event.flier_url
              ? `url(${event.flier_url}) center/cover no-repeat`
              : `linear-gradient(135deg, ${catMeta.color}2A 0%, ${catMeta.color}0A 100%)`,
            flexShrink: 0,
            height: '46%',
          }}
        />

        {/* Content */}
        <div style={{
          flex: 1,
          padding: '20px 20px 24px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
        }}>
          {/* Row: category pill + date */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 14,
            gap: 8,
          }}>
            <span
              style={{
                background: catMeta.color + '18',
                color: catMeta.color,
                border: `1px solid ${catMeta.color}33`,
                padding: '4px 11px',
                borderRadius: 'var(--radius-pill)',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase' as const,
                flexShrink: 0,
              }}
            >
              {catMeta.label}
            </span>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              fontWeight: 500,
              color: '#888',
              textAlign: 'right',
            }}>
              {formatCardDate(event.date)}
            </span>
          </div>

          {/* Title */}
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(22px, 6vw, 30px)',
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              color: '#111',
              marginBottom: 16,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            } as React.CSSProperties}
          >
            {event.title}
          </h2>

          {/* Meta */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 22 }}>
            {event.time && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={14} color="#999" strokeWidth={2} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 500, color: '#555' }}>
                  {formatTime(event.time)}
                </span>
              </div>
            )}
            {event.location_name && (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <MapPin size={14} color="#999" strokeWidth={2} style={{ marginTop: 3, flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 500, color: '#555' }}>
                  {event.location_name}
                  {event.location_address ? ` · ${event.location_address}` : ''}
                </span>
              </div>
            )}
          </div>

          {/* RSVP */}
          <div style={{ marginTop: 'auto' }}>
            {event.rsvp_url ? (
              <a
                href={event.rsvp_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#111',
                  color: '#fff',
                  padding: '13px 26px',
                  borderRadius: 'var(--radius-pill)',
                  fontFamily: 'var(--font-display)',
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'background 0.15s, transform 0.15s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#333'
                  e.currentTarget.style.transform = 'scale(1.02)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#111'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                RSVP
                <ExternalLink size={14} strokeWidth={2.5} />
              </a>
            ) : (
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: '#aaa' }}>
                Free entry — no RSVP needed
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface Props {
  events: Event[]
  countryCode: string
}

const CARD_AREA_HEIGHT = 'calc(100dvh - 57px - 60px - 32px)'

export default function NationEventsPage({ events, countryCode }: Props) {
  const upper = countryCode.toUpperCase()
  const nation = NATION_BY_CODE[upper]
  const filtered = getEventsForNation(events, upper)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  const [gradStart, gradEnd] = NATION_GRADIENTS[upper] ?? ['#1a1a1a', '#0e0e0e']

  const scrollTo = useCallback((idx: number) => {
    const el = scrollRef.current
    if (!el) return
    const target = Math.max(0, Math.min(idx, filtered.length - 1))
    el.scrollTo({ left: el.offsetWidth * target, behavior: 'smooth' })
    setActiveIdx(target)
  }, [filtered.length])

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const idx = Math.round(el.scrollLeft / el.offsetWidth)
    setActiveIdx(idx)
  }, [])

  const activeDate = filtered[activeIdx]?.date
  const stepperDate = activeDate ? formatStepperDate(activeDate) : null

  if (!nation) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0e0e0e' }}>
        <p style={{ color: '#fff', fontFamily: 'var(--font-body)' }}>Country not found.</p>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100dvh',
      background: `linear-gradient(160deg, ${gradStart}, ${gradEnd})`,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header — no border, white text, centered logo */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: '14px 16px',
        flexShrink: 0,
      }}>
        {/* Left: back + country */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link
            href="/wc2026"
            style={{ display: 'flex', alignItems: 'center', color: 'rgba(255,255,255,0.6)', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
          >
            <ArrowLeft size={18} strokeWidth={2} />
          </Link>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: '0.06em',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <span style={{ fontSize: 18 }}>{nation.flag}</span>
            {nation.name.toUpperCase()}
          </span>
        </div>

        {/* Center: P96 logo */}
        <P96Logo color="#ffffff" height={18} />

        {/* Right: event count */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
          }}>
            {filtered.length} EVENT{filtered.length !== 1 ? 'S' : ''}
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          padding: 32,
        }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: '#fff', textAlign: 'center' }}>
            {nation.flag} Coming soon
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.65)', textAlign: 'center', maxWidth: 280 }}>
            No events posted yet for {nation.name}. Check back closer to the tournament.
          </p>
          <Link
            href="/wc2026"
            style={{
              marginTop: 8,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              color: '#fff',
              fontFamily: 'var(--font-display)',
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            <ArrowLeft size={13} />
            Pick another country
          </Link>
        </div>
      ) : (
        <>
          {/* Card area */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px 0 0',
            position: 'relative',
          }}>
            {/* Desktop prev arrow */}
            <button
              onClick={() => scrollTo(activeIdx - 1)}
              disabled={activeIdx === 0}
              aria-label="Previous event"
              style={{
                display: 'none',
                position: 'absolute',
                left: 'calc(50% - 265px)',
                zIndex: 10,
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '50%',
                width: 40,
                height: 40,
                cursor: activeIdx === 0 ? 'default' : 'pointer',
                alignItems: 'center',
                justifyContent: 'center',
                color: activeIdx === 0 ? 'rgba(255,255,255,0.3)' : '#fff',
                transition: 'background 0.15s',
              } as React.CSSProperties}
              className="desktop-arrow"
            >
              <ArrowLeft size={16} strokeWidth={2} />
            </button>

            {/* Scroll container */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              style={{
                width: 'min(440px, 100vw)',
                height: CARD_AREA_HEIGHT,
                display: 'flex',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
                WebkitOverflowScrolling: 'touch',
              } as React.CSSProperties}
            >
              {filtered.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {/* Desktop next arrow */}
            <button
              onClick={() => scrollTo(activeIdx + 1)}
              disabled={activeIdx === filtered.length - 1}
              aria-label="Next event"
              style={{
                display: 'none',
                position: 'absolute',
                right: 'calc(50% - 265px)',
                zIndex: 10,
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '50%',
                width: 40,
                height: 40,
                cursor: activeIdx === filtered.length - 1 ? 'default' : 'pointer',
                alignItems: 'center',
                justifyContent: 'center',
                color: activeIdx === filtered.length - 1 ? 'rgba(255,255,255,0.3)' : '#fff',
                transition: 'background 0.15s',
              } as React.CSSProperties}
              className="desktop-arrow"
            >
              <ArrowRight size={16} strokeWidth={2} />
            </button>
          </div>

          {/* Stepper — date + dots */}
          <div style={{
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            padding: '12px 0 20px',
            height: 60,
          }}>
            {stepperDate && (
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.55)',
                textTransform: 'uppercase',
              }}>
                {stepperDate}
              </span>
            )}
            {filtered.length > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                {filtered.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollTo(i)}
                    aria-label={`Event ${i + 1}`}
                    style={{
                      width: i === activeIdx ? 18 : 5,
                      height: 5,
                      borderRadius: 'var(--radius-pill)',
                      background: i === activeIdx ? '#fff' : 'rgba(255,255,255,0.3)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'width 0.2s, background 0.2s',
                      padding: 0,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
