import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Mahjong color palette
        'mahjong-green': '#0B6E4F',
        'tile-ivory': '#F5F3E7',
        'lucky-red': '#C1121F',
        'dark-wood': '#2C1810',
        'gold': '#D4AF37',
        'neutral-gray': '#4A4A4A',
      },
      fontFamily: {
        sans: ['var(--font-noto-sans)', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'tile': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), inset 0 2px 4px rgba(255, 255, 255, 0.1)',
        'tile-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), inset 0 2px 4px rgba(255, 255, 255, 0.15)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}

export default config
