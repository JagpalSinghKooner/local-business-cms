import typography from '@tailwindcss/typography'
import forms from '@tailwindcss/forms'
import daisyui from 'daisyui'

const config = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '16px' },
    extend: {},
  },
  plugins: [typography, forms, daisyui],
  daisyui: {
    themes: [
      {
        business: {
          primary: '#0369a1', // Sky 700 - matches old --color-brand-primary
          'primary-content': '#ffffff',
          secondary: '#f97316', // Orange 500 - matches old --color-brand-secondary
          'secondary-content': '#ffffff',
          accent: '#0369a1',
          'accent-content': '#ffffff',
          neutral: '#111827', // Gray 900 - matches old --color-surface-strong
          'neutral-content': '#ffffff',
          'base-100': '#ffffff', // White - matches old --color-surface
          'base-200': '#f5f5f5', // Gray 100 - matches old --color-surface-muted
          'base-300': '#e5e7eb', // Gray 200
          'base-content': '#0f172a', // Slate 900 - matches old --color-text-strong
          info: '#3b82f6',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
        },
      },
    ],
    base: true,
    styled: true,
    utils: true,
  },
}

export default config
