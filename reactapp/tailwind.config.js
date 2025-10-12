/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0061ff',
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#0061ff',
          600: '#0052d4',
          700: '#0043a8'
        },
        secondary: '#f7f9fc',
        accent: '#0d2481'
      }
    },
  },
  plugins: [],
}