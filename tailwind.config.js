/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070c1f',
          900: '#0b1230',
          800: '#111a3d',
          700: '#182354',
          600: '#213073'
        },
        teal: {
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488'
        },
        warn: {
          400: '#fb923c',
          500: '#f97316'
        },
        danger: {
          400: '#f87171',
          500: '#ef4444'
        }
      },
      boxShadow: {
        soft: '0 4px 24px rgba(15, 23, 42, 0.08)',
        card: '0 2px 12px rgba(15, 23, 42, 0.06)'
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    }
  },
  plugins: []
}
