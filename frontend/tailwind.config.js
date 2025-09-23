/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',  // Crucial for dark mode to work
  theme: {
    extend: {},
  },
  plugins: [],  // Empty - no line-clamp plugin to avoid errors
}