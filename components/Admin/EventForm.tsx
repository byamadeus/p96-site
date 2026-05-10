'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { supabase, Event, EventCategory } from '@/lib/supabase'
import { matches } from '@/data/matches'

const EMPTY: Omit<Event, 'id' | 'created_at'> = {
  title: '',
  description: '',
  category: 'watch_party',
  date: '',
  time: '',
  location_name: '',
  location_address: '',
  flier_url: '',
  rsvp_url: '',
  additional_links: [],
  game_id: null,
  is_published: false,
}

const input: React.CSSProperties = {
  width: '100%',
  background: '#1a1a1a',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 6,
  padding: '10px 12px',
  fontSize: 14,
  color: '#fff',
  fontFamily: 'inherit',
  outline: 'none',
}

const label: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'rgba(255,255,255,0.45)',
  marginBottom: 4,
  display: 'block',
}

function Field({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={label}>{name}</span>
      {children}
    </div>
  )
}

interface Props {
  existing?: Event
  onSaved: () => void
  onCancel?: () => void
}

export default function EventForm({ existing, onSaved, onCancel }: Props) {
  const [form, setForm] = useState<Omit<Event, 'id' | 'created_at'>>(
    existing
      ? {
          title: existing.title,
          description: existing.description ?? '',
          category: existing.category,
          date: existing.date,
          time: existing.time ?? '',
          location_name: existing.location_name ?? '',
          location_address: existing.location_address ?? '',
          flier_url: existing.flier_url ?? '',
          rsvp_url: existing.rsvp_url ?? '',
          additional_links: existing.additional_links ?? [],
          game_id: existing.game_id,
          is_published: existing.is_published,
        }
      : { ...EMPTY }
  )

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function uploadFlier(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `fliers/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('fliers').upload(path, file)
    if (error) {
      setError(`Upload failed: ${error.message}`)
    } else {
      const { data } = supabase.storage.from('fliers').getPublicUrl(path)
      set('flier_url', data.publicUrl)
    }
    setUploading(false)
  }

  function addLink() {
    set('additional_links', [...(form.additional_links ?? []), { label: '', url: '' }])
  }

  function updateLink(i: number, key: 'label' | 'url', val: string) {
    const links = [...(form.additional_links ?? [])]
    links[i] = { ...links[i], [key]: val }
    set('additional_links', links)
  }

  function removeLink(i: number) {
    set('additional_links', (form.additional_links ?? []).filter((_, idx) => idx !== i))
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = {
      ...form,
      description: form.description || null,
      time: form.time || null,
      location_name: form.location_name || null,
      location_address: form.location_address || null,
      flier_url: form.flier_url || null,
      rsvp_url: form.rsvp_url || null,
      additional_links: form.additional_links?.length ? form.additional_links : null,
      game_id: form.game_id || null,
    }

    const { error } = existing
      ? await supabase.from('events').update(payload).eq('id', existing.id)
      : await supabase.from('events').insert(payload)

    if (error) {
      setError(error.message)
    } else {
      onSaved()
    }
    setSaving(false)
  }

  return (
    <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Field name="Title *">
        <input style={input} required value={form.title} onChange={e => set('title', e.target.value)} placeholder="Morocco Watch Party" />
      </Field>

      <Field name="Category">
        <select style={{ ...input, cursor: 'pointer' }} value={form.category} onChange={e => set('category', e.target.value as EventCategory)}>
          <option value="watch_party">World Cup Watch Party</option>
          <option value="talks">Talks</option>
          <option value="workshop">Workshop</option>
          <option value="hangout">Hangout</option>
          <option value="collaboration">Collaboration</option>
          <option value="film_screening">Film Screening</option>
        </select>
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field name="Date *">
          <input style={input} type="date" required value={form.date} onChange={e => set('date', e.target.value)} />
        </Field>
        <Field name="Time">
          <input style={input} type="time" value={form.time ?? ''} onChange={e => set('time', e.target.value)} />
        </Field>
      </div>

      <Field name="Venue name">
        <input style={input} value={form.location_name ?? ''} onChange={e => set('location_name', e.target.value)} placeholder="P96 Culture House" />
      </Field>

      <Field name="Address">
        <input style={input} value={form.location_address ?? ''} onChange={e => set('location_address', e.target.value)} placeholder="1234 Atlantic Ave, Brooklyn" />
      </Field>

      <Field name="Description">
        <textarea
          style={{ ...input, minHeight: 80, resize: 'vertical' }}
          value={form.description ?? ''}
          onChange={e => set('description', e.target.value)}
          placeholder="What's going down…"
        />
      </Field>

      <Field name="RSVP link">
        <input style={input} value={form.rsvp_url ?? ''} onChange={e => set('rsvp_url', e.target.value)} placeholder="https://lu.ma/..." />
      </Field>

      <Field name="Flier image">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            style={{ ...input, padding: '8px 12px', fontSize: 13 }}
            value={form.flier_url ?? ''}
            onChange={e => set('flier_url', e.target.value)}
            placeholder="Paste URL or upload below"
          />
          <label style={{ ...label, cursor: 'pointer', padding: '8px 12px', background: '#1a1a1a', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: 6, textAlign: 'center', textTransform: 'none', fontSize: 12 }}>
            {uploading ? 'Uploading…' : '+ Upload image'}
            <input type="file" accept="image/*" onChange={uploadFlier} style={{ display: 'none' }} />
          </label>
          {form.flier_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.flier_url} alt="Flier preview" style={{ width: '100%', borderRadius: 6, maxHeight: 200, objectFit: 'cover' }} />
          )}
        </div>
      </Field>

      <Field name="Attach to WC match (optional)">
        <select style={{ ...input, cursor: 'pointer' }} value={form.game_id ?? ''} onChange={e => set('game_id', e.target.value ? Number(e.target.value) : null)}>
          <option value="">None</option>
          {matches.map(m => (
            <option key={m.id} value={m.id}>
              {m.date} · {m.teamA.name} vs {m.teamB.name} · {m.city}
            </option>
          ))}
        </select>
      </Field>

      {/* Additional links */}
      <div>
        <span style={label}>Additional links</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(form.additional_links ?? []).map((link, i) => (
            <div key={i} style={{ display: 'flex', gap: 8 }}>
              <input style={{ ...input, flex: '0 0 120px' }} placeholder="Label" value={link.label} onChange={e => updateLink(i, 'label', e.target.value)} />
              <input style={{ ...input, flex: 1 }} placeholder="https://…" value={link.url} onChange={e => updateLink(i, 'url', e.target.value)} />
              <button type="button" onClick={() => removeLink(i)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '0 4px', display: 'flex', alignItems: 'center' }}><X size={16} strokeWidth={2} /></button>
            </div>
          ))}
          <button
            type="button"
            onClick={addLink}
            style={{ alignSelf: 'flex-start', background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: 'rgba(255,255,255,0.45)', fontSize: 12, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            + Add link
          </button>
        </div>
      </div>

      {/* Published toggle */}
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
        <div
          onClick={() => set('is_published', !form.is_published)}
          style={{
            width: 44,
            height: 24,
            borderRadius: 12,
            background: form.is_published ? '#1A7F3C' : '#333',
            position: 'relative',
            transition: 'background 0.2s',
            flexShrink: 0,
          }}
        >
          <div style={{
            position: 'absolute',
            top: 3,
            left: form.is_published ? 23 : 3,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 0.2s',
          }} />
        </div>
        <span style={{ fontSize: 13, color: form.is_published ? '#fff' : 'rgba(255,255,255,0.45)' }}>
          {form.is_published ? 'Published' : 'Draft'}
        </span>
      </label>

      {error && <p style={{ fontSize: 13, color: '#E8412C' }}>{error}</p>}

      <div style={{ display: 'flex', gap: 10, paddingTop: 8 }}>
        <button
          type="submit"
          disabled={saving || uploading}
          style={{ flex: 1, padding: '12px', background: '#F5C842', color: '#000', border: 'none', borderRadius: 99, fontSize: 14, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer' }}
        >
          {saving ? 'Saving…' : existing ? 'Save changes' : 'Create event'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={{ padding: '12px 20px', background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 99, color: 'rgba(255,255,255,0.45)', fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
