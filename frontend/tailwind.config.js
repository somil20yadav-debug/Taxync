/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        fintech: {
          bg: {
            dark: '#0B1020',
            light: '#F5F2EB', // Warm Linen
          },
          card: {
            dark: '#131A2E',
            light: '#FFFFFF',
          },
          border: {
            dark: '#26304A',
            light: '#E7E2D7', // Warm border
          },
          brand: {
            DEFAULT: '#8B5CF6',
            light: '#7C3AED',
          },
          mint: {
            DEFAULT: '#2DD4BF',
            light: '#0D9488',
          },
          rose: {
            DEFAULT: '#FB7185',
            light: '#E11D48',
          },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
