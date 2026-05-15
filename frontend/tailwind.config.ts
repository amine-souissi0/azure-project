import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class", // toggled by adding/removing 'dark' class on <html>
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Cairo", "sans-serif"],
        arabic: ["Cairo", "Inter", "sans-serif"],
      },
      colors: {
        forest: {
          50: "#f0f9f4",
          100: "#dcf1e6",
          200: "#bae3ce",
          300: "#87ceae",
          400: "#4fb285",
          500: "#2e9668",
          600: "#1f7852",
          700: "#196042",
          800: "#154d35",
          900: "#0f3323",
          950: "#071c12",
        },
        gold: {
          50: "#fdf8ec",
          100: "#faedcc",
          200: "#f5d994",
          300: "#efc25c",
          400: "#e9ae35",
          500: "#d4961e",
          600: "#b87316",
          700: "#935215",
          800: "#793f17",
          900: "#663417",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
