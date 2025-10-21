import { Suspense, type ReactNode } from 'react'

type PreviewSuspenseProps = {
  fallback: ReactNode
  children: ReactNode
}

export function PreviewSuspense({ fallback, children }: PreviewSuspenseProps) {
  return <Suspense fallback={fallback}>{children}</Suspense>
}
