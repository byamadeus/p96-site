'use client'

import { Lock } from 'lucide-react'

// Priority dates = WC match days — drive "accented-disabled" state when no events published
export const PRIORITY_DATES = new Set([
  '2026-06-11',
  '2026-06-13', '2026-06-14', '2026-06-15',
  '2026-06-16', '2026-06-17',
  '2026-06-19', '2026-06-20', '2026-06-21',
  '2026-06-22', '2026-06-23',
  '2026-06-24', '2026-06-25', '2026-06-26', '2026-06-27',
  '2026-06-30',
])

const DAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

// ── DateStrip: minimized single-column list for view mode sidebar ──
interface DateStripProps {
  year: number
  month: number
  eventDates: Set<string>
  selectedDate: string | null
  onSelectDate: (date: string) => void
  light?: boolean
  adminMode?: boolean
}

export function DateStrip({ year, month, eventDates, selectedDate, onSelectDate, light = false, adminMode = false }: DateStripProps) {
  const daysInMonth = new Date(year, month, 0).getDate()
  const monthName = new Date(year, month - 1, 1)
    .toLocaleString('en-US', { month: 'short' })
    .toUpperCase()

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{
        padding: '10px 0 8px',
        textAlign: 'center',
        borderBottom: `1px solid ${light ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'}`,
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: 9, fontWeight: 800,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: light ? '#AAAAAA' : 'var(--c-text-subtle)',
        }}>
          {monthName}
        </span>
      </div>

      <div style={{ padding: '4px 6px 20px', display: 'flex', flexDirection: 'column', gap: 1 }}>
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const dateStr = isoDate(year, month, day)
          const isPriority = PRIORITY_DATES.has(dateStr)
          const hasEvents = eventDates.has(dateStr)
          const isSelected = selectedDate === dateStr
          const isInteractive = adminMode ? true : (hasEvents || isPriority)

          let bg = 'transparent'
          let color = isInteractive
            ? (light ? '#1A1A1A' : 'var(--c-text-muted)')
            : (light ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.15)')

          if (isSelected) {
            bg = 'var(--c-gold)'
            color = '#000'
          } else if (hasEvents) {
            bg = light ? 'rgba(255,218,68,0.2)' : 'rgba(255,218,68,0.12)'
            color = light ? '#6B4A00' : 'var(--c-gold)'
          } else if (isPriority) {
            bg = light ? 'rgba(255,218,68,0.08)' : 'rgba(255,218,68,0.06)'
            color = light ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.25)'
          }

          return (
            <div
              key={day}
              onClick={() => isInteractive && onSelectDate(dateStr)}
              style={{
                width: 32, height: 26,
                margin: '0 auto',
                borderRadius: 5,
                background: bg,
                color,
                cursor: isInteractive ? 'pointer' : 'default',
                fontSize: 11,
                fontWeight: isSelected ? 700 : 500,
                fontFamily: 'var(--font-body)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.1s',
                position: 'relative',
              }}
            >
              {day}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function isoDate(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

interface CalendarGridProps {
  year: number
  month: number
  eventDates: Set<string>
  selectedDate: string | null
  onSelectDate: (date: string) => void
  compact?: boolean
  light?: boolean
  adminMode?: boolean
}

export default function CalendarGrid({
  year, month, eventDates, selectedDate, onSelectDate, compact = false, light = false, adminMode = false,
}: CalendarGridProps) {
  const firstDay = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const monthName = new Date(year, month - 1, 1)
    .toLocaleString('en-US', { month: 'long' })
    .toUpperCase()

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const rows: (number | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7))

  const cellSize = compact ? 28 : 44
  const fontSize = compact ? 10 : 13

  return (
    <div>
      {/* Month header */}
      <div style={{
        padding: compact ? '10px 8px 8px' : '12px 8px 10px',
        borderBottom: `1px solid ${light ? 'rgba(0,0,0,0.06)' : 'var(--c-border)'}`,
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: compact ? 9 : 11,
          fontWeight: 800,
          letterSpacing: '0.1em',
          color: light ? '#AAAAAA' : (compact ? 'var(--c-text-subtle)' : 'var(--c-text-muted)'),
          textTransform: 'uppercase',
        }}>
          {compact ? monthName.slice(0, 3) : `${monthName} ${year}`}
        </span>
      </div>

      {/* Day headers */}
      {!compact && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          padding: '8px 8px 4px',
        }}>
          {DAY_LABELS.map(d => (
            <div key={d} style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
              textAlign: 'center',
              color: light ? 'rgba(0,0,0,0.38)' : 'var(--c-text-subtle)',
              fontFamily: 'var(--font-body)',
            }}>
              {d}
            </div>
          ))}
        </div>
      )}

      {/* Grid */}
      <div style={{ padding: compact ? '4px 4px 12px' : '4px 8px 20px' }}>
        {rows.map((row, ri) => (
          <div key={ri} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: compact ? 2 : 4,
            marginBottom: compact ? 2 : 4,
          }}>
            {row.map((day, ci) => {
              if (!day) {
                return compact
                  ? <div key={ci} style={{ width: cellSize, height: cellSize }} />
                  : <div key={ci} style={{ aspectRatio: '1' }} />
              }

              const dateStr = isoDate(year, month, day)
              const isPriority = PRIORITY_DATES.has(dateStr)
              const hasEvents = eventDates.has(dateStr)
              const isSelected = selectedDate === dateStr
              // adminMode: all dates clickable; else priority+events only
              const isInteractive = adminMode ? true : (hasEvents || isPriority)

              // 3 states: active (events) | accented-disabled (priority, no events) | disabled
              let bg = 'transparent'
              let borderColor = 'transparent'
              let color: string

              if (light) {
                color = isInteractive ? '#1A1A1A' : 'rgba(0,0,0,0.22)'
                if (isSelected) {
                  bg = 'var(--c-gold)'
                  color = '#000'
                } else if (hasEvents) {
                  bg = 'linear-gradient(135deg, rgba(255,218,68,0.28) 0%, rgba(255,140,0,0.15) 100%)'
                  borderColor = 'rgba(200,130,0,0.28)'
                  color = '#6B4A00'
                } else if (isPriority) {
                  // accented-disabled: gold tint, muted
                  bg = 'rgba(255,218,68,0.1)'
                  borderColor = 'rgba(200,150,0,0.2)'
                  color = 'rgba(0,0,0,0.3)'
                }
              } else {
                color = isInteractive ? 'var(--c-text-muted)' : 'rgba(255,255,255,0.18)'
                if (isSelected) {
                  bg = 'var(--c-gold)'
                  color = '#000'
                } else if (hasEvents) {
                  bg = 'rgba(255,218,68,0.1)'
                  borderColor = 'rgba(255,218,68,0.25)'
                  color = 'var(--c-gold)'
                } else if (isPriority) {
                  bg = 'rgba(255,218,68,0.06)'
                  borderColor = 'rgba(255,218,68,0.15)'
                  color = 'rgba(255,218,68,0.4)'
                }
              }

              const cellStyle: React.CSSProperties = {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: compact ? 4 : 8,
                background: bg,
                border: `1px solid ${borderColor}`,
                color,
                cursor: isInteractive ? 'pointer' : 'default',
                fontSize,
                fontWeight: 500,
                fontFamily: 'var(--font-body)',
                transition: 'background 0.1s, border-color 0.1s',
                userSelect: 'none',
                position: 'relative',
              }

              if (compact) {
                cellStyle.width = cellSize
                cellStyle.height = cellSize
                cellStyle.margin = '0 auto'
              } else {
                cellStyle.aspectRatio = '1'
              }

              return (
                <div key={ci} onClick={() => isInteractive && onSelectDate(dateStr)} style={cellStyle}>
                  {day}
                  {isPriority && !hasEvents && !isSelected && !compact && !adminMode && (
                    <Lock size={8} strokeWidth={2.5} style={{
                      position: 'absolute', top: 4, right: 4,
                      opacity: 0.45,
                    }} />
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
