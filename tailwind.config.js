/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        spu: {
          purple: {
            DEFAULT: '#4A154B',
            50: '#FBF4FB',
            100: '#F5E6F5',
            200: '#EBCDEB',
            300: '#DCAAD8',
            400: '#8A278A',
            500: '#641C64',
            600: '#4A154B', // Brand Primary
            700: '#3D113E',
            800: '#2E0D2F',
            900: '#1D081E'
          },
          pink: {
            DEFAULT: '#D63384', // Brand Secondary
            light: '#FCE7F3',
            50: '#FDF2F8',
            100: '#FCE7F3',
            200: '#FBCFE8',
            300: '#F472B6',
            400: '#E01E5A', // Brand Tertiary
            500: '#D63384',
            600: '#BE185D',
            700: '#9D174D'
          },
          magenta: '#E91E63',
          dark: '#1E1B24',
          slate: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            300: '#CBD5E1',
            500: '#64748B',
            700: '#334155',
            900: '#0F172A'
          }
        }
      },
      fontFamily: {
        sans: ['Prompt', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Prompt', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      boxShadow: {
        'spu-sm': '0 2px 8px -1px rgba(74, 21, 75, 0.08), 0 1px 4px -1px rgba(214, 51, 132, 0.06)',
        'spu-md': '0 8px 24px -4px rgba(74, 21, 75, 0.12), 0 4px 12px -2px rgba(214, 51, 132, 0.08)',
        'spu-lg': '0 16px 36px -6px rgba(74, 21, 75, 0.18), 0 8px 16px -4px rgba(214, 51, 132, 0.12)',
        'glow-pink': '0 0 20px -2px rgba(214, 51, 132, 0.45)',
        'glow-purple': '0 0 24px -2px rgba(74, 21, 75, 0.5)'
      }
    }
  }
}
