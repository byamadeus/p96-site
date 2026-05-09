export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        padding: '0 var(--page-padding)',
        minHeight: '100dvh',
      }}
    >
      {children}
    </div>
  )
}
