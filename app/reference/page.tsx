'use client'

import { useEffect } from 'react'

// ── Token data pulled directly from tokens.css ─────────────────────────
const COLORS = [
  { token: '--c-gold',    value: '#FFDA44', label: 'Gold' },
  { token: '--c-red',     value: '#E8412C', label: 'Red' },
  { token: '--c-green',   value: '#1A7F3C', label: 'Green' },
  { token: '--c-blue',    value: '#1B4FD8', label: 'Blue' },
  { token: '--c-orange',  value: '#F97B22', label: 'Orange' },
]

const SURFACES = [
  { token: '--c-bg',       value: '#0E0E0E', label: 'BG' },
  { token: '--c-surface',  value: '#161616', label: 'Surface' },
  { token: '--c-surface2', value: '#1F1F1F', label: 'Surface 2' },
]

const TEXT_COLORS = [
  { token: '--c-text',        value: '#FFFFFF',  label: 'Text', dark: true },
  { token: '--c-text-muted',  value: '#AAAAAA',  label: 'Muted', dark: true },
  { token: '--c-text-subtle', value: '#6E6E6E',  label: 'Subtle', dark: true },
]

const RADII = [
  { token: '--radius-sm',   value: '6px',  label: 'SM' },
  { token: '--radius-card', value: '16px', label: 'Card' },
  { token: '--radius-pill', value: '99px', label: 'Pill' },
]

const SPACING = [
  { token: '--space-1',  value: '4px'  },
  { token: '--space-2',  value: '8px'  },
  { token: '--space-3',  value: '12px' },
  { token: '--space-4',  value: '16px' },
  { token: '--space-6',  value: '24px' },
  { token: '--space-8',  value: '32px' },
  { token: '--space-12', value: '48px' },
  { token: '--space-16', value: '64px' },
]

const TYPE_SCALE = [
  { token: '--text-2xs',  value: '10px', label: '2XS' },
  { token: '--text-xs',   value: '12px', label: 'XS' },
  { token: '--text-sm',   value: '14px', label: 'SM' },
  { token: '--text-base', value: '16px', label: 'Base' },
  { token: '--text-lg',   value: '20px', label: 'LG' },
  { token: '--text-xl',   value: '24px', label: 'XL' },
  { token: '--text-2xl',  value: '32px', label: '2XL' },
  { token: '--text-3xl',  value: '48px', label: '3XL' },
  { token: '--text-4xl',  value: '64px', label: '4XL' },
  { token: '--text-5xl',  value: '96px', label: '5XL' },
]

const TYPE_CLASSES = [
  { cls: 't-hero',    label: 'Hero',    sample: 'PROJECT 96' },
  { cls: 't-display', label: 'Display', sample: 'JUNE 2026' },
  { cls: 't-title',   label: 'Title',   sample: 'Watch Party' },
  { cls: 't-heading', label: 'Heading', sample: 'FIFA World Cup' },
  { cls: 't-date',    label: 'Date',    sample: '14' },
  { cls: 't-body',    label: 'Body',    sample: 'Community programming for the diaspora.' },
  { cls: 't-label',   label: 'Label',   sample: 'Watch Party' },
  { cls: 't-caption', label: 'Caption', sample: '7:00 PM · Flatbush, Brooklyn' },
  { cls: 't-whisper', label: 'Whisper', sample: 'Updated Jun 1' },
  { cls: 't-counter', label: 'Counter', sample: '3 Events' },
]

const MOTION = [
  { token: '--duration-fast',  value: '150ms',  label: 'Fast' },
  { token: '--duration-base',  value: '250ms',  label: 'Base' },
  { token: '--duration-slow',  value: '400ms',  label: 'Slow' },
  { token: '--ease-out',       value: 'cubic-bezier(0.0, 0, 0.2, 1)',     label: 'Ease Out' },
  { token: '--ease-in-out',    value: 'cubic-bezier(0.4, 0, 0.2, 1)',     label: 'Ease In-Out' },
  { token: '--ease-spring',    value: 'cubic-bezier(0.34, 1.56, 0.64, 1)', label: 'Spring' },
]

