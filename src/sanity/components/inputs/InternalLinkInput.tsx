import {useEffect, useMemo, useState, type ChangeEvent} from 'react'
import {set, unset, useClient, type StringInputProps} from 'sanity'

type Option = {
  title: string
  value: string
}

type LinkDataset = {
  pages?: Array<{title?: string; slug?: string}>
  services?: Array<{title?: string; slug?: string}>
  locations?: Array<{city?: string; slug?: string}>
  offers?: Array<{title?: string; slug?: string}>
}

const BASE_OPTIONS: Option[] = [
  {title: 'Home', value: '/'},
  {title: 'Services (index)', value: '/services'},
  {title: 'Locations (index)', value: '/locations'},
  {title: 'Offers (index)', value: '/offers'},
]

export function InternalLinkInput(props: StringInputProps) {
  const {value, onChange, readOnly, elementProps} = props
  const client = useClient({apiVersion: '2025-10-16'})
  const [loading, setLoading] = useState(true)
  const [options, setOptions] = useState<Option[]>(BASE_OPTIONS)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function loadOptions() {
      setLoading(true)
      setError(null)
      try {
        const data = await client.fetch<LinkDataset>(`{
          "pages": *[_type == "page" && defined(slug.current)]{ title, "slug": slug.current },
          "services": *[_type == "service" && defined(slug.current)]{ title, "slug": slug.current },
          "locations": *[_type == "location" && defined(slug.current)]{ city, "slug": slug.current },
          "offers": *[_type == "offer" && defined(slug.current)]{ title, "slug": slug.current }
        }`)

        if (cancelled) return

        const unique = new Map<string, Option>()
        BASE_OPTIONS.forEach((option) => unique.set(option.value, option))

        data.pages?.forEach((page) => {
          if (!page?.slug) return
          const path = page.slug === 'home' ? '/' : `/${page.slug}`
          if (!unique.has(path)) {
            unique.set(path, {title: page.title ? `${page.title} (Page)` : path, value: path})
          }
        })

        data.services?.forEach((service) => {
          if (!service?.slug) return
          const path = `/services/${service.slug}`
          if (!unique.has(path)) {
            unique.set(path, {title: service.title ? `${service.title} (Service)` : path, value: path})
          }
        })

        data.locations?.forEach((location) => {
          if (!location?.slug) return
          const path = `/locations/${location.slug}`
          if (!unique.has(path)) {
            unique.set(path, {title: location.city ? `${location.city} (Location)` : path, value: path})
          }
        })

        data.offers?.forEach((offer) => {
          if (!offer?.slug) return
          const path = `/offers/${offer.slug}`
          if (!unique.has(path)) {
            unique.set(path, {title: offer.title ? `${offer.title} (Offer)` : path, value: path})
          }
        })

        setOptions(Array.from(unique.values()))
      } catch (err) {
        console.error('Failed to load internal link options', err)
        setError('Unable to load site URLs. You can still enter a path manually.')
        setOptions(BASE_OPTIONS)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadOptions()
    return () => {
      cancelled = true
    }
  }, [client])

  const selectValue = useMemo(() => {
    if (!value) return ''
    return options.some((option) => option.value === value) ? value : ''
  }, [options, value])

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextValue = event.currentTarget.value
    if (!nextValue) {
      onChange(unset())
      return
    }
    onChange(set(nextValue))
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.currentTarget.value.trim()
    if (!nextValue) {
      onChange(unset())
      return
    }
    onChange(set(nextValue.startsWith('/') ? nextValue : `/${nextValue}`))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', fontWeight: 500 }}>
        <span>Internal URL</span>
        <select
          value={selectValue}
          onChange={handleSelectChange}
          disabled={readOnly || loading}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d4d4d8', fontSize: '0.9rem' }}
        >
          <option value="">{loading ? 'Loading…' : 'Select a page…'}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.title}
            </option>
          ))}
        </select>
        {loading ? <span style={{ fontSize: '0.75rem', color: '#71717a' }}>Loading site paths…</span> : null}
      </label>

      <label style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem', fontWeight: 500 }}>
        <span>Custom path</span>
        <input
          {...elementProps}
          value={value ?? ''}
          onChange={handleInputChange}
          placeholder="/contact"
          readOnly={readOnly}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d4d4d8', fontSize: '0.9rem' }}
        />
        <span style={{ fontSize: '0.75rem', color: '#71717a' }}>
          Add a relative path beginning with “/”. Selecting an option above will fill this field automatically.
        </span>
      </label>

      {error ? <span style={{ fontSize: '0.75rem', color: '#dc2626' }}>{error}</span> : null}
    </div>
  )
}
