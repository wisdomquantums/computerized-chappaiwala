/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1d4ed8',
          dark: '#1e3a8a',
          light: '#60a5fa',
        },
        accent: '#f97316',
        muted: '#64748b',
      },
    },
  },
  plugins: [],
}

