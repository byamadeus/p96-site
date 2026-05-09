import { supabase, Event } from '@/lib/supabase'
import CalendarView from '@/components/Calendar/CalendarView'

export const revalidate = 60

export default async function CalendarPage() {
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .order('date', { ascending: true })

  return <CalendarView events={(data ?? []) as Event[]} />
}
