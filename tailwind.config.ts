import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        gruvbox: {
          bg: "#1d2021",
          bg1: "#3c3836",
          fg: "#ebdbb2",
          red: "#fb4934",
          green: "#b8bb26",
          yellow: "#fabd2f",
          blue: "#83a598",
          purple: "#d3869b",
          aqua: "#8ec07c",
          orange: "#fe8019",
          gray: "#928374",
        },
      },
      keyframes: {
        "text-color-cycle": {
          "0%": { color: "#fb4934" }, // red
          "12.5%": { color: "#b8bb26" }, // green
          "25%": { color: "#fabd2f" }, // yellow
          "37.5%": { color: "#83a598" }, // blue
          "50%": { color: "#d3869b" }, // purple
          "62.5%": { color: "#8ec07c" }, // aqua
          "75%": { color: "#fe8019" }, // orange
          "87.5%": { color: "#928374" }, // gray
          "100%": { color: "#fb4934" }, // loop
        },
      },
      animation: {
        "text-color-cycle": "text-color-cycle 80s steps(8, end) infinite",
      },
    },
  },
  safelist: [
    "border-gruvbox-red",
    "border-gruvbox-green",
    "border-gruvbox-yellow",
    "border-gruvbox-blue",
    "border-gruvbox-purple",
    "border-gruvbox-aqua",
    "border-gruvbox-orange",
  ],
} satisfies Config;
