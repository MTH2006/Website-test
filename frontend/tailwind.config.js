/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        caas: {
          dark: '#0b132b',
          card: '#1c2541',
          border: '#2c3e50',
          accent: '#3a506b',
          cyan: '#48cae4',
          blue: '#0077b6',
          green: '#10b981',
          red: '#ef4444',
          amber: '#f59e0b'
        }
      }
    },
  },
  plugins: [],
}
