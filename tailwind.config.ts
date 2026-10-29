// tailwind.config.ts
import type { Config } from 'tailwindcss'

// Colour tokens live as RGB channels in app/globals.css so they can flip for dark mode
const token = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Kept for the admin screens; now a warm clay instead of the old electric blue
        primary: token('primary'),
        canvas: token('canvas'),
        paper: token('paper'),
        linen: token('linen'),
        fg: token('fg'),
        muted: token('muted'),
        line: token('line'),
        clay: token('clay'),
        'on-clay': token('on-clay'),
        brass: token('brass'),
        night: token('night'),
        // Fixed brand colours that never flip
        ink: '#1E2A3B',
        cream: '#F6F2EC',
      },
      fontFamily: {
        outfit: ['var(--font-outfit)', 'sans-serif'],
        marcellus: ['var(--font-marcellus)', 'serif'],
      },
      letterSpacing: {
        label: '0.28em',
      },
      transitionTimingFunction: {
        silk: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'ring-out': {
          '0%': { transform: 'scale(0.2)', opacity: '0.9' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
        'drip': {
          '0%': { transform: 'translateY(-100%)' },
          '60%, 100%': { transform: 'translateY(100%)' },
        },
        'slow-zoom': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
      },
      animation: {
        'ring-out': 'ring-out 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite',
        'drip': 'drip 2.2s cubic-bezier(0.65, 0, 0.35, 1) infinite',
        'slow-zoom': 'slow-zoom 18s ease-out forwards',
      },
    },
  },
  plugins: [],
}
export default config
