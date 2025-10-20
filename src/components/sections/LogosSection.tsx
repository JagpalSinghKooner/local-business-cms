import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/layout/Container'
import type { PageSection } from '@/types/sanity'

const PLACEHOLDER = 'https://placehold.co/200x100?text=Logo'

export default function LogosSection({ section }: { section: Extract<PageSection, { _type: 'section.logos' }> }) {
  const items = Array.isArray(section.items) ? section.items : []
  if (!items.length) return null

  return (
    <section className="border-y border-zinc-200 bg-white py-16">
      <Container className="space-y-8">
        <header className="space-y-3 text-center md:max-w-2xl md:mx-auto">
          {section.title ? <h2 className="text-3xl font-semibold text-zinc-900">{section.title}</h2> : null}
          {section.description ? <p className="text-base text-zinc-600">{section.description}</p> : null}
        </header>
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {items.map((item, index) => {
            const content = (
              <div className="flex h-24 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <Image
                  src={item.logo?.asset?.url ?? PLACEHOLDER}
                  alt={item.name}
                  width={180}
                  height={90}
                  className="object-contain"
                />
              </div>
            )

            return (
              <li key={index} className="flex items-center justify-center">
                {item.url ? (
                  <Link href={item.url} target="_blank" rel="noreferrer" className="block w-full">
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
