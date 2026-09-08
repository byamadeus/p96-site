// Access gate — green gradient splash with P96 mark, "Get Access" routes into the calendar.
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import './access.css'

export default function AccessGate() {
  const router = useRouter()

  useEffect(() => {
    document.documentElement.style.backgroundColor = '#2F6957'
    document.body.style.backgroundColor = 'transparent'
    return () => {
      document.documentElement.style.backgroundColor = ''
      document.body.style.backgroundColor = ''
    }
  }, [])

  return (
    <>
      <style>{`
        @keyframes ctaPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(14,14,14,0.25); }
          50%       { box-shadow: 0 0 0 8px rgba(14,14,14,0); }
        }
        @keyframes markFloat {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-3%); }
        }
      `}</style>

      <main style={{
        minHeight: '100dvh',
        background: 'radial-gradient(ellipse at 70% 50%, #FFFFFF 0%, #ACC3BC 42%, #2F6957 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>

        <div className="logo-mark-container" style={{ animation: 'markFloat 6s ease-in-out infinite' }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 25 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="P96 logo"
            style={{ display: 'block' }}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.41733 0.0198668C6.97252 -0.0354936 7.969 0.0426437 8.52704 0.132486C10.0933 0.384613 11.7259 1.07393 12.6791 2.39372C15.853 -0.368605 19.3448 -0.393913 23.2365 0.590554L23.2333 5.8229C21.4814 4.95422 19.6516 4.58251 17.6776 4.60592C15.8887 4.67109 13.9176 5.10765 12.562 6.34709C12.2953 6.59067 11.9951 7.31067 12.5725 7.33756C12.9752 7.35623 13.6544 7.18255 14.064 7.08639C16.7245 6.46319 19.8357 5.91085 22.0843 7.90888C23.437 9.11827 23.9523 10.7857 24.1001 12.5503C24.4439 16.658 21.9303 19.8898 17.7115 20.0958C15.685 20.2407 13.3491 19.6861 11.8714 18.2417C11.7772 18.1493 11.6861 18.0557 11.5972 17.9601C11.5228 17.8804 11.4498 17.7991 11.377 17.7162C11.0894 18.1869 10.0034 18.8101 9.49885 19.0746C7.19459 20.2837 4.45125 20.3182 1.95307 19.7883C1.58864 19.7111 1.22105 19.5959 0.854401 19.5368L0.863259 16.1699C0.863575 16.0168 0.865157 15.8517 0.866738 15.6809V15.6597C0.871484 15.1858 0.876545 14.6723 0.854401 14.2608C1.01764 14.3702 1.24888 14.4699 1.44976 14.5566L1.57725 14.6119C2.7085 15.113 3.90112 15.3493 5.12696 15.4591C6.7903 15.6078 8.57133 15.4313 10.092 14.7071C10.5684 14.5018 10.9597 14.2611 11.3631 13.9353C11.618 13.7296 12.0679 13.1716 11.7876 12.8527C11.5076 12.6863 10.3194 12.9597 9.46342 13.1564L9.45867 13.1574C9.12493 13.2342 8.84212 13.2991 8.68426 13.3215C8.04398 13.4225 7.398 13.55 6.75108 13.5961C2.76386 13.8812 0.256192 11.4905 0.018617 7.5144C-0.234459 3.28328 2.1027 0.30869 6.41733 0.0198668ZM18.4878 11.4915L18.3682 11.4988C16.9175 11.5674 15.5214 11.8398 14.1017 12.1482C14.0542 12.7993 13.7588 14.0868 13.469 14.6885C13.6616 14.7198 13.8521 14.7609 14.0428 14.802L14.0466 14.803L14.132 14.821C14.2908 14.8552 14.4503 14.8881 14.6116 14.915C15.5743 15.0697 16.5477 15.1462 17.5226 15.1437C18.8035 15.1083 20.0904 15.0339 21.2979 14.5673C21.9417 14.3184 22.3652 13.8182 22.3434 13.1071C22.3406 13.0096 22.3358 12.9179 22.3263 12.8306C22.3187 12.761 22.3083 12.6942 22.2934 12.6297C22.276 12.5544 22.2529 12.4823 22.2216 12.4124C22.1814 12.3232 22.1283 12.2374 22.0571 12.1533C22.022 12.1118 21.9828 12.0707 21.9385 12.0299C21.7689 11.8733 21.5677 11.755 21.3485 11.6826C20.7066 11.4668 19.185 11.4567 18.4878 11.4915ZM6.2522 4.98459C7.78869 4.9093 9.05818 5.13295 10.5374 5.39299L10.6725 5.41672C10.2941 6.15348 10.1081 7.14902 9.97147 7.95855L9.68771 8.01929L9.11228 8.14171C8.81807 8.20372 8.52577 8.26351 8.23284 8.31887C7.56282 8.44572 6.89058 8.5498 6.18893 8.60484C6.08738 8.60896 5.97761 8.61433 5.86151 8.62003H5.85867C4.73437 8.67412 3.00903 8.75732 2.18716 8.1009C1.64242 7.66593 1.60635 6.47742 2.11915 5.99689C3.04667 5.12821 5.05515 5.03742 6.2522 4.98459Z"
              fill="#0E0E0E"
            />
          </svg>
        </div>

        <div className="landing-content" style={{
          position: 'relative', zIndex: 1,
          margin: '0 auto',
          minHeight: '100dvh', boxSizing: 'border-box',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          pointerEvents: 'none',
        }}>
          {/* Logo block — top left */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', pointerEvents: 'auto', width: 'fit-content' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/landing/image-1779745706618.webp" alt="Project96" draggable={false}
              style={{ maxWidth: 130, width: '100%', height: 'auto' }}
            />
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#0E0E0E', opacity: 0.45,
              display: 'block', textAlign: 'left', width: '100%',
              marginTop: 4, padding: '0 4px',
            }}>Presents</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', pointerEvents: 'auto' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px, 3.2vw, 48px)',
              fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.04em',
              color: '#0E0E0E', textTransform: 'uppercase', marginBottom: 20,
            }}>
              Culture<br />Community<br />Every<br />Day
            </h1>
            <p style={{ backgroundColor: '#000000', padding: '2px 4px',
              fontFamily: 'var(--font-body)', fontSize: 11,
              letterSpacing: '0.09em', textTransform: 'uppercase', fontWeight: 700,
              color: '#ffffffd3', opacity: 1, marginBottom: 6,
            }}>NYC • New York City</p>

            <p style={{
              fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.13em', textTransform: 'uppercase',
              color: '#0E0E0E', opacity: 0.55, marginBottom: 24,
            }}>Music · Art · Wellness · Food · Film</p>

            <button onClick={() => router.push('/calendar')} className="get-access-btn" style={{
              background: '#0E0E0E', color: '#FFFFFF', border: 'none', borderRadius: 4,
              padding: '16px 48px', fontSize: 13, fontWeight: 800,
              fontFamily: 'var(--font-display)', letterSpacing: '0.1em',
              textTransform: 'uppercase', cursor: 'pointer', marginBottom: 16,
              animation: 'ctaPulse 3s ease-in-out 2s infinite',
            }}>Get Access</button>
          </div>
        </div>
      </main>

    </>
  )
}
