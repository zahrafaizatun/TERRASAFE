/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070f1e',
          900: '#0a192f',
          800: '#112240',
          700: '#1b325f',
          600: '#23447c',
        },
        brand: {
          cyan: '#00e5ff',
          teal: '#00b4d8',
          blue: '#0077b6',
          sky: '#90e0ef',
          accent: '#38bdf8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shake': 'shake 0.5s ease-in-out infinite',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-4px)' },
          '40%, 80%': { transform: 'translateX(4px)' },
        }
      }
    },
  },
  plugins: [],
}
