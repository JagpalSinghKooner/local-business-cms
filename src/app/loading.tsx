import Container from '@/components/layout/Container'

/**
 * Root loading UI
 * Shown during page transitions and data fetching
 */
export default function Loading() {
  return (
    <main className="min-h-screen bg-surface py-16">
      <Container>
        <div className="space-y-8 animate-pulse">
          {/* Hero skeleton */}
          <div className="space-y-4">
            <div className="h-4 w-24 bg-surface-muted rounded" />
            <div className="h-12 w-3/4 bg-surface-muted rounded" />
            <div className="h-6 w-full bg-surface-muted rounded" />
            <div className="h-6 w-5/6 bg-surface-muted rounded" />
          </div>

          {/* Content skeleton */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-surface-muted rounded-2xl" />
            ))}
          </div>
        </div>
      </Container>
    </main>
  )
}
