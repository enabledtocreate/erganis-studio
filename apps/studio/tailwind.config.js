/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        linen: {
          50: '#faf8f5',
          100: '#f3efe8',
          200: '#e7e2db',
        },
        paper: '#ffffff',
        ink: {
          50: '#f6f6f5',
          100: '#e7e7e5',
          200: '#d1d0cd',
          300: '#b0aeaa',
          400: '#8a8782',
          500: '#6f6c66',
          600: '#5e5b56',
          700: '#4f4d49',
          800: '#44423f',
          900: '#2c2a28',
          950: '#1c1917',
        },
        forest: {
          500: '#3d6b4f',
          600: '#2f5540',
        },
        warm: {
          border: '#e7e2db',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      borderRadius: {
        studio: '0.625rem',
        'studio-lg': '0.75rem',
        'studio-xl': '1rem',
      },
      boxShadow: {
        card: '0 1px 2px rgba(28, 25, 23, 0.04)',
      },
    },
  },
  plugins: [],
};
