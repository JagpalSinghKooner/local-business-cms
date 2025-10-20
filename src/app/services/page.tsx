import Container from '@/components/layout/Container'
import { listServices } from '@/sanity/loaders'
import ServiceCard from '@/components/cards/ServiceCard'

export const revalidate = 3600

export default async function ServicesPage() {
  const services = await listServices()

  return (
    <main className="py-16">
      <Container className="space-y-10">
        <header className="max-w-2xl space-y-3">
          <p className="text-sm uppercase tracking-wide text-zinc-500">Services</p>
          <h1 className="text-4xl font-semibold text-zinc-900">All Services</h1>
          <p className="text-base text-zinc-600">
            Explore the full range of services we offer. Each service page includes detailed information, FAQs, and
            service area coverage.
          </p>
        </header>

        <section>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <li key={service.slug}>
                <ServiceCard service={service} />
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </main>
  )
}
