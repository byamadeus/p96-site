'use client'

import { RotateCcw } from 'lucide-react'

interface PageFooterProps {
  label?: string
  showContact?: boolean
  showDevReset?: boolean
}

export default function PageFooter({
  label = 'PROJECT 96 © 2026',
  showContact = false,
  showDevReset = false,
}: PageFooterProps) {
  return (
    <footer style={{
      borderTop: '1px solid rgba(0,0,0,0.06)',
      padding: '14px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexShrink: 0,
      background: '#FFFFFF',
    }}>
      <span style={{
        fontSize: 10, fontWeight: 600, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)',
        fontFamily: 'var(--font-body)',
      }}>
        {label}
      </span>

      {(showContact || showDevReset) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {showContact && (
            <a
              href="mailto:info@p96.nyc"
              style={{
                fontSize: 10, fontWeight: 600, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)',
                fontFamily: 'var(--font-body)', textDecoration: 'none',
              }}
            >
              STAY IN TOUCH
            </a>
          )}
          {showDevReset && (
            <button
              onClick={() => {
                document.cookie = 'p96_intake=; path=/; max-age=0'
                window.location.reload()
              }}
              title="Reset cookie (dev)"
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                color: 'rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.45)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(0,0,0,0.18)')}
            >
              <RotateCcw size={12} strokeWidth={2} />
            </button>
          )}
        </div>
      )}
    </footer>
  )
}
