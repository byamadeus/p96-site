'use client'

import { create } from 'zustand'
import type { EventCategory } from './supabase'

export interface IntakeData {
  nations: string[]    // multi-select 2-letter codes
  borough: string | null
  email: string | null
  phone: string | null
}

interface AppStore {
  intake: IntakeData
  wcMode: boolean
  activeCategory: EventCategory | null
  activeBorough: string | null
  activeNations: string[]

  setIntake: (data: IntakeData) => void
  setWcMode: (v: boolean) => void
  setActiveCategory: (cat: EventCategory | null) => void
  setActiveBorough: (b: string | null) => void
  setActiveNations: (n: string[]) => void
  loadFromCookie: () => void
}

export const useAppStore = create<AppStore>((set, get) => ({
  intake: { nations: [], borough: null, email: null, phone: null },
  wcMode: false,
  activeCategory: null,
  activeBorough: null,
  activeNations: [],

  setIntake: (data) => set({ intake: data }),

  setWcMode: (v) => {
    set({ wcMode: v })
    if (v) {
      set({ activeCategory: 'watch_party', activeNations: get().intake.nations })
    } else {
      set({ activeCategory: null })
    }
  },

  setActiveCategory: (cat) => {
    set({ activeCategory: cat })
    if (cat === 'watch_party') {
      set({ wcMode: true, activeNations: get().intake.nations })
    } else if (cat !== null) {
      set({ wcMode: false })
    }
  },

  setActiveBorough: (b) => set({ activeBorough: b }),

  setActiveNations: (n) => set({ activeNations: n }),

  loadFromCookie: () => {
    try {
      const cookie = document.cookie.split(';').find(c => c.trim().startsWith('p96_intake='))
      if (cookie) {
        const raw = cookie.trim().slice('p96_intake='.length)
        const parsed = JSON.parse(decodeURIComponent(raw))
        const data: IntakeData = {
          nations: Array.isArray(parsed.nations) ? parsed.nations
            : parsed.country ? [parsed.country] : [],
          borough: parsed.borough ?? null,
          email: parsed.email ?? null,
          phone: parsed.phone ?? null,
        }
        set({ intake: data, activeNations: data.nations, activeBorough: data.borough })
      }
    } catch {
      // no cookie or invalid
    }
  },
}))

export function saveIntakeCookie(data: IntakeData) {
  const payload = { ...data, ts: Date.now() }
  document.cookie = `p96_intake=${encodeURIComponent(JSON.stringify(payload))}; path=/; max-age=${60 * 60 * 24 * 180}`
}

export function hasIntakeCookie(): boolean {
  if (typeof document === 'undefined') return false
  return document.cookie.split(';').some(c => c.trim().startsWith('p96_intake='))
}
