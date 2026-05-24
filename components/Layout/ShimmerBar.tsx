export default function ShimmerBar() {
  return (
    <>
      <div style={{
        height: 3,
        flexShrink: 0,
        background: 'linear-gradient(90deg, var(--c-gold) 0%, var(--c-red) 50%, var(--c-gold) 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 3s linear infinite',
      }} />
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 0%   0% }
          100% { background-position: 200% 0% }
        }
      `}</style>
    </>
  )
}
