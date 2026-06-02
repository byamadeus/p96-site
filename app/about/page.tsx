import ShimmerBar from '@/components/Layout/ShimmerBar'
import Navbar from '@/components/Layout/Navbar'
import PageFooter from '@/components/Layout/PageFooter'
import P96Logo from '@/components/Layout/P96Logo'

const PAGE_GRADIENT = 'radial-gradient(ellipse at 70% 50%, #FFFFFF 0%, #C5E8F5 42%, #7BBAD6 100%)'

const PILLARS = [
  {
    name: 'Project 96',
    tag: 'Apparel',
    desc: 'Culturally-inspired streetwear rooted in the aesthetics and energy of the African diaspora.',
  },
  {
    name: 'Club 96',
    tag: 'Experiences',
    desc: 'Community gatherings, activations, and events — field days, beach days, curated dinners, nightlife, and more.',
  },
  {
    name: 'Channel 96',
    tag: 'Media',
    desc: 'Original content, storytelling, and media produced through our creative lens.',
  },
]

export default function AboutPage() {
  return (
    <>
      <div style={{ position: 'fixed', inset: 0, background: PAGE_GRADIENT, zIndex: -1 }} />

      <div style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
        <ShimmerBar />
        <Navbar light />

        {/* Hero */}
        <div style={{
          padding: 'clamp(48px, 8vw, 96px) clamp(20px, 5vw, 80px) clamp(32px, 5vw, 64px)',
          maxWidth: 960, margin: '0 auto', width: '100%',
        }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'rgba(0,0,0,0.45)',
            marginBottom: 16,
          }}>
            Est. 2016 · New York City
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 8vw, 96px)',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 0.95,
            color: '#0E0E0E',
            textTransform: 'uppercase',
            marginBottom: 'clamp(20px, 3vw, 36px)',
          }}>
            Built by<br />the culture.
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(15px, 2vw, 18px)',
            lineHeight: 1.65,
            color: 'rgba(0,0,0,0.6)',
            maxWidth: 540,
          }}>
            Project 96 is a cultural platform rooted in the African Diaspora.
            We build community through experiences, media, fashion, and products.
            This is our 10th year.
          </p>
        </div>

        {/* Image placeholder */}
        <div style={{
          maxWidth: 960, margin: '0 auto', width: '100%',
          padding: '0 clamp(20px, 5vw, 80px)',
        }}>
          <div style={{
            width: '100%',
            aspectRatio: '16/9',
            background: 'rgba(255,255,255,0.5)',
            border: '1px solid rgba(255,255,255,0.7)',
            borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
            overflow: 'hidden',
          }}>
            <P96Logo color="rgba(0,0,0,0.12)" height={48} />
          </div>
        </div>

        {/* Body copy */}
        <div style={{
          maxWidth: 960, margin: '0 auto', width: '100%',
          padding: 'clamp(40px, 6vw, 72px) clamp(20px, 5vw, 80px)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'clamp(24px, 4vw, 48px)',
          alignItems: 'start',
        }}>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(22px, 3vw, 30px)',
              fontWeight: 800, letterSpacing: '-0.03em',
              color: '#0E0E0E', marginBottom: 14, lineHeight: 1.1,
              textTransform: 'uppercase',
            }}>
              What we do
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 15, lineHeight: 1.7, color: 'rgba(0,0,0,0.6)',
            }}>
              We started as a fashion brand, then evolved into experiences and activations.
              Now we also operate as a boutique creative consultancy. Some opportunities
              position P96 as the brand — others position us as creative partners or collaborators.
            </p>
          </div>
          <div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(22px, 3vw, 30px)',
              fontWeight: 800, letterSpacing: '-0.03em',
              color: '#0E0E0E', marginBottom: 14, lineHeight: 1.1,
              textTransform: 'uppercase',
            }}>
              100+ activations
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 15, lineHeight: 1.7, color: 'rgba(0,0,0,0.6)',
            }}>
              Field days, beach days, curated dinners, nightlife, workshops, film screenings,
              and more — all built around the energy of diaspora culture in New York City.
            </p>
          </div>
        </div>

        {/* Three pillars */}
        <div style={{
          maxWidth: 960, margin: '0 auto', width: '100%',
          padding: '0 clamp(20px, 5vw, 80px) clamp(48px, 8vw, 96px)',
        }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 10, fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)',
            marginBottom: 20,
          }}>
            Three pillars
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 12,
          }}>
            {PILLARS.map(p => (
              <div key={p.name} style={{
                background: 'rgba(255,255,255,0.55)',
                border: '1px solid rgba(255,255,255,0.7)',
                borderRadius: 16,
                padding: '24px 22px 28px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              }}>
                <span style={{
                  display: 'inline-block',
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)',
                  fontFamily: 'var(--font-body)',
                  background: 'rgba(0,0,0,0.05)',
                  borderRadius: 99, padding: '3px 8px',
                  marginBottom: 12,
                }}>
                  {p.tag}
                </span>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em',
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
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }} />
        <PageFooter showContact />
      </div>
    </>
  )
}
