/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B6B3A',
          dark: '#0D4A25',
          light: '#2E8B57',
          50: '#F0F9F4',
          100: '#DCEFE4',
          200: '#B9DFCA',
          300: '#89C8A8',
          400: '#57AB82',
          500: '#1B6B3A',
          600: '#186234',
          700: '#14532D',
          800: '#0D4A25',
          900: '#0A3A1D',
          950: '#062212',
        },
        accent: {
          DEFAULT: '#C8A951',
          light: '#E0C97A',
          dark: '#A88A32',
        },
        surface: '#FFFFFF',
        background: '#F8FAF9',
        foreground: '#1A1A2E',
        muted: {
          DEFAULT: '#6B7280',
          foreground: '#9CA3AF',
        },
        border: '#E5E7EB',
        success: {
          DEFAULT: '#10B981',
          light: '#D1FAE5',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7',
        },
        danger: {
          DEFAULT: '#EF4444',
          light: '#FEE2E2',
        },
        info: {
          DEFAULT: '#3B82F6',
          light: '#DBEAFE',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        'sidebar': '2px 0 8px 0 rgb(0 0 0 / 0.08)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
