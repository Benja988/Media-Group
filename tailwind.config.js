/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',

        card: 'rgb(var(--card))',
        'card-foreground': 'rgb(var(--card-foreground))',

        primary: 'rgb(var(--primary))',
        'primary-foreground': 'rgb(var(--primary-foreground))',

        muted: 'rgb(var(--muted))',
        'muted-foreground': 'rgb(var(--muted-foreground))',

        border: 'rgb(var(--border))',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
