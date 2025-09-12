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
        skew: {
          "0%, 30%": { transform: "none" },
          "30.2%": { transform: "skewX(50deg)" },
          "30.4%": { transform: "skewX(-50deg)" },
          "31%": { transform: "none" },
        },
        move: {
          "0%, 30%, 33%, 98%": { transform: "none" },
          "31%": { transform: "translateX(-6px)" },
          "100%": { transform: "translateX(6px)" },
        },
        flash: {
          "0%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        lines: {
          "0%": { opacity: "0.1" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "text-color-cycle": "text-color-cycle 80s steps(8, end) infinite",
        skew: "skew 2s infinite",
        move: "move 1.5s infinite",
        flash: "flash 0.04s infinite",
        lines: "lines 1s infinite",
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

    "before:border-gruvbox-red",
    "before:border-gruvbox-green",
    "before:border-gruvbox-yellow",
    "before:border-gruvbox-blue",
    "before:border-gruvbox-purple",
    "before:border-gruvbox-aqua",
    "before:border-gruvbox-orange",

    "text-gruvbox-red",
    "text-gruvbox-green",
    "text-gruvbox-yellow",
    "text-gruvbox-blue",
    "text-gruvbox-purple",
    "text-gruvbox-aqua",
    "text-gruvbox-orange",
  ],
} satisfies Config;
