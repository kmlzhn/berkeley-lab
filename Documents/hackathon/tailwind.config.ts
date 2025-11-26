import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'periwinkle': {
          50: '#F5F6FE',
          500: '#9BA9E6',
          600: '#7B8CDE',
          700: '#5B6BBE',
        },
        'cool-gray': {
          50: '#F7F8FA',
          100: '#E8EBF0',
          200: '#D1D6DE',
          400: '#9BA3B0',
          600: '#5D6670',
          800: '#2D3338',
          900: '#1A1D21',
        },
        'off-white': '#FAFBFC',
        'almost-black': '#0F1114',
      },
      fontFamily: {
        sans: ['var(--font-instrument-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;