// ── Layout helpers ─────────────────────────────────────────────────────
const S = {
  page: {
    minHeight: '100dvh',
    background: '#F5F5F0',
    color: '#0E0E0E',
    fontFamily: 'var(--font-body)',
    padding: '0 0 80px',
  } as React.CSSProperties,
  header: {
    background: '#0E0E0E',
    color: '#FFFFFF',
    padding: '32px 32px 28px',
    borderBottom: '3px solid var(--c-gold)',
    marginBottom: 48,
  } as React.CSSProperties,
  section: {
    maxWidth: 900,
    margin: '0 auto 48px',
    padding: '0 24px',
  } as React.CSSProperties,
  sectionTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
    color: 'rgba(0,0,0,0.35)',
    marginBottom: 16,
    borderBottom: '1px solid rgba(0,0,0,0.08)',
    paddingBottom: 8,
  } as React.CSSProperties,
  tokenLabel: {
    fontFamily: 'var(--font-body)',
    fontSize: 10,
    color: 'rgba(0,0,0,0.4)',
    marginTop: 6,
    letterSpacing: '0.04em',
  } as React.CSSProperties,
  monoTag: {
    fontFamily: 'monospace',
    fontSize: 9,
    background: 'rgba(0,0,0,0.06)',
    padding: '2px 5px',
    borderRadius: 3,
    color: 'rgba(0,0,0,0.5)',
  } as React.CSSProperties,
} as const

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={S.section}>
      <div style={S.sectionTitle}>{title}</div>
      {children}
    </div>
  )
}

