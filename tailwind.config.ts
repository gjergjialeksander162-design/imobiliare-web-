import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#002349",
          dark: "#001730",
          light: "#e8ecf2",
        },
        gold: {
          DEFAULT: "#b8975a",
          light: "#d9c08f",
          dark: "#8f7340",
        },
        ivory: "#faf8f4",
        sand: "#f6f4f0",
        line: "#ded9d1",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      boxShadow: {
        soft: "0 20px 60px -30px rgb(0 35 73 / 0.35)",
        card: "0 18px 40px -28px rgb(0 35 73 / 0.45)",
      },
      keyframes: {
        reveal: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        kenburns: {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.08)" },
        },
        fadein: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        reveal: "reveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
        kenburns: "kenburns 18s ease-out both",
        fadein: "fadein 1.2s ease-out both",
      },
      letterSpacing: {
        wider: "0.08em",
        widest: "0.18em",
      },
    },
  },
  plugins: [],
} satisfies Config;
