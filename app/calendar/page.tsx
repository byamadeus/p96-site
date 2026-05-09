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

  // In dev, always layer seed events under real DB events
  const events =
    process.env.NODE_ENV === 'development'
      ? [...seedEvents.filter(s => !dbEvents.find(d => d.title === s.title)), ...dbEvents]
      : dbEvents

  return <CalendarView events={events} />
}
