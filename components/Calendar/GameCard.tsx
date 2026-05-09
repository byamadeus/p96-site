'use client'

import { Match, Team } from '@/data/matches'

function fmt(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()
}

function TeamCol({ team }: { team: Team }) {
  return (
    <div style={{ textAlign: 'center', flex: 1 }}>
      <div style={{ fontSize: 40, lineHeight: 1, marginBottom: 6 }}>{team.flag}</div>
      <div
        style={{
          fontSize: 13,
          fontWeight: team.isDiaspora ? 700 : 500,
          color: team.isDiaspora ? 'var(--c-text)' : 'var(--c-text-muted)',
          lineHeight: 1.2,
        }}
      >
        {team.name}
      </div>
      {team.isDiaspora && (
        <div
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--c-gold)',
            marginTop: 3,
          }}
        >
          DIASPORA
        </div>
      )}
    </div>
  )
}

export default function GameCard({ match, onOpen }: { match: Match; onOpen: () => void }) {
  const bothDiaspora = match.teamA.isDiaspora && match.teamB.isDiaspora

  return (
    <div
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onOpen()}
      style={{
        background: 'var(--c-surface)',
        border: `1px solid ${bothDiaspora ? 'rgba(245,200,66,0.3)' : 'var(--c-border)'}`,
        borderRadius: 'var(--radius-card)',
        padding: 'var(--space-4)',
        marginBottom: 'var(--space-3)',
        cursor: 'pointer',
      }}
    >
      {/* Meta */}
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--c-text-subtle)',
          marginBottom: 'var(--space-4)',
        }}
      >
        {match.stage} · {fmt(match.date)} · {match.kickoff}
      </div>

      {/* Teams */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--space-4)',
        }}
      >
        <TeamCol team={match.teamA} />
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: 'var(--c-text-subtle)',
            letterSpacing: '0.05em',
            flexShrink: 0,
            padding: '0 var(--space-3)',
          }}
        >
          VS
        </div>
        <TeamCol team={match.teamB} />
      </div>

      {/* Venue */}
      <div style={{ fontSize: 12, color: 'var(--c-text-muted)' }}>
        📍 {match.venue} · {match.city}
      </div>
    </div>
  )
}
