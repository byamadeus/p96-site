'use client'

import { EventCategory, getCategoryMeta } from '@/lib/supabase'

export const FILTERABLE_CATEGORIES: EventCategory[] = [
  'entertainment',
  'education_workshops',
  'wellness',
  'art',
  'music',
  'fashion',
  'film',
  'athletic',
  'food',
  'hangout',
  'watch_party',
]

interface CategoryFilterPanelProps {
  selected: Set<string>
  onToggle: (category: string) => void
  onClear: () => void
}

export default function CategoryFilterPanel({ selected, onToggle, onClear }: CategoryFilterPanelProps) {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'nowrap',
      overflowX: 'auto',
      gap: 8,
      padding: '2px 20px 4px',
      WebkitOverflowScrolling: 'touch',
    }}>
      <button
        onClick={onClear}
        style={{
          flexShrink: 0,
          fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          padding: '7px 14px', borderRadius: 999,
          border: `1px solid ${selected.size === 0 ? '#0E0E0E' : 'rgba(0,0,0,0.15)'}`,
          background: selected.size === 0 ? '#0E0E0E' : 'transparent',
          color: selected.size === 0 ? '#FFFFFF' : 'rgba(0,0,0,0.55)',
          cursor: 'pointer', whiteSpace: 'nowrap',
        }}
      >
        ALL
      </button>
      {FILTERABLE_CATEGORIES.map(cat => {
        const meta = getCategoryMeta(cat)
        const active = selected.has(cat)
        return (
          <button
            key={cat}
            onClick={() => onToggle(cat)}
            style={{
              flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '7px 14px', borderRadius: 999,
              border: `1px solid ${active ? meta.border : 'rgba(0,0,0,0.12)'}`,
              background: active ? meta.bg : 'transparent',
              color: active ? meta.color : 'rgba(0,0,0,0.55)',
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: meta.color, flexShrink: 0 }} />
            {meta.label}
          </button>
        )
      })}
    </div>
  )
}
