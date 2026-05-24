'use client'

import { Clock, MapPin, Lock } from 'lucide-react'
import { Event, getCategoryMeta } from '@/lib/supabase'
import { Match } from '@/data/matches'

function fmtDateHeader(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00')
    .toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    .toUpperCase()
}

function fmtTime(t: string): string {
  const [h, m] = t.split(':').map(Number)
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'} EST`
}

interface DateCardsPanelProps {
  date: string
  events: Event[]
  isLocked: boolean
  onGetNotified: () => void
  getMatch: (event: Event) => Match | null
  label?: string
}

export default function DateCardsPanel({
  date, events, isLocked, onGetNotified, getMatch, label,
}: DateCardsPanelProps) {
  const formattedDate = fmtDateHeader(date)
  const visibleEvents = events.slice(0, 3)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Panel header */}
      <div
        style={{
          padding: '18px 24px 16px',
          borderBottom: '1px solid var(--c-border)',
          flexShrink: 0,
        }}
      >
        {label && (
          <div
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: 'var(--c-gold)',
              fontFamily: 'var(--font-body)',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            {label}
          </div>
        )}
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--c-text)',
          }}
        >
          {formattedDate}
        </h2>
      </div>

      {/* Cards area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 24px 32px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          alignContent: 'flex-start',
        }}
      >
        {isLocked ? (
          <LockedCard onGetNotified={onGetNotified} />
        ) : visibleEvents.length === 0 ? (
          <div
            style={{
              color: 'var(--c-text-subtle)',
              fontSize: 13,
              fontFamily: 'var(--font-body)',
              paddingTop: 8,
            }}
          >
            No events match your current filter.
          </div>
        ) : (
          visibleEvents.map(event => (
            <EventCard key={event.id} event={event} match={getMatch(event)} />
          ))
        )}
      </div>
    </div>
  )
}

function EventCard({ event, match }: { event: Event; match: Match | null }) {
  const meta = getCategoryMeta(event.category)

  return (
    <div
      style={{
        flex: '1 1 240px',
        maxWidth: 320,
        background: 'var(--c-surface)',
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--c-border)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Image / color block */}
      <div
        style={{
          height: 160,
          background: event.flier_url
            ? `url(${event.flier_url}) center/cover no-repeat`
            : `linear-gradient(145deg, ${meta.color}18 0%, ${meta.color}06 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          borderBottom: '1px solid var(--c-border)',
          flexShrink: 0,
        }}
      >
        {!event.flier_url && (
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 36,
              fontWeight: 800,
              color: meta.color,
              opacity: 0.2,
              letterSpacing: '-0.04em',
            }}
          >
            P96
          </span>
        )}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            padding: '3px 8px',
            borderRadius: 3,
            background: `${meta.color}22`,
            border: `1px solid ${meta.color}44`,
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: meta.color,
            fontFamily: 'var(--font-body)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {meta.label}
        </div>
      </div>

      {/* Card content */}
      <div
        style={{
          padding: '14px 16px 16px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {match && (
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: 'var(--c-gold)',
              marginBottom: 6,
              fontFamily: 'var(--font-body)',
              letterSpacing: '0.04em',
            }}
          >
            ⚽ {match.teamA.flag} vs {match.teamB.flag} · {match.kickoff}
          </div>
        )}

        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
            color: 'var(--c-text)',
            marginBottom: 10,
            flex: 1,
          }}
        >
          {event.title}
        </h3>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 5,
            marginBottom: 14,
          }}
        >
          {event.time && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 11,
                color: 'var(--c-text-muted)',
                fontFamily: 'var(--font-body)',
              }}
            >
              <Clock size={11} strokeWidth={2} style={{ flexShrink: 0 }} />
              {fmtTime(event.time)}
            </div>
          )}
          {event.location_name && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: 11,
                color: 'var(--c-text-muted)',
                fontFamily: 'var(--font-body)',
              }}
            >
              <MapPin size={11} strokeWidth={2} style={{ flexShrink: 0 }} />
              {event.location_name}
            </div>
          )}
        </div>

        {event.rsvp_url ? (
          <a
            href={event.rsvp_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'block',
              padding: '10px',
              borderRadius: 6,
              background: 'var(--c-gold)',
              color: '#000',
              fontSize: 11,
              fontWeight: 800,
              textAlign: 'center',
              textDecoration: 'none',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            RSVP →
          </a>
        ) : (
          <div
            style={{
              padding: '10px',
              borderRadius: 6,
              border: '1px solid var(--c-border)',
              color: 'var(--c-text-subtle)',
              fontSize: 11,
              textAlign: 'center',
              fontFamily: 'var(--font-body)',
            }}
          >
            Free entry — no RSVP needed
          </div>
        )}
      </div>
    </div>
  )
}

function LockedCard({ onGetNotified }: { onGetNotified: () => void }) {
  return (
    <div
      style={{
        flex: '1 1 240px',
        maxWidth: 320,
        background: 'var(--c-surface)',
        borderRadius: 'var(--radius-card)',
        border: '1px solid var(--c-border-emphasis)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          height: 160,
          background: 'var(--c-surface2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          borderBottom: '1px solid var(--c-border)',
          flexShrink: 0,
        }}
      >
        <Lock size={24} strokeWidth={1.5} style={{ color: 'var(--c-text-subtle)' }} />
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: '0.16em',
            color: 'var(--c-text-subtle)',
            textTransform: 'uppercase',
          }}
        >
          DROPPING SOON
        </span>
      </div>

      <div style={{ padding: '16px 16px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: 'var(--c-text)',
            marginBottom: 8,
          }}
        >
          Something&apos;s cooking.
        </h3>
        <p
          style={{
            fontSize: 12,
            color: 'var(--c-text-muted)',
            lineHeight: 1.5,
            marginBottom: 16,
            fontFamily: 'var(--font-body)',
            flex: 1,
          }}
        >
          Drop your email to get first access when this event drops.
        </p>
        <button
          onClick={onGetNotified}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: 6,
            background: 'var(--c-surface2)',
            border: '1px solid var(--c-border-emphasis)',
            color: 'var(--c-text)',
            fontSize: 11,
            fontWeight: 800,
            textAlign: 'center',
            cursor: 'pointer',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            transition: 'background 0.12s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--c-surface2)')}
        >
          GET NOTIFIED →
        </button>
      </div>
    </div>
  )
}
