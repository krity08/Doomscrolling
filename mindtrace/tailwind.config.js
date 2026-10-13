/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f4f6fb',
          100: '#e6eaf5',
          500: '#3b3b8f',
          700: '#23235a',
          900: '#111133',
        },
      },
      boxShadow: {
        soft: '0 4px 20px rgba(20, 24, 60, 0.06)',
      },
    },
  },
  plugins: [],
}