import Container from '@/components/layout/Container'

/**
 * Service page loading UI
 * Shown during service data fetching
 */
export default function ServiceLoading() {
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
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-full bg-surface-muted rounded" />
            ))}
          </div>
        </Container>
      </section>
    </main>
  )
}
