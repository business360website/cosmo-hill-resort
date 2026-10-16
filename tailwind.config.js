/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sand: '#D3A376',    // section 1 / 4 / 7 / 10
        cream: '#FFE0B2',   // section 2 / 5 / 8
        ivory: '#FFF2DF',   // section 3 / 6 / 9
        cocoa: '#8C6E63',   // accent only (icons, large numerals)
        ink: '#2B1D18',
        paper: '#FFF8EC',
        forest: '#2E7D32',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Figtree', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        rise: { '0%': { opacity: 0, transform: 'translateY(28px)' }, '100%': { opacity: 1, transform: 'none' } },
        drift: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(8px)' } },
        fadeIn: { '0%': { opacity: 0, transform: 'scale(.97)' }, '100%': { opacity: 1, transform: 'none' } },
      },
      animation: {
        rise: 'rise 1s cubic-bezier(.2,.7,.2,1) both',
        drift: 'drift 2.4s ease-in-out infinite',
        fadeIn: 'fadeIn .5s ease both',
      },
    },
  },
  plugins: [],
}
