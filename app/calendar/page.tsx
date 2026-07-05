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

  // Fetch draft dates via SECURITY DEFINER function (bypasses RLS, returns dates only — no draft content exposed)
  const { data: draftRows } = await supabase.rpc('get_draft_dates')

  // Only lock dates where drafts exist but NO published event on that date
  const draftDates = new Set(
    ((draftRows ?? []) as string[])
      .filter(d => !publishedDates.has(d))
  )

  return <CalendarView events={events} draftDates={draftDates} initialDate={initialDate} />
}
