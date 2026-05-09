'use client'

const NATIONS = [
  { code: 'MA', flag: '🇲🇦', name: 'Morocco' },
  { code: 'SN', flag: '🇸🇳', name: 'Senegal' },
  { code: 'GH', flag: '🇬🇭', name: 'Ghana' },
  { code: 'DZ', flag: '🇩🇿', name: 'Algeria' },
  { code: 'EG', flag: '🇪🇬', name: 'Egypt' },
  { code: 'TN', flag: '🇹🇳', name: 'Tunisia' },
  { code: 'CI', flag: '🇨🇮', name: 'Ivory Coast' },
  { code: 'CD', flag: '🇨🇩', name: 'DR Congo' },
  { code: 'ZA', flag: '🇿🇦', name: 'South Africa' },
  { code: 'CV', flag: '🇨🇻', name: 'Cape Verde' },
  { code: 'HT', flag: '🇭🇹', name: 'Haiti' },
  { code: 'CW', flag: '🇨🇼', name: 'Curaçao' },
]

interface Props {
  selected: string[]
  onChange: (codes: string[]) => void
}

export default function FilterChips({ selected, onChange }: Props) {
  function toggle(code: string) {
    onChange(
      selected.includes(code)
        ? selected.filter(c => c !== code)
        : [...selected, code]
    )
  }

  // Selected nations first, then the rest
  const sorted = [
    ...NATIONS.filter(n => selected.includes(n.code)),
    ...NATIONS.filter(n => !selected.includes(n.code)),
  ]

  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--space-2)',
        overflowX: 'auto',
        paddingBottom: 'var(--space-2)',
        marginBottom: 'var(--space-4)',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {selected.length > 0 && (
        <button
          onClick={() => onChange([])}
          style={{
            padding: '6px 10px',
            borderRadius: 'var(--radius-pill)',
            border: '1.5px solid var(--c-border)',
            background: 'transparent',
            color: 'var(--c-text-muted)',
            fontSize: 11,
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          All ×
        </button>
      )}
      {sorted.map(n => {
        const active = selected.includes(n.code)
        return (
          <button
            key={n.code}
            onClick={() => toggle(n.code)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '6px 12px',
              borderRadius: 'var(--radius-pill)',
              border: `1.5px solid ${active ? 'var(--c-gold)' : 'var(--c-border)'}`,
              background: active ? 'rgba(245,200,66,0.1)' : 'transparent',
              color: active ? 'var(--c-gold)' : 'var(--c-text-muted)',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'border-color 0.15s, background 0.15s, color 0.15s',
            }}
          >
            {n.flag} {n.name}
          </button>
        )
      })}
    </div>
  )
}
