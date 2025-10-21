'use client'

import { useEffect, useRef, useState, type FocusEvent } from 'react'
import Link from 'next/link'
import type { LocationSummary, ServiceSummary } from '@/types'

type MegaMenuProps = {
  services?: ServiceSummary[]
  locations?: LocationSummary[]
}

type MenuKey = 'services' | 'locations'

const menuConfig: Array<{ key: MenuKey; label: string }> = [
  { key: 'services', label: 'Services' },
  { key: 'locations', label: 'Locations' },
]

export default function MegaMenu({ services = [], locations = [] }: MegaMenuProps) {
  const [open, setOpen] = useState<MenuKey | null>(null)
  const closeTimeout = useRef<NodeJS.Timeout | null>(null)

  const normalizeHref = (href: string) => {
    if (!href) return '#'
    const sanitized = href.startsWith('/') ? href : `/${href}`
    return sanitized.replace(/\/+/g, '/')
  }

  const servicesItems = services.map((service) => ({ label: service.title, href: normalizeHref(`/services/${service.slug}`) }))
  const locationsItems = locations.map((location) => ({ label: location.city, href: normalizeHref(`/locations/${location.slug}`) }))

  const itemsByKey: Record<MenuKey, Array<{ label: string; href: string }>> = {
    services: servicesItems,
    locations: locationsItems,
  }

  const hasServices = itemsByKey.services.length > 0
  const hasLocations = itemsByKey.locations.length > 0

  const clearClose = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current)
      closeTimeout.current = null
    }
  }

  const openMenu = (key: MenuKey) => {
    clearClose()
    setOpen(key)
  }

  const scheduleClose = () => {
    clearClose()
    closeTimeout.current = setTimeout(() => setOpen(null), 120)
  }

  useEffect(() => () => clearClose(), [])

  if (!hasServices && !hasLocations) {
    return null
  }

  return (
    <div className="relative flex h-full items-center gap-4">
      {menuConfig.map(({ key, label }) => {
        const items = itemsByKey[key]
        if (items.length === 0) return null

        const isOpen = open === key

        const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            scheduleClose()
          }
        }

        return (
          <div
            key={key}
            className="relative"
            onPointerEnter={() => openMenu(key)}
            onPointerLeave={scheduleClose}
            onFocusCapture={() => openMenu(key)}
            onBlurCapture={handleBlur}
          >
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm font-medium text-muted transition hover:text-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-primary)]"
              aria-expanded={isOpen}
              aria-haspopup="true"
            >
              {label}
              <span aria-hidden className="text-xs">▾</span>
            </button>

            {isOpen ? (
              <div
                className="absolute left-1/2 top-full z-30 w-[320px] -translate-x-1/2 translate-y-3 rounded-2xl border border-divider bg-surface p-4 shadow-elevated"
                onPointerEnter={() => openMenu(key)}
                onPointerLeave={scheduleClose}
              >
                <ul className="max-h-80 overflow-auto pr-2 text-sm">
                  {items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block rounded-md px-3 py-2 text-left text-muted transition hover:bg-surface-muted hover:text-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-primary)]"
                        onClick={() => setOpen(null)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
