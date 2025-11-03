/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#d87d4a', // Orange accent
        secondary: '#101010', // Deep black section background
        light: '#f1f1f1', // Light gray background
        dark: '#191919', // Footer or hero background
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.1em',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '3rem',
          xl: '4rem',
          '2xl': '5rem',
        },
      },
    },
  },
  plugins: [],
};
