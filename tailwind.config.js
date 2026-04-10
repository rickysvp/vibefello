/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
      },
      colors: {
        background: '#FFFFFF',
        foreground: '#000000',
        accent: '#34EF8D',
        muted: {
          DEFAULT: '#F4F4F5',
          foreground: '#71717A',
        },
        emerald: '#10B981',
        destructive: '#EF4444',
        secondary: '#18181B',
        tertiary: '#E4E4E7',
      },
      backgroundImage: {
        'vibe-gradient': 'linear-gradient(135deg, #34EF8D, #28D97E, #1FC46F)',
      },
    },
  },
  plugins: [],
};
