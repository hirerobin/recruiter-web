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
          DEFAULT: '#14B8A6', // teal from Figma
          dark: '#0D9488',
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
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config
