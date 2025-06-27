/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        primary: {
          DEFAULT: '#004b8d',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#49aa42',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#f5f5f5',
          foreground: '#6d6d6d',
        },
        border: '#d9d9d9',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'doppio': ['Doppio One', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}