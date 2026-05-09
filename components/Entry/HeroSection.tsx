export default function HeroSection() {
  return (
    <section style={{ paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-8)' }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--c-gold)',
          marginBottom: 'var(--space-4)',
        }}
      >
        FIFA World Cup 2026
      </p>

      <h1
        style={{
          fontSize: 40,
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          marginBottom: 'var(--space-6)',
        }}
      >
        Your game.
        <br />
        Your people.
        <br />
        Your summer.
      </h1>

      <p
        style={{
          fontSize: 16,
          fontWeight: 400,
          lineHeight: 1.6,
          color: 'var(--c-text-muted)',
          maxWidth: 320,
        }}
      >
        Find where the diaspora watches. Discover P96 events. Bring your people.
      </p>
    </section>
  )
}
