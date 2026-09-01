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
        sand: "#f6f4f0",
        line: "#ded9d1",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      letterSpacing: {
        wider: "0.08em",
        widest: "0.18em",
      },
    },
  },
  plugins: [],
} satisfies Config;