export default function ReferencePage() {
  useEffect(() => {
    document.documentElement.style.backgroundColor = '#F5F5F0'
    document.body.style.backgroundColor = '#F5F5F0'
    return () => {
      document.documentElement.style.backgroundColor = ''
      document.body.style.backgroundColor = ''
    }
  }, [])

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--c-gold)', display: 'block', marginBottom: 8,
          }}>
            P96 Design System
          </span>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1,
            color: '#FFFFFF', margin: 0,
          }}>
            Reference
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 12,
            color: 'rgba(255,255,255,0.4)', marginTop: 8,
          }}>
            Design tokens · Typography · Spacing · Motion
          </p>
        </div>
      </div>

      {/* ── Brand palette ──────────────────────────── */}
      <Section title="Brand Palette">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {COLORS.map(c => (
            <div key={c.token}>
              <div style={{ width: 72, height: 72, borderRadius: 12, background: c.value, border: '1px solid rgba(0,0,0,0.08)' }} />
              <div style={{ ...S.tokenLabel, fontWeight: 600 }}>{c.label}</div>
              <div style={{ ...S.tokenLabel, marginTop: 2 }}>
                <span style={S.monoTag}>{c.value}</span>
              </div>
              <div style={{ ...S.tokenLabel, marginTop: 2 }}>
                <span style={S.monoTag}>{c.token}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Surfaces ───────────────────────────────── */}
      <Section title="Surfaces">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {SURFACES.map(c => (
            <div key={c.token}>
              <div style={{ width: 72, height: 72, borderRadius: 12, background: c.value, border: '1px solid rgba(0,0,0,0.12)' }} />
              <div style={{ ...S.tokenLabel, fontWeight: 600 }}>{c.label}</div>
              <div style={{ ...S.tokenLabel, marginTop: 2 }}>
                <span style={S.monoTag}>{c.value}</span>
              </div>
              <div style={{ ...S.tokenLabel, marginTop: 2 }}>
                <span style={S.monoTag}>{c.token}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Text colors ────────────────────────────── */}
      <Section title="Text Colors">
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {TEXT_COLORS.map(c => (
            <div key={c.token}>
              <div style={{
                width: 120, height: 48, borderRadius: 8,
                background: '#0E0E0E',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(0,0,0,0.12)',
              }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14, color: c.value }}>
                  Aa
                </span>
              </div>
              <div style={{ ...S.tokenLabel, fontWeight: 600 }}>{c.label}</div>
              <div style={{ ...S.tokenLabel, marginTop: 2 }}>
                <span style={S.monoTag}>{c.value}</span>
              </div>
              <div style={{ ...S.tokenLabel, marginTop: 2 }}>
                <span style={S.monoTag}>{c.token}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Type scale ─────────────────────────────── */}
      <Section title="Type Scale">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {TYPE_SCALE.map(t => (
            <div key={t.token} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ ...S.monoTag, minWidth: 80 }}>{t.token}</span>
              <span style={{ ...S.monoTag, minWidth: 36 }}>{t.value}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: t.value, lineHeight: 1, color: '#0E0E0E' }}>
                {t.label}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Type classes ───────────────────────────── */}
      <Section title="Type Classes">
        <div style={{
          background: '#0E0E0E', borderRadius: 16, overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.1)',
        }}>
          {TYPE_CLASSES.map((t, i) => (
            <div key={t.cls} style={{
              padding: '16px 20px',
              borderBottom: i < TYPE_CLASSES.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              display: 'flex', alignItems: 'baseline', gap: 16, flexWrap: 'wrap',
            }}>
              <span style={{ ...S.monoTag, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)', minWidth: 80, flexShrink: 0 }}>
                .{t.cls}
              </span>
              <span className={t.cls}>{t.sample}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Spacing ────────────────────────────────── */}
      <Section title="Spacing (4px base)">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SPACING.map(s => (
            <div key={s.token} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ ...S.monoTag, minWidth: 100 }}>{s.token}</span>
              <span style={{ ...S.monoTag, minWidth: 40 }}>{s.value}</span>
              <div style={{
                height: 12, width: s.value,
                background: 'var(--c-gold)', borderRadius: 2,
                flexShrink: 0,
              }} />
            </div>
          ))}
        </div>
      </Section>

      {/* ── Border radius ──────────────────────────── */}
      <Section title="Border Radius">
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          {RADII.map(r => (
            <div key={r.token} style={{ textAlign: 'center' }}>
              <div style={{
                width: 64, height: 64,
                background: '#0E0E0E',
                borderRadius: r.value,
                margin: '0 auto',
              }} />
              <div style={{ ...S.tokenLabel, fontWeight: 600, marginTop: 8 }}>{r.label}</div>
              <div style={{ ...S.tokenLabel, marginTop: 2 }}>
                <span style={S.monoTag}>{r.value}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Motion ─────────────────────────────────── */}
      <Section title="Motion">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MOTION.map(m => (
            <div key={m.token} style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <span style={{ ...S.monoTag, minWidth: 160 }}>{m.token}</span>
              <span style={{ ...S.tokenLabel, margin: 0, fontWeight: 600 }}>{m.label}</span>
              <span style={{ ...S.monoTag }}>{m.value}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Event categories ───────────────────────── */}
      <Section title="Event Categories">
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[
            { cat: 'watch_party',    label: 'Watch Party',    color: '#E8412C' },
            { cat: 'talks',          label: 'Talks',          color: '#1B4FD8' },
            { cat: 'workshop',       label: 'Workshop',       color: '#1A7F3C' },
            { cat: 'hangout',        label: 'Hangout',        color: '#F97B22' },
            { cat: 'collaboration',  label: 'Collaboration',  color: '#7C3AED' },
            { cat: 'film_screening', label: 'Film Screening', color: '#0E7490' },
          ].map(c => (
            <div key={c.cat} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#FFFFFF', borderRadius: 8, padding: '8px 14px',
              border: '1px solid rgba(0,0,0,0.08)',
            }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: '#0E0E0E' }}>
                {c.label}
              </span>
              <span style={S.monoTag}>{c.cat}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
