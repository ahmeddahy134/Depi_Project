/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FAF7F4',
        secondary: '#F2EBE3',
        accent: '#E8C4B8',
        highlight: '#C9956C',
        textPrimary: '#2D2D2D',
        textSecondary: '#7A7A7A',
      },
      fontFamily: {
        tajawal: ['Tajawal', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
