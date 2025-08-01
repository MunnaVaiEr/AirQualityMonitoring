/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
 theme: {
  extend: {
    colors: {
      scrollbar: '#1e293b',      // dark background
      'scrollbar-thumb': '#94a3b8',  // thumb color
    },
  },
},
  darkMode: 'class', // Enable dark mode
  plugins: [
    require('tailwind-scrollbar'),
  ],
};
