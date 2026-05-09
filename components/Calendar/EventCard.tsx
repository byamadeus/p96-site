'use client'

import { Event, getCategoryMeta } from '@/lib/supabase'
import { Match } from '@/data/matches'

function fmtTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

interface EventCardProps {
  event: Event
  match?: Match | null
  wcMode?: boolean
  selected?: boolean
  onOpen: () => void
}

export default function EventCard({ event, match, wcMode, selected, onOpen }: EventCardProps) {
  const meta = getCategoryMeta(event.category)
  const isWatchParty = event.category === 'watch_party'

  return (
    <div
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onOpen()}
      style={{
        padding: '14px 20px',
        borderBottom: '1px solid var(--c-border)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        background: selected
          ? 'rgba(255,255,255,0.04)'
          : isWatchParty && wcMode
          ? 'rgba(255,218,68,0.03)'
          : 'transparent',
        borderLeft: selected
          ? `2px solid ${meta.color}`
          : isWatchParty && wcMode
          ? '2px solid rgba(255,218,68,0.4)'
          : '2px solid transparent',
        transition: 'background 0.12s',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Game badge */}
        {match && (
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: wcMode ? 'var(--c-gold)' : 'var(--c-text-subtle)',
              marginBottom: 3,
              fontFamily: 'var(--font-body)',
              textTransform: 'uppercase',
            }}
          >
            ⚽ {match.teamA.flag}{match.teamA.name} vs {match.teamB.flag}{match.teamB.name} · {match.kickoff}
          </div>
        )}

        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--c-text)',
              lineHeight: 1.3,
              fontFamily: 'var(--font-body)',
            }}
          >
            {event.title}
          </span>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: meta.color,
              flexShrink: 0,
              fontFamily: 'var(--font-body)',
            }}
          >
            {meta.label}
          </span>
        </div>

        {/* Meta */}
        <div
          style={{
            fontSize: 12,
            color: 'var(--c-text-muted)',
            marginTop: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            flexWrap: 'wrap',
          }}
        >
          {event.time && <span>{fmtTime(event.time)}</span>}
          {event.time && event.location_name && <span style={{ opacity: 0.4 }}>·</span>}
          {event.location_name && <span>{event.location_name}</span>}
        </div>
      </div>

      {/* Location chip */}
      {event.location_name && (
        <div
          style={{
            flexShrink: 0,
            padding: '5px 10px',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--c-border)',
            fontSize: 11,
            fontWeight: 500,
            color: 'var(--c-text-muted)',
            fontFamily: 'var(--font-body)',
            whiteSpace: 'nowrap',
            maxWidth: 120,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {event.location_name}
        </div>
      )}
    </div>
  )
}
