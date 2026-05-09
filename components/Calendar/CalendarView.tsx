'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import IntakeModal from '@/components/Entry/IntakeModal'
import Navbar from '@/components/Layout/Navbar'
import PageWrapper from '@/components/Layout/PageWrapper'
import ModeToggle from '@/components/Calendar/ModeToggle'
import FilterChips from '@/components/Calendar/FilterChips'
import GameCard from '@/components/Calendar/GameCard'
import EventCard from '@/components/Calendar/EventCard'
import EventDrawer from '@/components/Calendar/EventDrawer'
import GameDrawer from '@/components/Calendar/GameDrawer'
import { matches, Match } from '@/data/matches'
import { Event } from '@/lib/supabase'

const NATION_MAP: Record<string, { flag: string; name: string }> = {
  MA: { flag: '🇲🇦', name: 'Morocco' },
  SN: { flag: '🇸🇳', name: 'Senegal' },
  GH: { flag: '🇬🇭', name: 'Ghana' },
  DZ: { flag: '🇩🇿', name: 'Algeria' },
  EG: { flag: '🇪🇬', name: 'Egypt' },
  TN: { flag: '🇹🇳', name: 'Tunisia' },
  CI: { flag: '🇨🇮', name: 'Ivory Coast' },
  CD: { flag: '🇨🇩', name: 'DR Congo' },
  ZA: { flag: '🇿🇦', name: 'South Africa' },
  CV: { flag: '🇨🇻', name: 'Cape Verde' },
  HT: { flag: '🇭🇹', name: 'Haiti' },
  CW: { flag: '🇨🇼', name: 'Curaçao' },
}

interface Intake { country?: string; borough?: string }

export default function CalendarView({ events }: { events: Event[] }) {
  const router = useRouter()
  const [mode, setMode] = useState<'wc' | 'all'>('wc')
  const [selected, setSelected] = useState<string[]>([])
  const [intake, setIntake] = useState<Intake>({})
  const [openEvent, setOpenEvent] = useState<Event | null>(null)
  const [openMatch, setOpenMatch] = useState<Match | null>(null)
  const [showIntake, setShowIntake] = useState(false)

  useEffect(() => {
    try {
      const cookie = document.cookie.split(';').find(c => c.trim().startsWith('p96_intake='))
      if (cookie) {
        const raw = cookie.trim().slice('p96_intake='.length)
        const parsed: Intake = JSON.parse(decodeURIComponent(raw))
        setIntake(parsed)
        if (parsed.country) setSelected([parsed.country])
      } else {
        setShowIntake(true)
      }
    } catch {
      setShowIntake(true)
    }
  }, [])

  function resetIntake() {
    document.cookie = 'p96_intake=; path=/; max-age=0'
    router.push('/')
  }

  const visibleMatches = matches.filter(m => {
    if (selected.length === 0) return m.teamA.isDiaspora || m.teamB.isDiaspora
    return selected.includes(m.teamA.code) || selected.includes(m.teamB.code)
  })

  const eventsByDate: Record<string, Event[]> = {}
  events.forEach(e => {
    if (!eventsByDate[e.date]) eventsByDate[e.date] = []
    eventsByDate[e.date].push(e)
  })

  const nation = intake.country ? NATION_MAP[intake.country] : null

  if (showIntake) {
    return (
      <>
        <PageWrapper><Navbar /></PageWrapper>
        <IntakeModal
          onDone={({ country, borough }) => {
            setIntake({ country, borough })
            if (country) setSelected([country])
            setShowIntake(false)
          }}
        />
      </>
    )
  }

  return (
    <PageWrapper>
      <Navbar />

      <div style={{ paddingTop: 'var(--space-4)', paddingBottom: 'var(--space-12)' }}>

        {/* Intake summary + dev reset */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <div style={{ fontSize: 13, color: 'var(--c-text-muted)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {nation && (
              <span style={{ color: 'var(--c-text)', fontWeight: 600 }}>
                {nation.flag} {nation.name}
              </span>
            )}
            {nation && intake.borough && <span>·</span>}
            {intake.borough && <span>{intake.borough}</span>}
            {!nation && !intake.borough && <span>All nations</span>}
          </div>

          <button
            onClick={resetIntake}
            style={{
              padding: '5px 10px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--c-green)',
              background: 'transparent',
              color: 'var(--c-green)',
              fontSize: 11,
              fontWeight: 700,
              fontFamily: 'inherit',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              flexShrink: 0,
            }}
          >
            ↺ Reset
          </button>
        </div>

        <ModeToggle mode={mode} onChange={setMode} />

        {mode === 'wc' && (
          <FilterChips selected={selected} onChange={setSelected} />
        )}

        {mode === 'wc' ? (
          visibleMatches.length === 0 ? (
            <Empty text="No matches for selected nations" />
          ) : (
            visibleMatches.map(match => (
              <div key={match.id}>
                <GameCard match={match} onOpen={() => setOpenMatch(match)} />
                {(eventsByDate[match.date] ?? []).map(ev => (
                  <EventCard key={ev.id} event={ev} onOpen={() => setOpenEvent(ev)} />
                ))}
              </div>
            ))
          )
        ) : (
          events.length === 0 ? (
            <Empty text="No events posted yet — check back soon" />
          ) : (
            events.map(ev => (
              <EventCard key={ev.id} event={ev} onOpen={() => setOpenEvent(ev)} />
            ))
          )
        )}
      </div>

      <EventDrawer event={openEvent} onClose={() => setOpenEvent(null)} />
      <GameDrawer match={openMatch} onClose={() => setOpenMatch(null)} />
    </PageWrapper>
  )
}

function Empty({ text }: { text: string }) {
  return (
    <p style={{ color: 'var(--c-text-muted)', fontSize: 14, paddingTop: 'var(--space-8)', textAlign: 'center' }}>
      {text}
    </p>
  )
}
