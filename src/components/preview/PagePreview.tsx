/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useMemo } from 'react'
import Breadcrumbs from '@/components/navigation/Breadcrumbs'
import { SectionRenderer } from '@/components/sections'
import Container from '@/components/layout/Container'
import Portable from '@/components/Portable'
import { ApplyScriptOverrides } from '@/components/scripts/ScriptOverridesProvider'
import { buildBreadcrumbs } from '@/lib/breadcrumbs'
import { usePreview } from '@/sanity/preview'
import { globalSettingsQ, pageBySlugQ, offersListQ } from '@/sanity/queries'

type PagePreviewProps = {
  slug: string
}

export default function PagePreview({ slug }: PagePreviewProps) {
  const global = usePreview(null, globalSettingsQ) as any
  const page = usePreview(null, pageBySlugQ, { slug }) as any
  const offers = usePreview(null, offersListQ) as any

  const path = !slug || slug === 'home' ? '/' : `/${slug}`

  const breadcrumbs = useMemo(
    () =>
      buildBreadcrumbs({
        path,
        currentLabel: page?.title ?? slug,
        settings: page?.breadcrumbs ?? null,
        navigation: global?.navigation,
        pages: global?.pages,
        homeLabel: global?.site?.name ?? 'Home',
      }),
    [global?.navigation, global?.pages, global?.site?.name, page?.breadcrumbs, page?.title, path, slug],
  )

  if (!page) {
    return (
      <main className="pb-16">
        <Container>
          <p>No draft exists for this slug yet.</p>
        </Container>
      </main>
    )
  }

  const hasSections = Array.isArray(page.sections) && page.sections.length > 0

  return (
    <main className="pb-16">
      <ApplyScriptOverrides overrides={page.scriptOverrides as any} />
      <Breadcrumbs trail={breadcrumbs} />
      {hasSections ? (
        <SectionRenderer
          sections={page.sections as any}
          services={global?.services ?? []}
          locations={global?.locations ?? []}
          offers={offers ?? []}
          site={global?.site ?? null}
          pagePath={path}
        />
      ) : (
        <header className="bg-surface-muted py-12">
          <Container>
            <h1 className="text-4xl font-semibold text-strong">{page.title}</h1>
          </Container>
        </header>
      )}

      {page.body && page.body.length ? (
        <section className="border-t border-divider py-16">
          <Container className="prose prose-theme max-w-none">
            <Portable value={page.body as any} />
          </Container>
        </section>
      ) : null}
    </main>
  )
}
