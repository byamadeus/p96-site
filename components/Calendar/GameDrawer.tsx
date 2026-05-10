'use client'

import { Calendar, MapPin } from 'lucide-react'
import { Match } from '@/data/matches'

function fmtDate(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })
}

export default function GameDrawer({ match, onClose }: { match: Match | null; onClose: () => void }) {
  const open = match !== null

  return (
    <>
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

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 51,
          background: 'var(--c-surface)',
          borderRadius: '20px 20px 0 0',
          maxHeight: '80dvh',
          overflowY: 'auto',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.32s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--c-border-emphasis)', margin: '12px auto 0' }} />

        {match && (
          <div style={{ padding: 'var(--space-6) var(--page-padding) 48px' }}>
            {/* Stage label */}
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--c-text-subtle)', marginBottom: 'var(--space-4)' }}>
              {match.stage}
            </div>

            {/* Teams */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 52, lineHeight: 1 }}>{match.teamA.flag}</div>
                <div style={{ fontSize: 15, fontWeight: match.teamA.isDiaspora ? 700 : 500, marginTop: 6, color: match.teamA.isDiaspora ? 'var(--c-text)' : 'var(--c-text-muted)' }}>
                  {match.teamA.name}
                </div>
                {match.teamA.isDiaspora && (
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--c-gold)', marginTop: 3 }}>DIASPORA</div>
                )}
              </div>

              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--c-text-subtle)', padding: '0 var(--space-4)' }}>VS</div>

              <div style={{ textAlign: 'center', flex: 1 }}>
                <div style={{ fontSize: 52, lineHeight: 1 }}>{match.teamB.flag}</div>
                <div style={{ fontSize: 15, fontWeight: match.teamB.isDiaspora ? 700 : 500, marginTop: 6, color: match.teamB.isDiaspora ? 'var(--c-text)' : 'var(--c-text-muted)' }}>
                  {match.teamB.name}
                </div>
                {match.teamB.isDiaspora && (
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--c-gold)', marginTop: 3 }}>DIASPORA</div>
                )}
              </div>
            </div>

            {/* Meta */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 14, color: 'var(--c-text-muted)', marginBottom: 'var(--space-6)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={14} strokeWidth={2} style={{ flexShrink: 0 }} />
                {fmtDate(match.date)} · {match.kickoff}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={14} strokeWidth={2} style={{ flexShrink: 0 }} />
                {match.venue}, {match.city}
              </span>
            </div>

            {/* Diaspora notes */}
            {match.diasporaNotes && (
              <div style={{
                background: 'rgba(245,200,66,0.07)',
                border: '1px solid rgba(245,200,66,0.2)',
                borderRadius: 'var(--radius-card)',
                padding: 'var(--space-4)',
                fontSize: 13,
                lineHeight: 1.6,
                color: 'var(--c-text-muted)',
              }}>
                {match.diasporaNotes}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
