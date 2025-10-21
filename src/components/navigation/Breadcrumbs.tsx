import Link from 'next/link'
import type { CSSProperties } from 'react'
import Container from '@/components/layout/Container'
import type { BreadcrumbNode } from '@/lib/breadcrumbs'

type BreadcrumbsProps = {
  trail: BreadcrumbNode[] | null | undefined
}

const containerStyle: CSSProperties = {
  paddingTop: 'var(--space-sm)',
  paddingBottom: 'var(--space-sm)',
}

const listStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--space-xs)',
  alignItems: 'center',
}

const itemStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-xs)',
}

const separatorStyle: CSSProperties = {
  fontSize: 'calc(var(--font-body-sm-size, 0.875rem) * 0.85)',
  color: 'var(--color-text-muted)',
}

export default function Breadcrumbs({ trail }: BreadcrumbsProps) {
  if (!trail || trail.length < 2) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className="border-b border-divider bg-surface-muted">
      <Container className="text-sm text-muted" style={containerStyle}>
        <ol style={listStyle}>
          {trail.map((crumb, index) => (
            <li key={`${crumb.href}-${index}`} style={itemStyle}>
              {index > 0 ? (
                <span aria-hidden="true" style={separatorStyle}>
                  /
                </span>
              ) : null}
              {crumb.isCurrent ? (
                <span aria-current="page" className="font-medium text-strong">
                  {crumb.label}
                </span>
              ) : (
                <Link href={crumb.href} className="transition-colors hover:text-strong">
                  {crumb.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </Container>
    </nav>
  )
}
