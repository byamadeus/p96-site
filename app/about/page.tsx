import ShimmerBar from '@/components/Layout/ShimmerBar'
import Navbar from '@/components/Layout/Navbar'
import PageFooter from '@/components/Layout/PageFooter'
import P96Logo from '@/components/Layout/P96Logo'

const PAGE_GRADIENT = 'radial-gradient(ellipse at 70% 50%, #FFFFFF 0%, #C5E8F5 42%, #7BBAD6 100%)'

function ImagePlaceholder({ aspect = '4/3' }: { aspect?: string }) {
  return (
    <div style={{
      width: '100%',
      aspectRatio: aspect,
      background: 'rgba(255,255,255,0.45)',
      border: '1px solid rgba(255,255,255,0.65)',
      borderRadius: 16,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      flexShrink: 0,
    }}>
      <P96Logo color="rgba(0,0,0,0.1)" height={40} />
    </div>
  )
}

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', background: PAGE_GRADIENT }}>
      <ShimmerBar />
      <Navbar light />

      {/* ── HERO ───────────────────────────────────────────────── */}
      <div style={{
        maxWidth: 1100, margin: '0 auto', width: '100%',
        padding: 'clamp(48px, 8vw, 96px) clamp(24px, 5vw, 80px) clamp(40px, 6vw, 72px)',
      }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)',
          marginBottom: 20,
        }}>
          Est. 2016 · New York City · 10th Year
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(52px, 10vw, 120px)',
          fontWeight: 900,
          letterSpacing: '-0.04em',
          lineHeight: 0.92,
          color: '#0E0E0E',
          textTransform: 'uppercase',
          marginBottom: 'clamp(24px, 4vw, 48px)',
          maxWidth: 800,
        }}>
          Built by<br />the culture.
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(16px, 2vw, 20px)',
          lineHeight: 1.65,
          color: 'rgba(0,0,0,0.6)',
          maxWidth: 560,
        }}>
          Project 96 is a cultural platform rooted in the African Diaspora.
          We build community through experiences, media, fashion, and products.
        </p>
      </div>

      {/* ── SECTION 1: What we do — text left, image right ─────── */}
      <div style={{
        maxWidth: 1100, margin: '0 auto', width: '100%',
        padding: '0 clamp(24px, 5vw, 80px) clamp(48px, 7vw, 80px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'clamp(32px, 5vw, 64px)',
        alignItems: 'center',
      }}>
        <div>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)',
            marginBottom: 16,
          }}>
            Who we are
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 800, letterSpacing: '-0.03em',
            color: '#0E0E0E', marginBottom: 20, lineHeight: 1.05,
            textTransform: 'uppercase',
          }}>
            Fashion.<br />Experiences.<br />Media.
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15, lineHeight: 1.75, color: 'rgba(0,0,0,0.6)',
          }}>
            We started as a fashion brand, then evolved into experiences and activations.
            Now we also operate as a boutique creative consultancy. Some opportunities
            position P96 as the brand — others position us as creative partners or collaborators.
          </p>
        </div>
        <ImagePlaceholder aspect="4/3" />
      </div>

      {/* ── SECTION 2: 100+ activations — image left, text right ─ */}
      <div style={{
        maxWidth: 1100, margin: '0 auto', width: '100%',
        padding: '0 clamp(24px, 5vw, 80px) clamp(48px, 7vw, 80px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'clamp(32px, 5vw, 64px)',
        alignItems: 'center',
      }}>
        {/* Image first on desktop, second on mobile via order */}
        <div style={{ order: 0 }}>
          <ImagePlaceholder aspect="4/3" />
        </div>
        <div style={{ order: 1 }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)',
            marginBottom: 16,
          }}>
            The work
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 800, letterSpacing: '-0.03em',
            color: '#0E0E0E', marginBottom: 20, lineHeight: 1.05,
            textTransform: 'uppercase',
          }}>
            100+<br />activations.
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15, lineHeight: 1.75, color: 'rgba(0,0,0,0.6)',
          }}>
            Field days, beach days, curated dinners, nightlife, workshops, film screenings,
            and more — all built around the energy of diaspora culture in New York City.
          </p>
        </div>
      </div>

      {/* ── THREE PILLARS ──────────────────────────────────────── */}
      <div style={{
        maxWidth: 1100, margin: '0 auto', width: '100%',
        padding: '0 clamp(24px, 5vw, 80px) clamp(64px, 10vw, 112px)',
      }}>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
          textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)',
          marginBottom: 24,
        }}>
          Three pillars
        </p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 12,
        }}>
          {[
            { name: 'Project 96', tag: 'Apparel', desc: 'Culturally-inspired streetwear rooted in the aesthetics and energy of the African diaspora.' },
            { name: 'Club 96', tag: 'Experiences', desc: 'Community gatherings and activations — field days, beach days, curated dinners, nightlife, workshops, film screenings.' },
            { name: 'Channel 96', tag: 'Media', desc: 'Original content, storytelling, and media produced through our creative lens.' },
          ].map(p => (
            <div key={p.name} style={{
              background: 'rgba(255,255,255,0.55)',
              border: '1px solid rgba(255,255,255,0.7)',
              borderRadius: 16,
              padding: '24px 22px 28px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            }}>
              <ImagePlaceholder aspect="16/9" />
              <div style={{ marginTop: 20 }}>
                <span style={{
                  display: 'inline-block',
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)',
                  fontFamily: 'var(--font-body)',
                  background: 'rgba(0,0,0,0.05)',
                  borderRadius: 99, padding: '3px 8px',
                  marginBottom: 10,
                }}>
                  {p.tag}
                </span>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em',
                  color: '#0E0E0E', marginBottom: 8, lineHeight: 1.1,
                }}>
                  {p.name}
                </h3>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 13, lineHeight: 1.65, color: 'rgba(0,0,0,0.55)',
                }}>
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PageFooter showContact />
    </div>
  )
}
