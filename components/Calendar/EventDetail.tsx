'use client'

import { Event, getCategoryMeta } from '@/lib/supabase'
import { Match } from '@/data/matches'

function fmtDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })
}

function fmtTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

interface EventDetailProps {
  event: Event | null
  match?: Match | null
  wcMode?: boolean
}

export default function EventDetail({ event, match, wcMode }: EventDetailProps) {
  if (!event) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '48px 24px',
          color: 'var(--c-text-subtle)',
          textAlign: 'center',
          gap: 8,
        }}
      >
        <span style={{ fontSize: 28 }}>⚽</span>
        <p style={{ fontSize: 13, lineHeight: 1.5 }}>
          Select an event to see details
        </p>
      </div>
    )
  }

  const meta = getCategoryMeta(event.category)

  return (
    <div style={{ padding: 'var(--space-6) var(--page-padding) 48px' }}>
      {/* Flier */}
      {event.flier_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={event.flier_url}
          alt={event.title}
          style={{
            width: '100%',
            borderRadius: 'var(--radius-card)',
            marginBottom: 'var(--space-6)',
            aspectRatio: '4/3',
            objectFit: 'cover',
          }}
        />
      )}

      {/* Game badge — if watch party linked to a match */}
      {match && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 6,
            padding: '8px 12px',
            background: wcMode ? 'rgba(255,218,68,0.08)' : 'var(--c-surface2)',
            border: `1px solid ${wcMode ? 'rgba(255,218,68,0.25)' : 'var(--c-border)'}`,
            borderRadius: 'var(--radius-sm)',
            marginBottom: 'var(--space-4)',
          }}
        >
          <span style={{ fontSize: 12 }}>⚽</span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: wcMode ? 'var(--c-gold)' : 'var(--c-text-muted)',
              letterSpacing: '0.02em',
            }}
          >
            {match.teamA.flag} {match.teamA.name} vs {match.teamB.flag} {match.teamB.name}
          </span>
          <span style={{ fontSize: 11, color: 'var(--c-text-subtle)' }}>
            · {match.kickoff} · {match.city}
          </span>
        </div>
      )}

      {/* Category tag */}
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: meta.color,
          marginBottom: 'var(--space-2)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {meta.label}
      </div>

      {/* Title */}
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 24,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          marginBottom: 'var(--space-4)',
          color: 'var(--c-text)',
        }}
      >
        {event.title}
      </h2>

      {/* Meta */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-6)',
          fontSize: 13,
          color: 'var(--c-text-muted)',
        }}
      >
        <span>📅 {fmtDate(event.date)}{event.time ? ` · ${fmtTime(event.time)}` : ''}</span>
        {event.location_name && <span>📍 {event.location_name}</span>}
        {event.location_address && (
          <span style={{ fontSize: 12 }}>{event.location_address}</span>
        )}
      </div>

      {/* Description */}
      {event.description && (
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.65,
            color: 'var(--c-text-muted)',
            marginBottom: 'var(--space-6)',
          }}
        >
          {event.description}
        </p>
      )}

      {/* RSVP */}
      {event.rsvp_url && (
        <a
          href={event.rsvp_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            width: '100%',
            padding: '16px',
            background: event.category === 'watch_party' ? 'var(--c-gold)' : meta.color,
            color: '#000',
            borderRadius: 'var(--radius-pill)',
            fontSize: 15,
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: 'var(--space-4)',
            textDecoration: 'none',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.01em',
          }}
        >
          RSVP →
        </a>
      )}

      {/* Additional links */}
      {event.additional_links && event.additional_links.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {event.additional_links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 13,
                color: 'var(--c-text-muted)',
                textDecoration: 'underline',
                textUnderlineOffset: 3,
              }}
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
