'use client'

import { useEffect, useRef, useState, type FocusEvent, type MouseEvent } from 'react'
import Link from 'next/link'
import type { LocationSummary, ServiceSummary } from '@/types'

type MegaMenuProps = {
  services?: ServiceSummary[]
  locations?: LocationSummary[]
  isMobile?: boolean
  onNavigate?: () => void
}

type MenuKey = 'services' | 'locations'

type ServicesByCategory = {
  categoryTitle: string
  categorySlug: string
  services: Array<{ label: string; href: string }>
}

export default function MegaMenu({ services = [], locations = [], isMobile = false, onNavigate }: MegaMenuProps) {
  const [open, setOpen] = useState<MenuKey | null>(null)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [expandedMobileCategory, setExpandedMobileCategory] = useState<string | null>(null)
  const [categoryRect, setCategoryRect] = useState<{ top: number; left: number } | null>(null)
  const closeTimeout = useRef<NodeJS.Timeout | null>(null)
  const categoryTimeout = useRef<NodeJS.Timeout | null>(null)
  const categoriesDropdownRef = useRef<HTMLDivElement>(null)

  const normalizeHref = (href: string) => {
    if (!href) return '#'
    const sanitized = href.startsWith('/') ? href : `/${href}`
    return sanitized.replace(/\/+/g, '/')
  }

  // Group services by category
  const servicesByCategory: ServicesByCategory[] = services.reduce((acc, service) => {
    const categoryTitle = service.category?.title || 'Uncategorized'
    const categorySlug = service.category?.slug || 'uncategorized'

    let category = acc.find(c => c.categorySlug === categorySlug)
    if (!category) {
      category = { categoryTitle, categorySlug, services: [] }
      acc.push(category)
    }

    category.services.push({
      label: service.title,
      href: normalizeHref(`/services/${service.slug}`)
    })

    return acc
  }, [] as ServicesByCategory[])

  // Sort categories by title
  servicesByCategory.sort((a, b) => a.categoryTitle.localeCompare(b.categoryTitle))

  const locationsItems = locations.map((location) => ({
    label: location.city,
    href: normalizeHref(`/locations/${location.slug}`)
  }))

  const hasServices = servicesByCategory.length > 0
  const hasLocations = locationsItems.length > 0

  const clearClose = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current)
      closeTimeout.current = null
    }
  }

  const clearCategoryTimeout = () => {
    if (categoryTimeout.current) {
      clearTimeout(categoryTimeout.current)
      categoryTimeout.current = null
    }
  }

  const openMenu = (key: MenuKey) => {
    clearClose()
    setOpen(key)
  }

  const scheduleClose = () => {
    clearClose()
    closeTimeout.current = setTimeout(() => {
      setOpen(null)
      setHoveredCategory(null)
      setCategoryRect(null)
    }, 300)
  }

  const handleCategoryHover = (categorySlug: string, event: MouseEvent<HTMLLIElement>) => {
    clearCategoryTimeout()
    clearClose()

    // Get the position of the hovered category item
    const rect = event.currentTarget.getBoundingClientRect()
    const dropdownRect = categoriesDropdownRef.current?.getBoundingClientRect()

    if (dropdownRect) {
      setCategoryRect({
        top: rect.top - dropdownRect.top,
        left: dropdownRect.width
      })
    }

    setHoveredCategory(categorySlug)
  }

  const scheduleCategoryClose = () => {
    clearCategoryTimeout()
    categoryTimeout.current = setTimeout(() => {
      setHoveredCategory(null)
      setCategoryRect(null)
    }, 200)
  }

  const keepSubmenuOpen = () => {
    clearCategoryTimeout()
    clearClose()
  }

  const handleLinkClick = () => {
    setOpen(null)
    setHoveredCategory(null)
    setExpandedMobileCategory(null)
    setCategoryRect(null)
    onNavigate?.()
  }

  const toggleMobileCategory = (categorySlug: string) => {
    setExpandedMobileCategory(expandedMobileCategory === categorySlug ? null : categorySlug)
  }

  useEffect(() => {
    return () => {
      clearClose()
      clearCategoryTimeout()
    }
  }, [])

  if (!hasServices && !hasLocations) {
    return null
  }

  // Mobile accordion-style menu with nested accordions for categories
  if (isMobile) {
    return (
      <div className="flex flex-col">
        {hasServices && (
          <div className="border-b border-divider">
            <button
              type="button"
              onClick={() => setOpen(open === 'services' ? null : 'services')}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-base font-medium text-strong"
            >
              Services
              <span aria-hidden className={`transition-transform ${open === 'services' ? 'rotate-180' : ''}`}>
                ▾
              </span>
            </button>
            {open === 'services' && (
              <div className="bg-surface-muted">
                {servicesByCategory.map((category) => (
                  <div key={category.categorySlug} className="border-t border-divider/50">
                    <button
                      type="button"
                      onClick={() => toggleMobileCategory(category.categorySlug)}
                      className="flex w-full items-center justify-between px-6 py-2.5 text-left text-sm font-semibold text-strong"
                    >
                      {category.categoryTitle}
                      <span aria-hidden className={`text-xs transition-transform ${expandedMobileCategory === category.categorySlug ? 'rotate-180' : ''}`}>
                        ▾
                      </span>
                    </button>
                    {expandedMobileCategory === category.categorySlug && (
                      <ul className="bg-surface px-6 pb-2">
                        {category.services.map((service) => (
                          <li key={service.href}>
                            <Link
                              href={service.href}
                              onClick={handleLinkClick}
                              className="block rounded-md px-3 py-2 text-sm text-muted transition hover:bg-brand/10 hover:text-strong"
                            >
                              {service.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {hasLocations && (
          <div className="border-b border-divider">
            <button
              type="button"
              onClick={() => setOpen(open === 'locations' ? null : 'locations')}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-base font-medium text-strong"
            >
              Locations
              <span aria-hidden className={`transition-transform ${open === 'locations' ? 'rotate-180' : ''}`}>
                ▾
              </span>
            </button>
            {open === 'locations' && (
              <div className="bg-surface-muted px-4 pb-4 pt-2">
                <ul className="grid grid-cols-2 gap-1">
                  {locationsItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={handleLinkClick}
                        className="block rounded-md px-3 py-2 text-sm text-muted transition hover:bg-brand/10 hover:text-strong"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  // Desktop mega menu with flyout submenu
  return (
    <div className="relative flex h-full items-center gap-4">
      {hasServices && (
        <div
          className="relative"
          onPointerEnter={() => openMenu('services')}
          onPointerLeave={scheduleClose}
          onFocusCapture={() => openMenu('services')}
          onBlurCapture={(event: FocusEvent<HTMLDivElement>) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              scheduleClose()
            }
          }}
        >
          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted transition hover:text-[var(--color-brand-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-primary)]"
            aria-expanded={open === 'services'}
            aria-haspopup="true"
          >
            Services
            <span aria-hidden className="text-xs">▾</span>
          </button>

          {open === 'services' && (
            <div className="relative">
              {/* Categories dropdown */}
              <div
                ref={categoriesDropdownRef}
                className="absolute left-1/2 top-full z-30 w-[280px] -translate-x-1/2 translate-y-3 rounded-2xl border border-divider bg-surface p-2 shadow-elevated"
                onPointerEnter={keepSubmenuOpen}
                onPointerLeave={scheduleClose}
              >
                <ul className="max-h-[480px] overflow-auto">
                  {servicesByCategory.map((category) => (
                    <li
                      key={category.categorySlug}
                      onPointerEnter={(e) => handleCategoryHover(category.categorySlug, e)}
                      onPointerLeave={scheduleCategoryClose}
                    >
                      <div className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-strong transition hover:bg-[var(--color-brand-primary)]/10 hover:text-[var(--color-brand-primary)]">
                        <span>{category.categoryTitle}</span>
                        <span aria-hidden className="text-xs text-muted">›</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Services submenu - positioned to the right of categories dropdown */}
              {hoveredCategory && categoryRect && (
                <div
                  className="absolute z-40 w-[280px] rounded-2xl border border-divider bg-surface p-2 shadow-elevated"
                  style={{
                    left: `calc(50% - 140px + ${categoryRect.left}px + 8px)`,
                    top: `calc(100% + 12px + ${categoryRect.top}px)`
                  }}
                  onPointerEnter={keepSubmenuOpen}
                  onPointerLeave={scheduleClose}
                >
                  {servicesByCategory
                    .filter(cat => cat.categorySlug === hoveredCategory)
                    .map((category) => (
                      <div key={category.categorySlug}>
                        <ul>
                          {category.services.map((service) => (
                            <li key={service.href}>
                              <Link
                                href={service.href}
                                className="block rounded-md px-3 py-2 text-sm text-muted transition hover:bg-[var(--color-brand-primary)]/10 hover:text-[var(--color-brand-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-primary)]"
                                onClick={handleLinkClick}
                              >
                                {service.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {hasLocations && (
        <div
          className="relative"
          onPointerEnter={() => openMenu('locations')}
          onPointerLeave={scheduleClose}
          onFocusCapture={() => openMenu('locations')}
          onBlurCapture={(event: FocusEvent<HTMLDivElement>) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              scheduleClose()
            }
          }}
        >
          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm font-medium text-muted transition hover:text-[var(--color-brand-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-primary)]"
            aria-expanded={open === 'locations'}
            aria-haspopup="true"
          >
            Locations
            <span aria-hidden className="text-xs">▾</span>
          </button>

          {open === 'locations' && (
            <div
              className="absolute left-1/2 top-full z-30 w-[280px] -translate-x-1/2 translate-y-3 rounded-2xl border border-divider bg-surface p-2 shadow-elevated"
              onPointerEnter={() => openMenu('locations')}
              onPointerLeave={scheduleClose}
            >
              <ul>
                {locationsItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-sm text-muted transition hover:bg-[var(--color-brand-primary)]/10 hover:text-[var(--color-brand-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-primary)]"
                      onClick={handleLinkClick}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
