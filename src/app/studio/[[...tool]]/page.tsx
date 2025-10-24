import LazyStudio from './LazyStudio'
import type { Metadata, Viewport } from 'next'

export const dynamic = 'force-dynamic'

// Define metadata inline without importing from next-sanity/studio
// This prevents bundling the entire 7.4MB Sanity package in main-app.js
export const metadata: Metadata = {
  title: 'Sanity Studio',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function StudioPage() {
  return <LazyStudio />
}
