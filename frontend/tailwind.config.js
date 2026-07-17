/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lapisco: {
          green: '#5EAC92', // Verde do login
          blue: '#8CB1F3',  // Azul do menu ativo
        }
      }
    },
  },
  plugins: [],
}