'use client'

import { Event } from '@/lib/supabase'

const TYPE = {
  p96_wc: { label: 'P96 × WORLD CUP', color: 'var(--c-gold)' },
  community: { label: 'COMMUNITY', color: 'var(--c-green)' },
  p96: { label: 'P96', color: 'var(--c-text-muted)' },
}

function fmtDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })
}

function fmtTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

export default function EventDrawer({ event, onClose }: { event: Event | null; onClose: () => void }) {
  const open = event !== null

  return (
    <>
      {/* Scrim */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.65)',
          zIndex: 50,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s',
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 51,
          background: 'var(--c-surface)',
          borderRadius: '20px 20px 0 0',
          maxHeight: '88dvh',
          overflowY: 'auto',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.32s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--c-border-emphasis)', margin: '12px auto 0' }} />

        {event && <DrawerContent event={event} onClose={onClose} />}
      </div>
    </>
  )
}

function DrawerContent({ event }: { event: Event; onClose: () => void }) {
  const cfg = TYPE[event.type]

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

      {/* Tag */}
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: cfg.color, marginBottom: 'var(--space-2)' }}>
        {cfg.label}
      </div>

      {/* Title */}
      <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 'var(--space-4)' }}>
        {event.title}
      </h2>

      {/* Meta */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', fontSize: 14, color: 'var(--c-text-muted)' }}>
        <span>📅 {fmtDate(event.date)}{event.time ? ` · ${fmtTime(event.time)}` : ''}</span>
        {event.location_name && <span>📍 {event.location_name}</span>}
        {event.location_address && <span style={{ fontSize: 12 }}>{event.location_address}</span>}
      </div>

      {/* Description */}
      {event.description && (
        <p style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--c-text-muted)', marginBottom: 'var(--space-6)' }}>
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
            background: cfg.color === 'var(--c-gold)' ? 'var(--c-gold)' : cfg.color === 'var(--c-green)' ? 'var(--c-green)' : 'var(--c-surface2)',
            color: '#000',
            borderRadius: 'var(--radius-pill)',
            fontSize: 15,
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: 'var(--space-4)',
            textDecoration: 'none',
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
              style={{ fontSize: 13, color: 'var(--c-text-muted)', textDecoration: 'underline', textUnderlineOffset: 3 }}
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
