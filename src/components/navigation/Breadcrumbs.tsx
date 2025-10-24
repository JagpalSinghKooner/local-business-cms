import Link from 'next/link'
import Container from '@/components/layout/Container'
import type { BreadcrumbNode } from '@/lib/breadcrumbs'

type BreadcrumbsProps = {
  trail: BreadcrumbNode[] | null | undefined
}

export default function Breadcrumbs({ trail }: BreadcrumbsProps) {
  if (!trail || trail.length < 2) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className="border-b border-divider bg-surface-muted">
      <Container className="py-2 text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1">
          {trail.map((crumb, index) => (
            <li key={`${crumb.href}-${index}`} className="flex items-center gap-1">
              {index > 0 ? (
                <span aria-hidden="true" className="text-xs text-muted">
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
