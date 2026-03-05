/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './docs/**/*.{js,jsx,ts,tsx,md,mdx}',
    './blog/**/*.{js,jsx,ts,tsx,md,mdx}'
  ],
  corePlugins: {
    preflight: false // Disables Tailwind's global resets
  },

  darkMode: ['class', '[data-theme="dark"]'], // Support Docusaurus dark mode
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'pulse-dot': 'pulseDot 2s infinite',
        'gradient-shift': 'gradientShift 3s ease infinite'
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        scaleIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.9)'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)'
          }
        },
        pulseDot: {
          '0%, 100%': {
            transform: 'scale(0.95)',
            boxShadow: '0 0 0 0 rgba(25, 58, 230, 0.7)'
          },
          '70%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 10px rgba(25, 58, 230, 0)'
          }
        },
        gradientShift: {
          '0%, 100%': {
            backgroundPosition: '0% 50%'
          },
          '50%': {
            backgroundPosition: '100% 50%'
          }
        }
      },

      backdropBlur: {
        xs: '2px'
      },

      // Enhanced max width
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem'
      },

      // Enhanced z-index
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
        90: '90',
        100: '100'
      },

      // Enhanced line height for better typography
      lineHeight: {
        relaxed: '1.625',
        loose: '1.75'
      },

      // Enhanced letter spacing
      letterSpacing: {
        tighter: '-0.025em',
        tight: '-0.0125em'
      },

      fontFamily: {
        sans: [
          'IBM Plex Sans',
          'Space Grotesk',
          'Segoe UI',
          'Roboto',
          'Ubuntu',
          'Cantarell',
          'Noto Sans',
          'system-ui',
          '-apple-system',
          'sans-serif'
        ],
        mono: ['Fira Code', 'JetBrains Mono', 'Cascadia Code', 'Consolas', 'Monaco', 'monospace'],
        space: ['Space Grotesk', 'sans-serif'],
        helvetica: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif']
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',

        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c8d7ff',
          300: '#a5b8ff',
          400: '#7f8cff',
          500: '#4a6bff', // This matches your --ifm-color-primary-lighter
          600: '#193ae6', // Your main brand color
          700: '#1529b8', // Your --ifm-color-primary-darker
          800: '#0d1f7a', // Your --ifm-color-primary-darkest
          900: '#0a1554'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        brand: {
          blue: {
            400: '#4F6AE8',
            500: '#203FDD'
          },
          green: {
            600: '#389E0D'
          },
          black: '#0D1238',
          gray: {
            50: '#F3F3F3',
            100: '#F0F0F0',
            200: '#EAEAEA',
            250: '#D1D1D1',
            300: '#bfbfbf',
            400: '#939393',
            450: '#9B9B9B',
            500: '#858585',
            600: '#676767',
            900: '#333333'
          }
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem'
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
        128: '32rem'
      },
      aspectRatio: {
        '21/9': '21 / 9',
        '21/7': '21 / 7',
        '21/5': '21 / 5',
        '16/9': '16 / 9'
      }
    }
  },
  plugins: [
    require('tailwindcss-animate'),
    // require('tailwindcss/line-clamp'), // For text truncation
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    function ({ addUtilities }) {
      const newUtilities = {
        '.line-clamp-1': {
          'display': '-webkit-box',
          '-webkit-line-clamp': '1',
          '-webkit-box-orient': 'vertical',
          'overflow': 'hidden'
        },
        '.line-clamp-2': {
          'display': '-webkit-box',
          '-webkit-line-clamp': '2',
          '-webkit-box-orient': 'vertical',
          'overflow': 'hidden'
        },
        '.line-clamp-3': {
          'display': '-webkit-box',
          '-webkit-line-clamp': '3',
          '-webkit-box-orient': 'vertical',
          'overflow': 'hidden'
        },
        '.line-clamp-4': {
          'display': '-webkit-box',
          '-webkit-line-clamp': '4',
          '-webkit-box-orient': 'vertical',
          'overflow': 'hidden'
        },
        '.line-clamp-5': {
          'display': '-webkit-box',
          '-webkit-line-clamp': '5',
          '-webkit-box-orient': 'vertical',
          'overflow': 'hidden'
        },
        '.line-clamp-6': {
          'display': '-webkit-box',
          '-webkit-line-clamp': '6',
          '-webkit-box-orient': 'vertical',
          'overflow': 'hidden'
        },
        '.line-clamp-7': {
          'display': '-webkit-box',
          '-webkit-line-clamp': '7',
          '-webkit-box-orient': 'vertical',
          'overflow': 'hidden'
        },
        '.line-clamp-8': {
          'display': '-webkit-box',
          '-webkit-line-clamp': '8',
          '-webkit-box-orient': 'vertical',
          'overflow': 'hidden'
        }
      }

      addUtilities(newUtilities, ['responsive'])
    }
  ],
  safelist: [
    // Brand colors
    'text-[#193ae6]',
    'bg-[#193ae6]',
    'border-[#193ae6]',
    'from-[#193ae6]',
    'to-[#193ae6]',

    // Animation classes
    'animate-pulse',
    'animate-fade-in',
    'animate-fade-in-up',
    'animate-scale-in',
    'animate-pulse-dot',
    'animate-gradient-shift',

    // Transform classes
    'hover:scale-110',
    'hover:scale-105',
    'hover:-translate-y-2',
    'hover:scale-[1.02]',

    // Line clamp classes
    'line-clamp-1',
    'line-clamp-2',
    'line-clamp-3',

    // Aspect ratio classes
    'aspect-[16/9]',
    'aspect-[21/9]',
    'aspect-[21/7]',
    'aspect-[21/5]'
  ]
}
