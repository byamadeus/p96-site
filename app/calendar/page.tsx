import { supabase, Event } from '@/lib/supabase'
import CalendarView from '@/components/Calendar/CalendarView'

export const revalidate = 60

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const { date: initialDate } = await searchParams
  const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!hasSupabase) return <CalendarView events={[]} draftDates={new Set()} initialDate={initialDate} />

  // Fetch published events (full data — shown as cards)
  const { data: published } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .order('date', { ascending: true })
    .order('time', { ascending: true, nullsFirst: false })

  const events = (published ?? []) as Event[]
  const publishedDates = new Set(events.map(e => e.date))

  // Fetch draft dates only (no content exposed to client)
  const { data: drafts } = await supabase
    .from('events')
    .select('date')
    .eq('is_published', false)

  // Only lock dates where drafts exist but NO published event on that date
  const draftDates = new Set(
    (drafts ?? [])
      .map(d => d.date as string)
      .filter(d => !publishedDates.has(d))
  )

  return <CalendarView events={events} draftDates={draftDates} initialDate={initialDate} />
}
