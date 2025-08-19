/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/javascript/src/**/*.{html,js,svelte,ts,erb}'],
  safelist: [
    'translate-x-0',
    '-translate-x-full',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  important: true, 
};
