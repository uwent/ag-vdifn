/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // 👈 enable dark mode with class strategy
  content: [
    './app/views/**/*.html.erb',
    './app/helpers/**/*.rb',
    './app/assets/stylesheets/**/*.css',
    './app/javascript/**/*.{html,js,svelte,ts}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
