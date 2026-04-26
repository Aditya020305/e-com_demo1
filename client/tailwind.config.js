/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#FDF8ED',
          100: '#FAF0D4',
          200: '#F5DFA3',
          300: '#EDCB68',
          400: '#E5B83A',
          500: '#D4A017',
          600: '#B8860B',
          700: '#9A7209',
          800: '#7D5C0B',
          900: '#66490F',
        },
        neutral: {
          50:  '#FAFAFA',
          100: '#F0F0F0',
          200: '#D4D4D4',
          300: '#A3A3A3',
          400: '#737373',
          500: '#525252',
          600: '#404040',
          700: '#2A2A2A',
          800: '#1A1A1A',
          900: '#0D0D0D',
          950: '#050505',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error:   '#EF4444',
        info:    '#3B82F6',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'sm':  '0 1px 2px rgba(0,0,0,0.3)',
        'md':  '0 4px 6px rgba(0,0,0,0.4)',
        'lg':  '0 10px 15px rgba(0,0,0,0.4)',
        'xl':  '0 20px 25px rgba(0,0,0,0.5)',
        '2xl': '0 25px 50px rgba(0,0,0,0.6)',
        'gold': '0 4px 20px rgba(212,160,23,0.25)',
        'gold-lg': '0 10px 30px rgba(212,160,23,0.3)',
      },
    },
  },
  plugins: [],
};
