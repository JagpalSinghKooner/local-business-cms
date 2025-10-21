import Link from 'next/link'
import Image from 'next/image'
import type { PageSection } from '@/types'
import Container from '@/components/layout/Container'
import { getSectionLayout } from './layout'
import { cn } from '@/lib/cn'
import { format } from 'date-fns'
import { CtaButton } from '@/components/ui/CtaButton'

type BlogListSectionType = Extract<PageSection, { _type: 'section.blogList' }> & {
  postsResolved?: BlogPostSummary[]
}

type BlogListSectionProps = {
  section: BlogListSectionType
}

export default function BlogListSection({ section }: BlogListSectionProps) {
  const limit = typeof section.limit === 'number' ? section.limit : 3
  const posts = Array.isArray(section.postsResolved) ? section.postsResolved.slice(0, Math.max(1, limit)) : []
  if (!posts.length) return null

  const layout = getSectionLayout(section)
  const mode = section.layoutMode ?? 'cards'
  const showAuthor = section.showAuthor ?? true
  const showPublishedDate = section.showPublishedDate ?? true

  return (
    <section
      className={layout.wrapperClassName}
      style={layout.style}
      data-animate={layout.dataAnimate}
      data-alignment={layout.dataAlignment}
    >
      <Container width={layout.containerWidth} className={cn(layout.containerClassName, 'space-y-8')}>
        <header className="space-y-3 md:max-w-3xl">
          {section.eyebrow ? (
            <p className="text-sm uppercase tracking-[0.2em] text-secondary">{section.eyebrow}</p>
          ) : null}
          <h2 className="text-3xl font-semibold text-strong">{section.heading}</h2>
          {section.body ? <p className="text-base text-muted">{section.body}</p> : null}
        </header>

        <div className={mode === 'list' ? 'space-y-6' : 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'}>
          {posts.map((post) => (
            <article
              key={post.slug}
              className={cn(
                'flex h-full flex-col gap-4 rounded-3xl border border-divider bg-surface p-6 shadow-elevated',
                mode === 'list' && 'md:flex-row md:items-center md:gap-6',
              )}
            >
              {post.coverImage ? (
                <div className={cn('relative overflow-hidden rounded-2xl bg-surface-muted', mode === 'list' ? 'h-36 w-36 flex-shrink-0' : 'h-48 w-full') }>
                  <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col gap-3">
                <header className="space-y-2">
                  <Link href={`/blog/${post.slug}`} className="text-xl font-semibold text-strong hover:text-accent">
                    {post.title}
                  </Link>
                  {post.excerpt ? <p className="text-sm text-muted">{post.excerpt}</p> : null}
                </header>
                <footer className="mt-auto text-xs uppercase tracking-[0.2em] text-muted">
                  <span>
                    {showAuthor && post.author ? post.author : null}
                    {showAuthor && showPublishedDate && post.publishedAt ? ' · ' : ''}
                    {showPublishedDate && post.publishedAt ? format(new Date(post.publishedAt), 'dd MMM yyyy') : null}
                  </span>
                </footer>
              </div>
            </article>
          ))}
        </div>

        {section.cta ? (
          <div>
            <CtaButton cta={section.cta} />
          </div>
        ) : null}
      </Container>
    </section>
  )
}

type BlogPostSummary = {
  slug: string
  title: string
  excerpt?: string
  coverImage?: string | null
  author?: string | null
  publishedAt?: string | null
}
