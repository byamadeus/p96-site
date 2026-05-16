import { supabase, Event } from '@/lib/supabase'
import { seedEvents } from '@/data/seedEvents'
import { NATION_BY_CODE } from '@/lib/nations'
import NationEventsPage from '@/components/WC/NationEventsPage'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { country: string } }) {
  const nation = NATION_BY_CODE[params.country.toUpperCase()]
  if (!nation) return {}
  return {
    title: `${nation.flag} ${nation.name} — P96 World Cup 2026`,
    description: `P96 Culture House events for ${nation.name} at the 2026 FIFA World Cup. Find watch parties and community events in NYC.`,
  }
}

export default async function CountryEventsPage({
  params,
}: {
  params: { country: string }
}) {
  const upper = params.country.toUpperCase()
  const nation = NATION_BY_CODE[upper]
  if (!nation) notFound()

  const hasSupabase = !!process.env.NEXT_PUBLIC_SUPABASE_URL

  const dbEvents: Event[] = hasSupabase
    ? ((await supabase.from('events').select('*').eq('is_published', true).order('date', { ascending: true })).data ?? []) as Event[]
    : []

  const events = [
    ...seedEvents.filter(s => !dbEvents.find(d => d.title === s.title)),
    ...dbEvents,
  ]

  return <NationEventsPage events={events} countryCode={upper} />
}
