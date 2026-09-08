import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder'

export const supabase = createClient(url, key)

export type EventCategory =
  | 'watch_party'
  | 'hangout'
  | 'entertainment'
  | 'education_workshops'
  | 'wellness'
  | 'art'
  | 'music'
  | 'fashion'
  | 'film'
  | 'athletic'
  | 'food'

const FALLBACK_META = { label: 'EVENT', color: 'var(--c-text-muted)', bg: 'var(--c-surface)', border: 'var(--c-border)' }

const _CATEGORY_META: Record<EventCategory, { label: string; color: string; bg: string; border: string }> = {
  watch_party:         { label: 'WATCH PARTY',        color: 'var(--c-gold)',       bg: 'rgba(255,218,68,0.07)',  border: 'var(--c-gold)' },
  hangout:             { label: 'HANGOUT',             color: 'var(--c-green)',      bg: 'rgba(26,127,60,0.07)',   border: 'var(--c-green)' },
  entertainment:       { label: 'ENTERTAINMENT',       color: 'var(--c-red)',        bg: 'rgba(232,65,44,0.07)',   border: 'var(--c-red)' },
  education_workshops: { label: 'EDUCATION / WORKSHOPS', color: 'var(--c-orange)',   bg: 'rgba(249,123,34,0.07)',  border: 'var(--c-orange)' },
  wellness:            { label: 'WELLNESS',            color: 'var(--c-green)',      bg: 'rgba(26,127,60,0.07)',   border: 'var(--c-green)' },
  art:                 { label: 'ART',                 color: 'var(--c-blue)',       bg: 'rgba(27,79,216,0.07)',   border: 'var(--c-blue)' },
  music:               { label: 'MUSIC',                color: 'var(--c-red)',       bg: 'rgba(232,65,44,0.07)',   border: 'var(--c-red)' },
  fashion:             { label: 'FASHION',             color: 'var(--c-gold)',       bg: 'rgba(255,218,68,0.07)',  border: 'var(--c-gold)' },
  film:                { label: 'FILM',                color: 'var(--c-text-muted)', bg: 'var(--c-surface)',       border: 'var(--c-border)' },
  athletic:            { label: 'ATHLETIC',            color: 'var(--c-blue)',       bg: 'rgba(27,79,216,0.07)',   border: 'var(--c-blue)' },
  food:                { label: 'FOOD',                 color: 'var(--c-orange)',    bg: 'rgba(249,123,34,0.07)',  border: 'var(--c-orange)' },
}

export function getCategoryMeta(cat: string) {
  return _CATEGORY_META[cat as EventCategory] ?? FALLBACK_META
}

export const CATEGORY_META = _CATEGORY_META

export interface Event {
  id: string
  created_at: string
  title: string
  description: string | null
  category: EventCategory
  date: string
  time: string | null
  location_name: string | null
  location_address: string | null
  flier_url: string | null
  rsvp_url: string | null
  additional_links: { label: string; url: string }[] | null
  game_id: number | null
  is_published: boolean
  recap_url?: string | null
}

export interface Intake {
  id: string
  created_at: string
  email: string
  phone: string | null
  country: string | null
  borough: string | null
}
