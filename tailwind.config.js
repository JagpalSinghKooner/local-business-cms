import typography from '@tailwindcss/typography'
import forms from '@tailwindcss/forms'

const config = {
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '16px' },
    extend: {},
  },
  plugins: [typography, forms],
}

export default config
