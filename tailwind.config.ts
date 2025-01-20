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
        accent: {
          500: "var(--color-accent-500)",
          900: "var(--color-accent-900)",
        },
        neutral: {
          100: "var(--color-neutral-100)",
          200: "var(--color-neutral-200)",
        },
        primary: {
          800: "var(--color-primary-800)",
          900: "var(--color-primary-900)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
