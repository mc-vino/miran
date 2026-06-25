/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2d5a27',
        accent: '#4a8a43',
        sage: '#f0f4f0',
      }
    },
  },
  plugins: [],
}
