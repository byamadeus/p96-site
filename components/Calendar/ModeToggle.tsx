'use client'

interface Props {
  mode: 'wc' | 'all'
  onChange: (mode: 'wc' | 'all') => void
}

export default function ModeToggle({ mode, onChange }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        background: 'var(--c-surface)',
        borderRadius: 'var(--radius-pill)',
        padding: 3,
        marginBottom: 'var(--space-4)',
      }}
    >
      {(['wc', 'all'] as const).map(m => (
        <button
          key={m}
          onClick={() => onChange(m)}
          style={{
            flex: 1,
            padding: '9px 0',
            borderRadius: 'var(--radius-pill)',
            border: 'none',
            background: mode === m ? 'var(--c-surface2)' : 'transparent',
            color: mode === m ? 'var(--c-text)' : 'var(--c-text-muted)',
            fontSize: 13,
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: 'pointer',
            transition: 'background 0.15s, color 0.15s',
            letterSpacing: '-0.01em',
          }}
        >
          {m === 'wc' ? '⚽ World Cup' : 'All Events'}
        </button>
      ))}
    </div>
  )
}
