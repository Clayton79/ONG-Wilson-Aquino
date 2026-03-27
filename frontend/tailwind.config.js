/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F7A3B',
          dark: '#0A5A2C',
          light: '#22A95A',
          50: '#EDFBF3',
          100: '#D4F5E2',
          200: '#A9EBC5',
          300: '#6FD89E',
          400: '#3BBF76',
          500: '#0F7A3B',
          600: '#0D6B34',
          700: '#0A5A2C',
          800: '#084923',
          900: '#063A1C',
          950: '#032110',
        },
        black: '#0B0B0B',
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#121212',
        },
        background: '#F6F8F6',
        foreground: '#111111',
        muted: {
          DEFAULT: '#6B7280',
          foreground: '#9CA3AF',
          bg: '#DDE5DD',
        },
        border: {
          DEFAULT: '#C9D3C9',
          light: '#E5E7EB',
        },
        success: { DEFAULT: '#198754', light: '#D1FAE5' },
        warning: { DEFAULT: '#D4A017', light: '#FEF3C7' },
        danger: { DEFAULT: '#C0392B', light: '#FEE2E2' },
        info: { DEFAULT: '#3B82F6', light: '#DBEAFE' },
        sidebar: {
          bg: '#0B0B0B',
          hover: '#1A1A1A',
          active: '#0F7A3B',
          text: '#A3A3A3',
          'text-active': '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover':
          '0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        sidebar: '2px 0 12px 0 rgb(0 0 0 / 0.15)',
      },
      borderRadius: { xl: '0.75rem', '2xl': '1rem' },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
