'use client'

import { getCategoryMeta } from '@/lib/supabase'

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
  eventCategories?: Map<string, string>
  isMobile?: boolean
}

export default function CalendarGrid({
  year, month, eventDates, selectedDate, onSelectDate,
  compact = false, light = false, adminMode = false,
  eventCategories, isMobile = false,
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

  return (
    <div>
      {/* Month header */}
      <div style={{
        padding: compact ? '10px 8px 8px' : '12px 8px 10px',
        borderBottom: `1px solid ${light ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)'}`,
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: compact ? 9 : 11,
          fontWeight: 800,
          letterSpacing: '0.1em',
          color: light ? '#AAAAAA' : (compact ? 'var(--c-text-subtle)' : 'rgba(0,0,0,0.6)'),
          textTransform: 'uppercase',
        }}>
          {compact ? monthName.slice(0, 3) : `${monthName} ${year}`}
        </span>
      </div>

      {/* Day headers — black pill style */}
      {!compact && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          padding: '8px 8px 6px',
          gap: 4,
        }}>
          {DAY_LABELS.map(d => (
            <div key={d} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{
                background: '#000000',
                color: '#FFFFFF',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-body)',
                borderRadius: 4,
                padding: '4px 7px',
                lineHeight: 1,
                display: 'block',
                whiteSpace: 'nowrap',
              }}>
                {d}
              </span>
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
                  : <div key={ci} style={{ aspectRatio: isMobile ? '1/1.3' : '1' }} />
              }

              const dateStr = isoDate(year, month, day)
              const isPriority = PRIORITY_DATES.has(dateStr)
              const hasEvents = eventDates.has(dateStr)
              const isSelected = selectedDate === dateStr
              const isInteractive = adminMode ? true : (hasEvents || isPriority)

              // ── Cell colors ─────────────────────────────────────
              let bg = 'transparent'
              let borderColor = 'transparent'
              let color: string

              if (light) {
                color = isInteractive ? '#1A1A1A' : 'rgba(0,0,0,0.3)'
                bg = 'rgba(0,0,0,0.03)'           // all cells get subtle bg
                borderColor = 'rgba(0,0,0,0.05)'
                if (isSelected) {
                  bg = 'var(--c-gold)'
                  borderColor = 'transparent'
                  color = '#000'
                } else if (hasEvents) {
                  bg = 'linear-gradient(135deg, rgba(255,218,68,0.38) 0%, rgba(255,140,0,0.22) 100%)'
                  borderColor = 'rgba(200,130,0,0.35)'
                  color = '#6B4A00'
                } else if (isPriority) {
                  bg = 'rgba(255,218,68,0.1)'
                  borderColor = 'rgba(200,150,0,0.15)'
                  color = 'rgba(0,0,0,0.3)'
                }
              } else {
                // Gradient bg — dark text throughout. Min opacity: black-60.
                color = isInteractive ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.5)'
                bg = 'rgba(255,255,255,0.07)'      // all cells get subtle bg
                borderColor = 'rgba(255,255,255,0.1)'
                if (isSelected) {
                  bg = 'var(--c-gold)'
                  borderColor = 'transparent'
                  color = '#000000'
                } else if (hasEvents) {
                  bg = 'rgba(255,255,255,0.5)'
                  borderColor = 'rgba(255,255,255,0.65)'
                  color = '#0E0E0E'
                } else if (isPriority) {
                  bg = 'rgba(255,255,255,0.14)'
                  borderColor = 'rgba(255,255,255,0.22)'
                  color = 'rgba(0,0,0,0.55)'
                }
              }

              // ── Soccer ball logic ────────────────────────────────
              const showBall = !compact && (hasEvents || (isPriority && !adminMode))
              const ballCategory = hasEvents
                ? (eventCategories?.get(dateStr) ?? 'watch_party')
                : 'watch_party'
              // Grey for priority-no-event, category color for real events
              const ballColor = hasEvents ? getCategoryMeta(ballCategory).color : 'rgba(0,0,0,0.1)'
              const ballOpacity = 1

              // ── Cell style ───────────────────────────────────────
              const cellStyle: React.CSSProperties = {
                position: 'relative',
                borderRadius: compact ? 4 : 8,
                background: bg,
                border: `1px solid ${borderColor}`,
                cursor: isInteractive ? 'pointer' : 'default',
                transition: 'background var(--duration-base) var(--ease-out), border-color var(--duration-base) var(--ease-out)',
                userSelect: 'none',
              }

              if (compact) {
                cellStyle.width = cellSize
                cellStyle.height = cellSize
                cellStyle.margin = '0 auto'
                cellStyle.display = 'flex'
                cellStyle.alignItems = 'center'
                cellStyle.justifyContent = 'center'
                cellStyle.fontSize = 10
                cellStyle.fontWeight = 500
                cellStyle.fontFamily = 'var(--font-body)'
                cellStyle.color = color
              } else {
                cellStyle.aspectRatio = isMobile ? '1/1.3' : '1'
              }

              return (
                <div key={ci} onClick={() => isInteractive && onSelectDate(dateStr)} style={cellStyle}>
                  {compact ? (
                    day
                  ) : (
                    <>
                      {/* Date number — top left, display font */}
                      <span style={{
                        position: 'absolute',
                        top: '10%',
                        left: '12%',
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(18px, 2.8vw, 32px)',
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                        lineHeight: 1,
                        color,
                      }}>
                        {day}
                      </span>

                      {/* Soccer ball — bottom right, white icon in colored circle */}
                      {showBall && (
                        <div style={{
                          position: 'absolute',
                          bottom: '8%',
                          right: '8%',
                          background: ballColor,
                          borderRadius: '50%',
                          width: 'clamp(22px, 3vw, 34px)',
                          height: 'clamp(22px, 3vw, 34px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <span className="material-icons" style={{
                            fontSize: 'clamp(14px, 1.8vw, 22px)',
                            color: '#FFFFFF',
                            lineHeight: 1,
                            userSelect: 'none',
                            display: 'block',
                          }}>
                            sports_soccer
                          </span>
                        </div>
                      )}
                    </>
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
