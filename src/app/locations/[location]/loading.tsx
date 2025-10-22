import Container from '@/components/layout/Container'

/**
 * Location page loading UI
 * Shown during location data fetching
 */
export default function LocationLoading() {
  return (
    <main className="pb-16">
      <section className="bg-surface-muted py-16">
        <Container>
          <div className="grid items-center gap-10 md:grid-cols-[1.25fr_1fr]">
            <div className="space-y-4 animate-pulse">
              <div className="h-4 w-32 bg-surface rounded" />
              <div className="h-10 w-3/4 bg-surface rounded" />
              <div className="h-6 w-full bg-surface rounded" />
              <div className="h-6 w-5/6 bg-surface rounded" />
              <div className="flex gap-3 pt-2">
                <div className="h-10 w-32 bg-surface rounded-full" />
                <div className="h-10 w-32 bg-surface rounded-full" />
              </div>
            </div>
            <div className="aspect-video bg-surface rounded-3xl animate-pulse" />
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-surface-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        </Container>
      </section>
    </main>
  )
}
