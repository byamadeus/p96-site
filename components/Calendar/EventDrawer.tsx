'use client'

// Legacy wrapper — CalendarView now uses EventDetail inside Vaul.
// Kept for any standalone usage outside CalendarView.

import { Event } from '@/lib/supabase'
import EventDetail from './EventDetail'

export default function EventDrawer({ event, onClose }: { event: Event | null; onClose: () => void }) {
  const open = event !== null

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.65)',
          zIndex: 50,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.25s',
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 51,
          background: 'var(--c-surface)',
          borderRadius: '20px 20px 0 0',
          maxHeight: '88dvh',
          overflowY: 'auto',
          transform: open ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.32s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--c-border-emphasis)', margin: '12px auto 0' }} />
        {event && <EventDetail event={event} />}
      </div>
    </>
  )
}
