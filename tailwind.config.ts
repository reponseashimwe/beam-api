import type { Config } from "tailwindcss";
const withMT = require("@material-tailwind/react/utils/withMT");

const config: Config = withMT({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        primary: "#000000",
        blue: "#2377A4",
        backcolor: "#f6f6ff",
        active: "#2377A4",
        "light-active": "#13c2c2",
        "dark-active": "#008989",
        grey: "#888888",
        "light-grey": "#dedede",
        "dark-grey": "#535353",
        error: "#ff0000",
        bg: "#E2D5D5",
      },
    },
  },
  plugins: [],
});

export default config;
