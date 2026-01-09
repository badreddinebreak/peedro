
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0891B2', // Cyan-600
          light: '#06B6D4', // Cyan-500
          dark: '#0E7490',  // Cyan-700
        },
        secondary: '#1D4ED8', // Blue-700
        light: '#F0F9FF', // Sky-50
        dark: {
          bg: '#0C111D',   // A darker slate/navy
          card: '#161B29', // Slightly lighter card bg
          text: '#E2E8F0', // Slate-200
          border: '#334155' // Slate-700
        }
      },
      boxShadow: {
        '3d': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        '3d-hover': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner-3d': 'inset 0 2px 4px 0 rgba(0,0,0,0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      }
    }
  },
  plugins: [],
}
