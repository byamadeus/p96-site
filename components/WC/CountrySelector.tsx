'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import P96Logo from '@/components/Layout/P96Logo'

// Position → nation mapping (derived from SVG flag colors)
const POSITIONS = [
  { file: 'top-middle', code: 'CV', col: 3, row: 1 },
  { file: 'top-left',   code: 'GH', col: 2, row: 2 },
  { file: 'top-right',  code: 'MA', col: 4, row: 2 },
  { file: 'left-top',   code: 'ZA', col: 1, row: 3 },
  { file: 'right-top',  code: 'TN', col: 5, row: 3 },
  { file: 'left-bottom',code: 'DZ', col: 2, row: 4 },
  { file: 'right-bottom',code:'CI', col: 4, row: 4 },
  { file: 'bottom-left',code: 'CD', col: 1, row: 5 },
  { file: 'bottom',     code: 'EG', col: 3, row: 5 },
  { file: 'bottom-right',code:'SN', col: 5, row: 5 },
] as const

const LIGHT: React.CSSProperties = {
  '--c-bg':              '#F7F6F2',
  '--c-surface':         '#FFFFFF',
  '--c-text':            '#111111',
  '--c-text-muted':      '#555555',
  '--c-text-subtle':     '#888888',
  '--c-border':          '#E3E1DC',
  '--c-border-emphasis': '#C8C5BE',
} as React.CSSProperties

export default function CountrySelector() {
  return (
    <div style={{
      ...LIGHT,
      minHeight: '100dvh',
      background: 'var(--c-bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Nav */}
      <div style={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: '16px',
        paddingLeft: 'max(16px, env(safe-area-inset-left))',
        paddingRight: 'max(16px, env(safe-area-inset-right))',
        flexShrink: 0,
      }}>
        <div />
        <Link href="/" aria-label="P96 home">
          <P96Logo color="#111111" height={18} />
        </Link>
        <div />
      </div>

      {/* Body — space-between pushes footer to bottom */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 0 max(32px, env(safe-area-inset-bottom))',
        paddingLeft: 'max(16px, env(safe-area-inset-left))',
        paddingRight: 'max(16px, env(safe-area-inset-right))',
        width: '100%',
      }}>

      {/* Header + grid grouped in center */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40, width: '100%' }}>
      <div style={{ textAlign: 'center' }}>
        <p className="t-label" style={{ color: 'var(--c-text-muted)', marginBottom: 8 }}>
          FIFA WORLD CUP 2026
        </p>
        <h1 className="t-display" style={{ fontSize: 'clamp(32px, 9vw, 52px)', color: 'var(--c-text)' }}>
          Choose your country
        </h1>
      </div>

      {/* Soccer ball grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '97fr 125fr 114fr 125fr 97fr',
          gridTemplateRows: '60fr 101fr 86fr 90fr 62fr',
          gap: 0,
          width: 'min(460px, calc(100vw - 32px - env(safe-area-inset-left) - env(safe-area-inset-right)))',
        }}
      >
        {/* Flag tiles */}
        {POSITIONS.map(({ file, code, col, row }) => (
          <Link
            key={code}
            href={`/wc2026/${code.toLowerCase()}`}
            title={code}
            style={{
              gridColumn: col,
              gridRow: row,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'scale(1.14)',
              transition: 'transform 0.15s, filter 0.15s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.22)'
              e.currentTarget.style.filter = 'brightness(1.1)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1.14)'
              e.currentTarget.style.filter = 'brightness(1)'
            }}
          >
            <Image
              src={`/teams/${file}.svg`}
              alt={code}
              width={120}
              height={120}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              priority
            />
          </Link>
        ))}

        {/* Center — P96 logo (2x) */}
        <div
          style={{
            gridColumn: 3,
            gridRow: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <P96Logo color="#111111" height={56} />
        </div>
      </div>
      </div>{/* end header + grid group */}

      {/* Footer hint — pinned to bottom */}
      <p className="t-whisper" style={{ textAlign: 'center', maxWidth: 280 }}>
        Pick your squad — see where P96 is watching with the community
      </p>
      </div>
    </div>
  )
}
