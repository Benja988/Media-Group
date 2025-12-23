/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",

        card: "rgb(var(--card))",
        cardForeground: "rgb(var(--card-foreground))",

        primary: "rgb(var(--primary))",
        primaryForeground: "rgb(var(--primary-foreground))",

        muted: "rgb(var(--muted))",
        mutedForeground: "rgb(var(--muted-foreground))",

        border: "rgb(var(--border))",
      },
    },
  },
  plugins: [
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
}



