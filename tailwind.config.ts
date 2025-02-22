// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#2563eb', // You can customize this color
      },
      fontFamily: {
        outfit: ['var(--font-outfit)', 'sans-serif'],
        marcellus: ['var(--font-marcellus)', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config