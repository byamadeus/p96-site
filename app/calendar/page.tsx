import { supabase, Event } from '@/lib/supabase'
import CalendarView from '@/components/Calendar/CalendarView'

export const revalidate = 60

export default async function CalendarPage() {
  const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL

  const events: Event[] = hasSupabase
    ? ((await supabase.from('events').select('*').eq('is_published', true).order('date', { ascending: true })).data ?? []) as Event[]
    : []

  return <CalendarView events={events} />
}
