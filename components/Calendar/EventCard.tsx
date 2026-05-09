'use client'

import { Event } from '@/lib/supabase'

const TYPE = {
  p96_wc: { label: 'P96 × WORLD CUP', color: 'var(--c-gold)', bg: 'rgba(245,200,66,0.07)', border: 'var(--c-gold)' },
  community: { label: 'COMMUNITY', color: 'var(--c-green)', bg: 'rgba(26,127,60,0.07)', border: 'var(--c-green)' },
  p96: { label: 'P96', color: 'var(--c-text-muted)', bg: 'var(--c-surface)', border: 'var(--c-border)' },
}

function fmtDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function fmtTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

export default function EventCard({ event, onOpen }: { event: Event; onOpen: () => void }) {
  const cfg = TYPE[event.type]

  return (
    <div
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onOpen()}
      style={{
        background: cfg.bg,
        border: `1.5px solid ${cfg.border}`,
        borderRadius: 'var(--radius-card)',
        padding: 'var(--space-4)',
        marginBottom: 'var(--space-3)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-1)',
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: cfg.color,
        }}
      >
        {cfg.label}
      </div>

      <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.2, color: 'var(--c-text)' }}>
        {event.title}
      </div>

      <div style={{ fontSize: 13, color: 'var(--c-text-muted)' }}>
        {fmtDate(event.date)}
        {event.time ? ` · ${fmtTime(event.time)}` : ''}
        {event.location_name ? ` · ${event.location_name}` : ''}
      </div>

      {event.rsvp_url && (
        <div style={{ fontSize: 12, fontWeight: 700, color: cfg.color, marginTop: 'var(--space-1)' }}>
          RSVP →
        </div>
      )}
    </div>
  )
}
