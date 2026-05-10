import { supabase, Event } from '@/lib/supabase'
import CalendarView from '@/components/Calendar/CalendarView'
import { seedEvents } from '@/data/seedEvents'

export const revalidate = 60

export default async function CalendarPage() {
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .order('date', { ascending: true })

  const dbEvents = (data ?? []) as Event[]

  // Always show seed events until replaced by real events from admin
  const events = [
    ...seedEvents.filter(s => !dbEvents.find(d => d.title === s.title)),
    ...dbEvents,
  ]

  return <CalendarView events={events} />
}
