/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "sans": ["Inter", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: "hsl(var(--bg-primary) / <alpha-value>)",
        secondary: "hsl(var(--bg-secondary) / <alpha-value>)",
        secondaryHover: "hsl(var(--bg-secondary-hover) / <alpha-value>)",
        normal: "hsl(var(--text-normal) / <alpha-value>)",
        muted: "hsl(var(--text-muted) / <alpha-value>)",
        faint: "hsl(var(--text-faint) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        loading: "hsl(var(--loading) / <alpha-value>)",
        accent: "hsl(var(--accent) / <alpha-value>)",
        accentHover: "hsl(var(--accent-hover) / <alpha-value>)",
      },
    },
  },
  plugins: [],
}