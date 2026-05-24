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
  background: '#FAFAFA',
  border: '1px solid rgba(0,0,0,0.12)',
  borderRadius: 8,
  padding: '10px 12px',
  fontSize: 14,
  color: '#111',
  fontFamily: 'var(--font-body)',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'rgba(0,0,0,0.4)',
  marginBottom: 5,
  display: 'block',
  fontFamily: 'var(--font-body)',
}

function Field({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={labelStyle}>{name}</span>
      {children}
    </div>
  )
}

interface Props {
  existing?: Event
  initialDate?: string
  onSaved: () => void
  onCancel?: () => void
}

export default function EventForm({ existing, initialDate, onSaved, onCancel }: Props) {
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
      : { ...EMPTY, date: initialDate ?? '' }
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
            style={{ ...input, fontSize: 13 }}
            value={form.flier_url ?? ''}
            onChange={e => set('flier_url', e.target.value)}
            placeholder="Paste image URL or upload below"
          />
          <label style={{
            cursor: 'pointer', padding: '9px 12px',
            background: '#FAFAFA', border: '1px dashed rgba(0,0,0,0.15)', borderRadius: 8,
            textAlign: 'center', fontSize: 12, fontWeight: 600,
            color: 'rgba(0,0,0,0.45)', letterSpacing: '0.06em',
            fontFamily: 'var(--font-body)', textTransform: 'uppercase',
          }}>
            {uploading ? 'Uploading…' : '+ Upload image'}
            <input type="file" accept="image/*" onChange={uploadFlier} style={{ display: 'none' }} />
          </label>
          {form.flier_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.flier_url} alt="Flier preview" style={{ width: '100%', borderRadius: 8, maxHeight: 200, objectFit: 'cover' }} />
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
        <span style={labelStyle}>Additional links</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(form.additional_links ?? []).map((link, i) => (
            <div key={i} style={{ display: 'flex', gap: 8 }}>
              <input style={{ ...input, flex: '0 0 120px' }} placeholder="Label" value={link.label} onChange={e => updateLink(i, 'label', e.target.value)} />
              <input style={{ ...input, flex: 1 }} placeholder="https://…" value={link.url} onChange={e => updateLink(i, 'url', e.target.value)} />
              <button type="button" onClick={() => removeLink(i)} style={{ background: 'none', border: 'none', color: 'rgba(0,0,0,0.3)', cursor: 'pointer', padding: '0 4px', display: 'flex', alignItems: 'center' }}>
                <X size={16} strokeWidth={2} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addLink}
            style={{ alignSelf: 'flex-start', background: 'none', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 8, color: 'rgba(0,0,0,0.45)', fontSize: 12, fontWeight: 600, padding: '7px 12px', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
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
            width: 44, height: 24, borderRadius: 12,
            background: form.is_published ? '#1A7F3C' : 'rgba(0,0,0,0.12)',
            position: 'relative', transition: 'background 0.2s', flexShrink: 0,
          }}
        >
          <div style={{
            position: 'absolute', top: 3,
            left: form.is_published ? 23 : 3,
            width: 18, height: 18, borderRadius: '50%',
            background: '#fff', transition: 'left 0.2s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }} />
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-body)', color: form.is_published ? '#1A7F3C' : 'rgba(0,0,0,0.45)' }}>
          {form.is_published ? 'Publish immediately' : 'Save as draft'}
        </span>
      </label>

      {error && <p style={{ fontSize: 13, color: '#E8412C', fontFamily: 'var(--font-body)' }}>{error}</p>}

      <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
        <button
          type="submit"
          disabled={saving || uploading}
          style={{
            flex: 1, padding: '13px',
            background: '#111', color: '#fff',
            border: 'none', borderRadius: 99,
            fontSize: 13, fontWeight: 800,
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.04em', textTransform: 'uppercase',
            cursor: saving || uploading ? 'default' : 'pointer',
            opacity: saving || uploading ? 0.6 : 1,
          }}
        >
          {saving ? 'Saving…' : existing ? 'Save Changes' : 'Create Event'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '13px 20px', background: 'none',
              border: '1px solid rgba(0,0,0,0.12)', borderRadius: 99,
              color: 'rgba(0,0,0,0.45)', fontSize: 13,
              fontFamily: 'var(--font-body)', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
