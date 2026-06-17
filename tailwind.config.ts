import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Palette de marque Pionniers de Touraine
        amber: {
          DEFAULT: '#F5A300',
          400: '#FFB627',
          500: '#F5A300',
          600: '#D98A00',
        },
        bordeaux: {
          DEFAULT: '#6E201B',
          700: '#7B2A22',
          900: '#4A1512',
        },
        ink: {
          950: '#0B0B0D',
          900: '#101014',
          850: '#15151A',
          800: '#1C1C22',
          700: '#27272F',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(245,163,0,0.45)',
        'glow-sm': '0 0 24px -10px rgba(245,163,0,0.5)',
      },
      backgroundImage: {
        'radial-amber':
          'radial-gradient(circle at 50% 0%, rgba(245,163,0,0.16), transparent 60%)',
        'grain':
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
