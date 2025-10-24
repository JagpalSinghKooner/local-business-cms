'use client'

import dynamic from 'next/dynamic'

// Lazy load the Studio component to prevent it from being bundled in main-app.js
// This reduces the main bundle size by ~7MB by only loading Studio when needed
const StudioClient = dynamic(() => import('./StudioClient'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontSize: '1.5rem',
        color: '#666',
      }}
    >
      Loading Studio...
    </div>
  ),
})

export default function LazyStudio() {
  return <StudioClient />
}
