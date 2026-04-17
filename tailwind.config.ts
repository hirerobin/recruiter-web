import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{vue,ts,js}',
    './components/**/*.{vue,ts,js}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0abab5',
          dark: '#089e9a',
          light: '#5EEAD4',
        },
        dark: {
          DEFAULT: '#1A1A2E',
          card: '#16213E',
          surface: '#0F3460',
        },
        yellow: {
          bg: '#F5C518',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
        syne: ['Syne', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
