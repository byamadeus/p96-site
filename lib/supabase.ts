import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, key)

export type EventType = 'p96_wc' | 'community' | 'p96'

export interface Event {
  id: string
  created_at: string
  title: string
  description: string | null
  type: EventType
  date: string
  time: string | null
  location_name: string | null
  location_address: string | null
  flier_url: string | null
  rsvp_url: string | null
  additional_links: { label: string; url: string }[] | null
  game_id: number | null
  is_published: boolean
}

export interface Intake {
  id: string
  created_at: string
  email: string
  country: string | null
  borough: string | null
}
