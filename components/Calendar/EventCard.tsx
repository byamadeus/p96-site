import { Clock, MapPin } from 'lucide-react'
import { Event, getCategoryMeta } from '@/lib/supabase'
import { Match } from '@/data/matches'

export function fmtTime(t: string): string {
  const [h, m] = t.split(':').map(Number)
  return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'} EST`
}

export function WhiteCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 16,
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      boxShadow: '0 8px 40px rgba(0,0,0,0.13)',
      ...style,
    }}>
      {children}
    </div>
  )
}

export function CardBody({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: '18px 20px 22px' }}>{children}</div>
}

export interface EventCardProps {
  event: Event
  match?: Match | null
  focal?: boolean
}

export default function EventCard({ event, match, focal = false }: EventCardProps) {
  const meta = getCategoryMeta(event.category)
  const titleSize = focal ? 22 : 17

  return (
    <WhiteCard style={{ width: 300 }}>
      <div style={{
        aspectRatio: '4/5',
        background: event.flier_url
          ? `url(${event.flier_url}) center/cover no-repeat`
          : '#F2F2F2',
        display: event.flier_url ? undefined : 'flex',
        alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {!event.flier_url && (
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: focal ? 32 : 24, fontWeight: 800,
            color: '#DADADA', letterSpacing: '-0.04em',
          }}>
            P96
          </span>
        )}
      </div>

      <div style={{ padding: focal ? '16px 20px 20px' : '12px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{
            fontSize: 12, fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: meta.color, fontFamily: 'var(--font-body)',
          }}>
            {meta.label}
          </span>
          <span style={{ fontSize: 12, color: '#999', fontFamily: 'var(--font-body)', fontWeight: 500 }}>
            {new Date(event.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
          </span>
        </div>

        {match && (
          <div style={{ fontSize: 12, fontWeight: 700, color: '#555', marginBottom: 6, fontFamily: 'var(--font-body)' }}>
            ⚽ {match.teamA.flag} vs {match.teamB.flag} · {match.kickoff}
          </div>
        )}

        <h3 style={{
          fontFamily: 'var(--font-display)', fontSize: titleSize, fontWeight: 800,
          letterSpacing: '-0.03em', lineHeight: 1.15,
          color: '#111', marginBottom: 10, flex: 1,
        }}>
          {event.title}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
          {event.time && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#555', fontFamily: 'var(--font-body)' }}>
              <Clock size={11} strokeWidth={2} style={{ flexShrink: 0, color: '#888' }} />
              {fmtTime(event.time)}
            </div>
          )}
          {event.location_name && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 5, fontSize: 12, color: '#555', fontFamily: 'var(--font-body)' }}>
              <MapPin size={11} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1, color: '#888' }} />
              <span>
                {event.location_name}
                {event.location_address && ` · ${event.location_address}`}
              </span>
            </div>
          )}
        </div>

        {(() => {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const isPast = new Date(event.date + 'T00:00:00') < today
          if (isPast && event.recap_url) {
            return (
              <a href={event.recap_url} target="_blank" rel="noopener noreferrer" style={{
                display: 'block', padding: '11px', borderRadius: 8,
                background: '#111', color: '#fff',
                fontSize: 12, fontWeight: 800, textAlign: 'center',
                textDecoration: 'none', fontFamily: 'var(--font-display)',
                letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>
                RECAP →
              </a>
            )
          }
          if (!isPast && event.rsvp_url) {
            return (
              <a href={event.rsvp_url} target="_blank" rel="noopener noreferrer" style={{
                display: 'block', padding: '11px', borderRadius: 8,
                background: '#111', color: '#fff',
                fontSize: 12, fontWeight: 800, textAlign: 'center',
                textDecoration: 'none', fontFamily: 'var(--font-display)',
                letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>
                RSVP →
              </a>
            )
          }
          return (
            <p style={{ fontSize: 12, color: '#999', fontFamily: 'var(--font-body)', textAlign: 'center', margin: 0 }}>
              Free entry — no RSVP needed
            </p>
          )
        })()}
      </div>
    </WhiteCard>
  )
}
